package com.kredo.backend.ledger.dto;

import com.kredo.backend.coa.domain.AccountType;
import com.kredo.backend.coa.domain.NormalBalance;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record GeneralLedgerResponse(
        Long entityId,
        Long periodId,
        Long accountId,
        String accountCode,
        String accountName,
        AccountType accountType,
        NormalBalance normalBalance,
        BigDecimal beginningBalance,
        List<GeneralLedgerLine> lines,
        BigDecimal totalDebit,
        BigDecimal totalCredit,
        BigDecimal endingBalance) {
    public record GeneralLedgerLine(
            Long lineId,
            Long journalId,
            String journalNo,
            LocalDate entryDate,
            String description,
            String memo,
            BigDecimal debit,
            BigDecimal credit,
            BigDecimal runningBalance) {
    }
}