package com.kredo.backend.coa.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * JPA Entity yang memetakan tabel "account" di PostgreSQL.
 */
@Entity
@Table(name = "account")
@Getter
@Setter
@NoArgsConstructor
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "entity_id", nullable = false)
    private Long entityId;

    @Column(name = "code", length = 20, nullable = false)
    private String code;

    @Column(name = "name", length = 150, nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", length = 10, nullable = false)
    private AccountType type;

    @Enumerated(EnumType.STRING)
    @Column(name = "normal_balance", length = 6, nullable = false)
    private NormalBalance normalBalance;

    @Column(name = "report_group", length = 30, nullable = false)
    private String reportGroup;

    @Column(name = "parent_id")
    private Long parentId;

    @Column(name = "is_postable", nullable = false)
    private boolean isPostable = true;

    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;

    @Version
    @Column(name = "version", nullable = false)
    private Long version = 0L;

    public Account(Long entityId, String code, String name, AccountType type,
            NormalBalance normalBalance, String reportGroup, Long parentId, boolean isPostable) {
        this.entityId = entityId;
        this.code = code;
        this.name = name;
        this.type = type;
        this.normalBalance = normalBalance;
        this.reportGroup = reportGroup;
        this.parentId = parentId;
        this.isPostable = isPostable;
        this.isActive = true;
    }
}