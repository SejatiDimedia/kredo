package com.kredo.backend.journal.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

/**
 * Detail baris jurnal (Double-Entry).
 * Memetakan tabel "journal_line" di PostgreSQL.
 */
@Entity
@Table(name = "journal_line")
@Getter
@Setter
@NoArgsConstructor
public class JournalLine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relasi Many-to-One: Banyak baris jurnal dimiliki oleh 1 Header Jurnal
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "entry_id", nullable = false)
    private JournalEntry journalEntry;

    @Column(name = "entity_id", nullable = false)
    private Long entityId;

    @Column(name = "line_no", nullable = false)
    private int lineNo;

    @Column(name = "account_id", nullable = false)
    private Long accountId;

    @Column(name = "debit", precision = 19, scale = 4, nullable = false)
    private BigDecimal debit = BigDecimal.ZERO;

    @Column(name = "credit", precision = 19, scale = 4, nullable = false)
    private BigDecimal credit = BigDecimal.ZERO;

    @Column(name = "memo", length = 255)
    private String memo;

    public JournalLine(Long entityId, int lineNo, Long accountId, BigDecimal debit, BigDecimal credit, String memo) {
        this.entityId = entityId;
        this.lineNo = lineNo;
        this.accountId = accountId;
        this.debit = debit != null ? debit : BigDecimal.ZERO;
        this.credit = credit != null ? credit : BigDecimal.ZERO;
        this.memo = memo;
    }
}