package com.kredo.backend.ledger.service;

import com.kredo.backend.audit.service.AuditLogService;
import com.kredo.backend.ledger.dto.ReconciliationResponse;
import com.kredo.backend.period.domain.AccountingPeriod;
import com.kredo.backend.period.repository.AccountingPeriodRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LedgerReconciliationService {

    private final JdbcTemplate jdbcTemplate;
    private final AccountingPeriodRepository accountingPeriodRepository;
    private final AuditLogService auditLogService;

    /**
     * Menjalankan audit rekonsiliasi antara baris jurnal terposting dan tabel
     * snapshot saldo.
     */
    @Transactional
    public ReconciliationResponse runReconciliation(Long entityId, Long periodId, Long actorId) {
        AccountingPeriod period = accountingPeriodRepository.findByEntityIdAndId(entityId, periodId)
                .orElseThrow(() -> new IllegalArgumentException("Periode akuntansi tidak ditemukan."));

        String querySql = """
                    SELECT
                        a.id AS account_id,
                        a.code AS account_code,
                        a.name AS account_name,
                        COALESCE(ab.debit_total, 0) AS snapshot_debit,
                        COALESCE(ab.credit_total, 0) AS snapshot_credit,
                        COALESCE(SUM(jl.debit), 0) AS recalculated_debit,
                        COALESCE(SUM(jl.credit), 0) AS recalculated_credit
                    FROM account a
                    LEFT JOIN account_balance ab ON a.id = ab.account_id AND ab.period_id = ?
                    LEFT JOIN journal_line jl ON a.id = jl.account_id
                    LEFT JOIN journal_entry je ON jl.entry_id = je.id AND je.period_id = ? AND je.status = 'POSTED'
                    WHERE a.entity_id = ? AND a.is_postable = TRUE
                    GROUP BY a.id, a.code, a.name, ab.debit_total, ab.credit_total
                    ORDER BY a.code ASC
                """;

        List<ReconciliationResponse.DiscrepancyDetail> discrepancies = new ArrayList<>();
        final BigDecimal[] totals = new BigDecimal[] {
                BigDecimal.ZERO, // 0: totalRecalculatedDebit
                BigDecimal.ZERO, // 1: totalRecalculatedCredit
                BigDecimal.ZERO, // 2: totalSnapshotDebit
                BigDecimal.ZERO // 3: totalSnapshotCredit
        };
        final int[] accountCount = new int[] { 0 };

        jdbcTemplate.query(querySql, rs -> {
            accountCount[0]++;
            Long accountId = rs.getLong("account_id");
            String accountCode = rs.getString("account_code");
            String accountName = rs.getString("account_name");

            BigDecimal snapshotDebit = rs.getBigDecimal("snapshot_debit");
            BigDecimal snapshotCredit = rs.getBigDecimal("snapshot_credit");
            BigDecimal recalculatedDebit = rs.getBigDecimal("recalculated_debit");
            BigDecimal recalculatedCredit = rs.getBigDecimal("recalculated_credit");

            totals[0] = totals[0].add(recalculatedDebit);
            totals[1] = totals[1].add(recalculatedCredit);
            totals[2] = totals[2].add(snapshotDebit);
            totals[3] = totals[3].add(snapshotCredit);

            BigDecimal debitDiff = snapshotDebit.subtract(recalculatedDebit).abs();
            BigDecimal creditDiff = snapshotCredit.subtract(recalculatedCredit).abs();

            if (debitDiff.compareTo(BigDecimal.ZERO) != 0 || creditDiff.compareTo(BigDecimal.ZERO) != 0) {
                discrepancies.add(new ReconciliationResponse.DiscrepancyDetail(
                        accountId, accountCode, accountName,
                        snapshotDebit, recalculatedDebit, debitDiff,
                        snapshotCredit, recalculatedCredit, creditDiff));
            }
        }, periodId, periodId, entityId);

        boolean isDebitCreditBalanced = totals[0].compareTo(totals[1]) == 0;
        boolean isInvariantMaintained = discrepancies.isEmpty() && isDebitCreditBalanced;

        // Catat eksekusi rekonsiliasi ke tabel audit_log jika dipicu oleh pengguna
        // (actorId > 0)
        if (actorId != null && actorId > 0) {
            String detailJson = String.format(
                    "{\"periodId\":%d,\"totalAccounts\":%d,\"discrepancyCount\":%d,\"isBalanced\":%b}",
                    periodId, accountCount[0], discrepancies.size(), isInvariantMaintained);
            auditLogService.log(entityId, actorId, "RUN_RECONCILIATION", "GENERAL_LEDGER", periodId, detailJson);
        }

        String periodName = "Periode " + period.getPeriodNo() + " (" + period.getStartDate().getYear() + ")";

        return new ReconciliationResponse(
                entityId,
                periodId,
                periodName,
                isDebitCreditBalanced,
                isInvariantMaintained,
                totals[0],
                totals[1],
                totals[2],
                totals[3],
                accountCount[0],
                discrepancies.size(),
                discrepancies,
                isInvariantMaintained ? "HEALTHY" : "DISCREPANCY_DETECTED",
                OffsetDateTime.now(),
                isInvariantMaintained
                        ? "Seluruh saldo akun buku besar sinkron dan terbukti bebas selisih."
                        : "Ditemukan perbedaan saldo antara tabel agregat dan baris jurnal terposting.");
    }
}