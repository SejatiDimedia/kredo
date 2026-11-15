package com.kredo.backend.period.domain;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.OffsetDateTime;

/**
 * Entitas Periode Akuntansi (Tabel accounting_period).
 * Mewakili satu bulan buku akuntansi dalam satu tahun fiskal.
 */
@Entity
@Table(name = "accounting_period")
public class AccountingPeriod {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "fiscal_year_id", nullable = false)
    private Long fiscalYearId;

    @Column(name = "entity_id", nullable = false)
    private Long entityId;

    @Column(name = "period_no", nullable = false)
    private Integer periodNo; // 1 s/d 12 (atau 13 untuk periode penyesuaian audit)

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private PeriodStatus status = PeriodStatus.OPEN;

    @Column(name = "closed_at")
    private OffsetDateTime closedAt;

    @Column(name = "closed_by")
    private Long closedBy;

    protected AccountingPeriod() {
        // Diperlukan oleh JPA
    }

    public AccountingPeriod(Long entityId, Long fiscalYearId, Integer periodNo, LocalDate startDate,
            LocalDate endDate) {
        this.entityId = entityId;
        this.fiscalYearId = fiscalYearId;
        this.periodNo = periodNo;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = PeriodStatus.OPEN;
    }

    // Helper method bisnis
    public boolean isOpen() {
        return this.status == PeriodStatus.OPEN;
    }

    // Getters & Setters
    public Long getId() {
        return id;
    }

    public Long getFiscalYearId() {
        return fiscalYearId;
    }

    public Long getEntityId() {
        return entityId;
    }

    public Integer getPeriodNo() {
        return periodNo;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public PeriodStatus getStatus() {
        return status;
    }

    public void setStatus(PeriodStatus status) {
        this.status = status;
    }

    public OffsetDateTime getClosedAt() {
        return closedAt;
    }

    public void setClosedAt(OffsetDateTime closedAt) {
        this.closedAt = closedAt;
    }

    public Long getClosedBy() {
        return closedBy;
    }

    public void setClosedBy(Long closedBy) {
        this.closedBy = closedBy;
    }
}