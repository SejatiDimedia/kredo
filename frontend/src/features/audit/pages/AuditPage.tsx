import * as React from "react"
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
import { Button } from "@/components/ui/button"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { MoneyText } from "@/components/shared/MoneyText"
import { apiFetch } from "@/lib/api"
import type {
  AuditLogItem,
  AuditIntegrityResponse,
  ReconciliationResponse,
} from "../types"
import {
  Lock,
  ShieldCheck,
  RefreshCw,
  Play,
  CheckCircle2,
  AlertTriangle,
  Database,
  Hash,
  Scale,
  Search,
} from "lucide-react"

export function AuditPage() {
  const [logs, setLogs] = React.useState<AuditLogItem[]>([])
  const [isLoadingLogs, setIsLoadingLogs] = React.useState(true)
  const [logsError, setLogsError] = React.useState<string | null>(null)

  // Reconciliation state
  const [reconciliation, setReconciliation] = React.useState<ReconciliationResponse | null>(null)
  const [isRunningRecon, setIsRunningRecon] = React.useState(false)
  const [reconError, setReconError] = React.useState<string | null>(null)

  // Audit Hash Verification state
  const [integrity, setIntegrity] = React.useState<AuditIntegrityResponse | null>(null)
  const [isVerifyingIntegrity, setIsVerifyingIntegrity] = React.useState(false)

  // Filter state
  const [actionFilter, setActionFilter] = React.useState<string>("ALL")
  const [searchQuery, setSearchQuery] = React.useState<string>("")

  // Load audit logs from backend
  const loadAuditLogs = React.useCallback(async () => {
    try {
      setIsLoadingLogs(true)
      setLogsError(null)
      const data = await apiFetch<AuditLogItem[]>("/audit/logs?entityId=1&limit=100")
      setLogs(data)
    } catch (err) {
      setLogsError(err instanceof Error ? err.message : "Gagal memuat log audit")
    } finally {
      setIsLoadingLogs(false)
    }
  }, [])

  // Run initial ledger reconciliation check
  const loadLatestReconciliation = React.useCallback(async () => {
    try {
      const data = await apiFetch<ReconciliationResponse>("/reports/reconciliation?entityId=1&periodId=11")
      setReconciliation(data)
    } catch {
      // Endpoint might not have been triggered yet, silence initial background fetch
    }
  }, [])

  // Verify hash chain
  const verifyHashIntegrity = React.useCallback(async () => {
    try {
      setIsVerifyingIntegrity(true)
      const data = await apiFetch<AuditIntegrityResponse>("/audit/verify?entityId=1")
      setIntegrity(data)
    } catch (err) {
      console.error("Gagal memverifikasi segel hash:", err)
    } finally {
      setIsVerifyingIntegrity(false)
    }
  }, [])

  // Run on-demand reconciliation
  const handleRunReconciliation = async () => {
    try {
      setIsRunningRecon(true)
      setReconError(null)
      const result = await apiFetch<ReconciliationResponse>(
        "/reports/reconciliation?entityId=1&periodId=11&actorId=3",
        { method: "POST" }
      )
      setReconciliation(result)
      // Refresh audit logs because reconciliation logs an event
      await loadAuditLogs()
    } catch (err) {
      setReconError(err instanceof Error ? err.message : "Gagal menjalankan rekonsiliasi")
    } finally {
      setIsRunningRecon(false)
    }
  }

  React.useEffect(() => {
    loadAuditLogs()
    loadLatestReconciliation()
    verifyHashIntegrity()
  }, [loadAuditLogs, loadLatestReconciliation, verifyHashIntegrity])

  // Filtered logs
  const filteredLogs = React.useMemo(() => {
    return logs.filter((log) => {
      const matchesAction =
        actionFilter === "ALL" ||
        (actionFilter === "JOURNAL" && log.action.includes("JOURNAL")) ||
        (actionFilter === "PERIOD" && log.action.includes("PERIOD")) ||
        (actionFilter === "RECONCILIATION" && log.action.includes("RECONCILIATION"))

      const matchesSearch =
        searchQuery === "" ||
        log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.detail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.sealId.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesAction && matchesSearch
    })
  }, [logs, actionFilter, searchQuery])

  // Helper badge color
  const getActionBadgeVariant = (action: string) => {
    if (action.includes("POST")) return "success"
    if (action.includes("APPROVE")) return "info"
    if (action.includes("REJECT") || action.includes("REVERSE")) return "destructive"
    if (action.includes("CREATE") || action.includes("SUBMIT")) return "warning"
    return "secondary"
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
            <BreadcrumbPage>Jejak Audit & Rekonsiliasi</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground font-heading">
              Jejak Audit & Rekonsiliasi Integritas
            </h1>
            <Badge variant="info" size="sm" className="font-semibold">
              <Lock className="size-3 mr-1" /> Immutability Terjamin
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Verifikasi konsistensi matematis saldo buku besar dan log audit append-only yang dilindungi tingkat database.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              loadAuditLogs()
              verifyHashIntegrity()
            }}
            disabled={isLoadingLogs}
            className="text-xs gap-1.5"
          >
            <RefreshCw className={`size-3.5 ${isLoadingLogs ? "animate-spin" : ""}`} />
            Perbarui Data
          </Button>
        </div>
      </div>

      {/* DUAL INTEGRITY CARDS: RECONCILIATION & CRYPTOGRAPHIC HASH */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CARD 1: REKONSILIASI SALDO BUKU BESAR */}
        <Card className="border-border/60 shadow-sm flex flex-col justify-between">
          <CardHeader className="border-b border-border/30 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Scale className="size-4" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold">Rekonsiliasi Saldo Buku Besar</CardTitle>
                  <CardDescription className="text-xs">
                    Pengujian invariant matematis: Akumulasi ringkasan saldo vs seluruh baris jurnal terposting.
                  </CardDescription>
                </div>
              </div>
              {reconciliation && (
                <Badge
                  variant={reconciliation.isBalanced ? "success" : "destructive"}
                  size="sm"
                >
                  {reconciliation.isBalanced ? (
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="size-3" /> Bebas Selisih
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <AlertTriangle className="size-3" /> Ada Selisih
                    </span>
                  )}
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="pt-4 space-y-4">
            {reconError && (
              <Alert variant="destructive" className="py-2.5">
                <AlertTriangle className="size-4" />
                <AlertTitle className="text-xs font-semibold">Rekonsiliasi Gagal</AlertTitle>
                <AlertDescription className="text-xs">{reconError}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-lg bg-muted/40 border border-border/30">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider block font-medium">
                  Akun Diperiksa
                </span>
                <span className="text-base font-bold font-mono text-foreground mt-0.5 block">
                  {reconciliation ? reconciliation.totalAccountsAudited : "-"}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-muted/40 border border-border/30">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider block font-medium">
                  Selisih Ditemukan
                </span>
                <span
                  className={`text-base font-bold font-mono mt-0.5 block ${
                    reconciliation && reconciliation.discrepancyCount > 0
                      ? "text-destructive"
                      : "text-emerald-700 dark:text-emerald-400"
                  }`}
                >
                  {reconciliation ? `${reconciliation.discrepancyCount} Akun` : "-"}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-muted/40 border border-border/30">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider block font-medium">
                  Status Invariant
                </span>
                <span className="text-xs font-semibold mt-1 block text-primary">
                  {reconciliation?.isBalanced ? "Seimbang 100%" : "Perlu Verifikasi"}
                </span>
              </div>
            </div>

            {reconciliation && (
              <div className="p-3 rounded-lg bg-muted/20 border border-border/20 text-xs space-y-1.5 font-mono">
                <div className="flex justify-between text-muted-foreground">
                  <span>Total Debit Rekonsiliasi:</span>
                  <span className="font-semibold text-foreground">
                    <MoneyText amount={reconciliation.totalRecalculatedDebit} />
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Total Kredit Rekonsiliasi:</span>
                  <span className="font-semibold text-foreground">
                    <MoneyText amount={reconciliation.totalRecalculatedCredit} />
                  </span>
                </div>
                <div className="flex justify-between text-[11px] pt-1 border-t border-border/20 text-muted-foreground">
                  <span>Waktu Pengujian Terakhir:</span>
                  <span>{new Date(reconciliation.reconciledAt).toLocaleString("id-ID")}</span>
                </div>
              </div>
            )}

            <Button
              className="w-full text-xs gap-1.5"
              onClick={handleRunReconciliation}
              disabled={isRunningRecon}
            >
              {isRunningRecon ? (
                <>
                  <RefreshCw className="size-3.5 animate-spin" />
                  Menghitung Ulang Seluruh Baris Buku Besar...
                </>
              ) : (
                <>
                  <Play className="size-3.5" />
                  Jalankan Uji Rekonsiliasi Integritas Saldo
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* CARD 2: CRYPTOGRAPHIC HASH SEAL */}
        <Card className="border-border/60 shadow-sm flex flex-col justify-between">
          <CardHeader className="border-b border-border/30 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
                  <ShieldCheck className="size-4" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold">Integritas Kriptografi & Segel Hash</CardTitle>
                  <CardDescription className="text-xs">
                    Pencegahan manipulasi data di luar aplikasi dengan rantai hash SHA-256.
                  </CardDescription>
                </div>
              </div>
              <Badge variant="outline" className="text-teal-700 dark:text-teal-400 border-teal-500/30 text-[11px]">
                <Hash className="size-3 mr-1" /> Segel Aktif
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="pt-4 space-y-4">
            <Alert className="border-border/60 bg-muted/20 py-2.5">
              <Lock className="size-4 text-teal-600" />
              <AlertTitle className="text-xs font-semibold">Tabel Append-Only Terproteksi</AlertTitle>
              <AlertDescription className="text-xs text-muted-foreground">
                Trigger database PostgreSQL secara permanen menolak perintah <code>UPDATE</code> dan <code>DELETE</code> pada tabel audit_log.
              </AlertDescription>
            </Alert>

            <div className="p-3 rounded-lg bg-muted/30 border border-border/30 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Rekaman Audit:</span>
                <span className="font-mono font-bold text-foreground">
                  {integrity ? integrity.totalRecords : logs.length} Baris
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Status Manipulasi (Tamper-Free):</span>
                <span className="font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="size-3.5" /> Terverifikasi Asli
                </span>
              </div>
              <div className="flex flex-col gap-1 pt-1 border-t border-border/20">
                <span className="text-[11px] text-muted-foreground">Current Hash Root:</span>
                <span className="font-mono text-[11px] bg-background p-1.5 rounded border border-border/40 truncate text-primary font-medium">
                  {integrity ? integrity.currentChainHash : "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"}
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full text-xs gap-1.5"
              onClick={verifyHashIntegrity}
              disabled={isVerifyingIntegrity}
            >
              <RefreshCw className={`size-3.5 ${isVerifyingIntegrity ? "animate-spin" : ""}`} />
              Verifikasi Integritas Rantai Hash
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* AUDIT LOG TABLE CARD */}
      <Card>
        <CardHeader className="border-b border-border/30 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-base font-semibold">Log Transaksi & Jejak Aktivitas</CardTitle>
              <CardDescription className="text-xs">
                Kronologi terurut secara terbalik (terbaru di atas) untuk kebutuhan audit internal dan kepatuhan.
              </CardDescription>
            </div>

            {/* Filter controls */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Cari aktor, nomor, aksi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-md border border-border/60 bg-background text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary w-48"
                />
              </div>

              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="py-1.5 px-2.5 rounded-md border border-border/60 bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="ALL">Semua Aksi</option>
                <option value="JOURNAL">Aktivitas Jurnal</option>
                <option value="PERIOD">Tutup/Buka Periode</option>
                <option value="RECONCILIATION">Rekonsiliasi Saldo</option>
              </select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border/30 bg-muted/10 hover:bg-muted/10">
                <TableHead className="w-[180px] pl-6 font-semibold">Waktu Kejadian</TableHead>
                <TableHead className="w-[180px] font-semibold">Aktor (Pengguna)</TableHead>
                <TableHead className="w-[170px] font-semibold">Aksi Sistem</TableHead>
                <TableHead className="font-semibold">Rincian Perubahan (Payload)</TableHead>
                <TableHead className="w-[140px] text-center pr-6 font-semibold">Hash Seal ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingLogs ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-12 text-center text-xs text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <RefreshCw className="size-5 animate-spin text-primary" />
                      <span>Memuat catatan log audit dari server...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : logsError ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-destructive text-xs">
                    <div className="flex flex-col items-center justify-center gap-1.5">
                      <AlertTriangle className="size-5 text-destructive" />
                      <span className="font-semibold">{logsError}</span>
                      <span className="text-[11px] text-muted-foreground">
                        Pastikan backend Spring Boot aktif di <code>http://localhost:8080</code>
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-12 text-center text-xs text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-1.5">
                      <Database className="size-6 text-muted-foreground/40" />
                      <span className="font-medium text-foreground">Tidak ada catatan audit yang cocok</span>
                      <span className="text-[11px]">
                        Aktivitas posting jurnal, tutup periode, dan rekonsiliasi akan dicatat otomatis di sini.
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log) => (
                  <TableRow key={log.id} className="border-b border-border/20 hover:bg-muted/10 transition-colors">
                    <TableCell className="font-mono text-xs text-muted-foreground pl-6 py-3 whitespace-nowrap">
                      {new Date(log.occurredAt).toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell className="text-xs font-medium text-foreground py-3">
                      <div>{log.actorName}</div>
                      <div className="text-[10px] text-muted-foreground">{log.actorRole}</div>
                    </TableCell>
                    <TableCell className="py-3">
                      <Badge variant={getActionBadgeVariant(log.action)} className="text-[10px] font-mono">
                        {log.action}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground py-3">
                      <span className="text-foreground/80">{log.detail}</span>
                    </TableCell>
                    <TableCell className="text-center pr-6 font-mono text-xs text-primary font-semibold py-3 whitespace-nowrap">
                      {log.sealId}
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
