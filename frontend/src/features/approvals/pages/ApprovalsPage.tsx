import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoneyText } from "@/components/shared/MoneyText"
import { Check, X } from "lucide-react"

export function ApprovalsPage() {
  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
              Antrean Persetujuan (Maker-Checker)
            </h1>
            <Badge variant="outline" className="border-amber-500/40 text-amber-700 bg-amber-500/10 text-xs font-semibold">
              2 Menunggu Review
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Aturan Invariant INV-06: Pengguna yang menginput/mengajukan jurnal dilarang menyetujui jurnal yang sama.
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border/40 bg-card shadow-xs">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border/30 bg-muted/20">
              <TableHead className="w-[140px] pl-5">Draft ID</TableHead>
              <TableHead className="w-[120px]">Tanggal</TableHead>
              <TableHead>Deskripsi Transaksi</TableHead>
              <TableHead className="w-[140px]">Pembuat (Maker)</TableHead>
              <TableHead className="w-[160px] text-right">Total Debit</TableHead>
              <TableHead className="w-[160px] text-right">Total Kredit</TableHead>
              <TableHead className="w-[180px] text-center pr-5">Aksi Persetujuan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="border-b border-border/20 hover:bg-primary/[0.02]">
              <TableCell className="font-mono font-semibold text-primary pl-5">DRAFT-2026-089</TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">15 Nov 2026</TableCell>
              <TableCell className="font-medium text-foreground">Pembayaran Beban Sewa Kantor Cabang</TableCell>
              <TableCell className="text-muted-foreground">Dina (Accountant)</TableCell>
              <TableCell className="text-right"><MoneyText amount="12500000" /></TableCell>
              <TableCell className="text-right"><MoneyText amount="12500000" /></TableCell>
              <TableCell className="text-center pr-5">
                <div className="flex items-center justify-center gap-2">
                  <Button size="xs" variant="outline" className="text-destructive border-destructive/40 hover:bg-destructive/10">
                    <X className="size-3 mr-1" /> Tolak
                  </Button>
                  <Button size="xs" className="bg-primary text-primary-foreground font-semibold">
                    <Check className="size-3 mr-1" /> Setujui & Post
                  </Button>
                </div>
              </TableCell>
            </TableRow>
            <TableRow className="border-b-0 hover:bg-primary/[0.02]">
              <TableCell className="font-mono font-semibold text-primary pl-5">DRAFT-2026-090</TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">15 Nov 2026</TableCell>
              <TableCell className="font-medium text-foreground">Pengadaan Alat Tulis & Perlengkapan Operasional</TableCell>
              <TableCell className="text-muted-foreground">Dina (Accountant)</TableCell>
              <TableCell className="text-right"><MoneyText amount="3450000" /></TableCell>
              <TableCell className="text-right"><MoneyText amount="3450000" /></TableCell>
              <TableCell className="text-center pr-5">
                <div className="flex items-center justify-center gap-2">
                  <Button size="xs" variant="outline" className="text-destructive border-destructive/40 hover:bg-destructive/10">
                    <X className="size-3 mr-1" /> Tolak
                  </Button>
                  <Button size="xs" className="bg-primary text-primary-foreground font-semibold">
                    <Check className="size-3 mr-1" /> Setujui & Post
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
