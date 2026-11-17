package com.kredo.backend.auth.domain;

import java.util.Collections;
import java.util.Set;

/**
 * Matriks Hak Akses (RBAC) Sesuai PRD Bab 3.2.
 */
public enum Role {
    ADMIN(Set.of("user:manage", "entity:manage", "coa:view", "audit:view")),
    ACCOUNTANT(Set.of("coa:view", "journal:view", "journal:create", "period:view", "import:run", "report:view", "report:export")),
    APPROVER(Set.of("coa:view", "journal:view", "journal:create", "journal:approve", "journal:post", "journal:reverse", "period:view", "import:run", "report:view", "report:export")),
    CONTROLLER(Set.of("coa:view", "coa:manage", "journal:view", "journal:create", "journal:approve", "journal:post", "journal:reverse", "period:view", "period:manage", "import:run", "import:autopost", "report:view", "report:export", "audit:view")),
    AUDITOR(Set.of("coa:view", "journal:view", "period:view", "report:view", "report:export", "audit:view"));

    private final Set<String> permissions;

    Role(Set<String> permissions) {
        this.permissions = permissions;
    }

    public Set<String> getPermissions() {
        return Collections.unmodifiableSet(permissions);
    }
}
