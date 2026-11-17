package com.kredo.backend.auth.dto;

import com.kredo.backend.auth.domain.Role;
import java.util.List;
import java.util.Set;

public record UserDto(
    Long id,
    String email,
    String fullName,
    Long activeEntityId,
    String activeEntityCode,
    String activeEntityName,
    Role role,
    Set<String> permissions,
    List<EntityRoleDto> availableEntities
) {}
