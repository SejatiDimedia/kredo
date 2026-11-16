package com.kredo.backend.ledger.controller;

import com.kredo.backend.ledger.dto.GeneralLedgerResponse;
import com.kredo.backend.ledger.dto.TrialBalanceResponse;
import com.kredo.backend.ledger.service.LedgerReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.kredo.backend.ledger.dto.IncomeStatementResponse;
import com.kredo.backend.ledger.dto.BalanceSheetResponse;

@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:5173", "http://127.0.0.1:5173" })
public class LedgerReportController {

    private final LedgerReportService ledgerReportService;

    /**
     * Endpoint Neraca Saldo (Trial Balance)
     * Contoh URL: GET /api/v1/reports/trial-balance?entityId=1&periodId=11
     */
    @GetMapping("/trial-balance")
    public ResponseEntity<TrialBalanceResponse> getTrialBalance(
            @RequestParam(defaultValue = "1") Long entityId,
            @RequestParam(defaultValue = "11") Long periodId) {
        TrialBalanceResponse response = ledgerReportService.getTrialBalance(entityId, periodId);
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint Kartu Buku Besar per Akun (General Ledger)
     * Contoh URL: GET
     * /api/v1/reports/general-ledger?entityId=1&periodId=11&accountId=1101
     */
    @GetMapping("/general-ledger")
    public ResponseEntity<GeneralLedgerResponse> getGeneralLedger(
            @RequestParam(defaultValue = "1") Long entityId,
            @RequestParam(defaultValue = "11") Long periodId,
            @RequestParam Long accountId) {
        GeneralLedgerResponse response = ledgerReportService.getGeneralLedger(entityId, periodId, accountId);
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint Laporan Laba Rugi (Income Statement)
     * Contoh: GET /api/v1/reports/income-statement?entityId=1&periodId=11
     */
    @GetMapping("/income-statement")
    public ResponseEntity<IncomeStatementResponse> getIncomeStatement(
            @RequestParam(defaultValue = "1") Long entityId,
            @RequestParam(defaultValue = "11") Long periodId) {
        IncomeStatementResponse response = ledgerReportService.getIncomeStatement(entityId, periodId);
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint Laporan Neraca (Balance Sheet)
     * Contoh: GET /api/v1/reports/balance-sheet?entityId=1&periodId=11
     */
    @GetMapping("/balance-sheet")
    public ResponseEntity<BalanceSheetResponse> getBalanceSheet(
            @RequestParam(defaultValue = "1") Long entityId,
            @RequestParam(defaultValue = "11") Long periodId) {
        BalanceSheetResponse response = ledgerReportService.getBalanceSheet(entityId, periodId);
        return ResponseEntity.ok(response);
    }
}