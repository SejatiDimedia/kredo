package com.kredo.backend.journal.repository;

import com.kredo.backend.journal.domain.JournalEntry;
import com.kredo.backend.journal.domain.JournalStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JournalEntryRepository extends JpaRepository<JournalEntry, Long> {

    // Ambil semua jurnal milik entitas tertentu, diurutkan dari transaksi terbaru
    List<JournalEntry> findByEntityIdOrderByEntryDateDescIdDesc(Long entityId);

    // Filter jurnal berdasarkan status (misal hanya yang POSTED atau DRAFT)
    List<JournalEntry> findByEntityIdAndStatusOrderByEntryDateDesc(Long entityId, JournalStatus status);

    // Cari jurnal berdasarkan nomor resmi (misal: "JV-PTM-2026-000001")
    Optional<JournalEntry> findByEntityIdAndJournalNo(Long entityId, String journalNo);
}