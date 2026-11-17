package com.kredo.backend.audit.service;

import com.kredo.backend.audit.dto.AuditIntegrityResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class AuditLogServiceTest {

    private JdbcTemplate jdbcTemplate;
    private AuditLogService auditLogService;

    @BeforeEach
    void setUp() {
        jdbcTemplate = mock(JdbcTemplate.class);
        auditLogService = new AuditLogService(jdbcTemplate);
    }

    @Test
    @DisplayName("Log berhasil memanggil INSERT ke tabel audit_log")
    void log_callsJdbcTemplateInsert() {
        Long entityId = 1L;
        Long actorId = 2L;

        auditLogService.log(entityId, actorId, "POST_JOURNAL", "JOURNAL_ENTRY", 100L, "{\"total\": 100000}");

        verify(jdbcTemplate, times(1)).update(
                anyString(),
                eq(entityId),
                eq(actorId),
                eq("POST_JOURNAL"),
                eq("JOURNAL_ENTRY"),
                eq(100L),
                eq("{\"total\": 100000}"),
                anyString(),
                any()
        );
    }

    @Test
    @DisplayName("Rantai hash bernilai Genesis jika tabel audit kosong")
    void verifyIntegrity_emptyTable_returnsGenesisHash() {
        Long entityId = 1L;
        when(jdbcTemplate.query(anyString(), any(RowMapper.class), eq(entityId)))
                .thenReturn(Collections.emptyList());

        AuditIntegrityResponse response = auditLogService.verifyIntegrity(entityId);

        assertThat(response).isNotNull();
        assertThat(response.isTamperFree()).isTrue();
        assertThat(response.totalRecords()).isEqualTo(0);
        assertThat(response.currentChainHash()).isEqualTo("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");
    }

    @Test
    @DisplayName("Rantai hash menghitung SHA-256 berantai untuk baris audit yang ada")
    void verifyIntegrity_withRecords_calculatesChainHash() {
        Long entityId = 1L;
        when(jdbcTemplate.query(anyString(), any(RowMapper.class), eq(entityId)))
                .thenReturn(List.of("1:POST_JOURNAL:{}:2026-11-17T00:00:00Z"));

        AuditIntegrityResponse response = auditLogService.verifyIntegrity(entityId);

        assertThat(response).isNotNull();
        assertThat(response.isTamperFree()).isTrue();
        assertThat(response.totalRecords()).isEqualTo(1);
        // Hash berubah dari genesis
        assertThat(response.currentChainHash()).isNotEqualTo("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");
    }
}
