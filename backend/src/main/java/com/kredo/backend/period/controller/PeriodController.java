package com.kredo.backend.period.controller;

import com.kredo.backend.period.dto.PeriodResponse;
import com.kredo.backend.period.service.PeriodClosingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/periods")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:5173", "http://127.0.0.1:5173" })
public class PeriodController {

    private final PeriodClosingService periodClosingService;

    // GET /api/v1/periods?entityId=1
    @GetMapping
    public ResponseEntity<List<PeriodResponse>> getPeriods(
            @RequestParam(defaultValue = "1") Long entityId) {
        List<PeriodResponse> periods = periodClosingService.getPeriodsByEntity(entityId);
        return ResponseEntity.ok(periods);
    }

    // POST /api/v1/periods/{id}/close?entityId=1&userId=3
    @PostMapping("/{id}/close")
    public ResponseEntity<PeriodResponse> closePeriod(
            @PathVariable Long id,
            @RequestParam(defaultValue = "1") Long entityId,
            @RequestParam(defaultValue = "3") Long userId) {
        PeriodResponse response = periodClosingService.closePeriod(entityId, id, userId);
        return ResponseEntity.ok(response);
    }

    // POST /api/v1/periods/{id}/reopen?entityId=1&userId=3&reason=Koreksi+audit
    @PostMapping("/{id}/reopen")
    public ResponseEntity<PeriodResponse> reopenPeriod(
            @PathVariable Long id,
            @RequestParam(defaultValue = "1") Long entityId,
            @RequestParam(defaultValue = "3") Long userId,
            @RequestParam(defaultValue = "Penyesuaian audit laporan keuangan") String reason) {
        PeriodResponse response = periodClosingService.reopenPeriod(entityId, id, userId, reason);
        return ResponseEntity.ok(response);
    }
}