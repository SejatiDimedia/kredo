import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Lock } from "lucide-react"

export function PeriodsPage() {
  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Periode Akuntansi & Tutup Buku
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Pengelolaan tahun fiskal 2026. Periode CLOSED dilindungi PostgreSQL Row Lock agar tidak menerima posting saat race condition.
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border/40 bg-card shadow-xs">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border/30 bg-muted/20">
              <TableHead className="w-[120px] pl-5">Periode ID</TableHead>
              <TableHead className="w-[180px]">Bulan / Tahun</TableHead>
              <TableHead className="w-[180px]">Rentang Tanggal</TableHead>
              <TableHead className="w-[140px] text-center">Status Periode</TableHead>
              <TableHead className="w-[180px] text-center">Neraca Saldo</TableHead>
              <TableHead className="w-[160px] text-center pr-5">Aksi Controller</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="border-b border-border/20">
              <TableCell className="font-mono pl-5 text-muted-foreground">PER-2026-10</TableCell>
              <TableCell className="font-semibold text-foreground">Oktober 2026</TableCell>
              <TableCell className="text-muted-foreground text-xs">01 Okt 2026 – 31 Okt 2026</TableCell>
              <TableCell className="text-center">
                <Badge variant="outline" className="border-slate-400 text-slate-600 dark:text-slate-300">
                  <Lock className="size-3 mr-1" /> CLOSED
                </Badge>
              </TableCell>
              <TableCell className="text-center text-emerald-600 font-semibold text-xs">
                Seimbang (0 Variance)
              </TableCell>
              <TableCell className="text-center pr-5">
                <Button size="xs" variant="outline" className="text-xs">Buka Kembali</Button>
              </TableCell>
            </TableRow>
            <TableRow className="border-b border-border/20 bg-teal-500/[0.03]">
              <TableCell className="font-mono pl-5 text-primary font-bold">PER-2026-11</TableCell>
              <TableCell className="font-bold text-foreground">November 2026 (Aktif)</TableCell>
              <TableCell className="text-muted-foreground text-xs">01 Nov 2026 – 30 Nov 2026</TableCell>
              <TableCell className="text-center">
                <Badge className="bg-emerald-600 text-white font-semibold text-xs">
                  <span className="size-1.5 rounded-full bg-white mr-1.5 animate-pulse" /> OPEN
                </Badge>
              </TableCell>
              <TableCell className="text-center text-emerald-600 font-semibold text-xs">
                Seimbang (0 Variance)
              </TableCell>
              <TableCell className="text-center pr-5">
                <Button size="xs" variant="outline" className="text-amber-700 border-amber-500/40 hover:bg-amber-500/10 text-xs">
                  Tutup Periode
                </Button>
              </TableCell>
            </TableRow>
            <TableRow className="border-b-0">
              <TableCell className="font-mono pl-5 text-muted-foreground">PER-2026-12</TableCell>
              <TableCell className="font-medium text-muted-foreground">Desember 2026</TableCell>
              <TableCell className="text-muted-foreground text-xs">01 Des 2026 – 31 Des 2026</TableCell>
              <TableCell className="text-center">
                <Badge variant="outline" className="text-muted-foreground">FUTURE</Badge>
              </TableCell>
              <TableCell className="text-center text-muted-foreground text-xs">—</TableCell>
              <TableCell className="text-center pr-5">
                <Button size="xs" variant="outline" disabled className="text-xs">Buka Periode</Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
