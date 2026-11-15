import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Upload } from "lucide-react"

export function CoaPage() {
  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Chart of Accounts (COA)
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Daftar bagan akun berstruktur pohon (maksimal 5 level). Akun daun bertanda postable dapat digunakan pada jurnal.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="gap-1.5 text-xs">
            <Upload className="size-3.5" /> Impor COA (CSV)
          </Button>
          <Button size="sm" className="gap-1.5 text-xs bg-primary text-primary-foreground font-semibold">
            <Plus className="size-3.5" /> Tambah Akun
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border/40 bg-card shadow-xs">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border/30 bg-muted/20">
              <TableHead className="w-[120px] pl-5">Kode Akun</TableHead>
              <TableHead>Nama Akun</TableHead>
              <TableHead className="w-[120px]">Jenis</TableHead>
              <TableHead className="w-[120px]">Saldo Normal</TableHead>
              <TableHead className="w-[160px]">Kelompok Laporan</TableHead>
              <TableHead className="w-[100px] text-center pr-5">Postable</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="border-b border-border/20 font-semibold bg-muted/10">
              <TableCell className="font-mono pl-5 text-primary">1000</TableCell>
              <TableCell>ASET</TableCell>
              <TableCell><Badge variant="outline">ASSET</Badge></TableCell>
              <TableCell>DEBIT</TableCell>
              <TableCell className="text-muted-foreground">—</TableCell>
              <TableCell className="text-center pr-5"><Badge variant="secondary" className="text-[10px]">Header</Badge></TableCell>
            </TableRow>
            <TableRow className="border-b border-border/20">
              <TableCell className="font-mono pl-9 text-foreground font-medium">1100</TableCell>
              <TableCell className="pl-6">Kas dan Bank</TableCell>
              <TableCell><Badge variant="outline">ASSET</Badge></TableCell>
              <TableCell>DEBIT</TableCell>
              <TableCell className="text-muted-foreground">CASH</TableCell>
              <TableCell className="text-center pr-5"><Badge variant="secondary" className="text-[10px]">Header</Badge></TableCell>
            </TableRow>
            <TableRow className="border-b border-border/20 hover:bg-primary/[0.02]">
              <TableCell className="font-mono pl-12 text-primary font-bold">1101</TableCell>
              <TableCell className="pl-9 font-medium text-foreground">Kas Kecil</TableCell>
              <TableCell><Badge variant="outline">ASSET</Badge></TableCell>
              <TableCell className="text-emerald-600 font-semibold">DEBIT</TableCell>
              <TableCell className="text-muted-foreground">CASH</TableCell>
              <TableCell className="text-center pr-5"><Badge className="bg-emerald-600 text-white text-[10px]">Postable</Badge></TableCell>
            </TableRow>
            <TableRow className="border-b border-border/20 hover:bg-primary/[0.02]">
              <TableCell className="font-mono pl-12 text-primary font-bold">1102</TableCell>
              <TableCell className="pl-9 font-medium text-foreground">Bank Mandiri Utama</TableCell>
              <TableCell><Badge variant="outline">ASSET</Badge></TableCell>
              <TableCell className="text-emerald-600 font-semibold">DEBIT</TableCell>
              <TableCell className="text-muted-foreground">CASH</TableCell>
              <TableCell className="text-center pr-5"><Badge className="bg-emerald-600 text-white text-[10px]">Postable</Badge></TableCell>
            </TableRow>
            <TableRow className="border-b-0 font-semibold bg-muted/10">
              <TableCell className="font-mono pl-5 text-primary">2000</TableCell>
              <TableCell>LIABILITAS</TableCell>
              <TableCell><Badge variant="outline">LIABILITY</Badge></TableCell>
              <TableCell>KREDIT</TableCell>
              <TableCell className="text-muted-foreground">—</TableCell>
              <TableCell className="text-center pr-5"><Badge variant="secondary" className="text-[10px]">Header</Badge></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
