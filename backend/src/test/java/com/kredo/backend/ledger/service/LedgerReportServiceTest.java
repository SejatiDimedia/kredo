package com.kredo.backend.ledger.service;

import com.kredo.backend.coa.repository.AccountRepository;
import com.kredo.backend.ledger.dto.BalanceSheetResponse;
import com.kredo.backend.ledger.dto.IncomeStatementResponse;
import com.kredo.backend.ledger.dto.TrialBalanceResponse;
import com.kredo.backend.period.domain.AccountingPeriod;
import com.kredo.backend.period.domain.PeriodStatus;
import com.kredo.backend.period.repository.AccountingPeriodRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collections;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class LedgerReportServiceTest {

    private JdbcTemplate jdbcTemplate;
    private AccountRepository accountRepository;
    private AccountingPeriodRepository accountingPeriodRepository;

    private LedgerReportService ledgerReportService;

    @BeforeEach
    void setUp() {
        jdbcTemplate = mock(JdbcTemplate.class);
        accountRepository = mock(AccountRepository.class);
        accountingPeriodRepository = mock(AccountingPeriodRepository.class);

        ledgerReportService = new LedgerReportService(
                jdbcTemplate,
                accountRepository,
                accountingPeriodRepository
        );
    }

    @Test
    @DisplayName("Neraca Saldo menghitung total debit dan kredit dengan benar")
    void getTrialBalance_calculatesTotals() {
        Long entityId = 1L;
        Long periodId = 11L;

        AccountingPeriod period = mock(AccountingPeriod.class);
        when(period.getId()).thenReturn(periodId);
        when(period.getEntityId()).thenReturn(entityId);
        when(period.getPeriodNo()).thenReturn(11);
        when(period.getStartDate()).thenReturn(LocalDate.of(2026, 11, 1));
        when(period.getStatus()).thenReturn(PeriodStatus.OPEN);

        when(accountingPeriodRepository.findByEntityIdAndId(entityId, periodId)).thenReturn(Optional.of(period));
        when(jdbcTemplate.query(anyString(), any(RowMapper.class), eq(periodId), eq(entityId)))
                .thenReturn(Collections.emptyList());

        TrialBalanceResponse response = ledgerReportService.getTrialBalance(entityId, periodId);

        assertThat(response).isNotNull();
        assertThat(response.isBalanced()).isTrue();
        assertThat(response.totalDebit()).isEqualByComparingTo(BigDecimal.ZERO);
        assertThat(response.totalCredit()).isEqualByComparingTo(BigDecimal.ZERO);
    }

    @Test
    @DisplayName("Laba Rugi menghitung Pendapatan - Beban = Laba Bersih")
    void getIncomeStatement_calculatesNetIncome() {
        Long entityId = 1L;
        Long periodId = 11L;

        AccountingPeriod period = mock(AccountingPeriod.class);
        when(period.getId()).thenReturn(periodId);
        when(period.getEntityId()).thenReturn(entityId);
        when(period.getPeriodNo()).thenReturn(11);
        when(period.getStartDate()).thenReturn(LocalDate.of(2026, 11, 1));
        when(period.getStatus()).thenReturn(PeriodStatus.OPEN);

        when(accountingPeriodRepository.findByEntityIdAndId(entityId, periodId)).thenReturn(Optional.of(period));
        when(jdbcTemplate.query(anyString(), any(RowMapper.class), eq(periodId), eq(entityId)))
                .thenReturn(Collections.emptyList());

        IncomeStatementResponse response = ledgerReportService.getIncomeStatement(entityId, periodId);

        assertThat(response).isNotNull();
        assertThat(response.netIncome()).isEqualByComparingTo(BigDecimal.ZERO);
        assertThat(response.isProfitable()).isTrue();
    }

    @Test
    @DisplayName("Neraca memverifikasi Aset = Liabilitas + Ekuitas + Laba Berjalan")
    void getBalanceSheet_verifiesEquation() {
        Long entityId = 1L;
        Long periodId = 11L;

        AccountingPeriod period = mock(AccountingPeriod.class);
        when(period.getId()).thenReturn(periodId);
        when(period.getEntityId()).thenReturn(entityId);
        when(period.getPeriodNo()).thenReturn(11);
        when(period.getStartDate()).thenReturn(LocalDate.of(2026, 11, 1));
        when(period.getStatus()).thenReturn(PeriodStatus.OPEN);

        when(accountingPeriodRepository.findByEntityIdAndId(entityId, periodId)).thenReturn(Optional.of(period));
        when(jdbcTemplate.query(anyString(), any(RowMapper.class), eq(periodId), eq(entityId)))
                .thenReturn(Collections.emptyList());

        BalanceSheetResponse response = ledgerReportService.getBalanceSheet(entityId, periodId);

        assertThat(response).isNotNull();
        assertThat(response.isBalanced()).isTrue();
        assertThat(response.totalAsset()).isEqualByComparingTo(BigDecimal.ZERO);
        assertThat(response.totalLiabilitiesAndEquity()).isEqualByComparingTo(BigDecimal.ZERO);
    }
}
