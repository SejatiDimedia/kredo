import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UploadCloud } from "lucide-react"

export function ImportsPage() {
  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
          Impor Massal (Spring Batch Engine)
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Proses impor file CSV hingga ratusan ribu baris dengan kemampuan chunking, idempotensi hash, dan restartability.
        </p>
      </div>

      <Card className="border-dashed border-2 border-border/80 p-8 text-center shadow-xs">
        <div className="flex flex-col items-center justify-center gap-3 max-w-md mx-auto">
          <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <UploadCloud className="size-6" />
          </div>
          <div>
            <h3 className="font-heading text-sm font-bold text-foreground">Unggah Berkas Jurnal CSV</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Kolom wajib: <code>journal_ref, entry_date, description, account_code, debit, credit, memo</code>.
            </p>
          </div>
          <Button size="sm" className="mt-2 bg-primary text-primary-foreground font-semibold">
            Pilih Berkas CSV
          </Button>
        </div>
      </Card>
    </div>
  )
}
