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
import { Lock, Unlock, CheckCircle2, ShieldCheck } from "lucide-react"

interface AccountingPeriod {
  id: string
  periodCode: string
  name: string
  startDate: string
  endDate: string
  status: "OPEN" | "CLOSED" | "FUTURE"
  isBalanced: boolean
  closedBy?: string
  closedAt?: string
}

const INITIAL_PERIODS: AccountingPeriod[] = [
  {
    id: "1",
    periodCode: "PER-2026-10",
    name: "Oktober 2026",
    startDate: "01 Okt 2026",
    endDate: "31 Okt 2026",
    status: "CLOSED",
    isBalanced: true,
    closedBy: "Maya Siregar (Controller)",
    closedAt: "31 Okt 2026 23:59",
  },
  {
    id: "2",
    periodCode: "PER-2026-11",
    name: "November 2026 (Aktif)",
    startDate: "01 Nov 2026",
    endDate: "30 Nov 2026",
    status: "OPEN",
    isBalanced: true,
  },
  {
    id: "3",
    periodCode: "PER-2026-12",
    name: "Desember 2026",
    startDate: "01 Des 2026",
    endDate: "31 Des 2026",
    status: "FUTURE",
    isBalanced: true,
  },
]

export function PeriodsPage() {
  const [periods, setPeriods] = React.useState<AccountingPeriod[]>(INITIAL_PERIODS)

  const handleToggleClose = (periodCode: string) => {
    setPeriods(prev => prev.map(p => {
      if (p.periodCode === periodCode) {
        const nextStatus = p.status === "OPEN" ? "CLOSED" : "OPEN"
        toast.success(`Status periode ${p.name} diubah menjadi: ${nextStatus}`)
        return {
          ...p,
          status: nextStatus,
          closedBy: nextStatus === "CLOSED" ? "Maya Siregar (Controller)" : undefined,
          closedAt: nextStatus === "CLOSED" ? "15 Nov 2026 09:30" : undefined,
        }
      }
      return p
    }))
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
            Pengelolaan tahun fiskal 2026. Periode CLOSED dilindungi PostgreSQL Row Lock agar tidak menerima posting.
          </p>
        </div>
      </div>

      {/* Accounting Invariant Alert (INV-08) */}
      <Alert className="border-border/60 bg-muted/20">
        <ShieldCheck className="size-4 text-primary" />
        <AlertTitle className="text-xs font-semibold">Aturan Tutup Buku (INV-08 & INV-11)</AlertTitle>
        <AlertDescription className="text-xs text-muted-foreground">
          Sistem secara otomatis menolak posting jurnal baru pada periode yang berstatus <code>CLOSED</code>. Pembukaan kembali periode tertutup membutuhkan otorisasi Financial Controller dan dicatat pada jejak audit.
        </AlertDescription>
      </Alert>

      {/* Period Table Card using shadcn Card */}
      <Card>
        <CardHeader className="border-b border-border/30 pb-4">
          <CardTitle className="text-base font-semibold">Daftar Periode Buku Besar 2026</CardTitle>
          <CardDescription className="text-xs">
            Hanya ada satu periode terbuka (OPEN) yang dapat menerima mutasi jurnal harian.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border/30 bg-muted/10 hover:bg-muted/10">
                <TableHead className="w-[140px] pl-6 font-semibold">Kode Periode</TableHead>
                <TableHead className="font-semibold">Nama Periode</TableHead>
                <TableHead className="w-[200px] font-semibold">Rentang Tanggal</TableHead>
                <TableHead className="w-[140px] text-center font-semibold">Status Periode</TableHead>
                <TableHead className="w-[180px] text-center font-semibold">Neraca Saldo</TableHead>
                <TableHead className="w-[160px] text-center pr-6 font-semibold">Aksi Controller</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {periods.map((period) => (
                <TableRow
                  key={period.periodCode}
                  className={`border-b border-border/20 transition-colors ${
                    period.status === "OPEN" ? "bg-muted/10 hover:bg-muted/15" : "hover:bg-muted/10"
                  }`}
                >
                  <TableCell className="font-mono text-xs pl-6 font-semibold text-primary py-3">
                    {period.periodCode}
                  </TableCell>
                  <TableCell className="text-xs font-medium py-3">
                    {period.name}
                    {period.closedBy && (
                      <div className="text-[10px] text-muted-foreground mt-0.5">
                        Ditutup oleh: {period.closedBy}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground font-mono py-3">
                    {period.startDate} – {period.endDate}
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
                    {period.status === "FUTURE" && (
                      <Badge variant="outline" className="text-xs text-muted-foreground border-dashed">
                        FUTURE
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-center py-3 text-xs">
                    <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-medium">
                      <CheckCircle2 className="size-3.5" />
                      Seimbang (0 Selisih)
                    </span>
                  </TableCell>
                  <TableCell className="text-center pr-6 py-3">
                    {period.status === "OPEN" ? (
                      <Button
                        size="xs"
                        variant="outline"
                        className="text-xs"
                        onClick={() => handleToggleClose(period.periodCode)}
                      >
                        <Lock className="size-3 mr-1" />
                        Tutup Buku
                      </Button>
                    ) : period.status === "CLOSED" ? (
                      <Button
                        size="xs"
                        variant="ghost"
                        className="text-xs"
                        onClick={() => handleToggleClose(period.periodCode)}
                      >
                        <Unlock className="size-3 mr-1" />
                        Buka Kembali
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
