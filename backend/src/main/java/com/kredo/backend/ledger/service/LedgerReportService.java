package com.kredo.backend.ledger.service;

import com.kredo.backend.coa.domain.Account;
import com.kredo.backend.coa.domain.AccountType;
import com.kredo.backend.coa.domain.NormalBalance;
import com.kredo.backend.coa.repository.AccountRepository;
import com.kredo.backend.ledger.dto.GeneralLedgerResponse;
import com.kredo.backend.ledger.dto.GeneralLedgerResponse.GeneralLedgerLine;
import com.kredo.backend.ledger.dto.TrialBalanceResponse;
import com.kredo.backend.ledger.dto.TrialBalanceResponse.TrialBalanceRow;
import com.kredo.backend.period.domain.AccountingPeriod;
import com.kredo.backend.period.repository.AccountingPeriodRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.kredo.backend.ledger.dto.IncomeStatementResponse;
import com.kredo.backend.ledger.dto.IncomeStatementResponse.IncomeStatementRow;
import com.kredo.backend.ledger.dto.BalanceSheetResponse;
import com.kredo.backend.ledger.dto.BalanceSheetResponse.BalanceSheetRow;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LedgerReportService {

    private final JdbcTemplate jdbcTemplate;
    private final AccountRepository accountRepository;
    private final AccountingPeriodRepository accountingPeriodRepository;

    /**
     * Menghasilkan Neraca Saldo (Trial Balance) untuk satu entitas dan periode
     * tertentu.
     * Menggabungkan data akun master (hanya akun postable/daun) dengan akumulasi
     * saldo
     * dari tabel agregat account_balance.
     */
    public TrialBalanceResponse getTrialBalance(Long entityId, Long periodId) {
        AccountingPeriod period = accountingPeriodRepository.findByEntityIdAndId(entityId, periodId)
                .orElseThrow(
                        () -> new IllegalArgumentException("Periode akuntansi tidak ditemukan untuk entitas ini."));

        String sql = """
                SELECT
                    a.id AS account_id,
                    a.code AS account_code,
                    a.name AS account_name,
                    a.type AS account_type,
                    a.normal_balance AS normal_balance,
                    COALESCE(ab.debit_total, 0) AS debit_total,
                    COALESCE(ab.credit_total, 0) AS credit_total
                FROM account a
                LEFT JOIN account_balance ab ON ab.account_id = a.id AND ab.period_id = ?
                WHERE a.entity_id = ? AND a.is_postable = true
                ORDER BY a.code ASC
                """;

        List<TrialBalanceRow> rows = jdbcTemplate.query(sql, (rs, rowNum) -> {
            Long accId = rs.getLong("account_id");
            String code = rs.getString("account_code");
            String name = rs.getString("account_name");
            AccountType type = AccountType.valueOf(rs.getString("account_type"));
            NormalBalance normalBalance = NormalBalance.valueOf(rs.getString("normal_balance"));
            BigDecimal debitTotal = rs.getBigDecimal("debit_total");
            BigDecimal creditTotal = rs.getBigDecimal("credit_total");

            // Hitung saldo akhir sesuai saldo normal akuntansi
            BigDecimal endingBalance;
            if (normalBalance == NormalBalance.DEBIT) {
                endingBalance = debitTotal.subtract(creditTotal);
            } else {
                endingBalance = creditTotal.subtract(debitTotal);
            }

            return new TrialBalanceRow(
                    accId,
                    code,
                    name,
                    type,
                    normalBalance,
                    debitTotal,
                    creditTotal,
                    endingBalance);
        }, periodId, entityId);

        BigDecimal totalDebit = BigDecimal.ZERO;
        BigDecimal totalCredit = BigDecimal.ZERO;

        for (TrialBalanceRow row : rows) {
            totalDebit = totalDebit.add(row.debitTotal());
            totalCredit = totalCredit.add(row.creditTotal());
        }

        boolean isBalanced = totalDebit.compareTo(totalCredit) == 0;

        return new TrialBalanceResponse(
                entityId,
                period.getId(),
                period.getPeriodNo(),
                period.getStartDate().getYear(),
                rows,
                totalDebit,
                totalCredit,
                isBalanced);
    }

    /**
     * Menghasilkan Kartu Buku Besar (General Ledger) untuk satu akun pada periode
     * tertentu.
     * Mengambil seluruh baris jurnal POSTED dan menghitung Saldo Berjalan (Running
     * Balance) baris per baris.
     */
    public GeneralLedgerResponse getGeneralLedger(Long entityId, Long periodId, Long accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new IllegalArgumentException("Akun tidak ditemukan dengan ID: " + accountId));

        if (!account.getEntityId().equals(entityId)) {
            throw new IllegalArgumentException("Akun tidak termasuk dalam entitas ini.");
        }

        AccountingPeriod period = accountingPeriodRepository.findByEntityIdAndId(entityId, periodId)
                .orElseThrow(
                        () -> new IllegalArgumentException("Periode akuntansi tidak ditemukan untuk entitas ini."));

        String sql = """
                SELECT
                    jl.id AS line_id,
                    je.id AS journal_id,
                    je.journal_no AS journal_no,
                    je.entry_date AS entry_date,
                    je.description AS journal_description,
                    jl.memo AS line_memo,
                    jl.debit AS debit,
                    jl.credit AS credit
                FROM journal_line jl
                JOIN journal_entry je ON je.id = jl.entry_id
                WHERE jl.entity_id = ?
                  AND jl.account_id = ?
                  AND je.period_id = ?
                  AND je.status = 'POSTED'
                ORDER BY je.entry_date ASC, je.journal_no ASC, jl.line_no ASC
                """;

        BigDecimal beginningBalance = BigDecimal.ZERO; // Saldo awal periode berjalan
        BigDecimal currentBalance = beginningBalance;
        BigDecimal totalDebit = BigDecimal.ZERO;
        BigDecimal totalCredit = BigDecimal.ZERO;

        List<GeneralLedgerLine> lines = new ArrayList<>();

        List<RawLine> rawLines = jdbcTemplate.query(sql, (rs, rowNum) -> new RawLine(
                rs.getLong("line_id"),
                rs.getLong("journal_id"),
                rs.getString("journal_no"),
                rs.getDate("entry_date").toLocalDate(),
                rs.getString("journal_description"),
                rs.getString("line_memo"),
                rs.getBigDecimal("debit"),
                rs.getBigDecimal("credit")), entityId, accountId, periodId);

        for (RawLine r : rawLines) {
            totalDebit = totalDebit.add(r.debit());
            totalCredit = totalCredit.add(r.credit());

            if (account.getNormalBalance() == NormalBalance.DEBIT) {
                currentBalance = currentBalance.add(r.debit()).subtract(r.credit());
            } else {
                currentBalance = currentBalance.add(r.credit()).subtract(r.debit());
            }

            lines.add(new GeneralLedgerLine(
                    r.lineId(),
                    r.journalId(),
                    r.journalNo(),
                    r.entryDate(),
                    r.description(),
                    r.memo(),
                    r.debit(),
                    r.credit(),
                    currentBalance));
        }

        return new GeneralLedgerResponse(
                entityId,
                period.getId(),
                account.getId(),
                account.getCode(),
                account.getName(),
                account.getType(),
                account.getNormalBalance(),
                beginningBalance,
                lines,
                totalDebit,
                totalCredit,
                currentBalance);
    }

    private record RawLine(
            Long lineId,
            Long journalId,
            String journalNo,
            LocalDate entryDate,
            String description,
            String memo,
            BigDecimal debit,
            BigDecimal credit) {
    }

    /**
     * Menghasilkan Laporan Laba Rugi (Income Statement) periode berjalan.
     * Pendapatan (Credit - Debit) - Beban (Debit - Credit) = Laba Bersih.
     */
    public IncomeStatementResponse getIncomeStatement(Long entityId, Long periodId) {
        AccountingPeriod period = accountingPeriodRepository.findByEntityIdAndId(entityId, periodId)
                .orElseThrow(
                        () -> new IllegalArgumentException("Periode akuntansi tidak ditemukan untuk entitas ini."));

        String sql = """
                SELECT
                    a.id AS account_id,
                    a.code AS account_code,
                    a.name AS account_name,
                    a.type AS account_type,
                    a.report_group AS report_group,
                    COALESCE(ab.debit_total, 0) AS debit_total,
                    COALESCE(ab.credit_total, 0) AS credit_total
                FROM account a
                LEFT JOIN account_balance ab ON ab.account_id = a.id AND ab.period_id = ?
                WHERE a.entity_id = ? AND a.is_postable = true AND a.type IN ('REVENUE', 'EXPENSE')
                ORDER BY a.code ASC
                """;

        List<IncomeStatementRow> revenues = new ArrayList<>();
        List<IncomeStatementRow> expenses = new ArrayList<>();
        BigDecimal totalRevenue = BigDecimal.ZERO;
        BigDecimal totalExpense = BigDecimal.ZERO;

        List<RawIncomeRow> rows = jdbcTemplate.query(sql, (rs, rowNum) -> new RawIncomeRow(
                rs.getLong("account_id"),
                rs.getString("account_code"),
                rs.getString("account_name"),
                AccountType.valueOf(rs.getString("account_type")),
                rs.getString("report_group"),
                rs.getBigDecimal("debit_total"),
                rs.getBigDecimal("credit_total")), periodId, entityId);

        for (RawIncomeRow r : rows) {
            if (r.type() == AccountType.REVENUE) {
                BigDecimal netAmount = r.creditTotal().subtract(r.debitTotal());
                revenues.add(new IncomeStatementRow(r.accountId(), r.code(), r.name(), r.type(), r.reportGroup(),
                        netAmount));
                totalRevenue = totalRevenue.add(netAmount);
            } else if (r.type() == AccountType.EXPENSE) {
                BigDecimal netAmount = r.debitTotal().subtract(r.creditTotal());
                expenses.add(new IncomeStatementRow(r.accountId(), r.code(), r.name(), r.type(), r.reportGroup(),
                        netAmount));
                totalExpense = totalExpense.add(netAmount);
            }
        }

        BigDecimal netIncome = totalRevenue.subtract(totalExpense);
        boolean isProfitable = netIncome.compareTo(BigDecimal.ZERO) >= 0;

        return new IncomeStatementResponse(
                entityId,
                period.getId(),
                period.getPeriodNo(),
                period.getStartDate().getYear(),
                revenues,
                totalRevenue,
                expenses,
                totalExpense,
                netIncome,
                isProfitable);
    }

    /**
     * Menghasilkan Laporan Neraca (Balance Sheet).
     * Aset = Liabilitas + Ekuitas + Laba Periode Berjalan.
     */
    public BalanceSheetResponse getBalanceSheet(Long entityId, Long periodId) {
        AccountingPeriod period = accountingPeriodRepository.findByEntityIdAndId(entityId, periodId)
                .orElseThrow(
                        () -> new IllegalArgumentException("Periode akuntansi tidak ditemukan untuk entitas ini."));

        // 1. Ambil Laba Berjalan dari Laba Rugi
        IncomeStatementResponse incomeStatement = getIncomeStatement(entityId, periodId);
        BigDecimal currentPeriodEarnings = incomeStatement.netIncome();

        // 2. Query Akun Riil (ASSET, LIABILITY, EQUITY)
        String sql = """
                SELECT
                    a.id AS account_id,
                    a.code AS account_code,
                    a.name AS account_name,
                    a.type AS account_type,
                    a.report_group AS report_group,
                    COALESCE(ab.debit_total, 0) AS debit_total,
                    COALESCE(ab.credit_total, 0) AS credit_total
                FROM account a
                LEFT JOIN account_balance ab ON ab.account_id = a.id AND ab.period_id = ?
                WHERE a.entity_id = ? AND a.is_postable = true AND a.type IN ('ASSET', 'LIABILITY', 'EQUITY')
                ORDER BY a.code ASC
                """;

        List<BalanceSheetRow> assets = new ArrayList<>();
        List<BalanceSheetRow> liabilities = new ArrayList<>();
        List<BalanceSheetRow> equities = new ArrayList<>();

        BigDecimal totalAsset = BigDecimal.ZERO;
        BigDecimal totalLiability = BigDecimal.ZERO;
        BigDecimal totalEquity = BigDecimal.ZERO;

        List<RawIncomeRow> rows = jdbcTemplate.query(sql, (rs, rowNum) -> new RawIncomeRow(
                rs.getLong("account_id"),
                rs.getString("account_code"),
                rs.getString("account_name"),
                AccountType.valueOf(rs.getString("account_type")),
                rs.getString("report_group"),
                rs.getBigDecimal("debit_total"),
                rs.getBigDecimal("credit_total")), periodId, entityId);

        for (RawIncomeRow r : rows) {
            if (r.type() == AccountType.ASSET) {
                BigDecimal netAmount = r.debitTotal().subtract(r.creditTotal());
                assets.add(
                        new BalanceSheetRow(r.accountId(), r.code(), r.name(), r.type(), r.reportGroup(), netAmount));
                totalAsset = totalAsset.add(netAmount);
            } else if (r.type() == AccountType.LIABILITY) {
                BigDecimal netAmount = r.creditTotal().subtract(r.debitTotal());
                liabilities.add(
                        new BalanceSheetRow(r.accountId(), r.code(), r.name(), r.type(), r.reportGroup(), netAmount));
                totalLiability = totalLiability.add(netAmount);
            } else if (r.type() == AccountType.EQUITY) {
                BigDecimal netAmount = r.creditTotal().subtract(r.debitTotal());
                equities.add(
                        new BalanceSheetRow(r.accountId(), r.code(), r.name(), r.type(), r.reportGroup(), netAmount));
                totalEquity = totalEquity.add(netAmount);
            }
        }

        BigDecimal totalLiabilitiesAndEquity = totalLiability.add(totalEquity).add(currentPeriodEarnings);
        boolean isBalanced = totalAsset.compareTo(totalLiabilitiesAndEquity) == 0;

        return new BalanceSheetResponse(
                entityId,
                period.getId(),
                period.getPeriodNo(),
                period.getStartDate().getYear(),
                assets,
                totalAsset,
                liabilities,
                totalLiability,
                equities,
                totalEquity,
                currentPeriodEarnings,
                totalLiabilitiesAndEquity,
                isBalanced);
    }

    private record RawIncomeRow(
            Long accountId,
            String code,
            String name,
            AccountType type,
            String reportGroup,
            BigDecimal debitTotal,
            BigDecimal creditTotal) {
    }
}