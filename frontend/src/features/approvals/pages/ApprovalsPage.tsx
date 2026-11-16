import * as React from "react"
import { toast } from "sonner"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { MoneyText } from "@/components/shared/MoneyText"
import { Check, X, ShieldAlert, FileText, Loader2, RefreshCw } from "lucide-react"
import { apiFetch } from "@/lib/api"
import type { JournalResponse } from "../../journals/types"

export function ApprovalsPage() {
  const [drafts, setDrafts] = React.useState<JournalResponse[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  // State untuk dialog penolakan (Reject)
  const [rejectTarget, setRejectTarget] = React.useState<JournalResponse | null>(null)
  const [rejectReason, setRejectReason] = React.useState("")
  const [isRejecting, setIsRejecting] = React.useState(false)

  // State untuk dialog konfirmasi persetujuan (Approve) & uji fraud
  const [confirmApproveTarget, setConfirmApproveTarget] = React.useState<JournalResponse | null>(null)
  const [confirmFraudTarget, setConfirmFraudTarget] = React.useState<JournalResponse | null>(null)

  // State loading untuk tombol approve
  const [approvingId, setApprovingId] = React.useState<number | null>(null)

  const fetchSubmittedJournals = React.useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await apiFetch<JournalResponse[]>("/journals?entityId=1")
      // Ambil hanya yang berstatus SUBMITTED (menunggu persetujuan)
      const submitted = data.filter((j) => j.status === "SUBMITTED")
      setDrafts(submitted)
    } catch (err: any) {
      toast.error(err.message || "Gagal memuat antrean persetujuan")
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchSubmittedJournals()
  }, [fetchSubmittedJournals])

  // Handle Approve resmi oleh Checker sah (Raka, ID = 2)
  const handleApproveValid = async (journal: JournalResponse) => {
    try {
      setApprovingId(journal.id)
      const res = await apiFetch<JournalResponse>(`/journals/${journal.id}/approve?approverId=2&post=true`, {
        method: "POST",
      })
      toast.success(`Jurnal #${journal.id} disetujui & diposting ke Buku Besar sebagai ${res.journalNo}!`)
      fetchSubmittedJournals()
    } catch (err: any) {
      toast.error(err.message || "Gagal menyetujui jurnal")
    } finally {
      setApprovingId(null)
    }
  }

  // Handle Uji Fraud Maker-Checker: Mencoba approve dengan user pembuat (Dina, ID = 1)
  const handleTestFraud = async (journal: JournalResponse) => {
    try {
      setApprovingId(journal.id)
      await apiFetch<JournalResponse>(`/journals/${journal.id}/approve?approverId=1&post=true`, {
        method: "POST",
      })
      toast.error("Peringatan: Sistem mengizinkan approval (harusnya ditolak)!")
    } catch (err: any) {
      // Harusnya ditolak oleh backend
      toast.error(`Sistem Menolak : ${err.message}`, {
        duration: 5000,
      })
    } finally {
      setApprovingId(null)
    }
  }

  // Handle Penolakan resmi oleh Checker
  const handleExecuteReject = async () => {
    if (!rejectTarget) return
    if (!rejectReason.trim()) {
      toast.error("Alasan penolakan wajib diisi!")
      return
    }

    try {
      setIsRejecting(true)
      await apiFetch<JournalResponse>(`/journals/${rejectTarget.id}/reject?rejecterId=2`, {
        method: "POST",
        body: JSON.stringify({ reason: rejectReason.trim() }),
      })
      toast.info(`Jurnal #${rejectTarget.id} dikembalikan ke status DRAFT untuk diperbaiki.`)
      setRejectTarget(null)
      setRejectReason("")
      fetchSubmittedJournals()
    } catch (err: any) {
      toast.error(err.message || "Gagal menolak jurnal")
    } finally {
      setIsRejecting(false)
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
            <BreadcrumbPage>Persetujuan Jurnal</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground font-heading">
              Antrean Persetujuan Jurnal
            </h1>
            <Badge variant="outline" className="border-amber-500/40 text-amber-700 dark:text-amber-400 text-xs">
              {drafts.length} Menunggu Verifikasi
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Mekanisme Maker-Checker (Segregation of Duties). Hanya Akuntan Senior / Checker yang dapat menyetujui jurnal.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchSubmittedJournals}
          disabled={isLoading}
          className="text-xs gap-1.5"
        >
          <RefreshCw className={`size-3.5 ${isLoading ? "animate-spin" : ""}`} />
          Segarkan Antrean
        </Button>
      </div>

      {/* Segregation of Duties Alert */}
      <Alert className="border-border/60 bg-muted/20">
        <ShieldAlert className="size-4 text-primary" />
        <AlertTitle className="text-xs font-semibold">Aturan Keamanan Pembukuan (Segregation of Duties)</AlertTitle>
        <AlertDescription className="text-xs text-muted-foreground">
          Pengguna yang membuat/mengajukan jurnal (Maker) dilarang menyetujui jurnalnya sendiri. Anda dapat mencoba tombol &quot;Uji Fraud&quot; untuk membuktikan penolakan otomatis dari backend.
        </AlertDescription>
      </Alert>

      {/* Main Approval Table Card */}
      <Card>
        <CardHeader className="border-b border-border/30 pb-4">
          <CardTitle className="text-base font-semibold">Draf Jurnal Perlu Verifikasi</CardTitle>
          <CardDescription className="text-xs">
            Periksa baris akun debit dan kredit sebelum mengesahkan jurnal ke buku besar permanen.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border/30 bg-muted/10 hover:bg-muted/10">
                <TableHead className="w-[120px] pl-6 font-semibold">Draft ID</TableHead>
                <TableHead className="w-[110px] font-semibold">Tanggal</TableHead>
                <TableHead className="font-semibold">Deskripsi Transaksi</TableHead>
                <TableHead className="w-[140px] font-semibold">Pembuat (Maker)</TableHead>
                <TableHead className="w-[150px] text-right font-semibold">Total Nominal</TableHead>
                <TableHead className="w-[260px] text-center pr-6 font-semibold">Aksi Otorisasi (Checker)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground text-xs">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="size-4 animate-spin text-primary" />
                      Memuat antrean persetujuan...
                    </div>
                  </TableCell>
                </TableRow>
              ) : drafts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground text-xs">
                    Seluruh draf telah diproses. Tidak ada jurnal yang menunggu persetujuan.
                  </TableCell>
                </TableRow>
              ) : (
                drafts.map((draft) => (
                  <TableRow key={draft.id} className="border-b border-border/20 hover:bg-muted/10 transition-colors">
                    <TableCell className="font-mono text-xs pl-6 font-semibold text-primary py-3">
                      Draft #{draft.id}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground font-mono py-3">
                      {draft.entryDate}
                    </TableCell>
                    <TableCell className="text-xs py-3">
                      <div className="font-medium text-foreground">{draft.description}</div>
                      <div className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                        <FileText className="size-3" /> {draft.lines?.length || 0} baris akun
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground py-3">
                      <span className="font-semibold text-foreground">User ID {draft.createdBy}</span> (Dina - Maker)
                    </TableCell>
                    <TableCell className="text-right text-xs font-mono py-3 font-semibold">
                      <MoneyText amount={draft.totalAmount} />
                    </TableCell>
                    <TableCell className="text-center pr-6 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Tombol Tolak */}
                        <Button
                          size="xs"
                          variant="outline"
                          className="text-destructive hover:bg-destructive/10 text-[11px]"
                          onClick={() => {
                            setRejectTarget(draft)
                            setRejectReason("")
                          }}
                          disabled={approvingId === draft.id}
                        >
                          <X className="size-3 mr-1" />
                          Tolak
                        </Button>

                        {/* Tombol Uji Fraud Maker-Checker (Coba approve sebagai pembuat) */}
                        <Button
                          size="xs"
                          variant="ghost"
                          className="text-[10px] text-amber-700 dark:text-amber-400 hover:bg-amber-500/10 cursor-pointer"
                          title="Coba setujui sebagai pembuat sendiri untuk menguji sistem penolakan"
                          onClick={() => setConfirmFraudTarget(draft)}
                          disabled={approvingId === draft.id}
                        >
                          Uji Fraud
                        </Button>

                        {/* Tombol Sah: Setujui & Posting sebagai Checker (Raka) */}
                        <Button
                          size="xs"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] cursor-pointer"
                          onClick={() => setConfirmApproveTarget(draft)}
                          disabled={approvingId === draft.id}
                        >
                          {approvingId === draft.id ? (
                            <Loader2 className="size-3 animate-spin mr-1" />
                          ) : (
                            <Check className="size-3 mr-1" />
                          )}
                          Setujui & Post
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog Alasan Penolakan Jurnal */}
      <Dialog open={!!rejectTarget} onOpenChange={(open) => !open && setRejectTarget(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-semibold text-destructive">
              <X className="size-4" />
              Tolak Draf Jurnal #{rejectTarget?.id}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Sesuai aturan audit akuntansi, penolakan draf wajib disertai alasan yang jelas agar pembuat (Maker) dapat memperbaikinya.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3 py-2 text-xs">
            <div className="rounded-md border p-3 bg-muted/20">
              <div className="text-muted-foreground text-[11px]">Uraian Jurnal:</div>
              <div className="font-semibold text-foreground mt-0.5">{rejectTarget?.description}</div>
              <div className="font-mono text-primary font-bold mt-1">
                Total: <MoneyText amount={rejectTarget?.totalAmount || 0} />
              </div>
            </div>

            <div>
              <label htmlFor="rejectReason" className="font-medium text-[11px] block mb-1">
                Alasan Penolakan (Wajib Diisi):
              </label>
              <Input
                id="rejectReason"
                placeholder="Contoh: Lampiran faktur belum lengkap atau kode akun beban salah..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="text-xs h-9"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRejectTarget(null)}
              disabled={isRejecting}
              className="text-xs"
            >
              Batal
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleExecuteReject}
              disabled={isRejecting}
              className="text-xs gap-1.5"
            >
              {isRejecting && <Loader2 className="size-3.5 animate-spin" />}
              Kembalikan ke Draf (Reject)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Konfirmasi Setujui & Post */}
      <AlertDialog open={!!confirmApproveTarget} onOpenChange={(open) => !open && setConfirmApproveTarget(null)}>
        <AlertDialogContent size="default" className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Persetujuan Jurnal</AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-muted-foreground space-y-2">
              <span>
                Apakah Anda yakin ingin menyetujui dan memposting draf jurnal ini ke Buku Besar?
              </span>
              {confirmApproveTarget && (
                <span className="rounded-md border p-2.5 bg-muted/20 text-xs block text-left">
                  <span className="font-semibold text-foreground block">
                    Draft #{confirmApproveTarget.id} — {confirmApproveTarget.description}
                  </span>
                  <span className="text-[11px] text-muted-foreground mt-0.5 block">
                    Tanggal: {confirmApproveTarget.entryDate} • Pembuat: User ID {confirmApproveTarget.createdBy} (Dina)
                  </span>
                  <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold mt-1 block">
                    Total: <MoneyText amount={confirmApproveTarget.totalAmount} />
                  </span>
                </span>
              )}
              <span className="text-[11px] text-amber-700 dark:text-amber-400 block">
                Setelah disetujui, voucher akan memperoleh nomor urut resmi permanen dan saldo akun buku besar akan langsung diperbarui.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
              onClick={() => {
                if (confirmApproveTarget) {
                  const target = confirmApproveTarget
                  setConfirmApproveTarget(null)
                  handleApproveValid(target)
                }
              }}
            >
              Ya, Setujui & Posting
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog Konfirmasi Uji Fraud */}
      <AlertDialog open={!!confirmFraudTarget} onOpenChange={(open) => !open && setConfirmFraudTarget(null)}>
        <AlertDialogContent size="default" className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Pengujian Kontrol Fraud</AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-muted-foreground space-y-2">
              <span>
                Tindakan ini akan menguji pertahanan sistem <strong>Segregation of Duties</strong> dengan mencoba menyetujui jurnal menggunakan akun pembuat (User ID 1 / Maker).
              </span>
              <span className="text-[11px] block">
                Sistem backend dirancang untuk <strong>menolak keras</strong> percobaan ini dan mencatatnya sebagai pelanggaran aturan pembukuan. Lanjutkan pengujian?
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              variant="outline"
              className="border-amber-500/40 text-amber-700 dark:text-amber-400 hover:bg-amber-500/10 font-semibold"
              onClick={() => {
                if (confirmFraudTarget) {
                  const target = confirmFraudTarget
                  setConfirmFraudTarget(null)
                  handleTestFraud(target)
                }
              }}
            >
              Lanjutkan Pengujian
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
