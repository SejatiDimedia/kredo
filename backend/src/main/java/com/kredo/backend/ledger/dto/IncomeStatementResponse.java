package com.kredo.backend.ledger.dto;

import com.kredo.backend.coa.domain.AccountType;
import java.math.BigDecimal;
import java.util.List;

public record IncomeStatementResponse(
        Long entityId,
        Long periodId,
        Integer periodNo,
        Integer fiscalYear,
        List<IncomeStatementRow> revenues,
        BigDecimal totalRevenue,
        List<IncomeStatementRow> expenses,
        BigDecimal totalExpense,
        BigDecimal netIncome,
        boolean isProfitable) {
    public record IncomeStatementRow(
            Long accountId,
            String accountCode,
            String accountName,
            AccountType accountType,
            String reportGroup,
            BigDecimal amount) {
    }
}