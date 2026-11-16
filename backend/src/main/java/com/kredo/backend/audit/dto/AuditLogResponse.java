package com.kredo.backend.audit.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

public record AuditLogResponse(
        Long id,
        Long entityId,
        Long actorId,
        String actorName,
        String actorRole,
        String action,
        String targetType,
        Long targetId,
        String detail,
        String ip,
        UUID correlationId,
        OffsetDateTime occurredAt,
        String sealId) {
}