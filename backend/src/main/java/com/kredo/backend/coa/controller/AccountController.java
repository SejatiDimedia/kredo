package com.kredo.backend.coa.controller;

import com.kredo.backend.coa.dto.AccountResponse;
import com.kredo.backend.coa.dto.CreateAccountRequest;
import com.kredo.backend.coa.service.AccountService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/accounts")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173") // Izinkan Frontend React Vite kita mengakses API ini (CORS)
public class AccountController {

    private final AccountService accountService;

    // GET /api/v1/accounts?entityId=1
    @GetMapping
    public ResponseEntity<List<AccountResponse>> getAccounts(
            @RequestParam(defaultValue = "1") Long entityId) {
        List<AccountResponse> accounts = accountService.getAccountsByEntity(entityId);
        return ResponseEntity.ok(accounts);
    }

    // POST /api/v1/accounts?entityId=1
    @PostMapping
    public ResponseEntity<AccountResponse> createAccount(
            @RequestParam(defaultValue = "1") Long entityId,
            @Valid @RequestBody CreateAccountRequest request) {
        AccountResponse created = accountService.createAccount(entityId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}