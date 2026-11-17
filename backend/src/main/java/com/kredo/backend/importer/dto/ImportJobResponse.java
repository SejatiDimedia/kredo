package com.kredo.backend.importer.dto;

import java.time.OffsetDateTime;
import java.util.List;

public record ImportJobResponse(
        Long id,
        Long entityId,
        String fileName,
        String fileHash,
        int totalRows,
        int processedRows,
        int successCount,
        int failureCount,
        String status,
        List<ImportErrorDetail> errors,
        Long createdBy,
        OffsetDateTime createdAt,
        OffsetDateTime completedAt,
        String message) {
    public record ImportErrorDetail(
            String journalRef,
            int lineNo,
            String accountCode,
            String reason) {
    }
}