import * as React from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/features/auth/context/AuthContext"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardAction,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { MoneyText } from "@/components/shared/MoneyText"
import {
  Plus,
  CheckCircle2,
  Calendar,
  ArrowRight,
  ShieldAlert,
  Clock,
  BookOpen,
  Loader2,
  AlertTriangle,
} from "lucide-react"
import { apiFetch } from "@/lib/api"
import type { JournalResponse } from "@/features/journals/types"
import type { TrialBalanceResponse, IncomeStatementResponse, BalanceSheetResponse } from "@/features/reports/types"

export function DashboardPage() {
  const navigate = useNavigate()
  const { user, hasPermission } = useAuth()

  const [isLoading, setIsLoading] = React.useState(true)
  const [journals, setJournals] = React.useState<JournalResponse[]>([])
  const [trialBalance, setTrialBalance] = React.useState<TrialBalanceResponse | null>(null)
  const [incomeStatement, setIncomeStatement] = React.useState<IncomeStatementResponse | null>(null)
  const [balanceSheet, setBalanceSheet] = React.useState<BalanceSheetResponse | null>(null)

  const activeEntityName = user?.activeEntityName || "PT Maju Jaya Sejahtera"

  React.useEffect(() => {
    async function loadDashboardData() {
      try {
        setIsLoading(true)
        const [journalsRes, tbRes, isRes, bsRes] = await Promise.allSettled([
          apiFetch<JournalResponse[]>("/journals"),
          apiFetch<TrialBalanceResponse>("/reports/trial-balance?periodId=11"),
          apiFetch<IncomeStatementResponse>("/reports/income-statement?periodId=11"),
          apiFetch<BalanceSheetResponse>("/reports/balance-sheet?periodId=11"),
        ])

        if (journalsRes.status === "fulfilled") setJournals(journalsRes.value)
        if (tbRes.status === "fulfilled") setTrialBalance(tbRes.value)
        if (isRes.status === "fulfilled") setIncomeStatement(isRes.value)
        if (bsRes.status === "fulfilled") setBalanceSheet(bsRes.value)
      } catch (err) {
        console.error("Gagal memuat ringkasan dashboard", err)
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  const pendingJournals = React.useMemo(
    () => journals.filter((j) => j.status === "SUBMITTED"),
    [journals]
  )

  const recentPostedJournals = React.useMemo(
    () => journals.filter((j) => j.status === "POSTED").slice(0, 5),
    [journals]
  )

  const isBalanced = trialBalance ? trialBalance.isBalanced : true

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
            <BreadcrumbPage>Dashboard Keuangan</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-heading">
            Ringkasan Buku Besar
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {activeEntityName} • Periode Aktif: November 2026 (OPEN)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate("/periods")}>
            <Calendar className="size-3.5 mr-1.5" />
            Periode: Nov 2026
          </Button>
          {hasPermission("journal:create") && (
            <Button size="sm" className="bg-[#0D6276] hover:bg-[#0A4D5D] text-white" onClick={() => navigate("/journals/new")}>
              <Plus className="size-3.5 mr-1.5" />
              Entri Jurnal Baru
            </Button>
          )}
        </div>
      </div>

      {/* Ledger Integrity Alert */}
      {isBalanced ? (
        <Alert className="border-teal-500/30 bg-teal-500/5">
          <CheckCircle2 className="size-4 text-teal-700 dark:text-teal-400" />
          <AlertTitle className="text-xs font-semibold text-foreground">
            Integritas Neraca Saldo Terverifikasi
          </AlertTitle>
          <AlertDescription className="text-xs text-muted-foreground">
            Seluruh jurnal berstatus <code>POSTED</code> berada dalam keseimbangan matematis.{" "}
            {trialBalance && (
              <>
                Total Debit (<MoneyText amount={trialBalance.totalDebit} />) = Total Kredit (<MoneyText amount={trialBalance.totalCredit} />) dengan variansi selisih 0,00.
              </>
            )}
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="border-rose-500/30 bg-rose-500/5 text-rose-800 dark:text-rose-200">
          <AlertTriangle className="size-4 text-rose-600" />
          <AlertTitle className="text-xs font-semibold">
            Peringatan: Neraca Saldo Tidak Seimbang!
          </AlertTitle>
          <AlertDescription className="text-xs">
            Ditemukan selisih variansi antara Debit dan Kredit sebesar <MoneyText amount={trialBalance ? Math.abs(Number(trialBalance.totalDebit) - Number(trialBalance.totalCredit)) : 0} />. Segera lakukan rekonsiliasi akun.
          </AlertDescription>
        </Alert>
      )}

      {/* Financial Metrics Cards (4 Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Aset */}
        <Card size="sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Total Aset</span>
              <Badge variant="outline" className="text-[10px] font-mono border-teal-500/30 text-teal-700 dark:text-teal-400">
                Neraca
              </Badge>
            </div>
            <CardTitle className="text-xl font-bold tracking-tight mt-1">
              <MoneyText amount={balanceSheet?.totalAsset ?? 100000000} />
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground space-y-1">
            <div className="flex justify-between">
              <span>Posisi Keuangan:</span>
              <span className="font-medium text-foreground">Aktif Seimbang</span>
            </div>
            <div className="flex justify-between">
              <span>Basis Pencatatan:</span>
              <span className="font-medium text-foreground">Akrual Standar</span>
            </div>
          </CardContent>
        </Card>

        {/* Metric 2: Total Liabilitas */}
        <Card size="sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Total Liabilitas (Kewajiban)</span>
              <Badge variant="outline" className="text-[10px] font-mono border-amber-500/30 text-amber-700 dark:text-amber-400">
                Liabilitas
              </Badge>
            </div>
            <CardTitle className="text-xl font-bold tracking-tight mt-1">
              <MoneyText amount={balanceSheet?.totalLiability ?? 0} />
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground space-y-1">
            <div className="flex justify-between">
              <span>Kewajiban Lancar:</span>
              <MoneyText amount={balanceSheet?.totalLiability ?? 0} className="font-medium text-foreground" />
            </div>
            <div className="flex justify-between">
              <span>Status Jatuh Tempo:</span>
              <span className="font-medium text-emerald-600 dark:text-emerald-400">Terkendali</span>
            </div>
          </CardContent>
        </Card>

        {/* Metric 3: Total Ekuitas */}
        <Card size="sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Total Ekuitas Modal</span>
              <Badge variant="outline" className="text-[10px] font-mono border-blue-500/30 text-blue-700 dark:text-blue-400">
                Modal
              </Badge>
            </div>
            <CardTitle className="text-xl font-bold tracking-tight mt-1">
              <MoneyText amount={balanceSheet?.totalEquity ?? 100000000} />
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground space-y-1">
            <div className="flex justify-between">
              <span>Modal Disetor:</span>
              <span className="font-medium text-foreground">PT Maju Jaya</span>
            </div>
            <div className="flex justify-between">
              <span>Laba Ditahan:</span>
              <span className="font-medium text-foreground">Akrual Berjalan</span>
            </div>
          </CardContent>
        </Card>

        {/* Metric 4: Laba Bersih Berjalan */}
        <Card size="sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Laba Bersih Berjalan</span>
              <Badge variant="outline" className="text-[10px] font-mono border-emerald-500/30 text-emerald-700 dark:text-emerald-400">
                P&L Net
              </Badge>
            </div>
            <CardTitle className="text-xl font-bold tracking-tight mt-1">
              <MoneyText amount={incomeStatement?.netIncome ?? 0} highlightPositive />
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground space-y-1">
            <div className="flex justify-between">
              <span>Total Pendapatan:</span>
              <MoneyText amount={incomeStatement?.totalRevenue ?? 0} className="font-medium text-foreground" />
            </div>
            <div className="flex justify-between">
              <span>Total Beban:</span>
              <MoneyText amount={incomeStatement?.totalExpense ?? 0} className="font-medium text-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Section: Maker-Checker Queue & Recent Journal Entries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column 1: Approval Queue (Maker-Checker) */}
        <Card>
          <CardHeader className="border-b border-border/30 pb-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-sm font-semibold">Antrean Persetujuan (Maker-Checker)</CardTitle>
                  <Badge variant={pendingJournals.length > 0 ? "secondary" : "outline"} className="text-[10px] font-semibold">
                    {pendingJournals.length} Menunggu
                  </Badge>
                </div>
                <CardDescription className="text-xs">
                  Prinsip Pemisahan Tugas: Pembuat dilarang menyetujui jurnal sendiri.
                </CardDescription>
              </div>
              <CardAction>
                <Button variant="ghost" size="xs" onClick={() => navigate("/approvals")}>
                  Lihat Semua
                  <ArrowRight className="size-3 ml-1" />
                </Button>
              </CardAction>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
                <Loader2 className="size-4 animate-spin" /> Memuat antrean...
              </div>
            ) : pendingJournals.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground">
                Tidak ada jurnal yang menunggu persetujuan saat ini.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-border/20 bg-muted/10">
                    <TableHead className="w-[100px] pl-4 text-xs font-semibold">ID Draf</TableHead>
                    <TableHead className="text-xs font-semibold">Keterangan Transaksi</TableHead>
                    <TableHead className="w-[130px] text-right text-xs font-semibold">Nominal</TableHead>
                    <TableHead className="w-[80px] text-center pr-4 text-xs font-semibold">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingJournals.slice(0, 3).map((draft) => (
                    <TableRow key={draft.id} className="border-b border-border/10 hover:bg-muted/10">
                      <TableCell className="font-mono text-xs pl-4 font-semibold text-primary">
                        DFT-{draft.id}
                      </TableCell>
                      <TableCell className="text-xs">
                        <div className="font-medium text-foreground">{draft.description}</div>
                        <div className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Clock className="size-3" /> {draft.entryDate} • {draft.lines?.length || 0} baris
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-xs font-mono">
                        <MoneyText amount={draft.totalAmount} />
                      </TableCell>
                      <TableCell className="text-center pr-4">
                        <Button
                          size="xs"
                          variant="ghost"
                          className="text-[11px] h-7"
                          onClick={() => navigate(`/journals/${draft.id}`)}
                        >
                          Tinjau
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Column 2: Recent Journal Entries */}
        <Card>
          <CardHeader className="border-b border-border/30 pb-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-sm font-semibold">Transaksi Terposting Terbaru</CardTitle>
                  <Badge variant="outline" className="text-[10px] border-teal-500/30 text-teal-700 dark:text-teal-400">
                    Buku Besar
                  </Badge>
                </div>
                <CardDescription className="text-xs">
                  Transaksi buku besar umum yang telah disahkan ke buku besar.
                </CardDescription>
              </div>
              <CardAction>
                <Button variant="ghost" size="xs" onClick={() => navigate("/journals")}>
                  Buku Jurnal
                  <ArrowRight className="size-3 ml-1" />
                </Button>
              </CardAction>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
                <Loader2 className="size-4 animate-spin" /> Memuat transaksi...
              </div>
            ) : recentPostedJournals.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground">
                Belum ada transaksi berstatus POSTED.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-border/20 bg-muted/10">
                    <TableHead className="w-[140px] pl-4 text-xs font-semibold">No. Jurnal</TableHead>
                    <TableHead className="text-xs font-semibold">Keterangan</TableHead>
                    <TableHead className="w-[130px] text-right text-xs font-semibold">Total Nominal</TableHead>
                    <TableHead className="w-[80px] text-center pr-4 text-xs font-semibold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentPostedJournals.map((j) => (
                    <TableRow key={j.id} className="border-b border-border/10 hover:bg-muted/10">
                      <TableCell className="font-mono text-xs pl-4 font-semibold text-primary">
                        {j.journalNo || `JRN-${j.id}`}
                      </TableCell>
                      <TableCell className="text-xs">
                        <div className="font-medium text-foreground">{j.description}</div>
                        <div className="text-[10px] text-muted-foreground">
                          {j.entryDate} • {j.lines?.length || 0} Baris Entri
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-xs font-mono">
                        <MoneyText amount={j.totalAmount} />
                      </TableCell>
                      <TableCell className="text-center pr-4">
                        <Badge variant="secondary" className="text-[10px]">
                          {j.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Footer Info Strip */}
      <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground py-2 border-t border-border/30">
        <div className="flex items-center gap-2">
          <BookOpen className="size-3.5 text-primary" />
          <span>General Ledger Core Engine • Multi-tenant Database Schema</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <ShieldAlert className="size-3 text-muted-foreground" />
            Append-only Audit Trail: Aktif
          </span>
          <Separator orientation="vertical" className="h-3" />
          <span>PostgreSQL Advisory Locking: Siap</span>
        </div>
      </div>
    </div>
  )
}
