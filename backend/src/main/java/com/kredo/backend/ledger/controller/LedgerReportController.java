package com.kredo.backend.ledger.controller;

import com.kredo.backend.ledger.dto.BalanceSheetResponse;
import com.kredo.backend.ledger.dto.GeneralLedgerResponse;
import com.kredo.backend.ledger.dto.IncomeStatementResponse;
import com.kredo.backend.ledger.dto.ReconciliationResponse;
import com.kredo.backend.ledger.dto.TrialBalanceResponse;
import com.kredo.backend.ledger.service.LedgerReconciliationService;
import com.kredo.backend.ledger.service.LedgerReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class LedgerReportController {

    private final LedgerReportService ledgerReportService;
    private final LedgerReconciliationService ledgerReconciliationService;

    @GetMapping("/trial-balance")
    public ResponseEntity<TrialBalanceResponse> getTrialBalance(
            @RequestParam(defaultValue = "1") Long entityId,
            @RequestParam(defaultValue = "11") Long periodId) {
        return ResponseEntity.ok(ledgerReportService.getTrialBalance(entityId, periodId));
    }

    @GetMapping("/general-ledger")
    public ResponseEntity<GeneralLedgerResponse> getGeneralLedger(
            @RequestParam(defaultValue = "1") Long entityId,
            @RequestParam(defaultValue = "11") Long periodId,
            @RequestParam Long accountId) {
        return ResponseEntity.ok(ledgerReportService.getGeneralLedger(entityId, periodId, accountId));
    }

    @GetMapping("/income-statement")
    public ResponseEntity<IncomeStatementResponse> getIncomeStatement(
            @RequestParam(defaultValue = "1") Long entityId,
            @RequestParam(defaultValue = "11") Long periodId) {
        return ResponseEntity.ok(ledgerReportService.getIncomeStatement(entityId, periodId));
    }

    @GetMapping("/balance-sheet")
    public ResponseEntity<BalanceSheetResponse> getBalanceSheet(
            @RequestParam(defaultValue = "1") Long entityId,
            @RequestParam(defaultValue = "11") Long periodId) {
        return ResponseEntity.ok(ledgerReportService.getBalanceSheet(entityId, periodId));
    }

    @PostMapping("/reconciliation")
    public ResponseEntity<ReconciliationResponse> runReconciliation(
            @RequestParam(defaultValue = "1") Long entityId,
            @RequestParam(defaultValue = "11") Long periodId,
            @RequestParam(defaultValue = "3") Long actorId) {
        return ResponseEntity.ok(ledgerReconciliationService.runReconciliation(entityId, periodId, actorId));
    }

    @GetMapping("/reconciliation")
    public ResponseEntity<ReconciliationResponse> getLatestReconciliation(
            @RequestParam(defaultValue = "1") Long entityId,
            @RequestParam(defaultValue = "11") Long periodId) {
        return ResponseEntity.ok(ledgerReconciliationService.runReconciliation(entityId, periodId, 0L));
    }
}