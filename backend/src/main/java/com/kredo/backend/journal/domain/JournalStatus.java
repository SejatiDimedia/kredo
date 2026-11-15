package com.kredo.backend.journal.domain;

/**
 * State Machine status jurnal akuntansi (PRD Bab 9):
 * DRAFT -> SUBMITTED -> APPROVED -> POSTED (atau CANCELLED)
 */
public enum JournalStatus {
    DRAFT,
    SUBMITTED,
    APPROVED,
    POSTED,
    CANCELLED
}