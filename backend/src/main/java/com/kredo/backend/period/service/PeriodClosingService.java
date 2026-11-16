package com.kredo.backend.period.service;

import com.kredo.backend.journal.domain.JournalStatus;
import com.kredo.backend.journal.repository.JournalEntryRepository;
import com.kredo.backend.ledger.dto.TrialBalanceResponse;
import com.kredo.backend.ledger.service.LedgerReportService;
import com.kredo.backend.period.domain.AccountingPeriod;
import com.kredo.backend.period.domain.PeriodStatus;
import com.kredo.backend.period.dto.PeriodResponse;
import com.kredo.backend.period.repository.AccountingPeriodRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PeriodClosingService {

    private final AccountingPeriodRepository accountingPeriodRepository;
    private final JournalEntryRepository journalEntryRepository;
    private final LedgerReportService ledgerReportService;

    private static final String[] MONTH_NAMES = {
            "", "Januari", "Februari", "Maret", "April", "Mei", "Juni",
            "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    };

    /**
     * Mengambil seluruh daftar periode akuntansi untuk suatu entitas.
     */
    @Transactional(readOnly = true)
    public List<PeriodResponse> getPeriodsByEntity(Long entityId) {
        return accountingPeriodRepository.findByEntityIdOrderByStartDateAsc(entityId).stream()
                .map(this::toResponse)
                .toList();
    }

    /**
     * Menutup Periode Akuntansi (Month-End Close).
     * Memvalidasi dua syarat mutlak:
     * 1. Tidak ada jurnal berstatus DRAFT, SUBMITTED, atau APPROVED.
     * 2. Neraca Saldo periode tersebut harus seimbang (Total Debit == Total
     * Kredit).
     */
    @Transactional
    public PeriodResponse closePeriod(Long entityId, Long periodId, Long userId) {
        AccountingPeriod period = accountingPeriodRepository.findByEntityIdAndId(entityId, periodId)
                .orElseThrow(
                        () -> new IllegalArgumentException("Periode akuntansi tidak ditemukan untuk entitas ini."));

        if (period.getStatus() == PeriodStatus.CLOSED) {
            throw new IllegalStateException("Periode akuntansi ini sudah berstatus CLOSED.");
        }
        if (period.getStatus() == PeriodStatus.LOCKED) {
            throw new IllegalStateException(
                    "Periode akuntansi sudah berstatus LOCKED (Tutup Tahun) dan tidak dapat dimodifikasi.");
        }

        // Syarat 1: Pastikan tidak ada jurnal gantung yang belum selesai
        List<JournalStatus> pendingStatuses = List.of(
                JournalStatus.DRAFT,
                JournalStatus.SUBMITTED,
                JournalStatus.APPROVED);
        long pendingCount = journalEntryRepository.countByEntityIdAndPeriodIdAndStatusIn(entityId, periodId,
                pendingStatuses);
        if (pendingCount > 0) {
            throw new IllegalStateException(String.format(
                    "Tutup buku ditolak: Masih terdapat %d jurnal yang belum selesai diposting atau dibatalkan (DRAFT/SUBMITTED/APPROVED) pada periode ini.",
                    pendingCount));
        }

        // Syarat 2: Pastikan Neraca Saldo seimbang
        TrialBalanceResponse trialBalance = ledgerReportService.getTrialBalance(entityId, periodId);
        if (!trialBalance.isBalanced()) {
            throw new IllegalStateException(String.format(
                    "Tutup buku ditolak: Neraca Saldo tidak seimbang. Total Debit = %s, Total Kredit = %s.",
                    trialBalance.totalDebit(),
                    trialBalance.totalCredit()));
        }

        // Lakukan penutupan periode
        period.setStatus(PeriodStatus.CLOSED);
        period.setClosedAt(OffsetDateTime.now());
        period.setClosedBy(userId);

        AccountingPeriod saved = accountingPeriodRepository.save(period);
        return toResponse(saved);
    }

    /**
     * Membuka kembali periode yang sudah CLOSED jika dibutuhkan penyesuaian khusus
     * oleh Controller/Auditor.
     */
    @Transactional
    public PeriodResponse reopenPeriod(Long entityId, Long periodId, Long userId, String reason) {
        AccountingPeriod period = accountingPeriodRepository.findByEntityIdAndId(entityId, periodId)
                .orElseThrow(
                        () -> new IllegalArgumentException("Periode akuntansi tidak ditemukan untuk entitas ini."));

        if (period.getStatus() == PeriodStatus.LOCKED) {
            throw new IllegalStateException(
                    "Periode berstatus LOCKED (Tutup Tahun) terkunci permanen dan tidak dapat dibuka kembali.");
        }
        if (period.getStatus() == PeriodStatus.OPEN) {
            throw new IllegalStateException("Periode akuntansi sudah dalam status OPEN.");
        }
        if (reason == null || reason.trim().isBlank()) {
            throw new IllegalArgumentException("Alasan pembukaan kembali periode wajib diisi untuk kebutuhan audit.");
        }

        period.setStatus(PeriodStatus.OPEN);
        period.setClosedAt(null);
        period.setClosedBy(null);

        AccountingPeriod saved = accountingPeriodRepository.save(period);
        return toResponse(saved);
    }

    private PeriodResponse toResponse(AccountingPeriod p) {
        int m = p.getPeriodNo();
        String monthName = (m >= 1 && m <= 12) ? MONTH_NAMES[m] : "Periode " + m;
        String displayName = monthName + " " + p.getStartDate().getYear();

        return new PeriodResponse(
                p.getId(),
                p.getEntityId(),
                p.getPeriodNo(),
                p.getStartDate().getYear(),
                displayName,
                p.getStartDate(),
                p.getEndDate(),
                p.getStatus(),
                p.getClosedAt(),
                p.getClosedBy());
    }
}