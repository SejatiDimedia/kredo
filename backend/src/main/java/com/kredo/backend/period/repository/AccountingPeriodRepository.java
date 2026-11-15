package com.kredo.backend.period.repository;

import com.kredo.backend.period.domain.AccountingPeriod;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AccountingPeriodRepository extends JpaRepository<AccountingPeriod, Long> {

    // Cari periode spesifik berdasarkan ID dan ID Entitas
    Optional<AccountingPeriod> findByEntityIdAndId(Long entityId, Long id);

    // Ambil seluruh daftar periode suatu entitas (diurutkan dari bulan pertama)
    List<AccountingPeriod> findByEntityIdOrderByStartDateAsc(Long entityId);

    /**
     * Query Cerdas: Mencari periode akuntansi yang menaungi suatu tanggal
     * transaksi.
     * Contoh: Tanggal '2026-11-15' akan otomatis menemukan Periode 11 (2026-11-01
     * s/d 2026-11-30).
     */
    @Query("SELECT p FROM AccountingPeriod p WHERE p.entityId = :entityId AND :date BETWEEN p.startDate AND p.endDate")
    Optional<AccountingPeriod> findPeriodByDate(@Param("entityId") Long entityId, @Param("date") LocalDate date);
}