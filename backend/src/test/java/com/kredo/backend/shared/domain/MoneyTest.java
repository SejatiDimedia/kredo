package com.kredo.backend.shared.domain;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class MoneyTest {

    @Test
    @DisplayName("0.1 + 0.2 harus tepat 0.3000 (Bebas dari bug floating-point double)")
    void testAntiFloatingPointDrift() {
        Money a = Money.of("0.1");
        Money b = Money.of("0.2");
        Money result = a.plus(b);

        assertThat(result).isEqualTo(Money.of("0.3"));
        assertThat(result.amount()).isEqualByComparingTo("0.3000");
    }

    @Test
    @DisplayName("Operasi penjumlahan dan pengurangan uang harus akurat")
    void testPlusAndMinus() {
        Money m1 = Money.of("100000000.00");
        Money m2 = Money.of("25000000.00");

        assertThat(m1.plus(m2)).isEqualTo(Money.of("125000000.00"));
        assertThat(m1.minus(m2)).isEqualTo(Money.of("75000000.00"));
    }

    @Test
    @DisplayName("Pengecekan isZero, isPositive, dan isNegative")
    void testComparisons() {
        assertThat(Money.zero().isZero()).isTrue();
        assertThat(Money.of("100.00").isPositive()).isTrue();
        assertThat(Money.of("-50.00").isNegative()).isTrue();
    }

    @Test
    @DisplayName("Tidak boleh membuat Money dengan nilai null")
    void testNullValidation() {
        assertThatThrownBy(() -> new Money(null))
                .isInstanceOf(NullPointerException.class)
                .hasMessageContaining("tidak boleh null");
    }
}