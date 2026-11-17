import * as React from "react"
import { useNavigate } from "react-router-dom"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { MoneyText } from "@/components/shared/MoneyText"
import {
  Download,
  FileSpreadsheet,
  Printer,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Loader2,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Scale,
} from "lucide-react"
import { apiFetch } from "@/lib/api"
import type {
  TrialBalanceResponse,
  IncomeStatementResponse,
  BalanceSheetResponse,
} from "../types"

export function ReportsPage() {
  const navigate = useNavigate()
  const [trialBalance, setTrialBalance] = React.useState<TrialBalanceResponse | null>(null)
  const [incomeStatement, setIncomeStatement] = React.useState<IncomeStatementResponse | null>(null)
  const [balanceSheet, setBalanceSheet] = React.useState<BalanceSheetResponse | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [tbError, setTbError] = React.useState<string | null>(null)
  const [isError, setIsError] = React.useState<string | null>(null)
  const [bsError, setBsError] = React.useState<string | null>(null)

  const loadAllReports = React.useCallback(async () => {
    try {
      setIsLoading(true)
      setTbError(null)
      setIsError(null)
      setBsError(null)

      const [tbResult, isResult, bsResult] = await Promise.allSettled([
        apiFetch<TrialBalanceResponse>("/reports/trial-balance?entityId=1&periodId=11"),
        apiFetch<IncomeStatementResponse>("/reports/income-statement?entityId=1&periodId=11"),
        apiFetch<BalanceSheetResponse>("/reports/balance-sheet?entityId=1&periodId=11"),
      ])

      if (tbResult.status === "fulfilled") {
        setTrialBalance(tbResult.value)
      } else {
        const msg = tbResult.reason instanceof Error ? tbResult.reason.message : "Gagal memuat Neraca Saldo"
        setTbError(msg)
      }

      if (isResult.status === "fulfilled") {
        setIncomeStatement(isResult.value)
      } else {
        const msg = isResult.reason instanceof Error ? isResult.reason.message : "Gagal memuat Laba Rugi"
        setIsError(msg)
      }

      if (bsResult.status === "fulfilled") {
        setBalanceSheet(bsResult.value)
      } else {
        const msg = bsResult.reason instanceof Error ? bsResult.reason.message : "Gagal memuat Neraca"
        setBsError(msg)
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    loadAllReports()
  }, [loadAllReports])

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Breadcrumb Navigation */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Buku Besar</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Laporan Keuangan Enterprise</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-heading">
            Laporan Keuangan
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Snapshot transaksi konsisten. Neraca Saldo, Laba Rugi, dan Neraca Keuangan.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={loadAllReports}
            disabled={isLoading}
            className="text-xs gap-1.5"
          >
            <RefreshCw className={`size-3.5 ${isLoading ? "animate-spin" : ""}`} />
            Segarkan
          </Button>
          <Button size="sm" variant="secondary" onClick={() => navigate("/reports/general-ledger")}>
            <BookOpen className="size-3.5 mr-1.5 text-primary" /> Buku Besar Per Akun
          </Button>
          <Button size="sm" variant="outline">
            <Download className="size-3.5 mr-1.5" /> CSV
          </Button>
          <Button size="sm" variant="outline">
            <FileSpreadsheet className="size-3.5 mr-1.5" /> Excel
          </Button>
          <Button size="sm" onClick={() => window.print()}>
            <Printer className="size-3.5 mr-1.5" /> Cetak PDF
          </Button>
        </div>
      </div>

      <Tabs defaultValue="trial-balance" className="w-full space-y-4">
        <TabsList className="bg-muted/60 p-1">
          <TabsTrigger value="trial-balance" className="text-xs cursor-pointer">
            Neraca Saldo (Trial Balance)
          </TabsTrigger>
          <TabsTrigger value="income-statement" className="text-xs cursor-pointer">
            Laba Rugi (Income Statement)
          </TabsTrigger>
          <TabsTrigger value="balance-sheet" className="text-xs cursor-pointer">
            Neraca (Balance Sheet)
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: NERACA SALDO */}
        <TabsContent value="trial-balance">
          <Card>
            <CardHeader className="border-b border-border/30 pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold">Neraca Saldo (Trial Balance)</CardTitle>
                  <CardDescription className="text-xs">
                    Periode November 2026 • Status Keseimbangan Mutasi Seluruh Akun Postable
                  </CardDescription>
                </div>
                {trialBalance && (
                  <Badge
                    variant="outline"
                    className={
                      trialBalance.isBalanced
                        ? "border-emerald-500/40 text-emerald-700 dark:text-emerald-400 font-semibold"
                        : "border-destructive text-destructive font-semibold"
                    }
                  >
                    {trialBalance.isBalanced ? "SEIMBANG" : "TIDAK SEIMBANG"}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-border/30 bg-muted/10 hover:bg-muted/10">
                    <TableHead className="w-[120px] pl-6 font-semibold">Kode Akun</TableHead>
                    <TableHead className="font-semibold">Nama Akun</TableHead>
                    <TableHead className="w-[160px] text-right font-semibold">Mutasi Debit</TableHead>
                    <TableHead className="w-[160px] text-right font-semibold">Mutasi Kredit</TableHead>
                    <TableHead className="w-[160px] text-right pr-6 font-semibold">Saldo Akhir</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-12 text-center text-muted-foreground">
                        <div className="flex items-center justify-center gap-2 text-xs">
                          <Loader2 className="size-4 animate-spin text-primary" />
                          <span>Menghitung Neraca Saldo real-time...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : tbError ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-8 text-center text-destructive text-xs">
                        <div className="flex flex-col items-center justify-center gap-1.5">
                          <AlertTriangle className="size-5 text-destructive" />
                          <span className="font-semibold">{tbError}</span>
                          <span className="text-[11px] text-muted-foreground">
                            Pastikan backend Spring Boot aktif di <code>http://localhost:8080</code>
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : !trialBalance || trialBalance.rows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-8 text-center text-muted-foreground text-xs">
                        Belum ada akun atau transaksi pada periode ini.
                      </TableCell>
                    </TableRow>
                  ) : (
                    <>
                      {trialBalance.rows.map((row) => (
                        <TableRow key={row.accountId} className="border-b border-border/20 hover:bg-muted/10">
                          <TableCell className="font-mono pl-6 text-primary font-bold text-xs py-3">
                            <button
                              type="button"
                              onClick={() => navigate(`/reports/general-ledger?accountId=${row.accountId}`)}
                              className="hover:underline text-primary cursor-pointer text-left font-mono"
                              title="Buka Buku Besar Akun ini"
                            >
                              {row.accountCode}
                            </button>
                          </TableCell>
                          <TableCell className="font-medium text-foreground text-xs py-3">
                            {row.accountName}
                          </TableCell>
                          <TableCell className="text-right text-xs font-mono py-3">
                            <MoneyText amount={row.debitTotal} />
                          </TableCell>
                          <TableCell className="text-right text-xs font-mono py-3">
                            <MoneyText amount={row.creditTotal} />
                          </TableCell>
                          <TableCell className="text-right pr-6 font-bold text-xs font-mono py-3">
                            <MoneyText amount={row.endingBalance} />
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="border-t-2 border-border/60 bg-muted/20 font-bold">
                        <TableCell colSpan={2} className="pl-6 text-foreground text-xs py-3">
                          TOTAL KESEIMBANGAN
                        </TableCell>
                        <TableCell className="text-right text-xs font-mono py-3">
                          <MoneyText amount={trialBalance.totalDebit} className="font-bold text-foreground" />
                        </TableCell>
                        <TableCell className="text-right text-xs font-mono py-3">
                          <MoneyText amount={trialBalance.totalCredit} className="font-bold text-foreground" />
                        </TableCell>
                        <TableCell className="text-right pr-6 text-xs py-3">
                          {trialBalance.isBalanced ? (
                            <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-extrabold">
                              <CheckCircle2 className="size-3.5" /> SEIMBANG
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-destructive font-extrabold">
                              <AlertTriangle className="size-3.5" /> TIDAK SEIMBANG
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    </>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: LABA RUGI (INCOME STATEMENT) */}
        <TabsContent value="income-statement" className="space-y-6">
          {isError ? (
            <Card>
              <CardContent className="py-12 text-center text-destructive text-xs">
                <div className="flex flex-col items-center justify-center gap-1.5 max-w-md mx-auto">
                  <AlertTriangle className="size-6 text-destructive" />
                  <span className="font-semibold text-sm">{isError}</span>
                  <span className="text-[11px] text-muted-foreground">
                    Gagal memuat data dari <code>/api/v1/reports/income-statement</code>. Pastikan backend Spring Boot sedang berjalan dan controller telah di-restart.
                  </span>
                  <Button variant="outline" size="sm" onClick={loadAllReports} className="mt-3 text-xs gap-1.5">
                    <RefreshCw className="size-3.5" /> Coba Muat Ulang
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Summary Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Total Pendapatan Usaha</span>
                  <TrendingUp className="size-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="font-mono text-xl font-bold text-foreground mt-2">
                  <MoneyText amount={incomeStatement?.totalRevenue || 0} />
                </div>
                <div className="text-[11px] text-muted-foreground mt-1">
                  Akumulasi penjualan produk & jasa
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Total Beban Operasional</span>
                  <TrendingDown className="size-4 text-rose-600 dark:text-rose-400" />
                </div>
                <div className="font-mono text-xl font-bold text-foreground mt-2">
                  <MoneyText amount={incomeStatement?.totalExpense || 0} />
                </div>
                <div className="text-[11px] text-muted-foreground mt-1">
                  Beban sewa kantor, gaji, dan utilitas
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Laba Bersih Periode Berjalan</span>
                  {incomeStatement?.isProfitable ? (
                    <Badge variant="success" size="sm" className="font-mono font-semibold">
                      SURPLUS / PROFIT
                    </Badge>
                  ) : (
                    <Badge variant="destructive" size="sm" className="font-mono font-semibold">
                      DEFISIT / RUGI
                    </Badge>
                  )}
                </div>
                <div
                  className={`font-mono text-xl font-extrabold mt-2 ${
                    incomeStatement?.isProfitable
                      ? "text-emerald-700 dark:text-emerald-400"
                      : "text-destructive"
                  }`}
                >
                  <MoneyText amount={incomeStatement?.netIncome || 0} />
                </div>
                <div className="text-[11px] text-muted-foreground mt-1">
                  Pendapatan bersih setelah dikurangi beban
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Breakdown Tables: Pendapatan & Beban */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Table Pendapatan */}
            <Card>
              <CardHeader className="border-b border-border/30 pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-semibold">Rincian Akun Pendapatan</CardTitle>
                    <CardDescription className="text-xs">Akun bertipe REVENUE (Saldo Normal Kredit)</CardDescription>
                  </div>
                  <Badge variant="success" size="sm" className="font-mono">
                    {incomeStatement?.revenues.length || 0} Akun
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-border/30 bg-muted/10">
                      <TableHead className="w-[100px] pl-4 font-semibold">Kode</TableHead>
                      <TableHead className="font-semibold">Nama Akun</TableHead>
                      <TableHead className="w-[140px] text-right pr-4 font-semibold">Nominal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={3} className="py-8 text-center text-xs text-muted-foreground">
                          <Loader2 className="size-4 animate-spin inline mr-2 text-primary" />
                          Memuat rincian pendapatan...
                        </TableCell>
                      </TableRow>
                    ) : !incomeStatement || incomeStatement.revenues.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="py-6 text-center text-xs text-muted-foreground">
                          Belum ada pendapatan yang tercatat pada periode ini.
                        </TableCell>
                      </TableRow>
                    ) : (
                      <>
                        {incomeStatement.revenues.map((row) => (
                          <TableRow key={row.accountId} className="border-b border-border/10 hover:bg-muted/10">
                            <TableCell className="font-mono text-xs pl-4 font-bold text-primary py-2.5">
                              <button
                                type="button"
                                onClick={() => navigate(`/reports/general-ledger?accountId=${row.accountId}`)}
                                className="hover:underline text-primary cursor-pointer text-left font-mono"
                              >
                                {row.accountCode}
                              </button>
                            </TableCell>
                            <TableCell className="text-xs text-foreground py-2.5">
                              {row.accountName}
                            </TableCell>
                            <TableCell className="text-right text-xs font-mono pr-4 font-medium py-2.5">
                              <MoneyText amount={row.amount} />
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="border-t-2 border-border/40 bg-muted/20 font-bold">
                          <TableCell colSpan={2} className="pl-4 text-xs py-2.5 text-foreground">
                            TOTAL PENDAPATAN
                          </TableCell>
                          <TableCell className="text-right text-xs font-mono pr-4 py-2.5 text-emerald-700 dark:text-emerald-400">
                            <MoneyText amount={incomeStatement.totalRevenue} />
                          </TableCell>
                        </TableRow>
                      </>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Table Beban */}
            <Card>
              <CardHeader className="border-b border-border/30 pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-semibold">Rincian Akun Beban</CardTitle>
                    <CardDescription className="text-xs">Akun bertipe EXPENSE (Saldo Normal Debit)</CardDescription>
                  </div>
                  <Badge variant="destructive" size="sm" className="font-mono">
                    {incomeStatement?.expenses.length || 0} Akun
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-border/30 bg-muted/10">
                      <TableHead className="w-[100px] pl-4 font-semibold">Kode</TableHead>
                      <TableHead className="font-semibold">Nama Akun</TableHead>
                      <TableHead className="w-[140px] text-right pr-4 font-semibold">Nominal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={3} className="py-8 text-center text-xs text-muted-foreground">
                          <Loader2 className="size-4 animate-spin inline mr-2 text-primary" />
                          Memuat rincian beban...
                        </TableCell>
                      </TableRow>
                    ) : !incomeStatement || incomeStatement.expenses.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="py-6 text-center text-xs text-muted-foreground">
                          Belum ada beban yang tercatat pada periode ini.
                        </TableCell>
                      </TableRow>
                    ) : (
                      <>
                        {incomeStatement.expenses.map((row) => (
                          <TableRow key={row.accountId} className="border-b border-border/10 hover:bg-muted/10">
                            <TableCell className="font-mono text-xs pl-4 font-bold text-primary py-2.5">
                              <button
                                type="button"
                                onClick={() => navigate(`/reports/general-ledger?accountId=${row.accountId}`)}
                                className="hover:underline text-primary cursor-pointer text-left font-mono"
                              >
                                {row.accountCode}
                              </button>
                            </TableCell>
                            <TableCell className="text-xs text-foreground py-2.5">
                              {row.accountName}
                            </TableCell>
                            <TableCell className="text-right text-xs font-mono pr-4 font-medium py-2.5">
                              <MoneyText amount={row.amount} />
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="border-t-2 border-border/40 bg-muted/20 font-bold">
                          <TableCell colSpan={2} className="pl-4 text-xs py-2.5 text-foreground">
                            TOTAL BEBAN
                          </TableCell>
                          <TableCell className="text-right text-xs font-mono pr-4 py-2.5 text-foreground">
                            <MoneyText amount={incomeStatement.totalExpense} />
                          </TableCell>
                        </TableRow>
                      </>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
            </>
          )}
        </TabsContent>

        {/* TAB 3: NERACA (BALANCE SHEET) */}
        <TabsContent value="balance-sheet" className="space-y-6">
          {bsError ? (
            <Card>
              <CardContent className="py-12 text-center text-destructive text-xs">
                <div className="flex flex-col items-center justify-center gap-1.5 max-w-md mx-auto">
                  <AlertTriangle className="size-6 text-destructive" />
                  <span className="font-semibold text-sm">{bsError}</span>
                  <span className="text-[11px] text-muted-foreground">
                    Gagal memuat data dari <code>/api/v1/reports/balance-sheet</code>. Pastikan backend Spring Boot sedang berjalan dan controller telah di-restart.
                  </span>
                  <Button variant="outline" size="sm" onClick={loadAllReports} className="mt-3 text-xs gap-1.5">
                    <RefreshCw className="size-3.5" /> Coba Muat Ulang
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Accounting Invariant Strip */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-border/60 bg-muted/20 p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Scale className="size-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-foreground font-heading">
                  Persamaan Dasar Akuntansi: Aset = Liabilitas + Ekuitas
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  Laba bersih periode berjalan otomatis diperhitungkan pada sisi Pasiva untuk menjaga integritas neraca.
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-center">
              {balanceSheet?.isBalanced ? (
                <Badge variant="success" size="lg" className="gap-1.5 font-bold">
                  <CheckCircle2 className="size-4" /> NERACA SEIMBANG
                </Badge>
              ) : (
                <Badge variant="destructive" size="lg" className="gap-1.5 font-bold">
                  <AlertTriangle className="size-4" /> SELISIH NERACA
                </Badge>
              )}
            </div>
          </div>

          {/* Two-Column Side by Side: AKTIVA vs PASIVA */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Kolom Kiri: AKTIVA (Aset) */}
            <Card>
              <CardHeader className="border-b border-border/30 pb-3 bg-muted/10">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">AKTIVA (ASET)</CardTitle>
                  <span className="text-xs font-mono text-muted-foreground">Saldo Normal Debit</span>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-border/30 bg-muted/10">
                      <TableHead className="w-[100px] pl-4 font-semibold">Kode</TableHead>
                      <TableHead className="font-semibold">Nama Akun Aset</TableHead>
                      <TableHead className="w-[140px] text-right pr-4 font-semibold">Saldo Akhir</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={3} className="py-8 text-center text-xs text-muted-foreground">
                          <Loader2 className="size-4 animate-spin inline mr-2 text-primary" />
                          Memuat aktiva...
                        </TableCell>
                      </TableRow>
                    ) : !balanceSheet || balanceSheet.assets.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="py-6 text-center text-xs text-muted-foreground">
                          Belum ada akun aset pada periode ini.
                        </TableCell>
                      </TableRow>
                    ) : (
                      <>
                        {balanceSheet.assets.map((row) => (
                          <TableRow key={row.accountId} className="border-b border-border/10 hover:bg-muted/10">
                            <TableCell className="font-mono text-xs pl-4 font-bold text-primary py-2.5">
                              <button
                                type="button"
                                onClick={() => navigate(`/reports/general-ledger?accountId=${row.accountId}`)}
                                className="hover:underline text-primary cursor-pointer text-left font-mono"
                              >
                                {row.accountCode}
                              </button>
                            </TableCell>
                            <TableCell className="text-xs text-foreground py-2.5">
                              {row.accountName}
                            </TableCell>
                            <TableCell className="text-right text-xs font-mono pr-4 font-medium py-2.5">
                              <MoneyText amount={row.amount} />
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="border-t-2 border-border/60 bg-muted/30 font-bold">
                          <TableCell colSpan={2} className="pl-4 text-xs py-3 text-foreground font-bold">
                            TOTAL AKTIVA (ASET)
                          </TableCell>
                          <TableCell className="text-right text-sm font-mono pr-4 py-3 font-extrabold text-primary">
                            <MoneyText amount={balanceSheet.totalAsset} />
                          </TableCell>
                        </TableRow>
                      </>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Kolom Kanan: PASIVA (Liabilitas + Ekuitas + Laba Berjalan) */}
            <Card>
              <CardHeader className="border-b border-border/30 pb-3 bg-muted/10">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">PASIVA (KEWAJIBAN & EKUITAS)</CardTitle>
                  <span className="text-xs font-mono text-muted-foreground">Saldo Normal Kredit</span>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-border/30 bg-muted/10">
                      <TableHead className="w-[100px] pl-4 font-semibold">Kode</TableHead>
                      <TableHead className="font-semibold">Nama Akun Kewajiban & Modal</TableHead>
                      <TableHead className="w-[140px] text-right pr-4 font-semibold">Saldo Akhir</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Bagian 1: Liabilitas */}
                    <TableRow className="bg-muted/15 font-semibold text-xs text-muted-foreground">
                      <TableCell colSpan={3} className="pl-4 py-1.5 uppercase text-[11px] tracking-wider">
                        Liabilitas / Kewajiban
                      </TableCell>
                    </TableRow>
                    {!balanceSheet || balanceSheet.liabilities.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="py-2 pl-6 text-xs text-muted-foreground italic">
                          Tidak ada saldo liabilitas.
                        </TableCell>
                      </TableRow>
                    ) : (
                      balanceSheet.liabilities.map((row) => (
                        <TableRow key={row.accountId} className="border-b border-border/10 hover:bg-muted/10">
                          <TableCell className="font-mono text-xs pl-6 font-bold text-primary py-2">
                            <button
                              type="button"
                              onClick={() => navigate(`/reports/general-ledger?accountId=${row.accountId}`)}
                              className="hover:underline text-primary cursor-pointer text-left font-mono"
                            >
                              {row.accountCode}
                            </button>
                          </TableCell>
                          <TableCell className="text-xs text-foreground py-2">
                            {row.accountName}
                          </TableCell>
                          <TableCell className="text-right text-xs font-mono pr-4 font-medium py-2">
                            <MoneyText amount={row.amount} />
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                    <TableRow className="border-b border-border/20 bg-muted/5 font-semibold text-xs">
                      <TableCell colSpan={2} className="pl-6 py-2 text-muted-foreground">
                        Subtotal Liabilitas
                      </TableCell>
                      <TableCell className="text-right text-xs font-mono pr-4 py-2 text-foreground font-semibold">
                        <MoneyText amount={balanceSheet?.totalLiability || 0} />
                      </TableCell>
                    </TableRow>

                    {/* Bagian 2: Ekuitas */}
                    <TableRow className="bg-muted/15 font-semibold text-xs text-muted-foreground">
                      <TableCell colSpan={3} className="pl-4 py-1.5 uppercase text-[11px] tracking-wider">
                        Ekuitas / Modal Saham
                      </TableCell>
                    </TableRow>
                    {!balanceSheet || balanceSheet.equities.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="py-2 pl-6 text-xs text-muted-foreground italic">
                          Tidak ada saldo ekuitas.
                        </TableCell>
                      </TableRow>
                    ) : (
                      balanceSheet.equities.map((row) => (
                        <TableRow key={row.accountId} className="border-b border-border/10 hover:bg-muted/10">
                          <TableCell className="font-mono text-xs pl-6 font-bold text-primary py-2">
                            <button
                              type="button"
                              onClick={() => navigate(`/reports/general-ledger?accountId=${row.accountId}`)}
                              className="hover:underline text-primary cursor-pointer text-left font-mono"
                            >
                              {row.accountCode}
                            </button>
                          </TableCell>
                          <TableCell className="text-xs text-foreground py-2">
                            {row.accountName}
                          </TableCell>
                          <TableCell className="text-right text-xs font-mono pr-4 font-medium py-2">
                            <MoneyText amount={row.amount} />
                          </TableCell>
                        </TableRow>
                      ))
                    )}

                    {/* Bagian 3: Laba Periode Berjalan */}
                    <TableRow className="border-b border-border/20 bg-emerald-500/5 font-semibold text-xs">
                      <TableCell className="font-mono text-xs pl-6 text-emerald-700 dark:text-emerald-400 py-2">
                        LABA
                      </TableCell>
                      <TableCell className="text-xs text-emerald-700 dark:text-emerald-400 py-2">
                        Laba Periode Berjalan (Current Earnings)
                      </TableCell>
                      <TableCell className="text-right text-xs font-mono pr-4 py-2 font-bold text-emerald-700 dark:text-emerald-400">
                        <MoneyText amount={balanceSheet?.currentPeriodEarnings || 0} />
                      </TableCell>
                    </TableRow>

                    {/* Grand Total Pasiva */}
                    <TableRow className="border-t-2 border-border/60 bg-muted/30 font-bold">
                      <TableCell colSpan={2} className="pl-4 text-xs py-3 text-foreground font-bold">
                        TOTAL PASIVA (LIABILITAS + EKUITAS)
                      </TableCell>
                      <TableCell className="text-right text-sm font-mono pr-4 py-3 font-extrabold text-primary">
                        <MoneyText amount={balanceSheet?.totalLiabilitiesAndEquity || 0} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
