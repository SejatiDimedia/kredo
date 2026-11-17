package com.kredo.backend.ledger.controller;

import com.kredo.backend.auth.security.UserPrincipal;
import com.kredo.backend.ledger.dto.BalanceSheetResponse;
import com.kredo.backend.ledger.dto.GeneralLedgerResponse;
import com.kredo.backend.ledger.dto.IncomeStatementResponse;
import com.kredo.backend.ledger.dto.ReconciliationResponse;
import com.kredo.backend.ledger.dto.TrialBalanceResponse;
import com.kredo.backend.ledger.service.LedgerReconciliationService;
import com.kredo.backend.ledger.service.LedgerReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
public class LedgerReportController {

    private final LedgerReportService ledgerReportService;
    private final LedgerReconciliationService ledgerReconciliationService;

    @GetMapping("/trial-balance")
    public ResponseEntity<TrialBalanceResponse> getTrialBalance(
            @RequestParam(required = false) Long entityId,
            @RequestParam(defaultValue = "11") Long periodId,
            @AuthenticationPrincipal UserPrincipal principal) {
        Long effectiveEntityId = resolveEntityId(entityId, principal);
        return ResponseEntity.ok(ledgerReportService.getTrialBalance(effectiveEntityId, periodId));
    }

    @GetMapping("/general-ledger")
    public ResponseEntity<GeneralLedgerResponse> getGeneralLedger(
            @RequestParam(required = false) Long entityId,
            @RequestParam(defaultValue = "11") Long periodId,
            @RequestParam Long accountId,
            @AuthenticationPrincipal UserPrincipal principal) {
        Long effectiveEntityId = resolveEntityId(entityId, principal);
        return ResponseEntity.ok(ledgerReportService.getGeneralLedger(effectiveEntityId, periodId, accountId));
    }

    @GetMapping("/income-statement")
    public ResponseEntity<IncomeStatementResponse> getIncomeStatement(
            @RequestParam(required = false) Long entityId,
            @RequestParam(defaultValue = "11") Long periodId,
            @AuthenticationPrincipal UserPrincipal principal) {
        Long effectiveEntityId = resolveEntityId(entityId, principal);
        return ResponseEntity.ok(ledgerReportService.getIncomeStatement(effectiveEntityId, periodId));
    }

    @GetMapping("/balance-sheet")
    public ResponseEntity<BalanceSheetResponse> getBalanceSheet(
            @RequestParam(required = false) Long entityId,
            @RequestParam(defaultValue = "11") Long periodId,
            @AuthenticationPrincipal UserPrincipal principal) {
        Long effectiveEntityId = resolveEntityId(entityId, principal);
        return ResponseEntity.ok(ledgerReportService.getBalanceSheet(effectiveEntityId, periodId));
    }

    @PostMapping("/reconciliation")
    public ResponseEntity<ReconciliationResponse> runReconciliation(
            @RequestParam(required = false) Long entityId,
            @RequestParam(defaultValue = "11") Long periodId,
            @RequestParam(required = false) Long actorId,
            @AuthenticationPrincipal UserPrincipal principal) {
        Long effectiveEntityId = resolveEntityId(entityId, principal);
        Long effectiveActorId = resolveUserId(actorId, principal);
        return ResponseEntity.ok(ledgerReconciliationService.runReconciliation(effectiveEntityId, periodId, effectiveActorId));
    }

    @GetMapping("/reconciliation")
    public ResponseEntity<ReconciliationResponse> getLatestReconciliation(
            @RequestParam(required = false) Long entityId,
            @RequestParam(defaultValue = "11") Long periodId,
            @AuthenticationPrincipal UserPrincipal principal) {
        Long effectiveEntityId = resolveEntityId(entityId, principal);
        return ResponseEntity.ok(ledgerReconciliationService.runReconciliation(effectiveEntityId, periodId, 0L));
    }

    private Long resolveEntityId(Long entityIdParam, UserPrincipal principal) {
        if (principal != null && principal.getEntityId() != null) {
            return principal.getEntityId();
        }
        return entityIdParam != null ? entityIdParam : 1L;
    }

    private Long resolveUserId(Long userIdParam, UserPrincipal principal) {
        if (principal != null && principal.getUserId() != null) {
            return principal.getUserId();
        }
        return userIdParam != null ? userIdParam : 1L;
    }
}
