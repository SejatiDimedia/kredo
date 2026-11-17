package com.kredo.backend.audit.controller;

import com.kredo.backend.audit.dto.AuditIntegrityResponse;
import com.kredo.backend.audit.dto.AuditLogResponse;
import com.kredo.backend.audit.service.AuditLogService;
import com.kredo.backend.auth.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/audit")
@RequiredArgsConstructor
public class AuditLogController {

    private final AuditLogService auditLogService;

    @GetMapping("/logs")
    public ResponseEntity<List<AuditLogResponse>> getAuditLogs(
            @RequestParam(required = false) Long entityId,
            @RequestParam(defaultValue = "100") int limit,
            @RequestParam(defaultValue = "0") int offset,
            @AuthenticationPrincipal UserPrincipal principal) {
        Long effectiveEntityId = resolveEntityId(entityId, principal);
        return ResponseEntity.ok(auditLogService.getAuditLogs(effectiveEntityId, limit, offset));
    }

    @GetMapping("/verify")
    public ResponseEntity<AuditIntegrityResponse> verifyIntegrity(
            @RequestParam(required = false) Long entityId,
            @AuthenticationPrincipal UserPrincipal principal) {
        Long effectiveEntityId = resolveEntityId(entityId, principal);
        return ResponseEntity.ok(auditLogService.verifyIntegrity(effectiveEntityId));
    }

    private Long resolveEntityId(Long entityIdParam, UserPrincipal principal) {
        if (principal != null && principal.getEntityId() != null) {
            return principal.getEntityId();
        }
        return entityIdParam != null ? entityIdParam : 1L;
    }
}
