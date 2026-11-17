package com.kredo.backend.journal.service;

import com.kredo.backend.audit.service.AuditLogService;
import com.kredo.backend.coa.repository.AccountRepository;
import com.kredo.backend.journal.domain.JournalEntry;
import com.kredo.backend.journal.domain.JournalSource;
import com.kredo.backend.journal.domain.JournalStatus;
import com.kredo.backend.journal.dto.CreateJournalLineRequest;
import com.kredo.backend.journal.dto.CreateJournalRequest;
import com.kredo.backend.journal.dto.JournalResponse;
import com.kredo.backend.journal.repository.JournalEntryRepository;
import com.kredo.backend.ledger.service.AccountBalanceService;
import com.kredo.backend.period.repository.AccountingPeriodRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.jdbc.core.JdbcTemplate;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

class JournalServiceTest {

    private JournalEntryRepository journalEntryRepository;
    private AccountRepository accountRepository;
    private AccountingPeriodRepository accountingPeriodRepository;
    private AccountBalanceService accountBalanceService;
    private JdbcTemplate jdbcTemplate;
    private AuditLogService auditLogService;

    private JournalService journalService;

    @BeforeEach
    void setUp() {
        journalEntryRepository = mock(JournalEntryRepository.class);
        accountRepository = mock(AccountRepository.class);
        accountingPeriodRepository = mock(AccountingPeriodRepository.class);
        accountBalanceService = mock(AccountBalanceService.class);
        jdbcTemplate = mock(JdbcTemplate.class);
        auditLogService = mock(AuditLogService.class);

        journalService = new JournalService(
                journalEntryRepository,
                accountRepository,
                accountingPeriodRepository,
                accountBalanceService,
                jdbcTemplate,
                auditLogService
        );
    }

    @Test
    @DisplayName("Maker tidak boleh menyetujui jurnal buatannya sendiri")
    void makerChecker_cannotApproveOwnCreatedJournal() {
        Long entityId = 1L;
        Long journalId = 100L;
        Long makerId = 1L;

        JournalEntry journal = new JournalEntry(entityId, 11L, LocalDate.now(), "Beli Alat Tulis", JournalSource.MANUAL, makerId);
        journal.setStatus(JournalStatus.SUBMITTED);
        journal.setSubmittedBy(makerId);

        when(journalEntryRepository.findByEntityIdAndId(entityId, journalId)).thenReturn(Optional.of(journal));

        // Maker (ID 1) mencoba menyetujui jurnalnya sendiri
        assertThatThrownBy(() -> journalService.approveJournal(entityId, journalId, makerId, false))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Pelanggaran Maker-Checker");
    }

    @Test
    @DisplayName("Checker yang berbeda orang berhasil menyetujui jurnal")
    void makerChecker_differentCheckerCanApprove() {
        Long entityId = 1L;
        Long journalId = 100L;
        Long makerId = 1L;
        Long checkerId = 2L;

        JournalEntry journal = new JournalEntry(entityId, 11L, LocalDate.now(), "Beli Alat Tulis", JournalSource.MANUAL, makerId);
        journal.setStatus(JournalStatus.SUBMITTED);
        journal.setSubmittedBy(makerId);

        when(journalEntryRepository.findByEntityIdAndId(entityId, journalId)).thenReturn(Optional.of(journal));
        when(journalEntryRepository.save(any(JournalEntry.class))).thenAnswer(invocation -> invocation.getArgument(0));

        JournalResponse response = journalService.approveJournal(entityId, journalId, checkerId, false);

        assertThat(response.status()).isEqualTo(JournalStatus.APPROVED);
        assertThat(journal.getApprovedBy()).isEqualTo(checkerId);
        verify(auditLogService, times(1)).log(eq(entityId), eq(checkerId), eq("APPROVE_JOURNAL"), any(), any(), any());
    }

    @Test
    @DisplayName("Penolakan draf jurnal jika Total Debit != Total Kredit")
    void createJournal_unbalancedLines_throwsException() {
        CreateJournalRequest unbalancedRequest = new CreateJournalRequest(
                LocalDate.now(),
                "Transaksi Tidak Seimbang",
                11L,
                JournalSource.MANUAL,
                List.of(
                        new CreateJournalLineRequest(1101L, new BigDecimal("100000.00"), BigDecimal.ZERO, "Kas"),
                        new CreateJournalLineRequest(4101L, BigDecimal.ZERO, new BigDecimal("90000.00"), "Pendapatan") // Selisih 10.000!
                )
        );

        assertThatThrownBy(() -> journalService.createJournal(1L, 1L, unbalancedRequest, false))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Jurnal tidak seimbang");
    }

    @Test
    @DisplayName("Jurnal yang belum POSTED tidak boleh dibalik (Reversal)")
    void reverseJournal_unpostedJournal_throwsException() {
        Long entityId = 1L;
        Long journalId = 100L;

        JournalEntry draftJournal = new JournalEntry(entityId, 11L, LocalDate.now(), "Draf", JournalSource.MANUAL, 1L);
        draftJournal.setStatus(JournalStatus.DRAFT);

        when(journalEntryRepository.findByEntityIdAndId(entityId, journalId)).thenReturn(Optional.of(draftJournal));

        assertThatThrownBy(() -> journalService.reverseJournal(entityId, journalId, "Koreksi"))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Hanya jurnal berstatus POSTED yang dapat dibalik");
    }

    @Test
    @DisplayName("Jurnal yang sudah pernah dibalik tidak boleh dibalik dua kali")
    void reverseJournal_alreadyReversed_throwsException() {
        Long entityId = 1L;
        Long journalId = 100L;

        JournalEntry postedJournal = new JournalEntry(entityId, 11L, LocalDate.now(), "Posting", JournalSource.MANUAL, 1L);
        postedJournal.setStatus(JournalStatus.POSTED);
        postedJournal.setReversalOfId(999L); // Sudah ada pasangan pembaliknya!

        when(journalEntryRepository.findByEntityIdAndId(entityId, journalId)).thenReturn(Optional.of(postedJournal));

        assertThatThrownBy(() -> journalService.reverseJournal(entityId, journalId, "Koreksi lagi"))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Jurnal ini sudah pernah dibalik sebelumnya");
    }

    @Test
    @DisplayName("Jurnal bertipe REVERSAL tidak boleh dibalik lagi (Mencegah rantai pembalikan)")
    void reverseJournal_reversalSourceCannotBeReversedAgain() {
        Long entityId = 1L;
        Long journalId = 100L;

        JournalEntry reversalJournal = new JournalEntry(entityId, 11L, LocalDate.now(), "Pembalik", JournalSource.REVERSAL, 1L);
        reversalJournal.setStatus(JournalStatus.POSTED);

        when(journalEntryRepository.findByEntityIdAndId(entityId, journalId)).thenReturn(Optional.of(reversalJournal));

        assertThatThrownBy(() -> journalService.reverseJournal(entityId, journalId, "Koreksi pembalik"))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Jurnal pembalik tidak dapat dibalik kembali");
    }
}
