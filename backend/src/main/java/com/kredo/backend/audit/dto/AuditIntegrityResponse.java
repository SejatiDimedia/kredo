package com.kredo.backend.audit.dto;

import java.time.OffsetDateTime;

public record AuditIntegrityResponse(
        boolean isTamperFree,
        long totalRecords,
        String currentChainHash,
        OffsetDateTime verifiedAt,
        String message) {
}