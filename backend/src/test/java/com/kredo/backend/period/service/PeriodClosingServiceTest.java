package com.kredo.backend.period.service;

import com.kredo.backend.journal.repository.JournalEntryRepository;
import com.kredo.backend.ledger.dto.TrialBalanceResponse;
import com.kredo.backend.ledger.service.LedgerReportService;
import com.kredo.backend.period.domain.AccountingPeriod;
import com.kredo.backend.period.domain.PeriodStatus;
import com.kredo.backend.period.dto.PeriodResponse;
import com.kredo.backend.period.repository.AccountingPeriodRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collections;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class PeriodClosingServiceTest {

    private AccountingPeriodRepository accountingPeriodRepository;
    private JournalEntryRepository journalEntryRepository;
    private LedgerReportService ledgerReportService;

    private PeriodClosingService periodClosingService;

    @BeforeEach
    void setUp() {
        accountingPeriodRepository = mock(AccountingPeriodRepository.class);
        journalEntryRepository = mock(JournalEntryRepository.class);
        ledgerReportService = mock(LedgerReportService.class);

        periodClosingService = new PeriodClosingService(
                accountingPeriodRepository,
                journalEntryRepository,
                ledgerReportService
        );
    }

    @Test
    @DisplayName("Tutup buku ditolak jika masih ada jurnal gantung (DRAFT / SUBMITTED / APPROVED)")
    void closePeriod_pendingJournalsExist_throwsException() {
        Long entityId = 1L;
        Long periodId = 11L;

        AccountingPeriod period = mock(AccountingPeriod.class);
        when(period.getId()).thenReturn(periodId);
        when(period.getEntityId()).thenReturn(entityId);
        when(period.getPeriodNo()).thenReturn(11);
        when(period.getStatus()).thenReturn(PeriodStatus.OPEN);

        when(accountingPeriodRepository.findByEntityIdAndId(entityId, periodId)).thenReturn(Optional.of(period));
        // Mensimulasikan ada 2 jurnal menggantung yang belum diposting
        when(journalEntryRepository.countByEntityIdAndPeriodIdAndStatusIn(eq(entityId), eq(periodId), anyList()))
                .thenReturn(2L);

        assertThatThrownBy(() -> periodClosingService.closePeriod(entityId, periodId, 3L))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Masih terdapat 2 jurnal yang belum selesai diposting");
    }

    @Test
    @DisplayName("Tutup buku ditolak jika Neraca Saldo tidak seimbang")
    void closePeriod_trialBalanceUnbalanced_throwsException() {
        Long entityId = 1L;
        Long periodId = 11L;

        AccountingPeriod period = mock(AccountingPeriod.class);
        when(period.getId()).thenReturn(periodId);
        when(period.getEntityId()).thenReturn(entityId);
        when(period.getPeriodNo()).thenReturn(11);
        when(period.getStatus()).thenReturn(PeriodStatus.OPEN);

        when(accountingPeriodRepository.findByEntityIdAndId(entityId, periodId)).thenReturn(Optional.of(period));
        when(journalEntryRepository.countByEntityIdAndPeriodIdAndStatusIn(eq(entityId), eq(periodId), anyList()))
                .thenReturn(0L); // 0 jurnal gantung

        // Neraca Saldo tidak seimbang: Debit 100jt vs Kredit 90jt (isBalanced = false)
        TrialBalanceResponse unbalancedTrialBalance = new TrialBalanceResponse(
                entityId, periodId, 11, 2026,
                Collections.emptyList(),
                new BigDecimal("100000000.00"),
                new BigDecimal("90000000.00"),
                false
        );
        when(ledgerReportService.getTrialBalance(entityId, periodId)).thenReturn(unbalancedTrialBalance);

        assertThatThrownBy(() -> periodClosingService.closePeriod(entityId, periodId, 3L))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Neraca Saldo tidak seimbang");
    }

    @Test
    @DisplayName("Tutup buku berhasil jika 0 jurnal gantung dan Neraca Saldo seimbang")
    void closePeriod_validConditions_success() {
        Long entityId = 1L;
        Long periodId = 11L;
        Long controllerId = 3L;

        AccountingPeriod period = mock(AccountingPeriod.class);
        when(period.getId()).thenReturn(periodId);
        when(period.getEntityId()).thenReturn(entityId);
        when(period.getPeriodNo()).thenReturn(11);
        when(period.getStartDate()).thenReturn(LocalDate.of(2026, 11, 1));
        when(period.getEndDate()).thenReturn(LocalDate.of(2026, 11, 30));
        when(period.getStatus()).thenReturn(PeriodStatus.OPEN);

        when(accountingPeriodRepository.findByEntityIdAndId(entityId, periodId)).thenReturn(Optional.of(period));
        when(journalEntryRepository.countByEntityIdAndPeriodIdAndStatusIn(eq(entityId), eq(periodId), anyList()))
                .thenReturn(0L);

        TrialBalanceResponse balancedTrialBalance = new TrialBalanceResponse(
                entityId, periodId, 11, 2026,
                Collections.emptyList(),
                new BigDecimal("50000000.00"),
                new BigDecimal("50000000.00"),
                true
        );
        when(ledgerReportService.getTrialBalance(entityId, periodId)).thenReturn(balancedTrialBalance);
        when(accountingPeriodRepository.save(any(AccountingPeriod.class))).thenReturn(period);

        PeriodResponse response = periodClosingService.closePeriod(entityId, periodId, controllerId);

        assertThat(response).isNotNull();
        verify(period).setStatus(PeriodStatus.CLOSED);
        verify(period).setClosedBy(controllerId);
        verify(period).setClosedAt(any());
    }

    @Test
    @DisplayName("Periode LOCKED (Tutup Tahun) dilarang dibuka kembali")
    void reopenPeriod_lockedPeriod_throwsException() {
        Long entityId = 1L;
        Long periodId = 1L;

        AccountingPeriod period = mock(AccountingPeriod.class);
        when(period.getId()).thenReturn(periodId);
        when(period.getEntityId()).thenReturn(entityId);
        when(period.getStatus()).thenReturn(PeriodStatus.LOCKED);

        when(accountingPeriodRepository.findByEntityIdAndId(entityId, periodId)).thenReturn(Optional.of(period));

        assertThatThrownBy(() -> periodClosingService.reopenPeriod(entityId, periodId, 3L, "Koreksi audit"))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("LOCKED (Tutup Tahun) terkunci permanen");
    }
}
