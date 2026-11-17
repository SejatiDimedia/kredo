package com.kredo.backend.ledger.service;

import com.kredo.backend.audit.service.AuditLogService;
import com.kredo.backend.ledger.dto.ReconciliationResponse;
import com.kredo.backend.period.domain.AccountingPeriod;
import com.kredo.backend.period.domain.PeriodStatus;
import com.kredo.backend.period.repository.AccountingPeriodRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowCallbackHandler;

import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class LedgerReconciliationServiceTest {

    private JdbcTemplate jdbcTemplate;
    private AccountingPeriodRepository accountingPeriodRepository;
    private AuditLogService auditLogService;

    private LedgerReconciliationService ledgerReconciliationService;

    @BeforeEach
    void setUp() {
        jdbcTemplate = mock(JdbcTemplate.class);
        accountingPeriodRepository = mock(AccountingPeriodRepository.class);
        auditLogService = mock(AuditLogService.class);

        ledgerReconciliationService = new LedgerReconciliationService(
                jdbcTemplate,
                accountingPeriodRepository,
                auditLogService
        );
    }

    @Test
    @DisplayName("Rekonsiliasi sukses menyatakan HEALTHY jika snapshot sama dengan hitung ulang")
    void runReconciliation_balancedSnapshot_healthy() throws SQLException {
        Long entityId = 1L;
        Long periodId = 11L;

        AccountingPeriod period = mock(AccountingPeriod.class);
        when(period.getId()).thenReturn(periodId);
        when(period.getEntityId()).thenReturn(entityId);
        when(period.getPeriodNo()).thenReturn(11);
        when(period.getStartDate()).thenReturn(LocalDate.of(2026, 11, 1));
        when(period.getStatus()).thenReturn(PeriodStatus.OPEN);

        when(accountingPeriodRepository.findByEntityIdAndId(entityId, periodId)).thenReturn(Optional.of(period));

        // Mock database query returning 2 accounts: 1101 (Kas: Debit 10jt) and 4101 (Pendapatan: Kredit 10jt)
        doAnswer(invocation -> {
            RowCallbackHandler rch = invocation.getArgument(1);

            ResultSet rs1 = mock(ResultSet.class);
            when(rs1.getLong("account_id")).thenReturn(1101L);
            when(rs1.getString("account_code")).thenReturn("1101");
            when(rs1.getString("account_name")).thenReturn("Kas Kecil");
            when(rs1.getBigDecimal("snapshot_debit")).thenReturn(new BigDecimal("10000000.00"));
            when(rs1.getBigDecimal("snapshot_credit")).thenReturn(BigDecimal.ZERO);
            when(rs1.getBigDecimal("recalculated_debit")).thenReturn(new BigDecimal("10000000.00"));
            when(rs1.getBigDecimal("recalculated_credit")).thenReturn(BigDecimal.ZERO);
            rch.processRow(rs1);

            ResultSet rs2 = mock(ResultSet.class);
            when(rs2.getLong("account_id")).thenReturn(4101L);
            when(rs2.getString("account_code")).thenReturn("4101");
            when(rs2.getString("account_name")).thenReturn("Pendapatan Penjualan");
            when(rs2.getBigDecimal("snapshot_debit")).thenReturn(BigDecimal.ZERO);
            when(rs2.getBigDecimal("snapshot_credit")).thenReturn(new BigDecimal("10000000.00"));
            when(rs2.getBigDecimal("recalculated_debit")).thenReturn(BigDecimal.ZERO);
            when(rs2.getBigDecimal("recalculated_credit")).thenReturn(new BigDecimal("10000000.00"));
            rch.processRow(rs2);

            return null;
        }).when(jdbcTemplate).query(anyString(), any(RowCallbackHandler.class), eq(periodId), eq(periodId), eq(entityId));

        ReconciliationResponse response = ledgerReconciliationService.runReconciliation(entityId, periodId, 3L);

        assertThat(response).isNotNull();
        assertThat(response.isBalanced()).isTrue();
        assertThat(response.isInvariantMaintained()).isTrue();
        assertThat(response.discrepancyCount()).isEqualTo(0);
        assertThat(response.systemStatus()).isEqualTo("HEALTHY");
        assertThat(response.totalAccountsAudited()).isEqualTo(2);
        assertThat(response.totalRecalculatedDebit()).isEqualByComparingTo("10000000.00");
        assertThat(response.totalRecalculatedCredit()).isEqualByComparingTo("10000000.00");

        verify(auditLogService, times(1)).log(eq(entityId), eq(3L), eq("RUN_RECONCILIATION"), eq("GENERAL_LEDGER"), eq(periodId), anyString());
    }

    @Test
    @DisplayName("Rekonsiliasi mendeteksi selisih jika snapshot berbeda dari transaksi riil")
    void runReconciliation_discrepancyDetected_reportsStatus() throws SQLException {
        Long entityId = 1L;
        Long periodId = 11L;

        AccountingPeriod period = mock(AccountingPeriod.class);
        when(period.getId()).thenReturn(periodId);
        when(period.getEntityId()).thenReturn(entityId);
        when(period.getPeriodNo()).thenReturn(11);
        when(period.getStartDate()).thenReturn(LocalDate.of(2026, 11, 1));
        when(period.getStatus()).thenReturn(PeriodStatus.OPEN);

        when(accountingPeriodRepository.findByEntityIdAndId(entityId, periodId)).thenReturn(Optional.of(period));

        // Mock database query with discrepancy: snapshot 10jt, tapi transaksi riil hanya 8jt (selisih 2jt)
        doAnswer(invocation -> {
            RowCallbackHandler rch = invocation.getArgument(1);

            ResultSet rs = mock(ResultSet.class);
            when(rs.getLong("account_id")).thenReturn(1101L);
            when(rs.getString("account_code")).thenReturn("1101");
            when(rs.getString("account_name")).thenReturn("Kas Kecil");
            when(rs.getBigDecimal("snapshot_debit")).thenReturn(new BigDecimal("10000000.00"));
            when(rs.getBigDecimal("snapshot_credit")).thenReturn(BigDecimal.ZERO);
            when(rs.getBigDecimal("recalculated_debit")).thenReturn(new BigDecimal("8000000.00"));
            when(rs.getBigDecimal("recalculated_credit")).thenReturn(BigDecimal.ZERO);
            rch.processRow(rs);

            return null;
        }).when(jdbcTemplate).query(anyString(), any(RowCallbackHandler.class), eq(periodId), eq(periodId), eq(entityId));

        ReconciliationResponse response = ledgerReconciliationService.runReconciliation(entityId, periodId, 0L);

        assertThat(response).isNotNull();
        assertThat(response.isInvariantMaintained()).isFalse();
        assertThat(response.discrepancyCount()).isEqualTo(1);
        assertThat(response.systemStatus()).isEqualTo("DISCREPANCY_DETECTED");
        assertThat(response.discrepancies()).hasSize(1);
        assertThat(response.discrepancies().get(0).debitDiff()).isEqualByComparingTo("2000000.00");
    }
}
