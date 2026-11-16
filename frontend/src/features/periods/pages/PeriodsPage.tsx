import * as React from "react"
import { toast } from "sonner"
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
import { Lock, Unlock, ShieldCheck, Loader2, RefreshCw } from "lucide-react"
import { apiFetch } from "@/lib/api"

interface PeriodResponse {
  id: number
  entityId: number
  periodNo: number
  fiscalYear: number
  name: string
  startDate: string
  endDate: string
  status: "OPEN" | "CLOSED" | "LOCKED"
  closedAt: string | null
  closedBy: number | null
}

export function PeriodsPage() {
  const [periods, setPeriods] = React.useState<PeriodResponse[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [processingPeriodId, setProcessingPeriodId] = React.useState<number | null>(null)

  const loadPeriods = React.useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await apiFetch<PeriodResponse[]>("/periods?entityId=1")
      setPeriods(data)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal memuat daftar periode akuntansi")
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    loadPeriods()
  }, [loadPeriods])

  // Aksi Tutup Buku
  const handleClosePeriod = async (period: PeriodResponse) => {
    try {
      setProcessingPeriodId(period.id)
      await apiFetch<PeriodResponse>(`/periods/${period.id}/close?entityId=1&userId=3`, {
        method: "POST",
      })
      toast.success(`Tutup buku sukses: Periode ${period.name} kini berstatus CLOSED. Transaksi baru dikunci!`)
      await loadPeriods()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menutup periode akuntansi")
    } finally {
      setProcessingPeriodId(null)
    }
  }

  // Aksi Buka Kembali Periode
  const handleReopenPeriod = async (period: PeriodResponse) => {
    try {
      setProcessingPeriodId(period.id)
      await apiFetch<PeriodResponse>(
        `/periods/${period.id}/reopen?entityId=1&userId=3&reason=Penyesuaian+audit+laporan+keuangan`,
        { method: "POST" }
      )
      toast.success(`Periode ${period.name} berhasil dibuka kembali (OPEN).`)
      await loadPeriods()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal membuka kembali periode")
    } finally {
      setProcessingPeriodId(null)
    }
  }

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
            <BreadcrumbPage>Periode Akuntansi & Tutup Buku</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-heading">
            Periode Akuntansi & Tutup Buku
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Pengelolaan tahun fiskal 2026. Periode CLOSED dilindungi PostgreSQL Row Lock agar tidak menerima posting jurnal baru.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={loadPeriods} disabled={isLoading}>
          <RefreshCw className={`size-3.5 mr-1.5 ${isLoading ? "animate-spin" : ""}`} />
          Segarkan Data
        </Button>
      </div>

      {/* Accounting Notice Alert */}
      <Alert className="border-border/60 bg-muted/20">
        <ShieldCheck className="size-4 text-primary" />
        <AlertTitle className="text-xs font-semibold">Aturan Integritas Tutup Buku (Month-End Close)</AlertTitle>
        <AlertDescription className="text-xs text-muted-foreground">
          Sistem secara otomatis menolak posting jurnal baru pada periode yang berstatus <code>CLOSED</code>.
          Prasyarat tutup buku: <strong>tidak ada jurnal gantung (Draft/Submitted/Approved)</strong> dan <strong>Neraca Saldo wajib seimbang</strong>.
          Pembukaan kembali periode tertutup membutuhkan otorisasi Financial Controller dan dicatat pada jejak audit.
        </AlertDescription>
      </Alert>

      {/* Period Table Card using shadcn Card */}
      <Card>
        <CardHeader className="border-b border-border/30 pb-4">
          <CardTitle className="text-base font-semibold">Daftar Periode Buku Besar 2026</CardTitle>
          <CardDescription className="text-xs">
            Hanya periode berstatus <code>OPEN</code> yang diizinkan menerima mutasi jurnal harian.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border/30 bg-muted/10 hover:bg-muted/10">
                <TableHead className="w-[120px] pl-6 font-semibold">No. Bulan</TableHead>
                <TableHead className="font-semibold">Nama Periode</TableHead>
                <TableHead className="w-[220px] font-semibold">Rentang Tanggal</TableHead>
                <TableHead className="w-[140px] text-center font-semibold">Status Periode</TableHead>
                <TableHead className="w-[180px] font-semibold text-center">Info Penutupan</TableHead>
                <TableHead className="w-[160px] text-center pr-6 font-semibold">Aksi Controller</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center text-muted-foreground">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="size-4 animate-spin text-primary" />
                      <span>Memuat status periode akuntansi...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : periods.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                    Tidak ada periode akuntansi ditemukan.
                  </TableCell>
                </TableRow>
              ) : (
                periods.map((period) => (
                  <TableRow
                    key={period.id}
                    className={`border-b border-border/20 transition-colors ${
                      period.status === "OPEN" ? "bg-muted/10 hover:bg-muted/15" : "hover:bg-muted/10"
                    }`}
                  >
                    <TableCell className="font-mono text-xs pl-6 font-semibold text-primary py-3">
                      Bulan {period.periodNo}
                    </TableCell>
                    <TableCell className="text-xs font-medium py-3">
                      <span className="font-semibold text-foreground">{period.name}</span>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground font-mono py-3">
                      {period.startDate} s/d {period.endDate}
                    </TableCell>
                    <TableCell className="text-center py-3">
                      {period.status === "OPEN" && (
                        <Badge variant="secondary" className="gap-1 font-semibold text-xs text-teal-700 dark:text-teal-300">
                          <Unlock className="size-3" />
                          OPEN
                        </Badge>
                      )}
                      {period.status === "CLOSED" && (
                        <Badge variant="outline" className="gap-1 font-normal text-xs text-muted-foreground">
                          <Lock className="size-3" />
                          CLOSED
                        </Badge>
                      )}
                      {period.status === "LOCKED" && (
                        <Badge variant="destructive" className="gap-1 text-xs">
                          <Lock className="size-3" />
                          LOCKED
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center py-3 text-xs text-muted-foreground">
                      {period.closedAt ? (
                        <span className="text-[11px]">
                          Ditutup {new Date(period.closedAt).toLocaleDateString("id-ID")}
                        </span>
                      ) : (
                        <span>—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center pr-6 py-3">
                      {period.status === "OPEN" ? (
                        <Button
                          size="xs"
                          variant="outline"
                          className="text-xs cursor-pointer border-destructive/30 hover:bg-destructive/10 hover:text-destructive text-foreground"
                          disabled={processingPeriodId === period.id}
                          onClick={() => handleClosePeriod(period)}
                        >
                          {processingPeriodId === period.id ? (
                            <Loader2 className="size-3 mr-1 animate-spin" />
                          ) : (
                            <Lock className="size-3 mr-1 text-destructive" />
                          )}
                          Tutup Buku
                        </Button>
                      ) : period.status === "CLOSED" ? (
                        <Button
                          size="xs"
                          variant="ghost"
                          className="text-xs cursor-pointer text-primary hover:bg-primary/10"
                          disabled={processingPeriodId === period.id}
                          onClick={() => handleReopenPeriod(period)}
                        >
                          {processingPeriodId === period.id ? (
                            <Loader2 className="size-3 mr-1 animate-spin" />
                          ) : (
                            <Unlock className="size-3 mr-1 text-primary" />
                          )}
                          Buka Kembali
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
