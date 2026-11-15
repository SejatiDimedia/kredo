import { useNavigate } from "react-router-dom"
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
} from "lucide-react"

export function DashboardPage() {
  const navigate = useNavigate()

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
            PT Maju Jaya Sejahtera • Periode Aktif: November 2026 (OPEN)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate("/periods")}>
            <Calendar className="size-3.5 mr-1.5" />
            Periode: Nov 2026
          </Button>
          <Button size="sm" onClick={() => navigate("/journals")}>
            <Plus className="size-3.5 mr-1.5" />
            Entri Jurnal Baru
          </Button>
        </div>
      </div>

      {/* Ledger Integrity Alert (INV-01) */}
      <Alert className="border-teal-500/30 bg-teal-500/5">
        <CheckCircle2 className="size-4 text-teal-700 dark:text-teal-400" />
        <AlertTitle className="text-xs font-semibold text-foreground">
          Integritas Neraca Saldo Terverifikasi (INV-01)
        </AlertTitle>
        <AlertDescription className="text-xs text-muted-foreground">
          Seluruh jurnal berstatus <code>POSTED</code> berada dalam keseimbangan sempurna. Total Debit (Rp 1.485.000.000,00) = Total Kredit (Rp 1.485.000.000,00) dengan variansi selisih 0,00.
        </AlertDescription>
      </Alert>

      {/* Financial Metrics Cards (4 Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Kas & Setara Kas */}
        <Card size="sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Kas & Bank Likuid</span>
              <Badge variant="outline" className="text-[10px] font-mono border-teal-500/30 text-teal-700 dark:text-teal-400">
                Akun 1100
              </Badge>
            </div>
            <CardTitle className="text-xl font-bold tracking-tight mt-1">
              <MoneyText amount="158875000" />
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground space-y-1">
            <div className="flex justify-between">
              <span>BCA Operasional:</span>
              <MoneyText amount="100000000" className="font-medium text-foreground" />
            </div>
            <div className="flex justify-between">
              <span>Mandiri Payroll:</span>
              <MoneyText amount="50000000" className="font-medium text-foreground" />
            </div>
            <div className="flex justify-between">
              <span>Kas Kecil:</span>
              <MoneyText amount="8875000" className="font-medium text-foreground" />
            </div>
          </CardContent>
        </Card>

        {/* Metric 2: Piutang Usaha */}
        <Card size="sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Piutang Usaha (AR)</span>
              <Badge variant="outline" className="text-[10px] font-mono border-blue-500/30 text-blue-700 dark:text-blue-400">
                Akun 1200
              </Badge>
            </div>
            <CardTitle className="text-xl font-bold tracking-tight mt-1">
              <MoneyText amount="84500000" />
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground space-y-1">
            <div className="flex justify-between">
              <span>Lancar (Current):</span>
              <MoneyText amount="72000000" className="font-medium text-foreground" />
            </div>
            <div className="flex justify-between">
              <span>Jatuh Tempo 1-30 hr:</span>
              <MoneyText amount="12500000" className="font-medium text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex justify-between">
              <span>Cadangan Penurunan:</span>
              <MoneyText amount="0" className="font-medium text-foreground" />
            </div>
          </CardContent>
        </Card>

        {/* Metric 3: Utang Usaha */}
        <Card size="sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Utang Usaha (AP)</span>
              <Badge variant="outline" className="text-[10px] font-mono border-amber-500/30 text-amber-700 dark:text-amber-400">
                Akun 2100
              </Badge>
            </div>
            <CardTitle className="text-xl font-bold tracking-tight mt-1">
              <MoneyText amount="42100000" />
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground space-y-1">
            <div className="flex justify-between">
              <span>Utang Pemasok:</span>
              <MoneyText amount="35000000" className="font-medium text-foreground" />
            </div>
            <div className="flex justify-between">
              <span>Utang Pajak PPN:</span>
              <MoneyText amount="4100000" className="font-medium text-foreground" />
            </div>
            <div className="flex justify-between">
              <span>Akrual Gaji:</span>
              <MoneyText amount="3000000" className="font-medium text-foreground" />
            </div>
          </CardContent>
        </Card>

        {/* Metric 4: Laba Bersih Berjalan */}
        <Card size="sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Laba Bersih (YTD)</span>
              <Badge variant="outline" className="text-[10px] font-mono border-emerald-500/30 text-emerald-700 dark:text-emerald-400">
                P&L Net
              </Badge>
            </div>
            <CardTitle className="text-xl font-bold tracking-tight mt-1">
              <MoneyText amount="165000000" highlightPositive />
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground space-y-1">
            <div className="flex justify-between">
              <span>Pendapatan:</span>
              <MoneyText amount="450000000" className="font-medium text-foreground" />
            </div>
            <div className="flex justify-between">
              <span>HPP & Beban Ops:</span>
              <MoneyText amount="285000000" className="font-medium text-foreground" />
            </div>
            <div className="flex justify-between">
              <span>Margin Operasional:</span>
              <span className="font-medium text-foreground">36.7%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Section: Maker-Checker Queue & Recent Journal Entries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column 1: Approval Queue (Maker-Checker INV-06) */}
        <Card>
          <CardHeader className="border-b border-border/30 pb-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-sm font-semibold">Antrean Persetujuan (Maker-Checker)</CardTitle>
                  <Badge variant="secondary" className="text-[10px] font-semibold">
                    2 Menunggu
                  </Badge>
                </div>
                <CardDescription className="text-xs">
                  Sesuai Invariant INV-06: Pembuat dilarang menyetujui jurnal sendiri.
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
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border/20 bg-muted/10">
                  <TableHead className="w-[120px] pl-4 text-xs font-semibold">Draft ID</TableHead>
                  <TableHead className="text-xs font-semibold">Keterangan Transaksi</TableHead>
                  <TableHead className="w-[130px] text-right text-xs font-semibold">Nominal</TableHead>
                  <TableHead className="w-[80px] text-center pr-4 text-xs font-semibold">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-b border-border/10 hover:bg-muted/10">
                  <TableCell className="font-mono text-xs pl-4 font-semibold text-primary">
                    DFT-2026-089
                  </TableCell>
                  <TableCell className="text-xs">
                    <div className="font-medium text-foreground">Pembayaran Beban Sewa Kantor</div>
                    <div className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Clock className="size-3" /> 15 Nov 2026 • Maker: Dina Putri
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-xs font-mono">
                    <MoneyText amount="12500000" />
                  </TableCell>
                  <TableCell className="text-center pr-4">
                    <Button size="xs" variant="outline" onClick={() => navigate("/approvals")}>
                      Review
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow className="border-b-0 hover:bg-muted/10">
                  <TableCell className="font-mono text-xs pl-4 font-semibold text-primary">
                    DFT-2026-090
                  </TableCell>
                  <TableCell className="text-xs">
                    <div className="font-medium text-foreground">Pengadaan Alat Tulis Operasional</div>
                    <div className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Clock className="size-3" /> 15 Nov 2026 • Maker: Dina Putri
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-xs font-mono">
                    <MoneyText amount="3450000" />
                  </TableCell>
                  <TableCell className="text-center pr-4">
                    <Button size="xs" variant="outline" onClick={() => navigate("/approvals")}>
                      Review
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Column 2: Recent Posted Journals */}
        <Card>
          <CardHeader className="border-b border-border/30 pb-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-sm font-semibold">Jurnal Terakhir Diposting</CardTitle>
                  <Badge variant="outline" className="text-[10px]">
                    Live Ledger
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
                <TableRow className="border-b border-border/10 hover:bg-muted/10">
                  <TableCell className="font-mono text-xs pl-4 font-semibold text-primary">
                    JV-PTM-2026-000003
                  </TableCell>
                  <TableCell className="text-xs">
                    <div className="font-medium text-foreground">Penjualan Kredit Barang Dagang</div>
                    <div className="text-[10px] text-muted-foreground">15 Nov 2026 • 2 Baris Entri</div>
                  </TableCell>
                  <TableCell className="text-right text-xs font-mono">
                    <MoneyText amount="15000000" />
                  </TableCell>
                  <TableCell className="text-center pr-4">
                    <Badge variant="secondary" className="text-[10px]">
                      POSTED
                    </Badge>
                  </TableCell>
                </TableRow>
                <TableRow className="border-b border-border/10 hover:bg-muted/10">
                  <TableCell className="font-mono text-xs pl-4 font-semibold text-primary">
                    JV-PTM-2026-000002
                  </TableCell>
                  <TableCell className="text-xs">
                    <div className="font-medium text-foreground">Pembelian Persediaan Barang Dagang</div>
                    <div className="text-[10px] text-muted-foreground">14 Nov 2026 • 2 Baris Entri</div>
                  </TableCell>
                  <TableCell className="text-right text-xs font-mono">
                    <MoneyText amount="20000000" />
                  </TableCell>
                  <TableCell className="text-center pr-4">
                    <Badge variant="secondary" className="text-[10px]">
                      POSTED
                    </Badge>
                  </TableCell>
                </TableRow>
                <TableRow className="border-b-0 hover:bg-muted/10">
                  <TableCell className="font-mono text-xs pl-4 font-semibold text-primary">
                    JV-PTM-2026-000001
                  </TableCell>
                  <TableCell className="text-xs">
                    <div className="font-medium text-foreground">Setoran Modal Pemilik Tunai</div>
                    <div className="text-[10px] text-muted-foreground">14 Nov 2026 • 2 Baris Entri</div>
                  </TableCell>
                  <TableCell className="text-right text-xs font-mono">
                    <MoneyText amount="100000000" />
                  </TableCell>
                  <TableCell className="text-center pr-4">
                    <Badge variant="secondary" className="text-[10px]">
                      POSTED
                    </Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
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
