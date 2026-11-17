package com.kredo.backend.auth.service;

import com.kredo.backend.audit.service.AuditLogService;
import com.kredo.backend.auth.domain.RefreshToken;
import com.kredo.backend.auth.domain.Role;
import com.kredo.backend.auth.domain.User;
import com.kredo.backend.auth.domain.UserEntityRole;
import com.kredo.backend.auth.dto.*;
import com.kredo.backend.auth.repository.RefreshTokenRepository;
import com.kredo.backend.auth.repository.UserEntityRoleRepository;
import com.kredo.backend.auth.repository.UserRepository;
import com.kredo.backend.auth.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final UserEntityRoleRepository userEntityRoleRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuditLogService auditLogService;
    private final JdbcTemplate jdbcTemplate;

    @Value("${kredo.jwt.refresh-token-expiration-seconds:604800}")
    private long refreshTokenExpirationSeconds;

    @Transactional
    public LoginResult login(LoginRequest request, String ip, String userAgent) {
        User user = userRepository.findByEmailIgnoreCase(request.email().trim())
                .orElseThrow(() -> new IllegalArgumentException("Email atau password tidak valid"));

        if (!user.isActive()) {
            throw new IllegalStateException("Akun pengguna ini telah dinonaktifkan. Hubungi Administrator.");
        }

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Email atau password tidak valid");
        }

        List<UserEntityRole> roles = userEntityRoleRepository.findByUserId(user.getId());
        if (roles.isEmpty()) {
            throw new IllegalStateException("Pengguna belum memiliki hak akses pada entitas mana pun");
        }

        // Default ke entitas pertama yang ditugaskan
        UserEntityRole defaultRole = roles.get(0);
        Long activeEntityId = defaultRole.getEntityId();
        Role activeRole = defaultRole.getRole();

        String accessToken = jwtTokenProvider.generateAccessToken(
                user.getId(),
                user.getEmail(),
                activeEntityId,
                activeRole.name(),
                activeRole.getPermissions()
        );

        String rawRefreshToken = createRefreshToken(user.getId(), ip, userAgent);

        UserDto userDto = buildUserDto(user, activeEntityId, activeRole, roles);

        auditLogService.log(activeEntityId, user.getId(), "LOGIN", "USER", user.getId(),
                "Pengguna login berhasil sebagai " + activeRole.name());

        return new LoginResult(new AuthResponse(accessToken, userDto), rawRefreshToken);
    }

    @Transactional
    public LoginResult refresh(String rawRefreshToken, String ip, String userAgent) {
        if (rawRefreshToken == null || rawRefreshToken.isBlank()) {
            throw new IllegalArgumentException("Refresh token tidak ditemukan di cookie");
        }

        String tokenHash = hashToken(rawRefreshToken);
        RefreshToken storedToken = refreshTokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() -> new IllegalArgumentException("Refresh token tidak valid atau tidak dikenali"));

        // DETEKSI PENCURIAN REFRESH TOKEN (TOKEN REUSE DETECTION - FR-AUTH-03)
        if (storedToken.isRevoked()) {
            // Token yang sudah pernah dirotasi dicoba dipakai lagi! Ini tanda pencurian token.
            // Cabut SEMUA refresh token milik user ini untuk perlindungan darurat.
            refreshTokenRepository.revokeAllForUser(storedToken.getUserId(), Instant.now());

            auditLogService.log(1L, storedToken.getUserId(), "SECURITY_ALERT", "TOKEN", storedToken.getId(),
                    "DETEKSI PENCURIAN TOKEN: Percobaan penggunaan ulang refresh token yang telah dicabut. Seluruh sesi pengguna dicabut demi keamanan.");

            log.warn("SECURITY ALERT: Token reuse detected for userId {}. All sessions revoked.", storedToken.getUserId());
            throw new IllegalStateException("Peringatan Keamanan: Terdeteksi penggunaan ulang token kedaluwarsa. Seluruh sesi dicabut demi keamanan.");
        }

        if (storedToken.isExpired()) {
            throw new IllegalArgumentException("Refresh token telah kedaluwarsa. Silakan login kembali.");
        }

        // Rotasi token: Cabut token lama dan terbitkan token baru
        String newRawRefreshToken = generateRandomToken();
        String newTokenHash = hashToken(newRawRefreshToken);

        storedToken.setRevokedAt(Instant.now());
        storedToken.setReplacedByHash(newTokenHash);
        refreshTokenRepository.save(storedToken);

        RefreshToken newToken = new RefreshToken();
        newToken.setUserId(storedToken.getUserId());
        newToken.setTokenHash(newTokenHash);
        newToken.setExpiresAt(Instant.now().plusSeconds(refreshTokenExpirationSeconds));
        newToken.setIp(ip);
        newToken.setUserAgent(userAgent);
        refreshTokenRepository.save(newToken);

        User user = userRepository.findById(storedToken.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("Pengguna tidak ditemukan"));

        List<UserEntityRole> roles = userEntityRoleRepository.findByUserId(user.getId());
        UserEntityRole defaultRole = roles.get(0);
        Long activeEntityId = defaultRole.getEntityId();
        Role activeRole = defaultRole.getRole();

        String newAccessToken = jwtTokenProvider.generateAccessToken(
                user.getId(),
                user.getEmail(),
                activeEntityId,
                activeRole.name(),
                activeRole.getPermissions()
        );

        UserDto userDto = buildUserDto(user, activeEntityId, activeRole, roles);
        return new LoginResult(new AuthResponse(newAccessToken, userDto), newRawRefreshToken);
    }

    @Transactional
    public void logout(String rawRefreshToken, Long userId) {
        if (rawRefreshToken != null && !rawRefreshToken.isBlank()) {
            String tokenHash = hashToken(rawRefreshToken);
            refreshTokenRepository.findByTokenHash(tokenHash).ifPresent(token -> {
                token.setRevokedAt(Instant.now());
                refreshTokenRepository.save(token);
            });
        }
        if (userId != null) {
            auditLogService.log(1L, userId, "LOGOUT", "USER", userId, "Pengguna logout dan mencabut sesi.");
        }
    }

    @Transactional(readOnly = true)
    public AuthResponse switchEntity(Long userId, Long targetEntityId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Pengguna tidak ditemukan"));

        List<UserEntityRole> roles = userEntityRoleRepository.findByUserId(user.getId());
        UserEntityRole targetRole = roles.stream()
                .filter(r -> r.getEntityId().equals(targetEntityId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Pengguna tidak memiliki hak akses pada entitas ID " + targetEntityId));

        String newAccessToken = jwtTokenProvider.generateAccessToken(
                user.getId(),
                user.getEmail(),
                targetEntityId,
                targetRole.getRole().name(),
                targetRole.getRole().getPermissions()
        );

        UserDto userDto = buildUserDto(user, targetEntityId, targetRole.getRole(), roles);
        return new AuthResponse(newAccessToken, userDto);
    }

    @Transactional(readOnly = true)
    public UserDto getCurrentUser(Long userId, Long activeEntityId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Pengguna tidak ditemukan"));

        List<UserEntityRole> roles = userEntityRoleRepository.findByUserId(user.getId());
        UserEntityRole activeRole = roles.stream()
                .filter(r -> r.getEntityId().equals(activeEntityId))
                .findFirst()
                .orElse(roles.get(0));

        return buildUserDto(user, activeRole.getEntityId(), activeRole.getRole(), roles);
    }

    private UserDto buildUserDto(User user, Long activeEntityId, Role activeRole, List<UserEntityRole> roles) {
        Map<Long, Map<String, String>> entityDetails = getEntityDetails();

        Map<String, String> currentEntity = entityDetails.getOrDefault(activeEntityId, Map.of("code", "PTM", "name", "PT Maju Jaya Sejahtera"));

        List<EntityRoleDto> available = roles.stream().map(r -> {
            Map<String, String> det = entityDetails.getOrDefault(r.getEntityId(), Map.of("code", "ENT-" + r.getEntityId(), "name", "Entitas " + r.getEntityId()));
            return new EntityRoleDto(r.getEntityId(), det.get("code"), det.get("name"), r.getRole());
        }).toList();

        return new UserDto(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                activeEntityId,
                currentEntity.get("code"),
                currentEntity.get("name"),
                activeRole,
                activeRole.getPermissions(),
                available
        );
    }

    private Map<Long, Map<String, String>> getEntityDetails() {
        Map<Long, Map<String, String>> map = new HashMap<>();
        jdbcTemplate.query("SELECT id, code, name FROM entity", rs -> {
            map.put(rs.getLong("id"), Map.of("code", rs.getString("code"), "name", rs.getString("name")));
        });
        return map;
    }

    private String createRefreshToken(Long userId, String ip, String userAgent) {
        String rawToken = generateRandomToken();
        String tokenHash = hashToken(rawToken);

        RefreshToken token = new RefreshToken();
        token.setUserId(userId);
        token.setTokenHash(tokenHash);
        token.setExpiresAt(Instant.now().plusSeconds(refreshTokenExpirationSeconds));
        token.setIp(ip);
        token.setUserAgent(userAgent);
        refreshTokenRepository.save(token);

        return rawToken;
    }

    private String generateRandomToken() {
        byte[] bytes = new byte[32];
        new SecureRandom().nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private String hashToken(String rawToken) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(rawToken.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not available", e);
        }
    }

    public record LoginResult(AuthResponse authResponse, String rawRefreshToken) {}
}
