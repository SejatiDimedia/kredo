package com.kredo.backend.auth.service;

import com.kredo.backend.audit.service.AuditLogService;
import com.kredo.backend.auth.domain.RefreshToken;
import com.kredo.backend.auth.domain.Role;
import com.kredo.backend.auth.domain.User;
import com.kredo.backend.auth.domain.UserEntityRole;
import com.kredo.backend.auth.dto.LoginRequest;
import com.kredo.backend.auth.repository.RefreshTokenRepository;
import com.kredo.backend.auth.repository.UserEntityRoleRepository;
import com.kredo.backend.auth.repository.UserRepository;
import com.kredo.backend.auth.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowCallbackHandler;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserEntityRoleRepository userEntityRoleRepository;

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @Mock
    private AuditLogService auditLogService;

    @Mock
    private JdbcTemplate jdbcTemplate;

    @InjectMocks
    private AuthService authService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(authService, "refreshTokenExpirationSeconds", 604800L);
    }

    @Test
    @DisplayName("Login berhasil menghasilkan access token dan refresh token")
    void login_validCredentials_success() {
        String email = "accountant@kredo.com";
        String password = "Password123!";

        User user = new User(email, "$2a$10$hashedPassword", "Dina Staf Akuntansi");
        user.setId(2L);

        when(userRepository.findByEmailIgnoreCase(email)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(password, user.getPasswordHash())).thenReturn(true);

        UserEntityRole role = new UserEntityRole(2L, 1L, Role.ACCOUNTANT);
        when(userEntityRoleRepository.findByUserId(2L)).thenReturn(List.of(role));

        when(jwtTokenProvider.generateAccessToken(eq(2L), eq(email), eq(1L), eq("ACCOUNTANT"), any()))
                .thenReturn("mock-jwt-access-token");

        AuthService.LoginResult result = authService.login(new LoginRequest(email, password), "127.0.0.1", "Mozilla/5.0");

        assertThat(result).isNotNull();
        assertThat(result.authResponse().accessToken()).isEqualTo("mock-jwt-access-token");
        assertThat(result.authResponse().user().email()).isEqualTo(email);
        assertThat(result.authResponse().user().role()).isEqualTo(Role.ACCOUNTANT);
        assertThat(result.rawRefreshToken()).isNotBlank();

        verify(refreshTokenRepository, times(1)).save(any(RefreshToken.class));
        verify(auditLogService, times(1)).log(eq(1L), eq(2L), eq("LOGIN"), eq("USER"), eq(2L), anyString());
    }

    @Test
    @DisplayName("Login gagal jika password tidak cocok")
    void login_invalidPassword_throwsException() {
        String email = "accountant@kredo.com";
        User user = new User(email, "$2a$10$hashedPassword", "Dina Staf Akuntansi");
        user.setId(2L);

        when(userRepository.findByEmailIgnoreCase(email)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("WrongPassword", user.getPasswordHash())).thenReturn(false);

        assertThatThrownBy(() -> authService.login(new LoginRequest(email, "WrongPassword"), "127.0.0.1", "Mozilla/5.0"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Email atau password tidak valid");

        verify(refreshTokenRepository, never()).save(any());
    }

    @Test
    @DisplayName("Login gagal jika akun pengguna nonaktif")
    void login_inactiveUser_throwsException() {
        String email = "disabled@kredo.com";
        User user = new User(email, "$2a$10$hashedPassword", "User Nonaktif");
        user.setId(10L);
        user.setActive(false);

        when(userRepository.findByEmailIgnoreCase(email)).thenReturn(Optional.of(user));

        assertThatThrownBy(() -> authService.login(new LoginRequest(email, "Password123!"), "127.0.0.1", "Mozilla/5.0"))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("dinonaktifkan");
    }

    @Test
    @DisplayName("Deteksi pencurian token: Refresh token yang sudah dicabut digunakan kembali memicu pencabutan darurat seluruh sesi")
    void refresh_tokenTheftReuse_revokesAllTokensAndLogsSecurityAlert() {
        String stolenRawToken = "stolen-raw-refresh-token";

        RefreshToken revokedToken = new RefreshToken();
        revokedToken.setId(50L);
        revokedToken.setUserId(2L);
        revokedToken.setRevokedAt(Instant.now().minusSeconds(3600)); // Sudah pernah dicabut / dirotasi sebelumnya
        revokedToken.setExpiresAt(Instant.now().plusSeconds(60000));

        when(refreshTokenRepository.findByTokenHash(anyString())).thenReturn(Optional.of(revokedToken));

        assertThatThrownBy(() -> authService.refresh(stolenRawToken, "192.168.1.1", "HackerAgent"))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Peringatan Keamanan");

        // Memastikan seluruh token user ini dicabut darurat
        verify(refreshTokenRepository, times(1)).revokeAllForUser(eq(2L), any(Instant.class));
        // Memastikan tercatat di audit log
        verify(auditLogService, times(1)).log(eq(1L), eq(2L), eq("SECURITY_ALERT"), eq("TOKEN"), eq(50L), contains("DETEKSI PENCURIAN TOKEN"));
    }

    @Test
    @DisplayName("Rotasi token: Refresh token valid menghasilkan token baru dan mencabut token lama")
    void refresh_validToken_rotatesTokenSuccessfully() {
        String validRawToken = "valid-raw-refresh-token";

        RefreshToken activeToken = new RefreshToken();
        activeToken.setId(70L);
        activeToken.setUserId(2L);
        activeToken.setExpiresAt(Instant.now().plusSeconds(60000));
        activeToken.setRevokedAt(null);

        when(refreshTokenRepository.findByTokenHash(anyString())).thenReturn(Optional.of(activeToken));

        User user = new User("accountant@kredo.com", "$2a$10$hashed", "Dina Staf Akuntansi");
        user.setId(2L);
        when(userRepository.findById(2L)).thenReturn(Optional.of(user));

        UserEntityRole role = new UserEntityRole(2L, 1L, Role.ACCOUNTANT);
        when(userEntityRoleRepository.findByUserId(2L)).thenReturn(List.of(role));

        when(jwtTokenProvider.generateAccessToken(eq(2L), eq("accountant@kredo.com"), eq(1L), eq("ACCOUNTANT"), any()))
                .thenReturn("new-jwt-access-token");

        AuthService.LoginResult result = authService.refresh(validRawToken, "127.0.0.1", "Mozilla/5.0");

        assertThat(result).isNotNull();
        assertThat(result.authResponse().accessToken()).isEqualTo("new-jwt-access-token");
        assertThat(activeToken.isRevoked()).isTrue();
        assertThat(activeToken.getReplacedByHash()).isNotNull();

        // Menyimpan status revoked token lama dan menyimpan token baru
        verify(refreshTokenRepository, times(2)).save(any(RefreshToken.class));
    }
}
