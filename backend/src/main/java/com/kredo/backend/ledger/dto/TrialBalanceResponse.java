package com.kredo.backend.ledger.dto;

import com.kredo.backend.coa.domain.AccountType;
import com.kredo.backend.coa.domain.NormalBalance;

import java.math.BigDecimal;
import java.util.List;

public record TrialBalanceResponse(
        Long entityId,
        Long periodId,
        int periodNo,
        int fiscalYear,
        List<TrialBalanceRow> rows,
        BigDecimal totalDebit,
        BigDecimal totalCredit,
        boolean isBalanced) {
    public record TrialBalanceRow(
            Long accountId,
            String accountCode,
            String accountName,
            AccountType accountType,
            NormalBalance normalBalance,
            BigDecimal debitTotal,
            BigDecimal creditTotal,
            BigDecimal endingBalance) {
    }
}