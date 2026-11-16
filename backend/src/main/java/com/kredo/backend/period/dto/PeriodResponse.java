package com.kredo.backend.period.dto;

import com.kredo.backend.period.domain.PeriodStatus;

import java.time.LocalDate;
import java.time.OffsetDateTime;

public record PeriodResponse(
        Long id,
        Long entityId,
        int periodNo,
        int fiscalYear,
        String name,
        LocalDate startDate,
        LocalDate endDate,
        PeriodStatus status,
        OffsetDateTime closedAt,
        Long closedBy) {
}