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
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoneyText } from "@/components/shared/MoneyText"
import { Plus, Download, Search, MoreHorizontal, Eye, Printer, RotateCcw } from "lucide-react"

interface JournalRecord {
  id: string
  journalNo: string
  date: string
  description: string
  source: "MANUAL" | "IMPORT_CSV" | "SYSTEM"
  totalDebit: string
  totalCredit: string
  status: "DRAFT" | "SUBMITTED" | "APPROVED" | "POSTED" | "REVERSED"
  linesCount: number
}

const INITIAL_JOURNALS: JournalRecord[] = [
  {
    id: "1",
    journalNo: "JV-PTM-2026-000001",
    date: "14 Nov 2026",
    description: "Setoran Modal Pemilik Tunai",
    source: "MANUAL",
    totalDebit: "100000000",
    totalCredit: "100000000",
    status: "POSTED",
    linesCount: 2,
  },
  {
    id: "2",
    journalNo: "JV-PTM-2026-000002",
    date: "14 Nov 2026",
    description: "Pembelian Persediaan Barang Dagang",
    source: "MANUAL",
    totalDebit: "20000000",
    totalCredit: "20000000",
    status: "POSTED",
    linesCount: 2,
  },
  {
    id: "3",
    journalNo: "JV-PTM-2026-000003",
    date: "15 Nov 2026",
    description: "Penjualan Kredit Barang Dagang",
    source: "MANUAL",
    totalDebit: "15000000",
    totalCredit: "15000000",
    status: "APPROVED",
    linesCount: 2,
  },
  {
    id: "4",
    journalNo: "JV-PTM-2026-000004",
    date: "15 Nov 2026",
    description: "Pembayaran Beban Sewa Kantor Cabang",
    source: "MANUAL",
    totalDebit: "12500000",
    totalCredit: "12500000",
    status: "SUBMITTED",
    linesCount: 2,
  },
  {
    id: "5",
    journalNo: "JV-PTM-2026-000005",
    date: "15 Nov 2026",
    description: "Pengadaan Alat Tulis & Perlengkapan Operasional",
    source: "MANUAL",
    totalDebit: "3450000",
    totalCredit: "3450000",
    status: "DRAFT",
    linesCount: 2,
  },
]

export function JournalsPage() {
  const [journals] = React.useState<JournalRecord[]>(INITIAL_JOURNALS)
  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL")

  const filteredJournals = React.useMemo(() => {
    return journals.filter((j) => {
      if (search) {
        const q = search.toLowerCase()
        const match = j.journalNo.toLowerCase().includes(q) || j.description.toLowerCase().includes(q)
        if (!match) return false
      }
      if (statusFilter !== "ALL" && j.status !== statusFilter) {
        return false
      }
      return true
    })
  }, [journals, search, statusFilter])

  const getStatusBadge = (status: JournalRecord["status"]) => {
    switch (status) {
      case "POSTED":
        return <Badge variant="secondary" className="font-semibold text-[10px]">POSTED</Badge>
      case "APPROVED":
        return <Badge variant="outline" className="border-teal-500/40 text-teal-700 dark:text-teal-400 text-[10px]">APPROVED</Badge>
      case "SUBMITTED":
        return <Badge variant="outline" className="border-amber-500/40 text-amber-700 dark:text-amber-400 text-[10px]">SUBMITTED</Badge>
      case "DRAFT":
        return <Badge variant="outline" className="text-muted-foreground text-[10px]">DRAFT</Badge>
      case "REVERSED":
        return <Badge variant="destructive" className="text-[10px]">REVERSED</Badge>
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
            <BreadcrumbPage>Jurnal Umum</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-heading">
            Daftar Jurnal Umum
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Semua transaksi pembukuan berpasangan (double-entry) dengan siklus Draft → Submitted → Approved → Posted.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => toast.info("Ekspor CSV jurnal diunduh...")}>
            <Download className="size-3.5 mr-1.5" />
            Ekspor CSV
          </Button>
          <Button size="sm" onClick={() => toast.info("Form input jurnal baru dibuka...")}>
            <Plus className="size-3.5 mr-1.5" />
            Input Jurnal Baru
          </Button>
        </div>
      </div>

      {/* Main Table Card using shadcn Card */}
      <Card>
        <CardHeader className="border-b border-border/30 pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base font-semibold">Transaksi Jurnal Entri</CardTitle>
              <CardDescription className="text-xs">
                Menampilkan {filteredJournals.length} dari total {journals.length} entri jurnal periode November 2026.
              </CardDescription>
            </div>
            <CardAction>
              <div className="flex items-center gap-2">
                <div className="relative w-64">
                  <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Cari no. jurnal atau uraian..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-8 text-xs h-8"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-36 text-xs h-8">
                    <SelectValue placeholder="Semua Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Semua Status</SelectItem>
                    <SelectItem value="POSTED">POSTED</SelectItem>
                    <SelectItem value="APPROVED">APPROVED</SelectItem>
                    <SelectItem value="SUBMITTED">SUBMITTED</SelectItem>
                    <SelectItem value="DRAFT">DRAFT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardAction>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border/30 bg-muted/10 hover:bg-muted/10">
                <TableHead className="w-[170px] pl-6 font-semibold">No. Jurnal</TableHead>
                <TableHead className="w-[110px] font-semibold">Tanggal</TableHead>
                <TableHead className="font-semibold">Deskripsi Transaksi</TableHead>
                <TableHead className="w-[100px] text-center font-semibold">Sumber</TableHead>
                <TableHead className="w-[150px] text-right font-semibold">Total Debit</TableHead>
                <TableHead className="w-[150px] text-right font-semibold">Total Kredit</TableHead>
                <TableHead className="w-[110px] text-center font-semibold">Status</TableHead>
                <TableHead className="w-[60px] text-center pr-6 font-semibold">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredJournals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center text-muted-foreground text-xs">
                    Tidak ada jurnal yang sesuai dengan pencarian atau filter status.
                  </TableCell>
                </TableRow>
              ) : (
                filteredJournals.map((journal) => (
                  <TableRow key={journal.id} className="border-b border-border/20 hover:bg-muted/10 transition-colors">
                    <TableCell className="font-mono text-xs pl-6 font-semibold text-primary py-3">
                      {journal.journalNo}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground font-mono py-3">
                      {journal.date}
                    </TableCell>
                    <TableCell className="text-xs py-3">
                      <div className="font-medium text-foreground">{journal.description}</div>
                      <div className="text-[10px] text-muted-foreground">{journal.linesCount} baris entri</div>
                    </TableCell>
                    <TableCell className="text-center py-3">
                      <Badge variant="outline" className="text-[10px] text-muted-foreground">
                        {journal.source}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-xs font-mono py-3">
                      <MoneyText amount={journal.totalDebit} />
                    </TableCell>
                    <TableCell className="text-right text-xs font-mono py-3">
                      <MoneyText amount={journal.totalCredit} />
                    </TableCell>
                    <TableCell className="text-center py-3">
                      {getStatusBadge(journal.status)}
                    </TableCell>
                    <TableCell className="text-center pr-6 py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-7">
                            <MoreHorizontal className="size-3.5" />
                            <span className="sr-only">Menu Aksi Jurnal</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 text-xs">
                          <DropdownMenuItem onClick={() => toast.info(`Melihat detail ${journal.journalNo}`)}>
                            <Eye className="size-3.5 mr-2" />
                            Lihat Rincian Akun
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toast.info(`Mencetak voucher ${journal.journalNo}`)}>
                            <Printer className="size-3.5 mr-2" />
                            Cetak Bukti Jurnal
                          </DropdownMenuItem>
                          {journal.status === "POSTED" && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => toast.info(`Buat jurnal pembalik untuk ${journal.journalNo}`)}
                                className="text-amber-700 dark:text-amber-400"
                              >
                                <RotateCcw className="size-3.5 mr-2" />
                                Jurnal Pembalik (Reversal)
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
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
