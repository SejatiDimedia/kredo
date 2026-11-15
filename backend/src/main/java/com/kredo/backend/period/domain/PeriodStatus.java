package com.kredo.backend.period.domain;

/**
 * Status Periode Akuntansi:
 * - OPEN: Periode aktif berjalan, transaksi boleh diposting.
 * - CLOSED: Tutup buku bulanan, transaksi tidak boleh ditambah/diubah kecuali
 * pembukaan kembali resmi.
 * - LOCKED: Terkunci permanen (biasanya setelah audit tahunan selesai).
 */
public enum PeriodStatus {
    OPEN,
    CLOSED,
    LOCKED
}