package com.kredo.backend.journal.domain;

/**
 * Siklus hidup / State Machine status jurnal akuntansi:
 * DRAFT -> SUBMITTED -> APPROVED -> POSTED (atau CANCELLED)
 */
public enum JournalStatus {
    DRAFT,
    SUBMITTED,
    APPROVED,
    POSTED,
    CANCELLED
}