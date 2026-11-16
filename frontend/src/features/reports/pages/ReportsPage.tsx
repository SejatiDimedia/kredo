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
import { Download, FileSpreadsheet, Printer, CheckCircle2, AlertTriangle, BookOpen, Loader2 } from "lucide-react"
import { apiFetch } from "@/lib/api"
import type { TrialBalanceResponse } from "../types"

export function ReportsPage() {
  const navigate = useNavigate()
  const [trialBalance, setTrialBalance] = React.useState<TrialBalanceResponse | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true)
        setError(null)
        const data = await apiFetch<TrialBalanceResponse>("/reports/trial-balance?entityId=1&periodId=11")
        setTrialBalance(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal memuat Neraca Saldo")
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

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
            Snapshot transaksi konsisten (PostgreSQL REPEATABLE READ). Neraca Saldo, Laba Rugi, dan Neraca.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" onClick={() => navigate("/reports/general-ledger")}>
            <BookOpen className="size-3.5 mr-1.5 text-primary" /> Buku Besar Per Akun
          </Button>
          <Button size="sm" variant="outline">
            <Download className="size-3.5 mr-1.5" /> CSV
          </Button>
          <Button size="sm" variant="outline">
            <FileSpreadsheet className="size-3.5 mr-1.5" /> Excel
          </Button>
          <Button size="sm">
            <Printer className="size-3.5 mr-1.5" /> Cetak PDF
          </Button>
        </div>
      </div>

      <Tabs defaultValue="trial-balance" className="w-full space-y-4">
        <TabsList className="bg-muted/60 p-1">
          <TabsTrigger value="trial-balance" className="text-xs">Neraca Saldo (Trial Balance)</TabsTrigger>
          <TabsTrigger value="income-statement" className="text-xs">Laba Rugi (Income Statement)</TabsTrigger>
          <TabsTrigger value="balance-sheet" className="text-xs">Neraca (Balance Sheet)</TabsTrigger>
        </TabsList>

        <TabsContent value="trial-balance">
          <Card>
            <CardHeader className="border-b border-border/30 pb-3">
              <CardTitle className="text-base font-semibold">Neraca Saldo (Trial Balance)</CardTitle>
              <CardDescription className="text-xs">
                Per 15 November 2026 • Status Keseimbangan Terverifikasi
              </CardDescription>
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
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="size-4 animate-spin text-primary" />
                          <span>Menghitung Neraca Saldo real-time...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : error ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-8 text-center text-destructive">
                        {error}
                      </TableCell>
                    </TableRow>
                  ) : !trialBalance || trialBalance.rows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
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

        <TabsContent value="income-statement">
          <Card>
            <CardHeader className="border-b border-border/30 pb-3">
              <CardTitle className="text-base font-semibold">Laporan Laba Rugi Komparatif</CardTitle>
              <CardDescription className="text-xs">Periode: 01 Jan 2026 – 15 Nov 2026</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4 text-xs">
              <div className="flex justify-between border-b border-border/20 pb-2">
                <span className="text-foreground">Pendapatan Penjualan Bersih (Akun 4100)</span>
                <MoneyText amount="450000000" highlightPositive />
              </div>
              <div className="flex justify-between border-b border-border/20 pb-2">
                <span className="text-foreground">Harga Pokok Penjualan (Akun 5000)</span>
                <MoneyText amount="-270000000" accountingNegative />
              </div>
              <div className="flex justify-between font-bold pt-1 text-sm">
                <span>Laba Kotor Operasional</span>
                <MoneyText amount="180000000" highlightPositive />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="balance-sheet">
          <Card>
            <CardHeader className="border-b border-border/30 pb-3">
              <CardTitle className="text-base font-semibold">Neraca Keuangan (Balance Sheet)</CardTitle>
              <CardDescription className="text-xs">Posisi per 15 November 2026 • Persamaan Akuntansi: Aset = Liabilitas + Ekuitas</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                <div className="rounded-lg border border-border/40 p-4 space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Aktiva / Aset</span>
                  <div className="flex justify-between font-bold text-sm pt-2">
                    <span>Total Aset</span>
                    <MoneyText amount="115000000" className="text-primary font-bold" />
                  </div>
                </div>
                <div className="rounded-lg border border-border/40 p-4 space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pasiva / Liabilitas & Ekuitas</span>
                  <div className="flex justify-between font-bold text-sm pt-2">
                    <span>Total Pasiva</span>
                    <MoneyText amount="115000000" className="text-primary font-bold" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
