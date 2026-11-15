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
import com.kredo.backend.shared.domain.Money;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class JournalService {

    private final JournalEntryRepository journalEntryRepository;
    private final AccountRepository accountRepository;
    private final JdbcTemplate jdbcTemplate;

    /**
     * Mengambil semua daftar jurnal milik entitas tertentu.
     */
    public List<JournalResponse> getJournalsByEntity(Long entityId) {
        return journalEntryRepository.findByEntityIdOrderByEntryDateDescIdDesc(entityId)
                .stream()
                .map(JournalResponse::fromEntity)
                .toList();
    }

    /**
     * Membuat dan memposting Jurnal Baru dengan validasi aturan akuntansi ketat.
     */
    @Transactional
    public JournalResponse createJournal(Long entityId, CreateJournalRequest request, boolean postImmediately) {
        // Default period ke November 2026 (Period ID = 11) jika tidak dikirim dari UI
        Long periodId = request.periodId() != null ? request.periodId() : 11L;
        Long userId = 1L; // User sistem / default

        // 1. INVARIANT VALIDASI: Hitung Total Debit & Kredit menggunakan Value Object
        // Money
        Money totalDebit = Money.zero();
        Money totalCredit = Money.zero();

        for (CreateJournalLineRequest lineReq : request.lines()) {
            Money debit = Money.of(lineReq.debit());
            Money credit = Money.of(lineReq.credit());

            // INV-04: Tepat satu sisi yang bernilai > 0
            if (debit.isZero() && credit.isZero()) {
                throw new IllegalArgumentException("Setiap baris jurnal harus memiliki nilai Debit atau Kredit.");
            }
            if (debit.isPositive() && credit.isPositive()) {
                throw new IllegalArgumentException("Baris jurnal tidak boleh mengisi Debit dan Kredit sekaligus.");
            }

            // INV-03: Validasi akun harus postable (bukan akun induk/header)
            Account account = accountRepository.findById(lineReq.accountId())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Akun dengan ID " + lineReq.accountId() + " tidak ditemukan."));

            if (!account.isPostable()) {
                throw new IllegalArgumentException("Akun " + account.getCode() + " — " + account.getName() +
                        " adalah akun induk (header) dan tidak boleh digunakan pada transaksi jurnal langsung.");
            }

            totalDebit = totalDebit.plus(debit);
            totalCredit = totalCredit.plus(credit);
        }

        // INV-01: Validasi Keseimbangan (Double-Entry Balancing)
        if (!totalDebit.equals(totalCredit)) {
            Money selisih = totalDebit.minus(totalCredit);
            throw new IllegalArgumentException(String.format(
                    "INVARIANT VIOLATION: Jurnal tidak seimbang! Total Debit (%s) tidak sama dengan Total Kredit (%s). Selisih: %s",
                    totalDebit, totalCredit, selisih));
        }

        if (totalDebit.isZero()) {
            throw new IllegalArgumentException("Total transaksi jurnal tidak boleh bernilai Rp 0.");
        }

        // 2. Buat Header Jurnal
        JournalEntry journal = new JournalEntry(
                entityId,
                periodId,
                request.entryDate(),
                request.description().trim(),
                request.source(),
                userId);
        journal.setTotalAmount(totalDebit.amount());

        // 3. Masukkan baris-baris rincian (lines)
        int lineNo = 1;
        for (CreateJournalLineRequest lineReq : request.lines()) {
            JournalLine line = new JournalLine(
                    entityId,
                    lineNo++,
                    lineReq.accountId(),
                    lineReq.debit(),
                    lineReq.credit(),
                    lineReq.memo() != null ? lineReq.memo().trim() : null);
            journal.addLine(line);
        }

        // 4. Jika langsung di-POST: Terbitkan Nomor Jurnal Resmi Tanpa Celah (Gapless
        // Sequence)
        if (postImmediately) {
            String journalNo = generateGaplessJournalNo(entityId, request.entryDate().getYear());
            journal.setJournalNo(journalNo);
            journal.setStatus(JournalStatus.POSTED);
            journal.setPostedBy(userId);
            journal.setPostedAt(java.time.OffsetDateTime.now());
        }

        // 5. Simpan ke database (Cascade otomatis menyimpan Header dan seluruh Lines)
        JournalEntry saved = journalEntryRepository.save(journal);
        return JournalResponse.fromEntity(saved);
    }

    /**
     * Menghasilkan nomor jurnal resmi berurutan tanpa celah (INV-07).
     * Menggunakan Row-Level Lock (FOR UPDATE) pada tabel journal_sequence di
     * PostgreSQL.
     */
    private String generateGaplessJournalNo(Long entityId, int fiscalYear) {
        // Kunci baris counter di database agar aman dari race condition (concurrency
        // safe)
        String sqlLock = "SELECT last_number FROM journal_sequence WHERE entity_id = ? AND fiscal_year = ? FOR UPDATE";
        Long currentNumber = jdbcTemplate.queryForObject(sqlLock, Long.class, entityId, fiscalYear);

        long nextNumber = (currentNumber != null ? currentNumber : 0L) + 1L;

        // Update counter angka terakhir
        String sqlUpdate = "UPDATE journal_sequence SET last_number = ? WHERE entity_id = ? AND fiscal_year = ?";
        jdbcTemplate.update(sqlUpdate, nextNumber, entityId, fiscalYear);

        // Format standar: JV-PTM-2026-000001
        return String.format("JV-PTM-%d-%06d", fiscalYear, nextNumber);
    }
}