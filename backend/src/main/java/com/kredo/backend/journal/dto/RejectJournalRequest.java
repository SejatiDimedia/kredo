package com.kredo.backend.journal.dto;

import jakarta.validation.constraints.NotBlank;

public record RejectJournalRequest(
        @NotBlank(message = "Alasan penolakan wajib diisi.") String reason) {
}