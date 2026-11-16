package com.kredo.backend.ledger.dto;

import com.kredo.backend.coa.domain.AccountType;
import java.math.BigDecimal;
import java.util.List;

public record BalanceSheetResponse(
        Long entityId,
        Long periodId,
        Integer periodNo,
        Integer fiscalYear,
        List<BalanceSheetRow> assets,
        BigDecimal totalAsset,
        List<BalanceSheetRow> liabilities,
        BigDecimal totalLiability,
        List<BalanceSheetRow> equities,
        BigDecimal totalEquity,
        BigDecimal currentPeriodEarnings,
        BigDecimal totalLiabilitiesAndEquity,
        boolean isBalanced) {
    public record BalanceSheetRow(
            Long accountId,
            String accountCode,
            String accountName,
            AccountType accountType,
            String reportGroup,
            BigDecimal amount) {
    }
}