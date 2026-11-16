package com.kredo.backend.ledger.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

public record ReconciliationResponse(
        Long entityId,
        Long periodId,
        String periodName,
        boolean isBalanced,
        boolean isInvariantMaintained,
        BigDecimal totalRecalculatedDebit,
        BigDecimal totalRecalculatedCredit,
        BigDecimal totalSnapshotDebit,
        BigDecimal totalSnapshotCredit,
        int totalAccountsAudited,
        int discrepancyCount,
        List<DiscrepancyDetail> discrepancies,
        String systemStatus,
        OffsetDateTime reconciledAt,
        String message) {
    public record DiscrepancyDetail(
            Long accountId,
            String accountCode,
            String accountName,
            BigDecimal snapshotDebit,
            BigDecimal recalculatedDebit,
            BigDecimal debitDiff,
            BigDecimal snapshotCredit,
            BigDecimal recalculatedCredit,
            BigDecimal creditDiff) {
    }
}