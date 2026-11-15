package com.kredo.backend.journal.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ReverseJournalRequest(
        @NotBlank(message = "Alasan pembalikan jurnal wajib diisi") @Size(max = 255, message = "Alasan pembalikan maksimal 255 karakter") String reason) {
}