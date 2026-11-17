package com.kredo.backend.auth.controller;

import com.kredo.backend.auth.dto.*;
import com.kredo.backend.auth.security.UserPrincipal;
import com.kredo.backend.auth.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletRequest httpRequest,
            HttpServletResponse httpResponse) {

        String ip = extractIp(httpRequest);
        String userAgent = httpRequest.getHeader("User-Agent");

        AuthService.LoginResult result = authService.login(request, ip, userAgent);

        setRefreshTokenCookie(httpResponse, result.rawRefreshToken(), 604800);
        return ResponseEntity.ok(result.authResponse());
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(
            @CookieValue(name = "refreshToken", required = false) String refreshToken,
            HttpServletRequest httpRequest,
            HttpServletResponse httpResponse) {

        String ip = extractIp(httpRequest);
        String userAgent = httpRequest.getHeader("User-Agent");

        AuthService.LoginResult result = authService.refresh(refreshToken, ip, userAgent);

        setRefreshTokenCookie(httpResponse, result.rawRefreshToken(), 604800);
        return ResponseEntity.ok(result.authResponse());
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            @CookieValue(name = "refreshToken", required = false) String refreshToken,
            @AuthenticationPrincipal UserPrincipal principal,
            HttpServletResponse httpResponse) {

        Long userId = principal != null ? principal.getUserId() : null;
        authService.logout(refreshToken, userId);

        setRefreshTokenCookie(httpResponse, "", 0);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser(@AuthenticationPrincipal UserPrincipal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        UserDto userDto = authService.getCurrentUser(principal.getUserId(), principal.getEntityId());
        return ResponseEntity.ok(userDto);
    }

    @PostMapping("/switch-entity")
    public ResponseEntity<AuthResponse> switchEntity(
            @Valid @RequestBody SwitchEntityRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {

        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        AuthResponse response = authService.switchEntity(principal.getUserId(), request.entityId());
        return ResponseEntity.ok(response);
    }

    private void setRefreshTokenCookie(HttpServletResponse response, String token, long maxAgeSeconds) {
        ResponseCookie cookie = ResponseCookie.from("refreshToken", token)
                .httpOnly(true)
                .secure(false) // Set false untuk dev localhost; ganti true di production HTTPS
                .path("/api/v1/auth")
                .maxAge(maxAgeSeconds)
                .sameSite("Lax") // Mengizinkan cookie terkirim saat fetch dari localhost:5173 ke localhost:8080
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    private String extractIp(HttpServletRequest request) {
        String xf = request.getHeader("X-Forwarded-For");
        if (xf != null && !xf.isBlank()) {
            return xf.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
