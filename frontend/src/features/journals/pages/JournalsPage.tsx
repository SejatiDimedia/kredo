import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoneyText } from "@/components/shared/MoneyText"
import { Plus, Download } from "lucide-react"

export function JournalsPage() {
  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Daftar Jurnal Umum
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Seluruh transaksi akuntansi double-entry (Draft, Submitted, Approved, dan Posted).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="gap-1.5 text-xs">
            <Download className="size-3.5" /> Ekspor CSV
          </Button>
          <Button size="sm" className="gap-1.5 text-xs bg-primary text-primary-foreground font-semibold">
            <Plus className="size-3.5" /> Input Jurnal Baru
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border/40 bg-card shadow-xs">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border/30 bg-muted/20">
              <TableHead className="w-[160px] pl-5">No. Jurnal</TableHead>
              <TableHead className="w-[110px]">Tanggal</TableHead>
              <TableHead>Deskripsi Transaksi</TableHead>
              <TableHead className="w-[140px] text-center">Sumber</TableHead>
              <TableHead className="w-[160px] text-right">Total Debit (IDR)</TableHead>
              <TableHead className="w-[160px] text-right">Total Kredit (IDR)</TableHead>
              <TableHead className="w-[110px] text-center pr-5">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="border-b border-border/20 hover:bg-primary/[0.02]">
              <TableCell className="font-mono font-semibold text-primary pl-5">JV-PTM-2026-000001</TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">14 Nov 2026</TableCell>
              <TableCell className="font-medium text-foreground">Setoran Modal Pemilik Tunai</TableCell>
              <TableCell className="text-center"><Badge variant="outline" className="text-[10px]">MANUAL</Badge></TableCell>
              <TableCell className="text-right"><MoneyText amount="100000000" /></TableCell>
              <TableCell className="text-right"><MoneyText amount="100000000" /></TableCell>
              <TableCell className="text-center pr-5"><Badge className="bg-emerald-600 text-white text-[10px]">POSTED</Badge></TableCell>
            </TableRow>
            <TableRow className="border-b border-border/20 hover:bg-primary/[0.02]">
              <TableCell className="font-mono font-semibold text-primary pl-5">JV-PTM-2026-000002</TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">14 Nov 2026</TableCell>
              <TableCell className="font-medium text-foreground">Beli Persediaan Barang Dagang</TableCell>
              <TableCell className="text-center"><Badge variant="outline" className="text-[10px]">MANUAL</Badge></TableCell>
              <TableCell className="text-right"><MoneyText amount="20000000" /></TableCell>
              <TableCell className="text-right"><MoneyText amount="20000000" /></TableCell>
              <TableCell className="text-center pr-5"><Badge className="bg-emerald-600 text-white text-[10px]">POSTED</Badge></TableCell>
            </TableRow>
            <TableRow className="border-b-0 hover:bg-primary/[0.02]">
              <TableCell className="font-mono font-semibold text-primary pl-5">JV-PTM-2026-000003</TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">15 Nov 2026</TableCell>
              <TableCell className="font-medium text-foreground">Penjualan Kredit Barang Dagang</TableCell>
              <TableCell className="text-center"><Badge variant="outline" className="text-[10px]">MANUAL</Badge></TableCell>
              <TableCell className="text-right"><MoneyText amount="15000000" /></TableCell>
              <TableCell className="text-right"><MoneyText amount="15000000" /></TableCell>
              <TableCell className="text-center pr-5">
                <Badge variant="outline" className="border-teal-500/40 bg-teal-500/10 text-teal-700 text-[10px]">
                  APPROVED
                </Badge>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
