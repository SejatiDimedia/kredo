package com.kredo.backend.journal.dto;

import com.kredo.backend.journal.domain.JournalSource;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.List;

public record CreateJournalRequest(
                @NotNull(message = "Tanggal transaksi wajib diisi") LocalDate entryDate,

                @NotBlank(message = "Keterangan/deskripsi transaksi wajib diisi") @Size(max = 500, message = "Deskripsi maksimal 500 karakter") String description,

                Long periodId,

                JournalSource source,

                // Minimal harus ada 2 baris (1 Debit dan 1 Kredit) sesuai kaidah akuntansi
                @NotEmpty(message = "Baris jurnal tidak boleh kosong") @Size(min = 2, message = "Jurnal harus memiliki minimal 2 baris (Debit & Kredit)") @Valid List<CreateJournalLineRequest> lines) {
}