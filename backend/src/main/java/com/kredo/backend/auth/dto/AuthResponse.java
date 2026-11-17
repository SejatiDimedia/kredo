package com.kredo.backend.auth.dto;

public record AuthResponse(
    String accessToken,
    UserDto user
) {}
