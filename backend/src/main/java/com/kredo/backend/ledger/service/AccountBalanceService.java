package com.kredo.backend.ledger.service;

import com.kredo.backend.journal.domain.JournalEntry;
import com.kredo.backend.journal.domain.JournalLine;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Map;
import java.util.TreeMap;

@Service
public class AccountBalanceService {

    private final JdbcTemplate jdbcTemplate;

    public AccountBalanceService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Helper internal untuk menampung agregasi mutasi per akun dalam satu jurnal.
     */
    private static class TurnoverAccumulator {
        BigDecimal debit = BigDecimal.ZERO;
        BigDecimal credit = BigDecimal.ZERO;
        long lineCount = 0;
    }

    /**
     * Memperbarui tabel agregat account_balance saat jurnal di-POSTED.
     * Mengikuti panduan PRD 12.1:
     * 1. Agregasi baris jurnal per accountId.
     * 2. Urutkan berdasarkan accountId (menggunakan TreeMap) untuk mencegah
     * deadlock.
     * 3. Jalankan operasi PostgreSQL UPSERT yang atomik.
     */
    @Transactional
    public void updateBalancesForJournal(JournalEntry journal) {
        // 1. Agregasi baris jurnal berdasarkan account_id
        // TreeMap otomatis mengurutkan key (accountId) dari nilai terkecil ke terbesar!
        Map<Long, TurnoverAccumulator> turnoverMap = new TreeMap<>();

        for (JournalLine line : journal.getLines()) {
            TurnoverAccumulator acc = turnoverMap.computeIfAbsent(line.getAccountId(), k -> new TurnoverAccumulator());
            acc.debit = acc.debit.add(line.getDebit());
            acc.credit = acc.credit.add(line.getCredit());
            acc.lineCount++;
        }

        // 2. Query PostgreSQL UPSERT atomik (INSERT ... ON CONFLICT DO UPDATE)
        String sqlUpsert = """
                    INSERT INTO account_balance (entity_id, period_id, account_id, debit_total, credit_total, line_count)
                    VALUES (?, ?, ?, ?, ?, ?)
                    ON CONFLICT (account_id, period_id)
                    DO UPDATE SET
                        debit_total  = account_balance.debit_total  + EXCLUDED.debit_total,
                        credit_total = account_balance.credit_total + EXCLUDED.credit_total,
                        line_count   = account_balance.line_count   + EXCLUDED.line_count
                """;

        // 3. Eksekusi penyimpanan saldo berurutan
        for (Map.Entry<Long, TurnoverAccumulator> entry : turnoverMap.entrySet()) {
            Long accountId = entry.getKey();
            TurnoverAccumulator turnover = entry.getValue();

            jdbcTemplate.update(
                    sqlUpsert,
                    journal.getEntityId(),
                    journal.getPeriodId(),
                    accountId,
                    turnover.debit,
                    turnover.credit,
                    turnover.lineCount);
        }
    }

    /**
     * FR-LED-04: Rekalkulasi Saldo Seluruh Akun untuk satu periode dari tabel
     * journal_line.
     * Berguna jika butuh sinkronisasi ulang atau audit pemulihan.
     */
    @Transactional
    public void recalculatePeriodBalances(Long entityId, Long periodId) {
        // Hapus snapshot lama
        jdbcTemplate.update("DELETE FROM account_balance WHERE entity_id = ? AND period_id = ?", entityId, periodId);

        // Hitung ulang dan insert kembali dari seluruh jurnal yang POSTED
        String sqlRecalc = """
                    INSERT INTO account_balance (entity_id, period_id, account_id, debit_total, credit_total, line_count)
                    SELECT
                        je.entity_id,
                        je.period_id,
                        jl.account_id,
                        SUM(jl.debit),
                        SUM(jl.credit),
                        COUNT(jl.id)
                    FROM journal_entry je
                    JOIN journal_line jl ON jl.entry_id = je.id
                    WHERE je.entity_id = ? AND je.period_id = ? AND je.status = 'POSTED'
                    GROUP BY je.entity_id, je.period_id, jl.account_id
                """;
        jdbcTemplate.update(sqlRecalc, entityId, periodId);
    }
}