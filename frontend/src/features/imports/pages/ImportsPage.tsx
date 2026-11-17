import * as React from "react"
import { useNavigate } from "react-router-dom"
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
import { Button } from "@/components/ui/button"
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
import { apiFetch } from "@/lib/api"
import type { ImportJobResponse } from "../types"
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Download,
  FileCheck,
  ArrowRight,
  Database,
  History,
  FileX2,
} from "lucide-react"

export function ImportsPage() {
  const navigate = useNavigate()
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  // Upload state
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)
  const [isAutoPost, setIsAutoPost] = React.useState(true)
  const [isForce, setIsForce] = React.useState(false)
  const [isUploading, setIsUploading] = React.useState(false)
  const [uploadError, setUploadError] = React.useState<string | null>(null)
  const [latestResult, setLatestResult] = React.useState<ImportJobResponse | null>(null)

  // History state
  const [jobHistory, setJobHistory] = React.useState<ImportJobResponse[]>([])
  const [isLoadingHistory, setIsLoadingHistory] = React.useState(true)

  // Load history from backend
  const loadJobHistory = React.useCallback(async () => {
    try {
      setIsLoadingHistory(true)
      const data = await apiFetch<ImportJobResponse[]>("/imports/jobs?entityId=1")
      setJobHistory(data)
    } catch {
      // Backend endpoint might still be starting
    } finally {
      setIsLoadingHistory(false)
    }
  }, [])

  React.useEffect(() => {
    loadJobHistory()
  }, [loadJobHistory])

  // Handle file select
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      if (!file.name.toLowerCase().endsWith(".csv")) {
        setUploadError("Berkas yang dipilih harus berekstensi .csv")
        setSelectedFile(null)
        return
      }
      setSelectedFile(file)
      setUploadError(null)
    }
  }

  // Handle drag and drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      if (!file.name.toLowerCase().endsWith(".csv")) {
        setUploadError("Hanya berkas berekstensi .csv yang didukung")
        return
      }
      setSelectedFile(file)
      setUploadError(null)
    }
  }

  // Handle template download
  const handleDownloadTemplate = () => {
    const csvContent =
      "journal_ref,entry_date,description,account_code,debit,credit,memo\n" +
      "JRN-001,2026-11-15,Penerimaan Piutang Usaha Konsumen,1102,15000000.00,0.00,Setoran via Bank BCA\n" +
      "JRN-001,2026-11-15,Penerimaan Piutang Usaha Konsumen,1201,0.00,15000000.00,Pelunasan Piutang PT ABC\n" +
      "JRN-002,2026-11-16,Pembayaran Beban Gaji Karyawan,6301,8500000.00,0.00,Gaji Staf Operasional\n" +
      "JRN-002,2026-11-16,Pembayaran Beban Gaji Karyawan,1102,0.00,8500000.00,Transfer Bank BCA\n"

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", "templat_impor_jurnal_kredo.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Execute upload
  const handleUpload = async () => {
    if (!selectedFile) return

    try {
      setIsUploading(true)
      setUploadError(null)

      const formData = new FormData()
      formData.append("file", selectedFile)

      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1"
      const res = await fetch(
        `${baseUrl}/imports/csv?entityId=1&autoPost=${isAutoPost}&force=${isForce}`,
        {
          method: "POST",
          body: formData,
        }
      )

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.message || `Gagal mengunggah berkas (${res.status}: ${res.statusText})`)
      }

      const result: ImportJobResponse = await res.json()
      setLatestResult(result)
      setSelectedFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ""
      await loadJobHistory()
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Terjadi kesalahan saat memproses impor CSV")
    } finally {
      setIsUploading(false)
    }
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
            <BreadcrumbPage>Impor Massal CSV</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground font-heading">
              Impor Massal Jurnal (Batch Engine)
            </h1>
            <Badge variant="outline" className="border-primary/40 text-primary text-xs font-semibold">
              <FileSpreadsheet className="size-3 mr-1" /> Chunk Processing
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Pemrosesan berkas CSV transaksi massal dengan validasi idempotensi hash (SHA-256) dan toleransi parsial per-jurnal.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadTemplate}
            className="text-xs gap-1.5"
          >
            <Download className="size-3.5" />
            Unduh Templat CSV
          </Button>
        </div>
      </div>

      {/* Format Specification Banner */}
      <Alert className="border-border/60 bg-muted/20">
        <CheckCircle2 className="size-4 text-primary" />
        <AlertTitle className="text-xs font-semibold">Struktur Kolom CSV yang Didukung</AlertTitle>
        <AlertDescription className="text-xs text-muted-foreground">
          Kolom wajib pada baris pertama: <code>journal_ref, entry_date, description, account_code, debit, credit, memo</code>.
          Setiap baris dengan <code>journal_ref</code> yang sama akan dihimpun menjadi 1 voucher jurnal double-entry.
        </AlertDescription>
      </Alert>

      {/* UPLOAD & CONTROLS CARD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-dashed border-2 p-6 flex flex-col justify-center items-center text-center">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />

          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="w-full flex flex-col items-center justify-center gap-3 py-6"
          >
            <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <UploadCloud className="size-7" />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground">
                {selectedFile ? selectedFile.name : "Pilih atau Tarik Berkas CSV ke Sini"}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                {selectedFile
                  ? `Ukuran berkas: ${(selectedFile.size / 1024).toFixed(1)} KB`
                  : "Mendukung berkas CSV dengan pemisah koma. Maksimal ukuran 10 MB per berkas."}
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Button
                size="sm"
                variant={selectedFile ? "outline" : "default"}
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="text-xs gap-1.5"
              >
                <FileSpreadsheet className="size-3.5" />
                {selectedFile ? "Ganti Berkas" : "Pilih Berkas CSV"}
              </Button>

              {selectedFile && (
                <Button
                  size="sm"
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="text-xs gap-1.5"
                >
                  {isUploading ? (
                    <>
                      <RefreshCw className="size-3.5 animate-spin" />
                      Memproses Batch...
                    </>
                  ) : (
                    <>
                      <FileCheck className="size-3.5" />
                      Mulai Proses Impor
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* SETTINGS CARD */}
        <Card className="border-border/60">
          <CardHeader className="pb-3 border-b border-border/30">
            <CardTitle className="text-sm font-semibold">Opsi Pemrosesan Batch</CardTitle>
            <CardDescription className="text-xs">
              Konfigurasi alur posting dan penanganan idempotensi berkas.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-4 text-xs">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isAutoPost}
                onChange={(e) => setIsAutoPost(e.target.checked)}
                className="mt-0.5 rounded border-border text-primary focus:ring-primary"
              />
              <div>
                <span className="font-semibold text-foreground block">Langsung Posting ke Buku Besar</span>
                <span className="text-muted-foreground text-[11px]">
                  Jurnal yang valid otomatis dialokasikan nomor resmi tanpa celah dan memperbarui saldo.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isForce}
                onChange={(e) => setIsForce(e.target.checked)}
                className="mt-0.5 rounded border-border text-primary focus:ring-primary"
              />
              <div>
                <span className="font-semibold text-foreground block">Paksa Impor Ulang</span>
                <span className="text-muted-foreground text-[11px]">
                  Abaikan penolakan idempotensi jika berkas dengan hash identik pernah diunggah sebelumnya.
                </span>
              </div>
            </label>

            <div className="pt-2 border-t border-border/30">
              <div className="rounded-lg bg-muted/30 p-2.5 text-[11px] text-muted-foreground space-y-1">
                <span className="font-semibold text-foreground block">Pencegahan Transaksi Ganda:</span>
                Sistem menghasilkan hash SHA-256 unik per isi berkas untuk memastikan transaksi massal tidak terduplikasi.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ERROR ALERT */}
      {uploadError && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle className="text-xs font-semibold">Impor Ditolak</AlertTitle>
          <AlertDescription className="text-xs">{uploadError}</AlertDescription>
        </Alert>
      )}

      {/* LATEST RESULT CARD */}
      {latestResult && (
        <Card className="border-border/60 shadow-sm border-l-4 border-l-primary">
          <CardHeader className="pb-3 border-b border-border/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck className="size-4 text-primary" />
                <div>
                  <CardTitle className="text-sm font-semibold">Hasil Impor: {latestResult.fileName}</CardTitle>
                  <CardDescription className="text-xs font-mono">
                    SHA-256: {latestResult.fileHash.slice(0, 16)}... • Status: {latestResult.status}
                  </CardDescription>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/journals")}
                className="text-xs gap-1.5"
              >
                Lihat di Buku Jurnal
                <ArrowRight className="size-3" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="pt-4 space-y-4">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-lg bg-muted/40 border border-border/30">
                <span className="text-[10px] text-muted-foreground uppercase font-medium">Total Baris CSV</span>
                <span className="text-base font-bold font-mono text-foreground mt-0.5 block">
                  {latestResult.totalRows} Baris
                </span>
              </div>
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 uppercase font-medium">
                  Jurnal Berhasil
                </span>
                <span className="text-base font-bold font-mono text-emerald-700 dark:text-emerald-400 mt-0.5 block">
                  {latestResult.successCount} Voucher
                </span>
              </div>
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <span className="text-[10px] text-destructive uppercase font-medium">Jurnal Gagal</span>
                <span className="text-base font-bold font-mono text-destructive mt-0.5 block">
                  {latestResult.failureCount} Voucher
                </span>
              </div>
            </div>

            {/* Error Lines Table if any */}
            {latestResult.errors && latestResult.errors.length > 0 && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-destructive">
                  <FileX2 className="size-4" />
                  Daftar Baris yang Gagal Divalidasi:
                </div>
                <div className="border border-border/40 rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader className="bg-muted/20">
                      <TableRow>
                        <TableHead className="w-28 text-xs">Ref Jurnal</TableHead>
                        <TableHead className="w-20 text-xs">Baris</TableHead>
                        <TableHead className="w-28 text-xs">Kode Akun</TableHead>
                        <TableHead className="text-xs">Alasan Penolakan</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {latestResult.errors.map((err, idx) => (
                        <TableRow key={idx} className="text-xs font-mono">
                          <TableCell className="font-semibold text-foreground">{err.journalRef}</TableCell>
                          <TableCell className="text-muted-foreground">{err.lineNo}</TableCell>
                          <TableCell className="text-primary">{err.accountCode || "-"}</TableCell>
                          <TableCell className="text-destructive font-sans text-xs">{err.reason}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* JOB HISTORY TABLE CARD */}
      <Card>
        <CardHeader className="border-b border-border/30 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="size-4 text-primary" />
              <div>
                <CardTitle className="text-base font-semibold">Riwayat Eksekusi Impor Massal</CardTitle>
                <CardDescription className="text-xs">
                  Rekaman jejak seluruh berkas batch yang pernah diproses oleh sistem.
                </CardDescription>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={loadJobHistory}
              disabled={isLoadingHistory}
              className="text-xs gap-1.5"
            >
              <RefreshCw className={`size-3.5 ${isLoadingHistory ? "animate-spin" : ""}`} />
              Perbarui Riwayat
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border/30 bg-muted/10 hover:bg-muted/10">
                <TableHead className="w-[180px] pl-6 font-semibold">Waktu Impor</TableHead>
                <TableHead className="font-semibold">Nama Berkas</TableHead>
                <TableHead className="w-[160px] font-semibold">Hash Idempotensi</TableHead>
                <TableHead className="w-[120px] text-center font-semibold">Total Baris</TableHead>
                <TableHead className="w-[150px] text-center font-semibold">Berhasil / Gagal</TableHead>
                <TableHead className="w-[130px] text-center pr-6 font-semibold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingHistory ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center text-xs text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <RefreshCw className="size-5 animate-spin text-primary" />
                      <span>Memuat riwayat impor batch...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : jobHistory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center text-xs text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-1.5">
                      <Database className="size-6 text-muted-foreground/40" />
                      <span className="font-medium text-foreground">Belum ada riwayat impor</span>
                      <span className="text-[11px]">
                        Unggah berkas CSV pertama Anda di atas untuk memproses transaksi massal.
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                jobHistory.map((job) => (
                  <TableRow key={job.id} className="border-b border-border/20 hover:bg-muted/10 transition-colors">
                    <TableCell className="font-mono text-xs text-muted-foreground pl-6 py-3 whitespace-nowrap">
                      {new Date(job.createdAt).toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell className="text-xs font-medium text-foreground py-3">
                      {job.fileName}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground py-3">
                      <code>{job.fileHash.slice(0, 10)}...</code>
                    </TableCell>
                    <TableCell className="text-center font-mono text-xs text-foreground py-3">
                      {job.totalRows}
                    </TableCell>
                    <TableCell className="text-center text-xs py-3 font-mono">
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold">{job.successCount}</span>
                      {" / "}
                      <span className={job.failureCount > 0 ? "text-destructive font-bold" : "text-muted-foreground"}>
                        {job.failureCount}
                      </span>
                    </TableCell>
                    <TableCell className="text-center pr-6 py-3">
                      <Badge
                        variant={job.status === "COMPLETED" ? "default" : job.status === "FAILED" ? "destructive" : "secondary"}
                        className="text-[10px]"
                      >
                        {job.status}
                      </Badge>
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
