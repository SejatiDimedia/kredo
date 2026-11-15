package com.kredo.backend.coa.dto;

import com.kredo.backend.coa.domain.Account;
import com.kredo.backend.coa.domain.AccountType;
import com.kredo.backend.coa.domain.NormalBalance;

/**
 * DTO Immutabel (Java Record) yang dikirim ke Frontend saat meminta data akun.
 */
public record AccountResponse(
        Long id,
        Long entityId,
        String code,
        String name,
        AccountType type,
        NormalBalance normalBalance,
        String reportGroup,
        Long parentId,
        boolean isPostable,
        boolean isActive) {
    public static AccountResponse fromEntity(Account account) {
        return new AccountResponse(
                account.getId(),
                account.getEntityId(),
                account.getCode(),
                account.getName(),
                account.getType(),
                account.getNormalBalance(),
                account.getReportGroup(),
                account.getParentId(),
                account.isPostable(),
                account.isActive());
    }
}