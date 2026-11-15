package com.kredo.backend.journal.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record CreateJournalLineRequest(
        @NotNull(message = "ID Akun wajib diisi") Long accountId,

        @NotNull(message = "Nilai debit tidak boleh null") @DecimalMin(value = "0.0", message = "Debit tidak boleh bernilai negatif") BigDecimal debit,

        @NotNull(message = "Nilai kredit tidak boleh null") @DecimalMin(value = "0.0", message = "Kredit tidak boleh bernilai negatif") BigDecimal credit,

        String memo) {
}