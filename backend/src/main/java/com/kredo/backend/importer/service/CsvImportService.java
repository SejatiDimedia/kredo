package com.kredo.backend.importer.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kredo.backend.audit.service.AuditLogService;
import com.kredo.backend.coa.domain.Account;
import com.kredo.backend.coa.repository.AccountRepository;
import com.kredo.backend.importer.dto.ImportJobResponse;
import com.kredo.backend.journal.domain.JournalSource;
import com.kredo.backend.journal.dto.CreateJournalLineRequest;
import com.kredo.backend.journal.dto.CreateJournalRequest;
import com.kredo.backend.journal.service.JournalService;
import com.kredo.backend.period.domain.AccountingPeriod;
import com.kredo.backend.period.repository.AccountingPeriodRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.*;

@Service
@RequiredArgsConstructor
public class CsvImportService {

    private final JournalService journalService;
    private final AccountRepository accountRepository;
    private final AccountingPeriodRepository accountingPeriodRepository;
    private final AuditLogService auditLogService;
    private final JdbcTemplate jdbcTemplate;
    private final ObjectMapper objectMapper;

    /**
     * Memproses berkas CSV transaksi massal dengan pengujian idempotensi hash
     * SHA-256.
     */
    @Transactional
    public ImportJobResponse processCsvImport(Long entityId, Long userId, MultipartFile file, boolean autoPost,
            boolean force) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Berkas CSV tidak boleh kosong.");
        }

        String fileName = file.getOriginalFilename() != null ? file.getOriginalFilename() : "import.csv";
        if (!fileName.toLowerCase().endsWith(".csv")) {
            throw new IllegalArgumentException("Berkas harus berformat CSV (.csv).");
        }

        byte[] fileBytes;
        try {
            fileBytes = file.getBytes();
        } catch (Exception e) {
            throw new IllegalStateException("Gagal membaca byte berkas: " + e.getMessage());
        }

        String fileHash = calculateSha256(fileBytes);

        // 1. Pengujian Idempotensi: Cegah berkas identik terproses dua kali (FR-IMP-04)
        if (!force) {
            String checkSql = "SELECT id FROM import_job WHERE entity_id = ? AND file_hash = ? AND status = 'COMPLETED' LIMIT 1";
            List<Long> existing = jdbcTemplate.query(checkSql, (rs, rowNum) -> rs.getLong("id"), entityId, fileHash);
            if (!existing.isEmpty()) {
                throw new IllegalStateException(String.format(
                        "Berkas dengan isi identik telah berhasil diimpor sebelumnya (Job ID: #%d). Aktifkan opsi 'Paksa Impor Ulang' jika ingin memproses kembali.",
                        existing.get(0)));
            }
        }

        // 2. Baca akun-akun master yang valid pada entitas ini
        Map<String, Account> accountCodeMap = new HashMap<>();
        for (Account a : accountRepository.findByEntityIdOrderByCodeAsc(entityId)) {
            accountCodeMap.put(a.getCode(), a);
        }

        // 3. Parsing Baris CSV
        List<RawCsvRow> rawRows = new ArrayList<>();
        List<ImportJobResponse.ImportErrorDetail> errorDetails = new ArrayList<>();

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            String line;
            int lineNumber = 0;
            boolean isHeader = true;

            while ((line = reader.readLine()) != null) {
                lineNumber++;
                String trimmed = line.trim();
                // Hapus BOM jika ada
                if (lineNumber == 1 && trimmed.startsWith("\uFEFF")) {
                    trimmed = trimmed.substring(1);
                }
                if (trimmed.isEmpty() || trimmed.startsWith("#")) {
                    continue;
                }

                String[] tokens = trimmed.split(",", -1);
                if (isHeader) {
                    isHeader = false;
                    continue; // Lewati header
                }

                if (tokens.length < 6) {
                    errorDetails.add(new ImportJobResponse.ImportErrorDetail(
                            "ROW-" + lineNumber, lineNumber, "-",
                            "Kolom tidak lengkap (minimal harus memiliki journal_ref, entry_date, description, account_code, debit, credit)"));
                    continue;
                }

                String ref = tokens[0].trim();
                String dateStr = tokens[1].trim();
                String desc = tokens[2].trim();
                String accCode = tokens[3].trim();
                String debitStr = tokens[4].trim();
                String creditStr = tokens[5].trim();
                String memo = tokens.length > 6 ? tokens[6].trim() : "";

                LocalDate entryDate;
                try {
                    entryDate = LocalDate.parse(dateStr);
                } catch (Exception e) {
                    errorDetails.add(new ImportJobResponse.ImportErrorDetail(ref, lineNumber, accCode,
                            "Format tanggal tidak valid (harus YYYY-MM-DD): " + dateStr));
                    continue;
                }

                BigDecimal debit;
                BigDecimal credit;
                try {
                    debit = debitStr.isEmpty() ? BigDecimal.ZERO : new BigDecimal(debitStr);
                    credit = creditStr.isEmpty() ? BigDecimal.ZERO : new BigDecimal(creditStr);
                } catch (Exception e) {
                    errorDetails.add(new ImportJobResponse.ImportErrorDetail(ref, lineNumber, accCode,
                            "Format nominal uang tidak valid."));
                    continue;
                }

                rawRows.add(new RawCsvRow(lineNumber, ref, entryDate, desc, accCode, debit, credit, memo));
            }
        } catch (Exception e) {
            throw new IllegalStateException("Gagal memproses parsing berkas CSV: " + e.getMessage());
        }

        // 4. Kelompokkan baris berdasarkan journal_ref
        Map<String, List<RawCsvRow>> groups = new LinkedHashMap<>();
        for (RawCsvRow r : rawRows) {
            groups.computeIfAbsent(r.ref(), k -> new ArrayList<>()).add(r);
        }

        int successCount = 0;
        int failureCount = 0;

        for (Map.Entry<String, List<RawCsvRow>> entry : groups.entrySet()) {
            String journalRef = entry.getKey();
            List<RawCsvRow> groupRows = entry.getValue();

            // Validasi A: Minimal 2 baris (Debit & Kredit)
            if (groupRows.size() < 2) {
                errorDetails.add(new ImportJobResponse.ImportErrorDetail(journalRef, groupRows.get(0).lineNo(), "-",
                        "Jurnal harus memiliki minimal 2 baris (Debit & Kredit)."));
                failureCount++;
                continue;
            }

            // Validasi B: Keseimbangan Debit vs Kredit
            BigDecimal totalDebit = BigDecimal.ZERO;
            BigDecimal totalCredit = BigDecimal.ZERO;
            boolean accountError = false;
            List<CreateJournalLineRequest> lineRequests = new ArrayList<>();

            for (RawCsvRow row : groupRows) {
                totalDebit = totalDebit.add(row.debit());
                totalCredit = totalCredit.add(row.credit());

                Account acc = accountCodeMap.get(row.accountCode());
                if (acc == null) {
                    errorDetails
                            .add(new ImportJobResponse.ImportErrorDetail(journalRef, row.lineNo(), row.accountCode(),
                                    "Kode akun tidak ditemukan di bagan akun (COA)."));
                    accountError = true;
                    break;
                }
                if (!acc.isPostable()) {
                    errorDetails
                            .add(new ImportJobResponse.ImportErrorDetail(journalRef, row.lineNo(), row.accountCode(),
                                    "Akun adalah akun induk (Header) dan tidak boleh dijurnal langsung."));
                    accountError = true;
                    break;
                }
                if (!acc.isActive()) {
                    errorDetails
                            .add(new ImportJobResponse.ImportErrorDetail(journalRef, row.lineNo(), row.accountCode(),
                                    "Akun dalam status non-aktif."));
                    accountError = true;
                    break;
                }

                lineRequests.add(new CreateJournalLineRequest(acc.getId(), row.debit(), row.credit(), row.memo()));
            }

            if (accountError) {
                failureCount++;
                continue;
            }

            if (totalDebit.compareTo(totalCredit) != 0) {
                errorDetails.add(new ImportJobResponse.ImportErrorDetail(journalRef, groupRows.get(0).lineNo(), "-",
                        String.format("Jurnal tidak seimbang: Total Debit (%s) != Total Kredit (%s)", totalDebit,
                                totalCredit)));
                failureCount++;
                continue;
            }

            if (totalDebit.compareTo(BigDecimal.ZERO) <= 0) {
                errorDetails.add(new ImportJobResponse.ImportErrorDetail(journalRef, groupRows.get(0).lineNo(), "-",
                        "Total nilai transaksi harus lebih besar dari nol."));
                failureCount++;
                continue;
            }

            // Validasi C: Periode Akuntansi Harus Terbuka
            LocalDate txDate = groupRows.get(0).entryDate();
            Optional<AccountingPeriod> periodOpt = accountingPeriodRepository.findPeriodByDate(entityId, txDate);
            if (periodOpt.isEmpty()) {
                errorDetails.add(new ImportJobResponse.ImportErrorDetail(journalRef, groupRows.get(0).lineNo(), "-",
                        "Tidak ditemukan periode akuntansi untuk tanggal: " + txDate));
                failureCount++;
                continue;
            }

            AccountingPeriod period = periodOpt.get();
            if (autoPost && !period.isOpen()) {
                errorDetails.add(new ImportJobResponse.ImportErrorDetail(journalRef, groupRows.get(0).lineNo(), "-",
                        String.format("Periode akuntansi %d berstatus %s (hanya dapat posting pada periode OPEN).",
                                period.getPeriodNo(), period.getStatus())));
                failureCount++;
                continue;
            }

            // 5. Eksekusi Pembuatan Jurnal
            try {
                String fullDesc = "[" + journalRef + "] " + groupRows.get(0).desc();
                CreateJournalRequest journalReq = new CreateJournalRequest(
                        txDate,
                        fullDesc,
                        period.getId(),
                        JournalSource.IMPORT,
                        lineRequests);
                journalService.createJournal(entityId, userId, journalReq, autoPost);
                successCount++;
            } catch (Exception ex) {
                errorDetails.add(new ImportJobResponse.ImportErrorDetail(journalRef, groupRows.get(0).lineNo(), "-",
                        "Gagal membuat jurnal: " + ex.getMessage()));
                failureCount++;
            }
        }

        // 6. Simpan Rekaman Job ke Database
        String insertSql = """
                    INSERT INTO import_job (entity_id, file_name, file_hash, total_rows, processed_rows, success_count, failure_count, status, error_summary, created_by, created_at, completed_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, 'COMPLETED', ?::jsonb, ?, now(), now())
                    RETURNING id
                """;

        String errorsJson;
        try {
            errorsJson = objectMapper.writeValueAsString(errorDetails);
        } catch (Exception e) {
            errorsJson = "[]";
        }

        Long jobId = jdbcTemplate.queryForObject(
                insertSql,
                Long.class,
                entityId,
                fileName,
                fileHash,
                rawRows.size(),
                rawRows.size(),
                successCount,
                failureCount,
                errorsJson,
                userId);

        auditLogService.log(entityId, userId, "IMPORT_CSV", "IMPORT_JOB", jobId,
                String.format("{\"fileName\":\"%s\",\"successCount\":%d,\"failureCount\":%d}", fileName, successCount,
                        failureCount));

        return new ImportJobResponse(
                jobId,
                entityId,
                fileName,
                fileHash,
                rawRows.size(),
                rawRows.size(),
                successCount,
                failureCount,
                "COMPLETED",
                errorDetails,
                userId,
                OffsetDateTime.now(ZoneOffset.UTC),
                OffsetDateTime.now(ZoneOffset.UTC),
                String.format("Impor batch selesai: %d jurnal berhasil diproses, %d jurnal gagal.", successCount,
                        failureCount));
    }

    /**
     * Mengambil riwayat eksekusi impor massal.
     */
    @Transactional(readOnly = true)
    public List<ImportJobResponse> getImportHistory(Long entityId, int limit) {
        String sql = """
                    SELECT id, entity_id, file_name, file_hash, total_rows, processed_rows,
                           success_count, failure_count, status, error_summary::text AS errors_json,
                           created_by, created_at, completed_at
                    FROM import_job
                    WHERE entity_id = ?
                    ORDER BY created_at DESC, id DESC
                    LIMIT ?
                """;

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            String errJson = rs.getString("errors_json");
            List<ImportJobResponse.ImportErrorDetail> errors = Collections.emptyList();
            if (errJson != null && !errJson.isBlank()) {
                try {
                    errors = objectMapper.readValue(errJson,
                            new TypeReference<List<ImportJobResponse.ImportErrorDetail>>() {
                            });
                } catch (Exception ignored) {
                }
            }

            OffsetDateTime createdAt = rs.getObject("created_at", OffsetDateTime.class);
            OffsetDateTime completedAt = rs.getObject("completed_at", OffsetDateTime.class);

            return new ImportJobResponse(
                    rs.getLong("id"),
                    rs.getLong("entity_id"),
                    rs.getString("file_name"),
                    rs.getString("file_hash"),
                    rs.getInt("total_rows"),
                    rs.getInt("processed_rows"),
                    rs.getInt("success_count"),
                    rs.getInt("failure_count"),
                    rs.getString("status"),
                    errors,
                    rs.getLong("created_by"),
                    createdAt != null ? createdAt : OffsetDateTime.now(ZoneOffset.UTC),
                    completedAt,
                    null);
        }, entityId, limit);
    }

    private String calculateSha256(byte[] data) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(data);
            StringBuilder hexString = new StringBuilder(2 * hash.length);
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1)
                    hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            return UUID.randomUUID().toString().replace("-", "");
        }
    }

    private record RawCsvRow(
            int lineNo,
            String ref,
            LocalDate entryDate,
            String desc,
            String accountCode,
            BigDecimal debit,
            BigDecimal credit,
            String memo) {
    }
}