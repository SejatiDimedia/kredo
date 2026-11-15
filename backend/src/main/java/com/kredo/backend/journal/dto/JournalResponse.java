package com.kredo.backend.journal.dto;

import com.kredo.backend.journal.domain.JournalEntry;
import com.kredo.backend.journal.domain.JournalSource;
import com.kredo.backend.journal.domain.JournalStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;

public record JournalResponse(
        Long id,
        Long entityId,
        String journalNo,
        LocalDate entryDate,
        String description,
        JournalSource source,
        JournalStatus status,
        BigDecimal totalAmount,
        Long createdBy,
        OffsetDateTime postedAt,
        List<JournalLineResponse> lines) {
    public record JournalLineResponse(
            Long id,
            int lineNo,
            Long accountId,
            BigDecimal debit,
            BigDecimal credit,
            String memo) {
    }

    public static JournalResponse fromEntity(JournalEntry entry) {
        List<JournalLineResponse> lineResponses = entry.getLines().stream()
                .map(line -> new JournalLineResponse(
                        line.getId(),
                        line.getLineNo(),
                        line.getAccountId(),
                        line.getDebit(),
                        line.getCredit(),
                        line.getMemo()))
                .toList();

        return new JournalResponse(
                entry.getId(),
                entry.getEntityId(),
                entry.getJournalNo(),
                entry.getEntryDate(),
                entry.getDescription(),
                entry.getSource(),
                entry.getStatus(),
                entry.getTotalAmount(),
                entry.getCreatedBy(),
                entry.getPostedAt(),
                lineResponses);
    }
}