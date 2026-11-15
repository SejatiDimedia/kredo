package com.kredo.backend.journal.service;

import com.kredo.backend.coa.domain.Account;
import com.kredo.backend.coa.repository.AccountRepository;
import com.kredo.backend.journal.domain.JournalEntry;
import com.kredo.backend.journal.domain.JournalLine;
import com.kredo.backend.journal.domain.JournalStatus;
import com.kredo.backend.journal.dto.CreateJournalLineRequest;
import com.kredo.backend.journal.dto.CreateJournalRequest;
import com.kredo.backend.journal.dto.JournalResponse;
import com.kredo.backend.journal.repository.JournalEntryRepository;
import com.kredo.backend.period.domain.AccountingPeriod;
import com.kredo.backend.period.repository.AccountingPeriodRepository;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class JournalService {

    private final JournalEntryRepository journalEntryRepository;
    private final AccountRepository accountRepository;
    private final AccountingPeriodRepository accountingPeriodRepository;
    private final JdbcTemplate jdbcTemplate;

    public JournalService(JournalEntryRepository journalEntryRepository,
            AccountRepository accountRepository,
            AccountingPeriodRepository accountingPeriodRepository,
            JdbcTemplate jdbcTemplate) {
        this.journalEntryRepository = journalEntryRepository;
        this.accountRepository = accountRepository;
        this.accountingPeriodRepository = accountingPeriodRepository;
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Mengambil daftar seluruh jurnal pada entitas tertentu.
     */
    public List<JournalResponse> getJournalsByEntity(Long entityId) {
        return journalEntryRepository.findByEntityIdOrderByEntryDateDescIdDesc(entityId)
                .stream()
                .map(JournalResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Overload: Membuat Jurnal Baru dengan default userId = 1L.
     */
    @Transactional
    public JournalResponse createJournal(Long entityId, CreateJournalRequest request, boolean postImmediately) {
        return createJournal(entityId, 1L, request, postImmediately);
    }

    /**
     * Membuat Jurnal Baru (Double-Entry).
     * Jika postImmediately = true, langsung dialokasikan nomor urut resmi dan
     * berstatus POSTED.
     */
    @Transactional
    public JournalResponse createJournal(Long entityId, Long userId, CreateJournalRequest request,
            boolean postImmediately) {
        // 1. Validasi Keseimbangan Debit vs Kredit (INV-01)
        BigDecimal totalDebit = BigDecimal.ZERO;
        BigDecimal totalCredit = BigDecimal.ZERO;

        for (CreateJournalLineRequest line : request.lines()) {
            totalDebit = totalDebit.add(line.debit());
            totalCredit = totalCredit.add(line.credit());
        }

        if (totalDebit.compareTo(totalCredit) != 0) {
            throw new IllegalArgumentException(
                    String.format("Jurnal tidak seimbang! Total Debit (%s) harus sama dengan Total Kredit (%s)",
                            totalDebit, totalCredit));
        }

        if (totalDebit.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Total nilai jurnal harus lebih besar dari 0.");
        }

        // 2. Validasi & Auto-Resolve Periode Akuntansi (INV-08)
        AccountingPeriod period;
        if (request.periodId() != null) {
            period = accountingPeriodRepository.findByEntityIdAndId(entityId, request.periodId())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Periode akuntansi dengan ID " + request.periodId() + " tidak ditemukan."));
        } else {
            // Otomatis deteksi periode dari tanggal transaksi
            period = accountingPeriodRepository.findPeriodByDate(entityId, request.entryDate())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Tidak ada periode akuntansi untuk tanggal: " + request.entryDate()));
        }

        // Penegakan Invariant INV-08: Jurnal tidak boleh diposting ke periode CLOSED
        // atau LOCKED!
        if (postImmediately && !period.isOpen()) {
            throw new IllegalStateException(String.format(
                    "Transaksi ditolak: Periode akuntansi bulan ke-%d berstatus %s. Jurnal hanya dapat diposting pada periode OPEN (INV-08).",
                    period.getPeriodNo(), period.getStatus()));
        }

        // 3. Validasi Akun-akun di baris jurnal
        Set<Long> accountIds = request.lines().stream()
                .map(CreateJournalLineRequest::accountId)
                .collect(Collectors.toSet());

        Map<Long, Account> accountMap = accountRepository.findAllById(accountIds).stream()
                .collect(Collectors.toMap(Account::getId, a -> a));

        for (Long accId : accountIds) {
            Account acc = accountMap.get(accId);
            if (acc == null || !acc.getEntityId().equals(entityId)) {
                throw new IllegalArgumentException("Akun dengan ID " + accId + " tidak ditemukan pada entitas ini.");
            }
            // Menggunakan acc.isActive() sesuai konvensi boolean Lombok
            if (!acc.isActive()) {
                throw new IllegalArgumentException(
                        "Akun " + acc.getCode() + " - " + acc.getName() + " dalam status non-aktif.");
            }
            // Validasi INV-03: Hanya akun daun/leaf (postable) yang boleh dijurnal
            if (!acc.isPostable()) {
                throw new IllegalArgumentException("Akun " + acc.getCode()
                        + " adalah akun Header/Induk dan tidak boleh dijurnal langsung (INV-03).");
            }
        }

        // 4. Bangun Objek Header Jurnal
        JournalEntry journal = new JournalEntry(
                entityId,
                period.getId(),
                request.entryDate(),
                request.description(),
                request.source(),
                userId);
        journal.setTotalAmount(totalDebit);

        // Tambahkan baris-baris jurnal
        int lineNo = 1;
        for (CreateJournalLineRequest lineReq : request.lines()) {
            JournalLine line = new JournalLine(
                    entityId,
                    lineNo++,
                    lineReq.accountId(),
                    lineReq.debit(),
                    lineReq.credit(),
                    lineReq.memo());
            journal.addLine(line);
        }

        // 5. Jika posting langsung, alokasikan nomor urut resmi tanpa celah (Gapless
        // Sequence)
        if (postImmediately) {
            String journalNo = generateGaplessJournalNo(entityId, request.entryDate().getYear());
            journal.setJournalNo(journalNo);
            journal.setStatus(JournalStatus.POSTED);
            journal.setPostedBy(userId);
            journal.setPostedAt(OffsetDateTime.now());
        }

        // 6. Simpan ke database (Cascade otomatis menyimpan Header dan seluruh Lines)
        JournalEntry saved = journalEntryRepository.save(journal);
        return JournalResponse.fromEntity(saved);
    }

    /**
     * Menghasilkan nomor jurnal resmi berurutan tanpa celah (INV-07).
     * Menggunakan Row-Level Lock (FOR UPDATE) pada tabel journal_sequence di
     * PostgreSQL.
     */
    private String generateGaplessJournalNo(Long entityId, int fiscalYear) {
        String sqlLock = "SELECT last_number FROM journal_sequence WHERE entity_id = ? AND fiscal_year = ? FOR UPDATE";
        Long currentNumber = jdbcTemplate.queryForObject(sqlLock, Long.class, entityId, fiscalYear);

        long nextNumber = (currentNumber != null ? currentNumber : 0L) + 1L;

        String sqlUpdate = "UPDATE journal_sequence SET last_number = ? WHERE entity_id = ? AND fiscal_year = ?";
        jdbcTemplate.update(sqlUpdate, nextNumber, entityId, fiscalYear);

        return String.format("JV-PTM-%d-%06d", fiscalYear, nextNumber);
    }

    /**
     * Mengambil detail satu jurnal berdasarkan ID.
     */
    public JournalResponse getJournalById(Long entityId, Long id) {
        JournalEntry journal = journalEntryRepository.findByEntityIdAndId(entityId, id)
                .orElseThrow(() -> new IllegalArgumentException("Jurnal dengan ID " + id + " tidak ditemukan."));
        return JournalResponse.fromEntity(journal);
    }

    /**
     * Membalik jurnal berstatus POSTED (Reversal Entry).
     * Membalik posisi Debit dan Kredit untuk menetralkan saldo secara legal.
     */
    @Transactional
    public JournalResponse reverseJournal(Long entityId, Long journalId, String reason) {
        JournalEntry original = journalEntryRepository.findByEntityIdAndId(entityId, journalId)
                .orElseThrow(() -> new IllegalArgumentException("Jurnal dengan ID " + journalId + " tidak ditemukan."));

        // Validasi 1: Hanya jurnal POSTED yang boleh dibalik
        if (original.getStatus() != JournalStatus.POSTED) {
            throw new IllegalStateException("Hanya jurnal berstatus POSTED yang dapat dibalik.");
        }

        // Validasi 2: Jurnal pembalik tidak boleh dibalik lagi
        if (original.getSource() == com.kredo.backend.journal.domain.JournalSource.REVERSAL) {
            throw new IllegalStateException("Jurnal pembalik tidak dapat dibalik kembali.");
        }

        // Validasi 3: Cek apakah jurnal ini sudah pernah dibalik sebelumnya
        if (original.getReversalOfId() != null) {
            throw new IllegalStateException("Jurnal ini sudah pernah dibalik sebelumnya.");
        }

        LocalDate today = LocalDate.now();

        // Validasi 4: Pastikan tanggal pembalikan hari ini berada di periode yang OPEN
        // (INV-08)
        AccountingPeriod currentPeriod = accountingPeriodRepository.findPeriodByDate(entityId, today)
                .orElseThrow(() -> new IllegalStateException(
                        "Tidak ada periode akuntansi terbuka untuk tanggal pembalikan: " + today));

        if (!currentPeriod.isOpen()) {
            throw new IllegalStateException(String.format(
                    "Pembalik jurnal gagal: Periode akuntansi berjalan (%d) berstatus %s (INV-08).",
                    currentPeriod.getPeriodNo(), currentPeriod.getStatus()));
        }

        String desc = "Pembalik Jurnal " + original.getJournalNo() + ": " +
                (reason != null && !reason.isBlank() ? reason.trim() : "Koreksi pembukuan transaksi");

        // Buat voucher jurnal baru dengan sumber REVERSAL dan periode aktif saat ini
        JournalEntry reversal = new JournalEntry(
                entityId,
                currentPeriod.getId(),
                today,
                desc,
                com.kredo.backend.journal.domain.JournalSource.REVERSAL,
                1L // User ID pembalik
        );
        reversal.setTotalAmount(original.getTotalAmount());
        reversal.setReversalOfId(original.getId());

        // LOGIKA PEMBALIKAN: Tukar posisi Debit dan Kredit pada setiap baris!
        int lineNo = 1;
        for (JournalLine origLine : original.getLines()) {
            JournalLine reversedLine = new JournalLine(
                    entityId,
                    lineNo++,
                    origLine.getAccountId(),
                    origLine.getCredit(), // Nilai Debit baru diambil dari Kredit lama!
                    origLine.getDebit(), // Nilai Kredit baru diambil dari Debit lama!
                    "Pembalik baris " + origLine.getLineNo() +
                            (origLine.getMemo() != null ? " (" + origLine.getMemo() + ")" : ""));
            reversal.addLine(reversedLine);
        }

        // Alokasikan nomor resmi baru tanpa celah
        String newJournalNo = generateGaplessJournalNo(entityId, today.getYear());
        reversal.setJournalNo(newJournalNo);
        reversal.setStatus(JournalStatus.POSTED);
        reversal.setPostedBy(1L);
        reversal.setPostedAt(OffsetDateTime.now());

        // Simpan jurnal pembalik ke database
        JournalEntry savedReversal = journalEntryRepository.save(reversal);

        // Tandai jurnal lama bahwa ia sudah memiliki pembalik
        original.setReversalOfId(savedReversal.getId());
        journalEntryRepository.save(original);

        return JournalResponse.fromEntity(savedReversal);
    }
}