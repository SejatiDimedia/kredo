-- ============================================================================
-- KREDO ACCOUNTING ENGINE: V3 INIT IMPORT JOB TRACKING
-- Tabel Pelacakan Eksekusi Batch Impor Massal CSV & Idempotensi Hash
-- ============================================================================

CREATE TABLE import_job (
    id               BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    entity_id        BIGINT       NOT NULL REFERENCES entity(id),
    file_name        VARCHAR(255) NOT NULL,
    file_hash        VARCHAR(64)  NOT NULL, -- SHA-256 idempotency hash (FR-IMP-04)
    total_rows       INT          NOT NULL DEFAULT 0,
    processed_rows   INT          NOT NULL DEFAULT 0,
    success_count    INT          NOT NULL DEFAULT 0,
    failure_count    INT          NOT NULL DEFAULT 0,
    status           VARCHAR(20)  NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED')),
    error_summary    JSONB,
    created_by       BIGINT       NOT NULL,
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT now(),
    completed_at     TIMESTAMPTZ
);

CREATE INDEX ix_import_job_entity ON import_job (entity_id, created_at DESC);