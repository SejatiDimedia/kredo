package com.kredo.backend.coa.dto;

import com.kredo.backend.coa.domain.AccountType;
import com.kredo.backend.coa.domain.NormalBalance;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * DTO saat menerima form "Tambah Akun" dari Frontend.
 * Dilengkapi validasi otomatis (@NotBlank, @NotNull, @Size).
 */
public record CreateAccountRequest(
        @NotBlank(message = "Kode akun tidak boleh kosong") @Size(max = 20, message = "Kode akun maksimal 20 karakter") String code,

        @NotBlank(message = "Nama akun tidak boleh kosong") @Size(max = 150, message = "Nama akun maksimal 150 karakter") String name,

        @NotNull(message = "Tipe akun (ASSET, LIABILITY, etc) wajib dipilih") AccountType type,

        @NotNull(message = "Saldo normal (DEBIT / CREDIT) wajib dipilih") NormalBalance normalBalance,

        @NotBlank(message = "Kelompok laporan (reportGroup) wajib diisi") String reportGroup,

        Long parentId,

        boolean isPostable) {
}