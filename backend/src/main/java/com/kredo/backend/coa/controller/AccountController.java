package com.kredo.backend.coa.controller;

import com.kredo.backend.auth.security.UserPrincipal;
import com.kredo.backend.coa.dto.AccountResponse;
import com.kredo.backend.coa.dto.CreateAccountRequest;
import com.kredo.backend.coa.service.AccountService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    // GET /api/v1/accounts?entityId=1
    @GetMapping
    public ResponseEntity<List<AccountResponse>> getAccounts(
            @RequestParam(required = false) Long entityId,
            @AuthenticationPrincipal UserPrincipal principal) {
        Long effectiveEntityId = resolveEntityId(entityId, principal);
        List<AccountResponse> accounts = accountService.getAccountsByEntity(effectiveEntityId);
        return ResponseEntity.ok(accounts);
    }

    // POST /api/v1/accounts?entityId=1
    @PostMapping
    public ResponseEntity<AccountResponse> createAccount(
            @RequestParam(required = false) Long entityId,
            @Valid @RequestBody CreateAccountRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        Long effectiveEntityId = resolveEntityId(entityId, principal);
        AccountResponse response = accountService.createAccount(effectiveEntityId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    private Long resolveEntityId(Long entityIdParam, UserPrincipal principal) {
        if (principal != null && principal.getEntityId() != null) {
            return principal.getEntityId();
        }
        return entityIdParam != null ? entityIdParam : 1L;
    }
}
