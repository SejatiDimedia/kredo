import * as React from "react"
import { useParams, useNavigate } from "react-router-dom"
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
import { MoneyText } from "@/components/shared/MoneyText"
import {
  ArrowLeft,
  Printer,
  RotateCcw,
  Clock,
  User,
  Hash,
  Loader2,
  Send,
} from "lucide-react"
import { apiFetch } from "@/lib/api"
import type { JournalResponse } from "../types"

interface AccountData {
  id: number
  code: string
  name: string
  type: string
}

export function JournalDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [journal, setJournal] = React.useState<JournalResponse | null>(null)
  const [accountMap, setAccountMap] = React.useState<Map<number, AccountData>>(new Map())
  const [isLoading, setIsLoading] = React.useState(true)

  // State untuk dialog pembalikan jurnal (Reversal)
  const [showReversalModal, setShowReversalModal] = React.useState(false)
  const [reversalReason, setReversalReason] = React.useState("")
  const [isReversing, setIsReversing] = React.useState(false)

  // State untuk konfirmasi pengajuan draf
  const [confirmSubmitOpen, setConfirmSubmitOpen] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const fetchJournalAndAccounts = React.useCallback(async () => {
    if (!id) return
    try {
      setIsLoading(true)
      const [journalData, accountsData] = await Promise.all([
        apiFetch<JournalResponse>(`/journals/${id}?entityId=1`),
        apiFetch<AccountData[]>("/accounts?entityId=1"),
      ])

      const map = new Map<number, AccountData>()
      accountsData.forEach((acc) => map.set(acc.id, acc))

      setJournal(journalData)
      setAccountMap(map)
    } catch (err: any) {
      toast.error(err.message || "Gagal memuat detail jurnal")
    } finally {
      setIsLoading(false)
    }
  }, [id])

  React.useEffect(() => {
    fetchJournalAndAccounts()
  }, [fetchJournalAndAccounts])

  const handleExecuteReversal = async () => {
    if (!journal) return
    try {
      setIsReversing(true)
      const res = await apiFetch<JournalResponse>(`/journals/${journal.id}/reverse?entityId=1`, {
        method: "POST",
        body: JSON.stringify({ reason: reversalReason || "Koreksi pembukuan" }),
      })
      toast.success(`Jurnal pembalik ${res.journalNo} berhasil diposting ke Buku Besar.`)
      setShowReversalModal(false)
      navigate("/journals")
    } catch (err: any) {
      toast.error(err.message || "Gagal membalik jurnal")
    } finally {
      setIsReversing(false)
    }
  }

  const handleSubmitDraft = async () => {
    if (!journal) return
    try {
      setIsSubmitting(true)
      await apiFetch<JournalResponse>(`/journals/${journal.id}/submit`, {
        method: "POST",
      })
      toast.success("Jurnal berhasil diajukan ke antrean persetujuan (SUBMITTED).")
      setConfirmSubmitOpen(false)
      fetchJournalAndAccounts()
    } catch (err: any) {
      toast.error(err.message || "Gagal mengajukan jurnal")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-muted-foreground text-xs">
        <Loader2 className="size-6 animate-spin text-primary" />
        Memuat detail voucher jurnal dari database...
      </div>
    )
  }

  if (!journal) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-muted-foreground text-xs">
        <p>Jurnal dengan ID {id} tidak ditemukan.</p>
        <Button size="sm" variant="outline" onClick={() => navigate("/journals")}>
          Kembali ke Daftar Jurnal
        </Button>
      </div>
    )
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
            <BreadcrumbLink href="/journals">Jurnal Umum</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{journal.journalNo || `Draft #${journal.id}`}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => navigate("/journals")}
          >
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-foreground font-heading">
                {journal.journalNo || `Draft #${journal.id}`}
              </h1>
              <Badge variant="secondary" className="font-semibold text-xs">
                {journal.status}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {journal.source}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {journal.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="size-3.5 mr-1.5" />
            Cetak Voucher
          </Button>
          {journal.status === "DRAFT" && (
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs gap-1.5 cursor-pointer"
              onClick={() => setConfirmSubmitOpen(true)}
            >
              <Send className="size-3.5" />
              Ajukan Persetujuan
            </Button>
          )}
          {journal.status === "POSTED" && journal.source !== "REVERSAL" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowReversalModal(true)
                setReversalReason("")
              }}
              className="border-amber-500/40 text-amber-700 dark:text-amber-400 hover:bg-amber-500/10 cursor-pointer"
            >
              <RotateCcw className="size-3.5 mr-1.5" />
              Buat Jurnal Pembalik (Reversal)
            </Button>
          )}
        </div>
      </div>

      {/* Metadata Overview Card */}
      <Card>
        <CardContent className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-muted-foreground flex items-center gap-1">
              <Clock className="size-3" /> Tanggal Transaksi
            </span>
            <span className="font-semibold font-mono text-foreground text-sm mt-0.5 block">
              {journal.entryDate}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground flex items-center gap-1">
              <Hash className="size-3" /> No. Urut Resmi
            </span>
            <span className="font-semibold font-mono text-foreground text-sm mt-0.5 block">
              {journal.journalNo || "-"}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground flex items-center gap-1">
              <User className="size-3" /> Pembuat (Maker)
            </span>
            <span className="font-medium text-foreground text-sm mt-0.5 block">
              User ID {journal.createdBy}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground flex items-center gap-1">
              <User className="size-3" /> Status Posting
            </span>
            <span className="font-medium text-foreground text-sm mt-0.5 block">
              {journal.status}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Lines Table Card */}
      <Card>
        <CardHeader className="border-b border-border/30 pb-3">
          <CardTitle className="text-sm font-semibold">Rincian Baris Debit & Kredit</CardTitle>
          <CardDescription className="text-xs">
            Dua sisi transaksi double-entry yang memengaruhi buku besar.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border/30 bg-muted/10 hover:bg-muted/10">
                <TableHead className="w-[50px] pl-6 text-center font-semibold">#</TableHead>
                <TableHead className="w-[140px] font-semibold">Kode Akun</TableHead>
                <TableHead className="font-semibold">Nama Akun Buku Besar</TableHead>
                <TableHead className="w-[160px] text-right font-semibold">Debit (IDR)</TableHead>
                <TableHead className="w-[160px] text-right font-semibold">Kredit (IDR)</TableHead>
                <TableHead className="pr-6 font-semibold">Keterangan Memo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {journal.lines.map((line) => {
                const acc = accountMap.get(line.accountId)
                return (
                  <TableRow key={line.id} className="border-b border-border/20 hover:bg-muted/10">
                    <TableCell className="pl-6 text-center font-mono text-xs text-muted-foreground py-3">
                      {line.lineNo}
                    </TableCell>
                    <TableCell className="font-mono text-xs font-semibold text-primary py-3">
                      {acc ? acc.code : `ID: ${line.accountId}`}
                    </TableCell>
                    <TableCell className="text-xs font-medium py-3">
                      {acc ? acc.name : "Akun Buku Besar"}
                      {acc && <span className="text-[10px] text-muted-foreground ml-2">({acc.type})</span>}
                    </TableCell>
                    <TableCell className="text-right text-xs font-mono py-3">
                      <MoneyText amount={line.debit} />
                    </TableCell>
                    <TableCell className="text-right text-xs font-mono py-3">
                      <MoneyText amount={line.credit} />
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground pr-6 py-3">
                      {line.memo || "-"}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog Konfirmasi Pembalikan Jurnal */}
      <Dialog open={showReversalModal} onOpenChange={setShowReversalModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-semibold text-amber-700 dark:text-amber-400">
              <RotateCcw className="size-4" />
              Balik Jurnal: {journal.journalNo}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Sesuai aturan akuntansi, jurnal berstatus POSTED tidak dapat dihapus. Pembalikan akan menghasilkan voucher jurnal baru yang menukar posisi Debit dan Kredit untuk menetralkan saldo.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3 py-2 text-xs">
            <div>
              <label htmlFor="reversalReason" className="font-medium text-[11px] block mb-1">
                Alasan Pembalikan / Koreksi (Wajib Audit):
              </label>
              <Input
                id="reversalReason"
                placeholder="Contoh: Koreksi salah catat akun beban..."
                value={reversalReason}
                onChange={(e) => setReversalReason(e.target.value)}
                className="text-xs h-9"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowReversalModal(false)}
              disabled={isReversing}
              className="text-xs"
            >
              Batal
            </Button>
            <Button
              size="sm"
              onClick={handleExecuteReversal}
              disabled={isReversing}
              className="text-xs bg-amber-600 hover:bg-amber-700 text-white gap-1.5"
            >
              {isReversing && <Loader2 className="size-3.5 animate-spin" />}
              Eksekusi Pembalik
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Konfirmasi Pengajuan Jurnal Draf */}
      <AlertDialog open={confirmSubmitOpen} onOpenChange={setConfirmSubmitOpen}>
        <AlertDialogContent size="default" className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Pengajuan Jurnal</AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-muted-foreground space-y-2">
              <span>
                Apakah Anda yakin ingin mengajukan voucher jurnal ini ke antrean persetujuan (Maker-Checker)?
              </span>
              {journal && (
                <span className="rounded-md border p-2.5 bg-muted/20 text-xs block text-left">
                  <span className="font-semibold text-foreground block">
                    Draft #{journal.id} — {journal.description}
                  </span>
                  <span className="text-[11px] text-muted-foreground mt-0.5 block">
                    Tanggal: {journal.entryDate} • {journal.lines?.length || 0} baris akun
                  </span>
                  <span className="font-mono text-primary font-bold mt-1 block">
                    Total: <MoneyText amount={journal.totalAmount} />
                  </span>
                </span>
              )}
              <span className="text-[11px] text-muted-foreground block">
                Setelah diajukan, status jurnal akan berubah menjadi <code>SUBMITTED</code> dan menunggu peninjauan Checker sebelum dapat diposting.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              disabled={isSubmitting}
              onClick={(e) => {
                e.preventDefault()
                handleSubmitDraft()
              }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-3.5 mr-1.5 animate-spin" />
                  Mengajukan...
                </>
              ) : (
                "Ya, Ajukan Persetujuan"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
