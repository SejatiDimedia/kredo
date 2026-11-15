import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Lock } from "lucide-react"

export function AuditPage() {
  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Jejak Audit Append-Only (Audit Trail)
          </h1>
          <Badge variant="outline" className="border-emerald-500/40 text-emerald-600 bg-emerald-500/10 text-xs font-semibold">
            <Lock className="size-3 mr-1" /> Immutability Terjamin
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          Tabel log append-only dengan larangan UPDATE dan DELETE di level trigger database PostgreSQL (INV-14).
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-border/40 bg-card shadow-xs">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border/30 bg-muted/20">
              <TableHead className="w-[180px] pl-5">Waktu Kejadian</TableHead>
              <TableHead className="w-[140px]">Aktor (User)</TableHead>
              <TableHead className="w-[180px]">Aksi Keamanan</TableHead>
              <TableHead>Rincian Payload</TableHead>
              <TableHead className="w-[140px] text-center pr-5">Hash Seal ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="border-b border-border/20">
              <TableCell className="font-mono text-xs text-muted-foreground pl-5">15 Nov 2026 09:15:22</TableCell>
              <TableCell className="font-medium text-foreground">Raka (Approver)</TableCell>
              <TableCell><Badge className="bg-primary text-primary-foreground text-[10px]">POST_JOURNAL</Badge></TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">entry_id: 104, journal_no: JV-PTM-2026-000003</TableCell>
              <TableCell className="text-center pr-5 font-mono text-xs text-teal-600 font-semibold">#SEAL-8821</TableCell>
            </TableRow>
            <TableRow className="border-b-0">
              <TableCell className="font-mono text-xs text-muted-foreground pl-5">15 Nov 2026 08:30:10</TableCell>
              <TableCell className="font-medium text-foreground">Dina (Accountant)</TableCell>
              <TableCell><Badge variant="outline" className="text-[10px]">SUBMIT_JOURNAL</Badge></TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">entry_id: 104, total: Rp 15.000.000,00</TableCell>
              <TableCell className="text-center pr-5 font-mono text-xs text-teal-600 font-semibold">#SEAL-8821</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
