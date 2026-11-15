package com.kredo.backend.coa.service;

import com.kredo.backend.coa.domain.Account;
import com.kredo.backend.coa.dto.AccountResponse;
import com.kredo.backend.coa.dto.CreateAccountRequest;
import com.kredo.backend.coa.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AccountService {

    private final AccountRepository accountRepository;

    /**
     * Mengambil semua akun COA milik entitas tertentu, diurutkan berdasarkan kode
     * akun.
     */
    public List<AccountResponse> getAccountsByEntity(Long entityId) {
        return accountRepository.findByEntityIdOrderByCodeAsc(entityId)
                .stream()
                .map(AccountResponse::fromEntity)
                .toList();
    }

    /**
     * Menambahkan akun baru dengan validasi keunikan kode akun per entitas.
     */
    @Transactional
    public AccountResponse createAccount(Long entityId, CreateAccountRequest request) {
        // Validasi: Cek apakah kode akun sudah pernah ada
        if (accountRepository.existsByEntityIdAndCode(entityId, request.code().trim())) {
            throw new IllegalArgumentException("Kode akun " + request.code() + " sudah digunakan di entitas ini.");
        }

        Account account = new Account(
                entityId,
                request.code().trim(),
                request.name().trim(),
                request.type(),
                request.normalBalance(),
                request.reportGroup().trim(),
                request.parentId(),
                request.isPostable());

        Account saved = accountRepository.save(account);
        return AccountResponse.fromEntity(saved);
    }
}