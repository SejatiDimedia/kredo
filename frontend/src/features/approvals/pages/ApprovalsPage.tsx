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
import { MoneyText } from "@/components/shared/MoneyText"
import { Check, X, ShieldAlert, FileText } from "lucide-react"

interface DraftApproval {
  id: string
  draftId: string
  date: string
  description: string
  maker: string
  totalDebit: string
  totalCredit: string
  lineCount: number
}

const INITIAL_DRAFTS: DraftApproval[] = [
  {
    id: "1",
    draftId: "DFT-2026-089",
    date: "15 Nov 2026",
    description: "Pembayaran Beban Sewa Kantor Cabang",
    maker: "Dina Putri (Accountant)",
    totalDebit: "12500000",
    totalCredit: "12500000",
    lineCount: 2,
  },
  {
    id: "2",
    draftId: "DFT-2026-090",
    date: "15 Nov 2026",
    description: "Pengadaan Alat Tulis & Perlengkapan Operasional",
    maker: "Dina Putri (Accountant)",
    totalDebit: "3450000",
    totalCredit: "3450000",
    lineCount: 2,
  },
]

export function ApprovalsPage() {
  const [drafts, setDrafts] = React.useState<DraftApproval[]>(INITIAL_DRAFTS)

  const handleApprove = (draftId: string, desc: string) => {
    setDrafts((prev) => prev.filter((d) => d.draftId !== draftId))
    toast.success(`Jurnal ${draftId} disetujui & diposting ke Buku Besar: "${desc}"`)
  }

  const handleReject = (draftId: string) => {
    setDrafts((prev) => prev.filter((d) => d.draftId !== draftId))
    toast.error(`Draft ${draftId} dikembalikan ke pembuat (Maker) untuk perbaikan`)
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
            <BreadcrumbPage>Persetujuan Jurnal</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground font-heading">
              Antrean Persetujuan Jurnal
            </h1>
            <Badge variant="outline" className="border-amber-500/40 text-amber-700 dark:text-amber-400 text-xs">
              {drafts.length} Menunggu Verifikasi
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Mekanisme Maker-Checker (Segregation of Duties). Hanya Akuntan Senior / Checker yang dapat menyetujui jurnal.
          </p>
        </div>
      </div>

      {/* Segregation of Duties Alert (INV-06) */}
      <Alert className="border-border/60 bg-muted/20">
        <ShieldAlert className="size-4 text-primary" />
        <AlertTitle className="text-xs font-semibold">Aturan Invariant Keamanan INV-06</AlertTitle>
        <AlertDescription className="text-xs text-muted-foreground">
          Pengguna yang membuat (Maker) dilarang menyetujui draf jurnal yang diajukannya sendiri. Sistem secara otomatis menolak otorisasi jika pembuat mencoba memposting jurnal sendiri.
        </AlertDescription>
      </Alert>

      {/* Main Approval Table Card using shadcn Card */}
      <Card>
        <CardHeader className="border-b border-border/30 pb-4">
          <CardTitle className="text-base font-semibold">Draf Jurnal Perlu Verifikasi</CardTitle>
          <CardDescription className="text-xs">
            Periksa baris akun debit dan kredit sebelum mengesahkan jurnal ke buku besar permanen.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border/30 bg-muted/10 hover:bg-muted/10">
                <TableHead className="w-[140px] pl-6 font-semibold">Draft ID</TableHead>
                <TableHead className="w-[110px] font-semibold">Tanggal</TableHead>
                <TableHead className="font-semibold">Deskripsi Transaksi</TableHead>
                <TableHead className="w-[180px] font-semibold">Pembuat (Maker)</TableHead>
                <TableHead className="w-[150px] text-right font-semibold">Total Debit</TableHead>
                <TableHead className="w-[150px] text-right font-semibold">Total Kredit</TableHead>
                <TableHead className="w-[180px] text-center pr-6 font-semibold">Aksi Otorisasi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {drafts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-muted-foreground text-xs">
                    Seluruh draf telah diproses. Tidak ada jurnal yang menunggu persetujuan.
                  </TableCell>
                </TableRow>
              ) : (
                drafts.map((draft) => (
                  <TableRow key={draft.id} className="border-b border-border/20 hover:bg-muted/10 transition-colors">
                    <TableCell className="font-mono text-xs pl-6 font-semibold text-primary py-3">
                      {draft.draftId}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground font-mono py-3">
                      {draft.date}
                    </TableCell>
                    <TableCell className="text-xs py-3">
                      <div className="font-medium text-foreground">{draft.description}</div>
                      <div className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                        <FileText className="size-3" /> {draft.lineCount} baris akun
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground py-3">
                      {draft.maker}
                    </TableCell>
                    <TableCell className="text-right text-xs font-mono py-3">
                      <MoneyText amount={draft.totalDebit} />
                    </TableCell>
                    <TableCell className="text-right text-xs font-mono py-3">
                      <MoneyText amount={draft.totalCredit} />
                    </TableCell>
                    <TableCell className="text-center pr-6 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          size="xs"
                          variant="outline"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => handleReject(draft.draftId)}
                        >
                          <X className="size-3 mr-1" />
                          Tolak
                        </Button>
                        <Button
                          size="xs"
                          onClick={() => handleApprove(draft.draftId, draft.description)}
                        >
                          <Check className="size-3 mr-1" />
                          Setujui & Post
                        </Button>
                      </div>
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
