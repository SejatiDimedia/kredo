-- ============================================================================
-- KREDO ACCOUNTING ENGINE: V2 SEED SAMPLE DATA
-- Data Awal Entitas, Tahun Fiskal, Periode, dan Bagan Akun (COA) Standar
-- ============================================================================

-- 1. Insert Entitas Default (PT Maju Jaya Sejahtera)
INSERT INTO entity (id, code, name, base_currency, fiscal_start_month)
OVERRIDING SYSTEM VALUE
VALUES (1, 'PTM', 'PT Maju Jaya Sejahtera', 'IDR', 1);

-- 2. Insert Tahun Fiskal 2026
INSERT INTO fiscal_year (id, entity_id, year, start_date, end_date, is_closed)
OVERRIDING SYSTEM VALUE
VALUES (1, 1, 2026, '2026-01-01', '2026-12-31', FALSE);

-- 3. Insert 12 Periode Akuntansi Bulanan Tahun 2026
-- Periode 1-10 (Jan-Okt) CLOSED, Periode 11 (Nov 2026) OPEN (Periode Berjalan)
INSERT INTO accounting_period (fiscal_year_id, entity_id, period_no, start_date, end_date, status) VALUES
(1, 1, 1,  '2026-01-01', '2026-01-31', 'CLOSED'),
(1, 1, 2,  '2026-02-01', '2026-02-28', 'CLOSED'),
(1, 1, 3,  '2026-03-01', '2026-03-31', 'CLOSED'),
(1, 1, 4,  '2026-04-01', '2026-04-30', 'CLOSED'),
(1, 1, 5,  '2026-05-01', '2026-05-31', 'CLOSED'),
(1, 1, 6,  '2026-06-01', '2026-06-30', 'CLOSED'),
(1, 1, 7,  '2026-07-01', '2026-07-31', 'CLOSED'),
(1, 1, 8,  '2026-08-01', '2026-08-31', 'CLOSED'),
(1, 1, 9,  '2026-09-01', '2026-09-30', 'CLOSED'),
(1, 1, 10, '2026-10-01', '2026-10-31', 'CLOSED'),
(1, 1, 11, '2026-11-01', '2026-11-30', 'OPEN'),
(1, 1, 12, '2026-12-01', '2026-12-31', 'OPEN');

-- 4. Inisialisasi Counter Nomor Jurnal Tahun 2026
INSERT INTO journal_sequence (entity_id, fiscal_year, last_number)
VALUES (1, 2026, 0);

-- 5. Insert Bagan Akun (Chart of Accounts / COA)
-- Level 1: Header / Induk (is_postable = FALSE)
INSERT INTO account (id, entity_id, code, name, type, normal_balance, report_group, is_postable)
OVERRIDING SYSTEM VALUE VALUES
(100, 1, '1000', 'ASET',              'ASSET',     'DEBIT',  'ASSET',     FALSE),
(200, 1, '2000', 'LIABILITAS',        'LIABILITY', 'CREDIT', 'LIABILITY', FALSE),
(300, 1, '3000', 'EKUITAS',           'EQUITY',    'CREDIT', 'EQUITY',    FALSE),
(400, 1, '4000', 'PENDAPATAN',        'REVENUE',   'CREDIT', 'REVENUE',   FALSE),
(600, 1, '6000', 'BEBAN OPERASIONAL', 'EXPENSE',   'DEBIT',  'EXPENSE',   FALSE);

-- Level 2: Sub-Induk Kas & Bank (is_postable = FALSE)
INSERT INTO account (id, entity_id, code, name, type, normal_balance, report_group, parent_id, is_postable)
OVERRIDING SYSTEM VALUE VALUES
(110, 1, '1100', 'Kas dan Setara Kas', 'ASSET', 'DEBIT', 'CASH', 100, FALSE);

-- Level 3: Akun Transaksi / Postable (is_postable = TRUE - yang boleh dijurnal)
INSERT INTO account (id, entity_id, code, name, type, normal_balance, report_group, parent_id, is_postable)
OVERRIDING SYSTEM VALUE VALUES
-- Aset (Postable)
(1101, 1, '1101', 'Kas Kecil Operasional',         'ASSET',     'DEBIT',  'CASH',       110, TRUE),
(1102, 1, '1102', 'Bank BCA Operasional',          'ASSET',     'DEBIT',  'CASH',       110, TRUE),
(1201, 1, '1201', 'Piutang Dagang Pihak Ketiga',   'ASSET',     'DEBIT',  'RECEIVABLE', 100, TRUE),
(1301, 1, '1301', 'Persediaan Barang Dagang',      'ASSET',     'DEBIT',  'INVENTORY',  100, TRUE),
-- Liabilitas (Postable)
(2101, 1, '2101', 'Utang Usaha Vendor',            'LIABILITY', 'CREDIT', 'PAYABLE',    200, TRUE),
-- Ekuitas (Postable)
(3101, 1, '3101', 'Modal Saham Disetor',           'EQUITY',    'CREDIT', 'EQUITY',     300, TRUE),
(3201, 1, '3201', 'Laba Ditahan',                  'EQUITY',    'CREDIT', 'EQUITY',     300, TRUE),
-- Pendapatan (Postable)
(4101, 1, '4101', 'Pendapatan Penjualan Produk',   'REVENUE',   'CREDIT', 'REVENUE',    400, TRUE),
-- Beban (Postable)
(6201, 1, '6201', 'Beban Sewa Kantor Cabang',      'EXPENSE',   'DEBIT',  'OPEX',       600, TRUE),
(6301, 1, '6301', 'Beban Gaji Karyawan',           'EXPENSE',   'DEBIT',  'OPEX',       600, TRUE);