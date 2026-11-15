import { useParams, useNavigate } from "react-router-dom"
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
import { MoneyText } from "@/components/shared/MoneyText"
import {
  ArrowLeft,
  Printer,
  RotateCcw,
  CheckCircle2,
  Clock,
  User,
  Hash,
} from "lucide-react"

export function JournalDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  // Mock detail data matching the requested journal ID or fallback
  const journal = {
    journalNo: id || "JV-PTM-2026-000003",
    date: "15 Nov 2026",
    period: "Nov 2026 (OPEN)",
    description: "Penjualan Kredit Barang Dagang",
    reference: "INV/2026/11/0088",
    status: "POSTED" as const,
    source: "MANUAL",
    totalDebit: "15000000",
    totalCredit: "15000000",
    maker: "Dina Putri (Accountant)",
    approver: "Raka Pratama (Checker)",
    lines: [
      {
        lineNo: 1,
        accountCode: "1201",
        accountName: "Piutang Dagang Pihak Ketiga",
        category: "ASET",
        debit: "15000000",
        credit: "0",
        memo: "Faktur Penjualan PT Berkah Abadi",
      },
      {
        lineNo: 2,
        accountCode: "4101",
        accountName: "Pendapatan Penjualan Produk",
        category: "PENDAPATAN",
        debit: "0",
        credit: "15000000",
        memo: "Pendapatan atas transaksi INV/2026/11/0088",
      },
    ],
    timeline: [
      {
        action: "POST_JOURNAL",
        actor: "Raka Pratama (Checker)",
        timestamp: "15 Nov 2026 09:15:22",
        statusFrom: "APPROVED",
        statusTo: "POSTED",
        note: "Disahkan dan diposting ke Buku Besar secara permanen.",
      },
      {
        action: "APPROVE_JOURNAL",
        actor: "Raka Pratama (Checker)",
        timestamp: "15 Nov 2026 09:10:05",
        statusFrom: "SUBMITTED",
        statusTo: "APPROVED",
        note: "Kelengkapan faktur diverifikasi dan seimbang.",
      },
      {
        action: "SUBMIT_JOURNAL",
        actor: "Dina Putri (Maker)",
        timestamp: "15 Nov 2026 08:30:10",
        statusFrom: "DRAFT",
        statusTo: "SUBMITTED",
        note: "Diajukan untuk persetujuan supervisor.",
      },
    ],
  }

  const handleReverseJournal = () => {
    toast.success(`Jurnal pembalik (reversal) untuk ${journal.journalNo} berhasil dibuat di periode OPEN!`)
    navigate("/journals")
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
            <BreadcrumbLink href="/journals">Jurnal Umum</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{journal.journalNo}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => navigate("/journals")}
          >
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-foreground font-heading">
                {journal.journalNo}
              </h1>
              <Badge variant="secondary" className="font-semibold text-xs">
                {journal.status}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {journal.source}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {journal.description} • Periode: {journal.period}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="size-3.5 mr-1.5" />
            Cetak Voucher Jurnal
          </Button>
          {journal.status === "POSTED" && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleReverseJournal}
              className="border-amber-500/40 text-amber-700 dark:text-amber-400 hover:bg-amber-500/10"
            >
              <RotateCcw className="size-3.5 mr-1.5" />
              Buat Jurnal Pembalik (Reversal)
            </Button>
          )}
        </div>
      </div>

      {/* Metadata Overview Card */}
      <Card>
        <CardContent className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-muted-foreground flex items-center gap-1">
              <Clock className="size-3" /> Tanggal Transaksi
            </span>
            <span className="font-semibold font-mono text-foreground text-sm mt-0.5 block">
              {journal.date}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground flex items-center gap-1">
              <Hash className="size-3" /> No. Referensi
            </span>
            <span className="font-semibold font-mono text-foreground text-sm mt-0.5 block">
              {journal.reference}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground flex items-center gap-1">
              <User className="size-3" /> Pembuat (Maker)
            </span>
            <span className="font-medium text-foreground text-sm mt-0.5 block">
              {journal.maker}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground flex items-center gap-1">
              <CheckCircle2 className="size-3 text-teal-600" /> Penyetuju (Checker)
            </span>
            <span className="font-medium text-foreground text-sm mt-0.5 block">
              {journal.approver}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Lines Table Card */}
      <Card>
        <CardHeader className="border-b border-border/30 pb-3">
          <CardTitle className="text-sm font-semibold">Rincian Baris Debit & Kredit</CardTitle>
          <CardDescription className="text-xs">
            Dua sisi transaksi double-entry yang memengaruhi buku besar.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border/30 bg-muted/10 hover:bg-muted/10">
                <TableHead className="w-[50px] pl-6 text-center font-semibold">#</TableHead>
                <TableHead className="w-[140px] font-semibold">Kode Akun</TableHead>
                <TableHead className="font-semibold">Nama Akun Buku Besar</TableHead>
                <TableHead className="w-[160px] text-right font-semibold">Debit (IDR)</TableHead>
                <TableHead className="w-[160px] text-right font-semibold">Kredit (IDR)</TableHead>
                <TableHead className="pr-6 font-semibold">Keterangan Memo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {journal.lines.map((line) => (
                <TableRow key={line.lineNo} className="border-b border-border/20 hover:bg-muted/10">
                  <TableCell className="pl-6 text-center font-mono text-xs text-muted-foreground py-3">
                    {line.lineNo}
                  </TableCell>
                  <TableCell className="font-mono text-xs font-semibold text-primary py-3">
                    {line.accountCode}
                  </TableCell>
                  <TableCell className="text-xs font-medium py-3">
                    {line.accountName}
                    <span className="text-[10px] text-muted-foreground ml-2">({line.category})</span>
                  </TableCell>
                  <TableCell className="text-right text-xs font-mono py-3">
                    <MoneyText amount={line.debit} />
                  </TableCell>
                  <TableCell className="text-right text-xs font-mono py-3">
                    <MoneyText amount={line.credit} />
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground pr-6 py-3">
                    {line.memo}
                  </TableCell>
                </TableRow>
              ))}

              {/* Total Balance Row */}
              <TableRow className="border-t-2 border-border/60 bg-muted/20 font-bold">
                <TableCell colSpan={3} className="pl-6 text-foreground text-xs py-3">
                  TOTAL KESEIMBANGAN JURNAL (INV-01)
                </TableCell>
                <TableCell className="text-right text-xs font-mono py-3">
                  <MoneyText amount={journal.totalDebit} className="font-bold text-foreground" />
                </TableCell>
                <TableCell className="text-right text-xs font-mono py-3">
                  <MoneyText amount={journal.totalCredit} className="font-bold text-foreground" />
                </TableCell>
                <TableCell className="pr-6 text-xs text-emerald-700 dark:text-emerald-400 font-extrabold py-3">
                  <span className="inline-flex items-center gap-1">
                    <CheckCircle2 className="size-3.5" /> SEIMBANG (0 VARIATION)
                  </span>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Audit Status Timeline Card (FR-JRN-10) */}
      <Card>
        <CardHeader className="border-b border-border/30 pb-3">
          <CardTitle className="text-sm font-semibold">Linimasa Riwayat Status (Audit Trail)</CardTitle>
          <CardDescription className="text-xs">
            Jejak waktu dan aktor otorisasi perpindahan siklus jurnal.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          {journal.timeline.map((step, idx) => (
            <div key={idx} className="flex items-start gap-3 text-xs">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary mt-0.5">
                <CheckCircle2 className="size-3.5" />
              </div>
              <div className="flex-1 space-y-0.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">
                    {step.action} ({step.statusFrom} → {step.statusTo})
                  </span>
                  <span className="text-[11px] font-mono text-muted-foreground">
                    {step.timestamp}
                  </span>
                </div>
                <p className="text-muted-foreground">Oleh: <strong className="text-foreground">{step.actor}</strong></p>
                <p className="text-xs text-muted-foreground/80 italic">{step.note}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
