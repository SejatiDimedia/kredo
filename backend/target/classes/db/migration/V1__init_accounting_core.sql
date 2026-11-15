-- ============================================================================
-- KREDO ACCOUNTING ENGINE: V1 INIT ACCOUNTING CORE
-- Skema Tabel & Trigger Invariant Akuntansi Sesuai PRD Bab 8
-- ============================================================================

-- 1. Tabel Entitas / Perusahaan (Multi-Entity Architecture)
CREATE TABLE entity (
    id                 BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    code               VARCHAR(20)  NOT NULL UNIQUE,
    name               VARCHAR(150) NOT NULL,
    base_currency      VARCHAR(3)   NOT NULL DEFAULT 'IDR',
    fiscal_start_month INT          NOT NULL DEFAULT 1 CHECK (fiscal_start_month BETWEEN 1 AND 12),
    created_at         TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- 2. Tabel Tahun Fiskal (Fiscal Year)
CREATE TABLE fiscal_year (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    entity_id   BIGINT  NOT NULL REFERENCES entity(id),
    year        INT     NOT NULL,
    start_date  DATE    NOT NULL,
    end_date    DATE    NOT NULL,
    is_closed   BOOLEAN NOT NULL DEFAULT FALSE,
    UNIQUE (entity_id, year)
);

-- 3. Tabel Periode Akuntansi (Accounting Period / Tutup Buku Bulanan)
CREATE TABLE accounting_period (
    id             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    fiscal_year_id BIGINT      NOT NULL REFERENCES fiscal_year(id),
    entity_id      BIGINT      NOT NULL REFERENCES entity(id),
    period_no      INT         NOT NULL CHECK (period_no BETWEEN 1 AND 13),
    start_date     DATE        NOT NULL,
    end_date       DATE        NOT NULL,
    status         VARCHAR(10) NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'CLOSED', 'LOCKED')),
    closed_at      TIMESTAMPTZ,
    closed_by      BIGINT,
    UNIQUE (entity_id, fiscal_year_id, period_no)
);

-- 4. Tabel Bagan Akun (Chart of Accounts / COA Berpohon)
CREATE TABLE account (
    id             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    entity_id      BIGINT       NOT NULL REFERENCES entity(id),
    code           VARCHAR(20)  NOT NULL,
    name           VARCHAR(150) NOT NULL,
    type           VARCHAR(10)  NOT NULL CHECK (type IN ('ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE')),
    normal_balance VARCHAR(6)   NOT NULL CHECK (normal_balance IN ('DEBIT', 'CREDIT')),
    report_group   VARCHAR(30)  NOT NULL, -- CASH, RECEIVABLE, INVENTORY, PAYABLE, EQUITY, REVENUE, OPEX, dll.
    parent_id      BIGINT       REFERENCES account(id),
    is_postable    BOOLEAN      NOT NULL DEFAULT TRUE,  -- Hanya akun anak (leaf node) yang boleh dijurnal
    is_active      BOOLEAN      NOT NULL DEFAULT TRUE,
    version        BIGINT       NOT NULL DEFAULT 0,     -- Optimistic Locking
    UNIQUE (entity_id, code)
);

-- 5. Tabel Header Jurnal (Journal Entry)
CREATE TABLE journal_entry (
    id             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    entity_id      BIGINT        NOT NULL REFERENCES entity(id),
    period_id      BIGINT        NOT NULL REFERENCES accounting_period(id),
    journal_no     VARCHAR(40),                         -- Diberikan otomatis saat status POSTED
    entry_date     DATE          NOT NULL,
    description    VARCHAR(500)  NOT NULL,
    source         VARCHAR(12)   NOT NULL CHECK (source IN ('MANUAL', 'IMPORT', 'REVERSAL', 'CLOSING', 'OPENING')),
    status         VARCHAR(10)   NOT NULL CHECK (status IN ('DRAFT', 'SUBMITTED', 'APPROVED', 'POSTED', 'CANCELLED')),
    reversal_of_id BIGINT        REFERENCES journal_entry(id),
    total_amount   NUMERIC(19,4) NOT NULL CHECK (total_amount >= 0),
    created_by     BIGINT        NOT NULL,
    submitted_by   BIGINT,
    approved_by    BIGINT,
    posted_by      BIGINT,
    posted_at      TIMESTAMPTZ,
    version        BIGINT        NOT NULL DEFAULT 0,    -- Optimistic Locking
    UNIQUE (entity_id, journal_no),
    UNIQUE (reversal_of_id)                             -- 1 jurnal hanya boleh dibalik 1 kali
);

-- 6. Tabel Baris Jurnal (Journal Lines / Double-Entry Ledger)
CREATE TABLE journal_line (
    id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    entry_id   BIGINT        NOT NULL REFERENCES journal_entry(id) ON DELETE CASCADE,
    entity_id  BIGINT        NOT NULL REFERENCES entity(id),
    line_no    INT           NOT NULL,
    account_id BIGINT        NOT NULL REFERENCES account(id),
    debit      NUMERIC(19,4) NOT NULL DEFAULT 0 CHECK (debit >= 0),
    credit     NUMERIC(19,4) NOT NULL DEFAULT 0 CHECK (credit >= 0),
    memo       VARCHAR(255),
    -- Invariant Akuntansi: Tepat satu sisi (debit ATAU kredit) yang bernilai > 0
    CHECK ((debit = 0) <> (credit = 0))
);

CREATE INDEX ix_journal_line_entry   ON journal_line (entry_id);
CREATE INDEX ix_journal_line_account ON journal_line (account_id);

-- 7. Tabel Saldo Ringkasan (Account Balance Snapshot untuk Laporan Cepat)
CREATE TABLE account_balance (
    account_id   BIGINT        NOT NULL REFERENCES account(id),
    period_id    BIGINT        NOT NULL REFERENCES accounting_period(id),
    entity_id    BIGINT        NOT NULL REFERENCES entity(id),
    debit_total  NUMERIC(19,4) NOT NULL DEFAULT 0,
    credit_total NUMERIC(19,4) NOT NULL DEFAULT 0,
    line_count   BIGINT        NOT NULL DEFAULT 0,
    PRIMARY KEY (account_id, period_id)
);

-- 8. Counter Nomor Jurnal Tanpa Celah (Gapless Sequence per Entitas & Tahun)
CREATE TABLE journal_sequence (
    entity_id   BIGINT NOT NULL REFERENCES entity(id),
    fiscal_year INT    NOT NULL,
    last_number BIGINT NOT NULL DEFAULT 0,
    PRIMARY KEY (entity_id, fiscal_year)
);

-- 9. Tabel Audit Log Append-Only
CREATE TABLE audit_log (
    id             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    entity_id      BIGINT,
    actor_id       BIGINT,
    action         VARCHAR(60) NOT NULL,
    target_type    VARCHAR(40),
    target_id      BIGINT,
    detail         JSONB       NOT NULL,
    ip             INET,
    correlation_id UUID,
    occurred_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- DATABASE TRIGGERS: PENEGAKAN INVARIANT KEAMANAN AKUNTANSI
-- ============================================================================

-- Trigger 1: Immutability Jurnal POSTED (Tidak Boleh Diubah atau Dihapus)
CREATE OR REPLACE FUNCTION prevent_posted_journal_mutation()
RETURNS TRIGGER AS $$
BEGIN
    -- Jika baris jurnal yang diedit/dihapus berasal dari jurnal berstatus POSTED:
    IF (SELECT status FROM journal_entry WHERE id = OLD.entry_id) = 'POSTED' THEN
        RAISE EXCEPTION 'INVARIANT VIOLATION: Baris jurnal dari jurnal POSTED tidak boleh diubah atau dihapus (INV-05)';
    END IF;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_protect_posted_journal_lines
BEFORE UPDATE OR DELETE ON journal_line
FOR EACH ROW EXECUTE FUNCTION prevent_posted_journal_mutation();

-- Trigger 2: Audit Log Append-Only (Tidak Boleh Ada UPDATE atau DELETE pada Log Audit)
CREATE OR REPLACE FUNCTION prevent_audit_log_mutation()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'INVARIANT VIOLATION: Audit log bersifat append-only, dilarang UPDATE atau DELETE (INV-14)';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_protect_audit_log
BEFORE UPDATE OR DELETE ON audit_log
FOR EACH ROW EXECUTE FUNCTION prevent_audit_log_mutation();