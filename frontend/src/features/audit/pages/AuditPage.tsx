import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Lock, ShieldCheck } from "lucide-react"

export function AuditPage() {
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
            <BreadcrumbPage>Jejak Audit Append-Only</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-heading">
            Jejak Audit (Audit Trail)
          </h1>
          <Badge variant="outline" className="border-teal-500/40 text-teal-700 dark:text-teal-400 text-xs font-semibold">
            <Lock className="size-3 mr-1" /> Immutability Terjamin
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          Tabel log append-only dengan larangan UPDATE dan DELETE di level trigger PostgreSQL (INV-14).
        </p>
      </div>

      <Alert className="border-border/60 bg-muted/20">
        <ShieldCheck className="size-4 text-primary" />
        <AlertTitle className="text-xs font-semibold">Integritas Keamanan Log (INV-14)</AlertTitle>
        <AlertDescription className="text-xs text-muted-foreground">
          Database trigger mencegah modifikasi dan penghapusan data secara paksa. Setiap perubahan status jurnal mencatat ID pengguna, alamat IP, timestamp presisi milidetik, dan hash payload transaksi.
        </AlertDescription>
      </Alert>

      {/* Audit Log Card using shadcn Card */}
      <Card>
        <CardHeader className="border-b border-border/30 pb-4">
          <CardTitle className="text-base font-semibold">Log Transaksi & Tindakan Pengguna</CardTitle>
          <CardDescription className="text-xs">
            Kronologi terurut secara terbalik (terbaru di atas) untuk kebutuhan audit eksternal.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border/30 bg-muted/10 hover:bg-muted/10">
                <TableHead className="w-[190px] pl-6 font-semibold">Waktu Kejadian</TableHead>
                <TableHead className="w-[180px] font-semibold">Aktor (Pengguna)</TableHead>
                <TableHead className="w-[160px] font-semibold">Aksi Sistem</TableHead>
                <TableHead className="font-semibold">Rincian Payload</TableHead>
                <TableHead className="w-[140px] text-center pr-6 font-semibold">Hash Seal ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="border-b border-border/20 hover:bg-muted/10 transition-colors">
                <TableCell className="font-mono text-xs text-muted-foreground pl-6 py-3">
                  15 Nov 2026 09:15:22
                </TableCell>
                <TableCell className="text-xs font-medium text-foreground py-3">
                  Raka Pratama (Checker)
                </TableCell>
                <TableCell className="py-3">
                  <Badge variant="secondary" className="text-[10px] font-mono">
                    POST_JOURNAL
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground py-3">
                  journal_no: JV-PTM-2026-000003 • total: Rp 15.000.000,00
                </TableCell>
                <TableCell className="text-center pr-6 font-mono text-xs text-primary font-semibold py-3">
                  #SEAL-8821
                </TableCell>
              </TableRow>
              <TableRow className="border-b border-border/20 hover:bg-muted/10 transition-colors">
                <TableCell className="font-mono text-xs text-muted-foreground pl-6 py-3">
                  15 Nov 2026 08:30:10
                </TableCell>
                <TableCell className="text-xs font-medium text-foreground py-3">
                  Dina Putri (Maker)
                </TableCell>
                <TableCell className="py-3">
                  <Badge variant="outline" className="text-[10px] font-mono">
                    SUBMIT_JOURNAL
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground py-3">
                  draft_id: DFT-2026-089 • total: Rp 12.500.000,00
                </TableCell>
                <TableCell className="text-center pr-6 font-mono text-xs text-primary font-semibold py-3">
                  #SEAL-8820
                </TableCell>
              </TableRow>
              <TableRow className="border-b-0 hover:bg-muted/10 transition-colors">
                <TableCell className="font-mono text-xs text-muted-foreground pl-6 py-3">
                  14 Nov 2026 14:02:45
                </TableCell>
                <TableCell className="text-xs font-medium text-foreground py-3">
                  Maya Siregar (Controller)
                </TableCell>
                <TableCell className="py-3">
                  <Badge variant="outline" className="text-[10px] font-mono">
                    OPEN_PERIOD
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground py-3">
                  period_code: PER-2026-11 (November 2026)
                </TableCell>
                <TableCell className="text-center pr-6 font-mono text-xs text-primary font-semibold py-3">
                  #SEAL-8819
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
