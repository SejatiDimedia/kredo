package com.kredo.backend.importer.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kredo.backend.audit.service.AuditLogService;
import com.kredo.backend.coa.domain.Account;
import com.kredo.backend.coa.domain.AccountType;
import com.kredo.backend.coa.domain.NormalBalance;
import com.kredo.backend.coa.repository.AccountRepository;
import com.kredo.backend.importer.dto.ImportJobResponse;
import com.kredo.backend.journal.service.JournalService;
import com.kredo.backend.period.domain.AccountingPeriod;
import com.kredo.backend.period.domain.PeriodStatus;
import com.kredo.backend.period.repository.AccountingPeriodRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.mock.web.MockMultipartFile;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class CsvImportServiceTest {

    private JournalService journalService;
    private AccountRepository accountRepository;
    private AccountingPeriodRepository accountingPeriodRepository;
    private AuditLogService auditLogService;
    private JdbcTemplate jdbcTemplate;
    private ObjectMapper objectMapper;

    private CsvImportService csvImportService;

    @BeforeEach
    void setUp() {
        journalService = mock(JournalService.class);
        accountRepository = mock(AccountRepository.class);
        accountingPeriodRepository = mock(AccountingPeriodRepository.class);
        auditLogService = mock(AuditLogService.class);
        jdbcTemplate = mock(JdbcTemplate.class);
        objectMapper = new ObjectMapper();

        csvImportService = new CsvImportService(
                journalService,
                accountRepository,
                accountingPeriodRepository,
                auditLogService,
                jdbcTemplate,
                objectMapper
        );
    }

    @Test
    @DisplayName("Penolakan berkas jika berkas kosong atau bukan CSV")
    void processCsvImport_emptyOrInvalidFile_throwsException() {
        MockMultipartFile emptyFile = new MockMultipartFile("file", "test.txt", "text/plain", new byte[0]);

        assertThatThrownBy(() -> csvImportService.processCsvImport(1L, 1L, emptyFile, true, false))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    @DisplayName("Penolakan idempotensi jika berkas dengan hash identik pernah diimpor sebelumnya")
    void processCsvImport_duplicateFileHash_throwsException() {
        String csvContent = "journal_ref,entry_date,description,account_code,debit,credit,memo\n" +
                "JRN-1,2026-11-15,Penjualan,1101,100,0,Kas\n" +
                "JRN-1,2026-11-15,Penjualan,4101,0,100,Pendapatan\n";

        MockMultipartFile file = new MockMultipartFile("file", "test.csv", "text/csv", csvContent.getBytes(StandardCharsets.UTF_8));

        // Mock database mengembalikan bahwa hash ini sudah ada
        when(jdbcTemplate.query(anyString(), any(RowMapper.class), eq(1L), anyString())).thenReturn(List.of(99L));

        assertThatThrownBy(() -> csvImportService.processCsvImport(1L, 1L, file, true, false))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("telah berhasil diimpor sebelumnya");
    }

    @Test
    @DisplayName("Berhasil memproses berkas CSV valid dengan 1 jurnal seimbang")
    void processCsvImport_validFile_success() {
        Long entityId = 1L;
        Long userId = 1L;

        String csvContent = "journal_ref,entry_date,description,account_code,debit,credit,memo\n" +
                "JRN-001,2026-11-15,Penjualan Tunai,1101,500000.00,0.00,Kas\n" +
                "JRN-001,2026-11-15,Penjualan Tunai,4101,0.00,500000.00,Pendapatan\n";

        MockMultipartFile file = new MockMultipartFile("file", "transaksi.csv", "text/csv", csvContent.getBytes(StandardCharsets.UTF_8));

        // Idempotency check: belum pernah ada
        when(jdbcTemplate.query(anyString(), any(RowMapper.class), eq(entityId), anyString())).thenReturn(Collections.emptyList());

        // Master account
        Account kas = new Account(entityId, "1101", "Kas", AccountType.ASSET, NormalBalance.DEBIT, "CASH", null, true);
        kas.setId(1101L);
        Account pendapatan = new Account(entityId, "4101", "Pendapatan", AccountType.REVENUE, NormalBalance.CREDIT, "REVENUE", null, true);
        pendapatan.setId(4101L);
        when(accountRepository.findByEntityIdOrderByCodeAsc(entityId)).thenReturn(List.of(kas, pendapatan));

        // Open period
        AccountingPeriod period = mock(AccountingPeriod.class);
        when(period.getId()).thenReturn(11L);
        when(period.isOpen()).thenReturn(true);
        when(accountingPeriodRepository.findPeriodByDate(eq(entityId), any(LocalDate.class))).thenReturn(Optional.of(period));

        // Insert import_job returning ID
        when(jdbcTemplate.queryForObject(anyString(), eq(Long.class), any(), any(), any(), any(), any(), any(), any(), any(), any())).thenReturn(101L);

        ImportJobResponse response = csvImportService.processCsvImport(entityId, userId, file, true, false);

        assertThat(response).isNotNull();
        assertThat(response.totalRows()).isEqualTo(2);
        assertThat(response.successCount()).isEqualTo(1);
        assertThat(response.failureCount()).isEqualTo(0);
        assertThat(response.status()).isEqualTo("COMPLETED");

        verify(journalService, times(1)).createJournal(eq(entityId), eq(userId), any(), eq(true));
        verify(auditLogService, times(1)).log(eq(entityId), eq(userId), eq("IMPORT_CSV"), eq("IMPORT_JOB"), eq(101L), anyString());
    }

    @Test
    @DisplayName("Toleransi parsial: Jurnal tidak seimbang dicatat sebagai error tanpa membatalkan jurnal lain")
    void processCsvImport_unbalancedGroup_recordedAsError() {
        Long entityId = 1L;
        Long userId = 1L;

        // JRN-001 tidak seimbang (Debit 500rb vs Kredit 400rb)
        String csvContent = "journal_ref,entry_date,description,account_code,debit,credit,memo\n" +
                "JRN-001,2026-11-15,Penjualan Salah,1101,500000.00,0.00,Kas\n" +
                "JRN-001,2026-11-15,Penjualan Salah,4101,0.00,400000.00,Pendapatan\n";

        MockMultipartFile file = new MockMultipartFile("file", "salah.csv", "text/csv", csvContent.getBytes(StandardCharsets.UTF_8));

        when(jdbcTemplate.query(anyString(), any(RowMapper.class), eq(entityId), anyString())).thenReturn(Collections.emptyList());

        Account kas = new Account(entityId, "1101", "Kas", AccountType.ASSET, NormalBalance.DEBIT, "CASH", null, true);
        Account pendapatan = new Account(entityId, "4101", "Pendapatan", AccountType.REVENUE, NormalBalance.CREDIT, "REVENUE", null, true);
        when(accountRepository.findByEntityIdOrderByCodeAsc(entityId)).thenReturn(List.of(kas, pendapatan));

        when(jdbcTemplate.queryForObject(anyString(), eq(Long.class), any(), any(), any(), any(), any(), any(), any(), any(), any())).thenReturn(102L);

        ImportJobResponse response = csvImportService.processCsvImport(entityId, userId, file, true, false);

        assertThat(response).isNotNull();
        assertThat(response.successCount()).isEqualTo(0);
        assertThat(response.failureCount()).isEqualTo(1);
        assertThat(response.errors()).hasSize(1);
        assertThat(response.errors().get(0).reason()).contains("tidak seimbang");

        // Journal service never invoked for invalid journal
        verify(journalService, never()).createJournal(any(), any(), any(), anyBoolean());
    }
}
