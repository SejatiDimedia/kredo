package com.kredo.backend.audit.controller;

import com.kredo.backend.audit.dto.AuditIntegrityResponse;
import com.kredo.backend.audit.dto.AuditLogResponse;
import com.kredo.backend.audit.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/audit")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuditLogController {

    private final AuditLogService auditLogService;

    @GetMapping("/logs")
    public ResponseEntity<List<AuditLogResponse>> getAuditLogs(
            @RequestParam Long entityId,
            @RequestParam(defaultValue = "100") int limit,
            @RequestParam(defaultValue = "0") int offset) {
        return ResponseEntity.ok(auditLogService.getAuditLogs(entityId, limit, offset));
    }

    @GetMapping("/verify")
    public ResponseEntity<AuditIntegrityResponse> verifyIntegrity(@RequestParam Long entityId) {
        return ResponseEntity.ok(auditLogService.verifyIntegrity(entityId));
    }
}