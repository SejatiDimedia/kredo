import * as React from "react"
import { useNavigate } from "react-router-dom"
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
  CardAction,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { MoneyText } from "@/components/shared/MoneyText"
import { Plus, Download, Search, MoreHorizontal, Eye, RotateCcw, Send, Loader2 } from "lucide-react"
import { apiFetch } from "@/lib/api"
import type { JournalResponse, JournalStatus } from "../types"

export function JournalsPage() {
  const navigate = useNavigate()
  const [journals, setJournals] = React.useState<JournalResponse[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL")

  // State untuk dialog pembalikan jurnal (Reversal)
  const [reversalTarget, setReversalTarget] = React.useState<JournalResponse | null>(null)
  const [reversalReason, setReversalReason] = React.useState("")
  const [isReversing, setIsReversing] = React.useState(false)

  // State untuk dialog konfirmasi pengajuan (Submit Draft)
  const [confirmSubmitTarget, setConfirmSubmitTarget] = React.useState<JournalResponse | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const fetchJournals = React.useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await apiFetch<JournalResponse[]>("/journals?entityId=1")
      setJournals(data)
    } catch (err: any) {
      toast.error(err.message || "Gagal memuat daftar jurnal dari backend")
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchJournals()
  }, [fetchJournals])

  const filteredJournals = React.useMemo(() => {
    return journals.filter((j) => {
      if (search) {
        const q = search.toLowerCase()
        const match =
          (j.journalNo && j.journalNo.toLowerCase().includes(q)) ||
          j.description.toLowerCase().includes(q)
        if (!match) return false
      }
      if (statusFilter !== "ALL" && j.status !== statusFilter) {
        return false
      }
      return true
    })
  }, [journals, search, statusFilter])

  const getStatusBadge = (status: JournalStatus) => {
    switch (status) {
      case "POSTED":
        return <Badge variant="success" size="sm" className="font-mono uppercase font-semibold">POSTED</Badge>
      case "APPROVED":
        return <Badge variant="info" size="sm" className="font-mono uppercase font-semibold">APPROVED</Badge>
      case "SUBMITTED":
        return <Badge variant="warning" size="sm" className="font-mono uppercase font-semibold">SUBMITTED</Badge>
      case "DRAFT":
        return <Badge variant="secondary" size="sm" className="font-mono uppercase font-medium">DRAFT</Badge>
      case "CANCELLED":
        return <Badge variant="destructive" size="sm" className="font-mono uppercase font-medium">CANCELLED</Badge>
    }
  }

  // Handle submit draft ke antrean persetujuan (Maker)
  const handleSubmitDraft = async (id: number) => {
    try {
      setIsSubmitting(true)
      await apiFetch<JournalResponse>(`/journals/${id}/submit?userId=1`, {
        method: "POST",
      })
      toast.success("Jurnal berhasil diajukan ke antrean persetujuan (SUBMITTED).")
      setConfirmSubmitTarget(null)
      fetchJournals()
    } catch (err: any) {
      toast.error(err.message || "Gagal mengajukan jurnal")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle eksekusi pembalikan jurnal (Reversal)
  const handleExecuteReversal = async () => {
    if (!reversalTarget) return
    try {
      setIsReversing(true)
      const res = await apiFetch<JournalResponse>(`/journals/${reversalTarget.id}/reverse?entityId=1`, {
        method: "POST",
        body: JSON.stringify({ reason: reversalReason || "Koreksi pembukuan" }),
      })
      toast.success(`Jurnal pembalik ${res.journalNo} berhasil diposting ke Buku Besar.`)
      setReversalTarget(null)
      setReversalReason("")
      fetchJournals()
    } catch (err: any) {
      toast.error(err.message || "Gagal membalik jurnal")
    } finally {
      setIsReversing(false)
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
            <BreadcrumbPage>Jurnal Umum</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-heading">
            Daftar Jurnal Umum
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Semua transaksi pembukuan berpasangan (double-entry) dengan siklus Draft → Submitted → Approved → Posted.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => toast.info("Ekspor CSV jurnal...")}>
            <Download className="size-3.5 mr-1.5" />
            Ekspor CSV
          </Button>
          <Button size="sm" onClick={() => navigate("/journals/new")}>
            <Plus className="size-3.5 mr-1.5" />
            Input Jurnal Baru
          </Button>
        </div>
      </div>

      {/* Main Table Card */}
      <Card>
        <CardHeader className="border-b border-border/30 pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base font-semibold">Transaksi Jurnal Entri</CardTitle>
              <CardDescription className="text-xs">
                {isLoading
                  ? "Menghubungkan ke backend Spring Boot..."
                  : `Menampilkan ${filteredJournals.length} dari total ${journals.length} entri jurnal.`}
              </CardDescription>
            </div>
            <CardAction>
              <div className="flex items-center gap-2">
                <div className="relative w-64">
                  <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Cari no. jurnal atau uraian..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-8 text-xs h-8"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-36 text-xs h-8">
                    <SelectValue placeholder="Semua Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Semua Status</SelectItem>
                    <SelectItem value="POSTED">POSTED</SelectItem>
                    <SelectItem value="APPROVED">APPROVED</SelectItem>
                    <SelectItem value="SUBMITTED">SUBMITTED</SelectItem>
                    <SelectItem value="DRAFT">DRAFT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardAction>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border/30 bg-muted/10 hover:bg-muted/10">
                <TableHead className="w-[180px] pl-6 font-semibold">No. Jurnal</TableHead>
                <TableHead className="w-[110px] font-semibold">Tanggal</TableHead>
                <TableHead className="font-semibold">Deskripsi Transaksi</TableHead>
                <TableHead className="w-[100px] text-center font-semibold">Sumber</TableHead>
                <TableHead className="w-[160px] text-right font-semibold">Total Nilai</TableHead>
                <TableHead className="w-[110px] text-center font-semibold">Status</TableHead>
                <TableHead className="w-[70px] text-center pr-6 font-semibold">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-muted-foreground text-xs">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="size-4 animate-spin text-primary" />
                      Memuat transaksi dari database...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredJournals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-muted-foreground text-xs">
                    Tidak ada jurnal yang sesuai dengan pencarian atau filter status.
                  </TableCell>
                </TableRow>
              ) : (
                filteredJournals.map((journal) => (
                  <TableRow key={journal.id} className="border-b border-border/20 hover:bg-muted/10 transition-colors">
                    <TableCell className="font-mono text-xs pl-6 font-semibold text-primary py-3">
                      {journal.journalNo ? (
                        journal.journalNo
                      ) : (
                        <span className="italic text-muted-foreground">Draft #{journal.id}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground font-mono py-3">
                      {journal.entryDate}
                    </TableCell>
                    <TableCell className="text-xs py-3">
                      <div className="font-medium text-foreground">{journal.description}</div>
                      <div className="text-[10px] text-muted-foreground">{journal.lines?.length || 0} baris akun</div>
                    </TableCell>
                    <TableCell className="text-center py-3">
                      <Badge variant="outline" className="text-[10px] text-muted-foreground">
                        {journal.source}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-xs font-mono py-3 font-semibold">
                      <MoneyText amount={journal.totalAmount} />
                    </TableCell>
                    <TableCell className="text-center py-3">
                      {getStatusBadge(journal.status)}
                    </TableCell>
                    <TableCell className="text-center pr-6 py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-7">
                            <MoreHorizontal className="size-3.5" />
                            <span className="sr-only">Menu Aksi Jurnal</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52 text-xs">
                          <DropdownMenuItem onClick={() => navigate(`/journals/${journal.id}`)}>
                            <Eye className="size-3.5 mr-2" />
                            Lihat Rincian Baris
                          </DropdownMenuItem>

                          {/* Tombol Submit jika masih DRAFT */}
                          {journal.status === "DRAFT" && (
                            <DropdownMenuItem
                              onClick={() => setConfirmSubmitTarget(journal)}
                              className="text-amber-700 dark:text-amber-400 font-semibold cursor-pointer"
                            >
                              <Send className="size-3.5 mr-2" />
                              Ajukan Persetujuan
                            </DropdownMenuItem>
                          )}

                          {/* Tombol Reversal jika POSTED dan bukan Reversal */}
                          {journal.status === "POSTED" && journal.source !== "REVERSAL" && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  setReversalTarget(journal)
                                  setReversalReason("")
                                }}
                                className="text-amber-700 dark:text-amber-400"
                              >
                                <RotateCcw className="size-3.5 mr-2" />
                                Jurnal Pembalik (Reversal)
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog Konfirmasi Jurnal Pembalik (Reversal Modal) */}
      <Dialog open={!!reversalTarget} onOpenChange={(open) => !open && setReversalTarget(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-semibold text-amber-700 dark:text-amber-400">
              <RotateCcw className="size-4" />
              Balik Jurnal: {reversalTarget?.journalNo}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Sesuai aturan akuntansi, jurnal berstatus POSTED tidak dapat dihapus. Pembalikan akan menghasilkan voucher jurnal baru yang menukar posisi Debit dan Kredit untuk menetralkan saldo.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3 py-2 text-xs">
            <div className="rounded-md border p-3 bg-muted/20">
              <div className="text-muted-foreground text-[11px]">Jurnal Asli:</div>
              <div className="font-semibold text-foreground mt-0.5">{reversalTarget?.description}</div>
              <div className="font-mono text-primary font-bold mt-1">
                Total: <MoneyText amount={reversalTarget?.totalAmount || 0} />
              </div>
            </div>

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
              onClick={() => setReversalTarget(null)}
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

      {/* Dialog Konfirmasi Pengajuan Jurnal */}
      <AlertDialog open={!!confirmSubmitTarget} onOpenChange={(open) => !open && setConfirmSubmitTarget(null)}>
        <AlertDialogContent size="default" className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Pengajuan Jurnal</AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-muted-foreground space-y-2">
              <span>
                Apakah Anda yakin ingin mengajukan voucher jurnal ini ke antrean persetujuan (Maker-Checker)?
              </span>
              {confirmSubmitTarget && (
                <span className="rounded-md border p-2.5 bg-muted/20 text-xs block text-left">
                  <span className="font-semibold text-foreground block">
                    Draft #{confirmSubmitTarget.id} — {confirmSubmitTarget.description}
                  </span>
                  <span className="text-[11px] text-muted-foreground mt-0.5 block">
                    Tanggal: {confirmSubmitTarget.entryDate} • Sumber: {confirmSubmitTarget.source}
                  </span>
                  <span className="font-mono text-primary font-bold mt-1 block">
                    Total: <MoneyText amount={confirmSubmitTarget.totalAmount} />
                  </span>
                </span>
              )}
              <span className="text-[11px] text-muted-foreground block">
                Setelah diajukan, status jurnal akan berubah menjadi <code>SUBMITTED</code> dan menunggu verifikasi oleh Checker sebelum diposting ke Buku Besar.
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
                if (confirmSubmitTarget) {
                  handleSubmitDraft(confirmSubmitTarget.id)
                }
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
