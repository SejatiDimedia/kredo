# Kredo Bulk Import Test Data

Direktori ini berisi berkas data pengujian untuk fitur **Impor Massal Jurnal (Batch Engine)** Kredo.

---

### 1. `import-batch-valid.csv` (100% Valid)
- **Tujuan**: Menguji alur sukses impor massal secara menyeluruh.
- **Isi**: 7 transaksi jurnal double-entry (total 15 baris).
- **Karakteristik**:
  - Menggunakan kode akun aktif & postable (`1101`, `1102`, `1201`, `2101`, `4101`, `6201`, `6301`).
  - Seluruh jurnal seimbang matematis (Total Debit = Total Kredit).
  - Bertanggal di periode aktif berjalan (November 2026 / Periode 11 `OPEN`).
  - Memiliki variasi transaksi 2-baris dan multi-baris (compound journal 3-baris).
- **Ekspektasi Hasil**: `Status: COMPLETED`, Sukses: 7, Gagal: 0.

---

### 2. `import-batch-partial-error.csv` (Campuran Valid & Error)
- **Tujuan**: Menguji ketahanan validasi isolasi parsial dan pembuatan laporan kesalahan (*Error Report CSV*).
- **Isi**: 6 transaksi jurnal (3 valid, 3 sengaja dibuat salah).
  - `TX-ERR-001`: **Valid** (Penjualan tunai).
  - `TX-ERR-002`: **Gagal** (Jurnal tidak seimbang, selisih Rp 1.000.000).
  - `TX-ERR-003`: **Valid** (Beban sewa).
  - `TX-ERR-004`: **Gagal** (Kode akun `9999` tidak terdaftar di COA).
  - `TX-ERR-005`: **Gagal** (Tanggal `2026-05-15` berada di periode `CLOSED`).
  - `TX-ERR-006`: **Valid** (Pelunasan utang).
- **Ekspektasi Hasil**: `Status: COMPLETED` (dengan parsial error), Sukses: 3, Gagal: 3. Tombol unduh CSV error akan aktif dan dapat diunduh untuk melihat rincian penyebab kegagalan tiap baris.

---

### Format Header Kolom CSV
```csv
journal_ref,entry_date,description,account_code,debit,credit,memo
```
- `journal_ref`: Pengelompokan baris transaksi menjadi satu kesatuan jurnal.
- `entry_date`: Format ISO 8601 (`YYYY-MM-DD`).
- `description`: Deskripsi umum jurnal.
- `account_code`: Kode akun COA level daun (*postable*).
- `debit`: Nominal angka desimal (maks 2 desimal).
- `credit`: Nominal angka desimal (maks 2 desimal).
- `memo`: Keterangan detail baris transaksi (opsional).
