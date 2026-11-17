package com.kredo.backend.coa.service;

import com.kredo.backend.coa.domain.Account;
import com.kredo.backend.coa.domain.AccountType;
import com.kredo.backend.coa.domain.NormalBalance;
import com.kredo.backend.coa.dto.AccountResponse;
import com.kredo.backend.coa.dto.CreateAccountRequest;
import com.kredo.backend.coa.repository.AccountRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

class AccountServiceTest {

    private AccountRepository accountRepository;
    private AccountService accountService;

    @BeforeEach
    void setUp() {
        accountRepository = mock(AccountRepository.class);
        accountService = new AccountService(accountRepository);
    }

    @Test
    @DisplayName("Berhasil membuat akun baru dengan data valid")
    void createAccount_validRequest_success() {
        Long entityId = 1L;
        CreateAccountRequest request = new CreateAccountRequest(
                "1101",
                "Kas Kecil Operasional",
                AccountType.ASSET,
                NormalBalance.DEBIT,
                "CASH",
                100L,
                true
        );

        when(accountRepository.existsByEntityIdAndCode(entityId, "1101")).thenReturn(false);
        when(accountRepository.save(any(Account.class))).thenAnswer(invocation -> {
            Account acc = invocation.getArgument(0);
            acc.setId(1101L);
            return acc;
        });

        AccountResponse response = accountService.createAccount(entityId, request);

        assertThat(response).isNotNull();
        assertThat(response.code()).isEqualTo("1101");
        assertThat(response.name()).isEqualTo("Kas Kecil Operasional");
        assertThat(response.type()).isEqualTo(AccountType.ASSET);
        assertThat(response.normalBalance()).isEqualTo(NormalBalance.DEBIT);
        assertThat(response.isPostable()).isTrue();
        assertThat(response.isActive()).isTrue();
    }

    @Test
    @DisplayName("Menolak pembuatan akun jika kode sudah digunakan pada entitas yang sama")
    void createAccount_duplicateCode_throwsException() {
        Long entityId = 1L;
        CreateAccountRequest request = new CreateAccountRequest(
                "1101",
                "Kas Kecil Duplikat",
                AccountType.ASSET,
                NormalBalance.DEBIT,
                "CASH",
                null,
                true
        );

        when(accountRepository.existsByEntityIdAndCode(entityId, "1101")).thenReturn(true);

        assertThatThrownBy(() -> accountService.createAccount(entityId, request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("sudah digunakan");

        verify(accountRepository, never()).save(any(Account.class));
    }

    @Test
    @DisplayName("Mengambil seluruh daftar akun terurut berdasarkan kode")
    void getAccountsByEntity_returnsSortedList() {
        Long entityId = 1L;
        Account acc1 = new Account(entityId, "1000", "ASET", AccountType.ASSET, NormalBalance.DEBIT, "ASSET", null, false);
        Account acc2 = new Account(entityId, "1101", "Kas Kecil", AccountType.ASSET, NormalBalance.DEBIT, "CASH", 1000L, true);

        when(accountRepository.findByEntityIdOrderByCodeAsc(entityId)).thenReturn(List.of(acc1, acc2));

        List<AccountResponse> result = accountService.getAccountsByEntity(entityId);

        assertThat(result).hasSize(2);
        assertThat(result.get(0).code()).isEqualTo("1000");
        assertThat(result.get(1).code()).isEqualTo("1101");
    }
}
