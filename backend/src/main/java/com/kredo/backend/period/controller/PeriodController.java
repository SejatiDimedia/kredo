package com.kredo.backend.period.controller;

import com.kredo.backend.auth.security.UserPrincipal;
import com.kredo.backend.period.dto.PeriodResponse;
import com.kredo.backend.period.service.PeriodClosingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/periods")
@RequiredArgsConstructor
public class PeriodController {

    private final PeriodClosingService periodClosingService;

    // GET /api/v1/periods?entityId=1
    @GetMapping
    public ResponseEntity<List<PeriodResponse>> getPeriods(
            @RequestParam(required = false) Long entityId,
            @AuthenticationPrincipal UserPrincipal principal) {
        Long effectiveEntityId = resolveEntityId(entityId, principal);
        List<PeriodResponse> periods = periodClosingService.getPeriodsByEntity(effectiveEntityId);
        return ResponseEntity.ok(periods);
    }

    // POST /api/v1/periods/{id}/close?entityId=1&userId=3
    @PostMapping("/{id}/close")
    public ResponseEntity<PeriodResponse> closePeriod(
            @PathVariable Long id,
            @RequestParam(required = false) Long entityId,
            @RequestParam(required = false) Long userId,
            @AuthenticationPrincipal UserPrincipal principal) {
        Long effectiveEntityId = resolveEntityId(entityId, principal);
        Long effectiveUserId = resolveUserId(userId, principal);
        PeriodResponse response = periodClosingService.closePeriod(effectiveEntityId, id, effectiveUserId);
        return ResponseEntity.ok(response);
    }

    // POST /api/v1/periods/{id}/reopen?entityId=1&userId=3&reason=Koreksi+audit
    @PostMapping("/{id}/reopen")
    public ResponseEntity<PeriodResponse> reopenPeriod(
            @PathVariable Long id,
            @RequestParam(required = false) Long entityId,
            @RequestParam(required = false) Long userId,
            @RequestParam(defaultValue = "Penyesuaian audit laporan keuangan") String reason,
            @AuthenticationPrincipal UserPrincipal principal) {
        Long effectiveEntityId = resolveEntityId(entityId, principal);
        Long effectiveUserId = resolveUserId(userId, principal);
        PeriodResponse response = periodClosingService.reopenPeriod(effectiveEntityId, id, effectiveUserId, reason);
        return ResponseEntity.ok(response);
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
