package com.kredo.backend.shared.domain;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Objects;

/**
 * Value Object untuk merepresentasikan nilai moneter di Kredo.
 * Didesain Immutable menggunakan fitur Java 17 Record.
 * Skala 4 desimal internal (NUMERIC 19,4) dengan pembulatan Banker's Rounding
 * (HALF_EVEN).
 */
public record Money(BigDecimal amount) implements Comparable<Money> {

    public static final int SCALE = 4;
    public static final RoundingMode ROUNDING = RoundingMode.HALF_EVEN;
    public static final Money ZERO = new Money(BigDecimal.ZERO.setScale(SCALE, ROUNDING));

    // Constructor Compact Java Record: Melakukan validasi & pembulatan otomatis
    public Money {
        Objects.requireNonNull(amount, "Nilai amount tidak boleh null");
        amount = amount.setScale(SCALE, ROUNDING);
    }

    public static Money of(String value) {
        return new Money(new BigDecimal(value));
    }

    public static Money of(long value) {
        return new Money(BigDecimal.valueOf(value));
    }

    public static Money of(BigDecimal value) {
        return new Money(value);
    }

    public static Money zero() {
        return ZERO;
    }

    public Money plus(Money other) {
        Objects.requireNonNull(other, "Money penambah tidak boleh null");
        return new Money(this.amount.add(other.amount));
    }

    public Money minus(Money other) {
        Objects.requireNonNull(other, "Money pengurang tidak boleh null");
        return new Money(this.amount.subtract(other.amount));
    }

    public boolean isZero() {
        return this.amount.compareTo(BigDecimal.ZERO) == 0;
    }

    public boolean isPositive() {
        return this.amount.compareTo(BigDecimal.ZERO) > 0;
    }

    public boolean isNegative() {
        return this.amount.compareTo(BigDecimal.ZERO) < 0;
    }

    @Override
    public int compareTo(Money other) {
        return this.amount.compareTo(other.amount);
    }

    @Override
    public String toString() {
        return amount.toPlainString();
    }
}