package com.kredo.backend.journal.domain;

/**
 * Sumber pencatatan voucher jurnal akuntansi.
 */
public enum JournalSource {
    MANUAL, // Dibuat manual oleh akuntan lewat form UI
    IMPORT, // Hasil impor massal file CSV
    REVERSAL, // Jurnal pembalik otomatis untuk koreksi
    CLOSING, // Jurnal penutup akhir tahun
    OPENING // Jurnal saldo awal pembukuan
}