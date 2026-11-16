package com.kredo.backend.journal.repository;

import com.kredo.backend.journal.domain.JournalEntry;
import com.kredo.backend.journal.domain.JournalStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JournalEntryRepository extends JpaRepository<JournalEntry, Long> {

    // Ambil jurnal beserta baris-barisnya (lines) dalam 1 query SQL (JOIN) bebas
    // N+1 & Lazy Exception
    @EntityGraph(attributePaths = { "lines" })
    List<JournalEntry> findByEntityIdOrderByEntryDateDescIdDesc(Long entityId);

    @EntityGraph(attributePaths = { "lines" })
    List<JournalEntry> findByEntityIdAndStatusOrderByEntryDateDesc(Long entityId, JournalStatus status);

    @EntityGraph(attributePaths = { "lines" })
    Optional<JournalEntry> findByEntityIdAndJournalNo(Long entityId, String journalNo);

    @EntityGraph(attributePaths = { "lines" })
    Optional<JournalEntry> findByEntityIdAndId(Long entityId, Long id);
}