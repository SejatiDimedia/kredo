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
  CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { UploadCloud, FileSpreadsheet, CheckCircle2 } from "lucide-react"

export function ImportsPage() {
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
            <BreadcrumbPage>Impor Massal CSV</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground font-heading">
          Impor Massal Jurnal (Batch Engine)
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Pemrosesan berkas CSV puluhan ribu baris dengan validasi idempotensi hash (SHA-256) dan restartability chunk.
        </p>
      </div>

      <Alert className="border-border/60 bg-muted/20">
        <CheckCircle2 className="size-4 text-primary" />
        <AlertTitle className="text-xs font-semibold">Validasi Format CSV</AlertTitle>
        <AlertDescription className="text-xs text-muted-foreground">
          Kolom wajib pada berkas CSV: <code>journal_ref, entry_date, description, account_code, debit, credit, memo</code>. Pastikan setiap <code>journal_ref</code> memiliki total debit dan kredit yang seimbang.
        </AlertDescription>
      </Alert>

      <Card className="border-dashed border-2 p-8 text-center">
        <CardContent className="flex flex-col items-center justify-center gap-4 max-w-md mx-auto p-0">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted text-foreground">
            <UploadCloud className="size-6 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Unggah Berkas Jurnal CSV</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Tarik dan letakkan berkas CSV Anda di sini, atau klik tombol di bawah untuk memilih berkas dari komputer.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm">
              <FileSpreadsheet className="size-4 mr-2" />
              Pilih Berkas CSV
            </Button>
            <Button size="sm" variant="outline">
              Unduh Templat CSV
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
