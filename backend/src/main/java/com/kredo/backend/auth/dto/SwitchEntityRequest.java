package com.kredo.backend.auth.dto;

import jakarta.validation.constraints.NotNull;

public record SwitchEntityRequest(
    @NotNull(message = "ID entitas wajib ditentukan")
    Long entityId
) {}
