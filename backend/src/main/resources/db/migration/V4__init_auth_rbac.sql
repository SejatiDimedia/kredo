-- ============================================================================
-- KREDO ACCOUNTING ENGINE: V4 INIT AUTH & RBAC (Role-Based Access Control)
-- Sesuai PRD Bab 3 (Persona & Matriks Hak Akses) & Bab 6.1 (FR-AUTH-01 s/d 03)
-- ============================================================================

-- 1. Tabel Pengguna Aplikasi (App User)
CREATE TABLE app_user (
    id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email         VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name     VARCHAR(150) NOT NULL,
    is_active     BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX ix_app_user_email ON app_user(email);

-- 2. Tabel Peran Pengguna per Entitas (Multi-Entity RBAC)
-- Satu pengguna bisa memiliki peran berbeda di entitas yang berbeda
CREATE TABLE user_entity_role (
    id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id    BIGINT      NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
    entity_id  BIGINT      NOT NULL REFERENCES entity(id) ON DELETE CASCADE,
    role       VARCHAR(30) NOT NULL CHECK (role IN ('ADMIN', 'ACCOUNTANT', 'APPROVER', 'CONTROLLER', 'AUDITOR')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, entity_id)
);

CREATE INDEX ix_user_entity_role_user ON user_entity_role(user_id);
CREATE INDEX ix_user_entity_role_entity ON user_entity_role(entity_id);

-- 3. Tabel Refresh Token dengan Rotasi & Deteksi Pencurian (Token Reuse Detection)
CREATE TABLE refresh_token (
    id                 BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id            BIGINT       NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
    token_hash         VARCHAR(64)  NOT NULL UNIQUE, -- SHA-256 hash agar tidak tersimpan plaintext di database
    expires_at         TIMESTAMPTZ  NOT NULL,
    revoked_at         TIMESTAMPTZ,
    replaced_by_hash   VARCHAR(64),
    created_at         TIMESTAMPTZ  NOT NULL DEFAULT now(),
    ip                 VARCHAR(45),
    user_agent         VARCHAR(255)
);

CREATE INDEX ix_refresh_token_user ON refresh_token(user_id);
CREATE INDEX ix_refresh_token_hash ON refresh_token(token_hash);

-- 4. Seed Data: 5 Persona Resmi Sesuai PRD (Password: Kredo2026!)
INSERT INTO app_user (id, email, password_hash, full_name, is_active)
OVERRIDING SYSTEM VALUE VALUES
(1, 'admin@kredo.com',      '$2a$10$VFsSzhJ4vsSaJCrldPvyp./YSghbGAGBKQJywfs6gg1YneOhkjJs6', 'Sari Administrator', true),
(2, 'accountant@kredo.com', '$2a$10$VFsSzhJ4vsSaJCrldPvyp./YSghbGAGBKQJywfs6gg1YneOhkjJs6', 'Dina Staf Akuntansi',  true),
(3, 'approver@kredo.com',   '$2a$10$VFsSzhJ4vsSaJCrldPvyp./YSghbGAGBKQJywfs6gg1YneOhkjJs6', 'Raka Senior Approver', true),
(4, 'controller@kredo.com', '$2a$10$VFsSzhJ4vsSaJCrldPvyp./YSghbGAGBKQJywfs6gg1YneOhkjJs6', 'Maya Controller',      true),
(5, 'auditor@kredo.com',    '$2a$10$VFsSzhJ4vsSaJCrldPvyp./YSghbGAGBKQJywfs6gg1YneOhkjJs6', 'Arief Auditor',        true);

-- 5. Hubungkan Persona ke Entitas 1 (PT Maju Jaya Sejahtera)
INSERT INTO user_entity_role (user_id, entity_id, role) VALUES
(1, 1, 'ADMIN'),
(2, 1, 'ACCOUNTANT'),
(3, 1, 'APPROVER'),
(4, 1, 'CONTROLLER'),
(5, 1, 'AUDITOR');
