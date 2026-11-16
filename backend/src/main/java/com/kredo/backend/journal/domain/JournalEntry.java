package com.kredo.backend.journal.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Master Header transaksi jurnal akuntansi.
 * Memetakan tabel "journal_entry" di PostgreSQL.
 */
@Entity
@Table(name = "journal_entry")
@Getter
@Setter
@NoArgsConstructor
public class JournalEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "entity_id", nullable = false)
    private Long entityId;

    @Column(name = "period_id", nullable = false)
    private Long periodId;

    @Column(name = "journal_no", length = 40)
    private String journalNo; // Bernilai null saat DRAFT, dialokasikan saat POSTED

    @Column(name = "entry_date", nullable = false)
    private LocalDate entryDate;

    @Column(name = "description", length = 500, nullable = false)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "source", length = 12, nullable = false)
    private JournalSource source = JournalSource.MANUAL;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 10, nullable = false)
    private JournalStatus status = JournalStatus.DRAFT;

    @Column(name = "reversal_of_id")
    private Long reversalOfId;

    @Column(name = "total_amount", precision = 19, scale = 4, nullable = false)
    private BigDecimal totalAmount = BigDecimal.ZERO;

    @Column(name = "created_by", nullable = false)
    private Long createdBy;

    @Column(name = "submitted_by")
    private Long submittedBy;

    @Column(name = "approved_by")
    private Long approvedBy;

    @Column(name = "posted_by")
    private Long postedBy;

    @Column(name = "posted_at")
    private OffsetDateTime postedAt;

    @Version
    @Column(name = "version", nullable = false)
    private Long version = 0L; // Optimistic Locking

    // Relasi One-to-Many: 1 Jurnal memiliki banyak baris.
    // CascadeType.ALL: Saat Header disimpan/dihapus, baris-barisnya otomatis ikut
    // tersimpan!
    @OneToMany(mappedBy = "journalEntry", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("lineNo ASC")
    private List<JournalLine> lines = new ArrayList<>();

    public JournalEntry(Long entityId, Long periodId, LocalDate entryDate, String description,
            JournalSource source, Long createdBy) {
        this.entityId = entityId;
        this.periodId = periodId;
        this.entryDate = entryDate;
        this.description = description;
        this.source = source != null ? source : JournalSource.MANUAL;
        this.status = JournalStatus.DRAFT;
        this.createdBy = createdBy;
    }

    /**
     * Helper method penting untuk menambahkan baris jurnal secara sinkron.
     */
    public void addLine(JournalLine line) {
        lines.add(line);
        line.setJournalEntry(this);
    }
}