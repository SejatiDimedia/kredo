package com.kredo.backend.auth.dto;

import com.kredo.backend.auth.domain.Role;

public record EntityRoleDto(
    Long entityId,
    String entityCode,
    String entityName,
    Role role
) {}
