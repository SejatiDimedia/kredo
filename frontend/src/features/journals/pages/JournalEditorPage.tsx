import * as React from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import Decimal from "decimal.js"
import { toDecimal } from "@/lib/money"
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
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field"
import { BalanceBar } from "@/components/shared/BalanceBar"
import {
  Plus,
  Trash2,
  ArrowLeft,
  Loader2,
} from "lucide-react"
import { apiFetch } from "@/lib/api"
import type { JournalResponse } from "../types"

interface AccountOption {
  id: number
  code: string
  name: string
  type: string
  normalBalance: string
  isPostable: boolean
}

interface LineEntry {
  id: string
  lineNo: number
  accountId: string // numeric ID as string for Select component
  debit: string
  credit: string
  memo: string
}

export function JournalEditorPage() {
  const navigate = useNavigate()

  // State Akun dari Backend
  const [postableAccounts, setPostableAccounts] = React.useState<AccountOption[]>([])
  const [isLoadingAccounts, setIsLoadingAccounts] = React.useState(true)

  // Header State
  const [entryDate, setEntryDate] = React.useState(new Date().toISOString().split("T")[0])
  const [description, setDescription] = React.useState("")
  const [reference, setReference] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Lines State (Minimal 2 baris)
  const [lines, setLines] = React.useState<LineEntry[]>([
    { id: "line-1", lineNo: 1, accountId: "", debit: "", credit: "", memo: "" },
    { id: "line-2", lineNo: 2, accountId: "", debit: "", credit: "", memo: "" },
  ])

  // Ambil daftar akun postable dari backend
  React.useEffect(() => {
    async function loadAccounts() {
      try {
        setIsLoadingAccounts(true)
        const accounts = await apiFetch<AccountOption[]>("/accounts?entityId=1")
        const postable = accounts.filter((a) => a.isPostable)
        setPostableAccounts(postable)

        // Defaultkan dua baris pertama jika akun tersedia
        if (postable.length >= 2) {
          setLines([
            { id: "line-1", lineNo: 1, accountId: String(postable[0].id), debit: "", credit: "", memo: "" },
            { id: "line-2", lineNo: 2, accountId: String(postable[1].id), debit: "", credit: "", memo: "" },
          ])
        }
      } catch (err: any) {
        toast.error("Gagal memuat daftar akun COA: " + err.message)
      } finally {
        setIsLoadingAccounts(false)
      }
    }
    loadAccounts()
  }, [])

  // Perhitungan Real-time dengan Decimal.js (Anti-Floating Drift)
  const totalDebit = React.useMemo(() => {
    return lines.reduce((acc, line) => {
      if (!line.debit) return acc
      try {
        return acc.plus(toDecimal(line.debit))
      } catch {
        return acc
      }
    }, new Decimal(0))
  }, [lines])

  const totalCredit = React.useMemo(() => {
    return lines.reduce((acc, line) => {
      if (!line.credit) return acc
      try {
        return acc.plus(toDecimal(line.credit))
      } catch {
        return acc
      }
    }, new Decimal(0))
  }, [lines])

  // Tambah baris baru
  const handleAddLine = () => {
    const defaultAcc = postableAccounts[0]?.id ? String(postableAccounts[0].id) : ""
    setLines((prev) => [
      ...prev,
      {
        id: `line-${Date.now()}`,
        lineNo: prev.length + 1,
        accountId: defaultAcc,
        debit: "",
        credit: "",
        memo: "",
      },
    ])
  }

  // Hapus baris (minimal 2 baris)
  const handleRemoveLine = (id: string) => {
    if (lines.length <= 2) {
      toast.error("Jurnal akuntansi wajib memiliki minimal 2 baris.")
      return
    }
    setLines((prev) => prev.filter((l) => l.id !== id))
  }

  // Input Debit otomatis mengosongkan Kredit pada baris yang sama
  const handleDebitChange = (id: string, val: string) => {
    setLines((prev) =>
      prev.map((l) => {
        if (l.id === id) {
          return {
            ...l,
            debit: val,
            credit: val ? "" : l.credit,
          }
        }
        return l
      })
    )
  }

  // Input Kredit otomatis mengosongkan Debit pada baris yang sama
  const handleCreditChange = (id: string, val: string) => {
    setLines((prev) =>
      prev.map((l) => {
        if (l.id === id) {
          return {
            ...l,
            credit: val,
            debit: val ? "" : l.debit,
          }
        }
        return l
      })
    )
  }

  // Helper cerdas: Tambahkan baris otomatis untuk menyeimbangkan selisih
  const handleAddBalancingLine = (diff: Decimal, side: "DEBIT" | "CREDIT") => {
    const formatted = diff.toFixed(2)
    const defaultAcc = postableAccounts[0]?.id ? String(postableAccounts[0].id) : ""
    setLines((prev) => [
      ...prev,
      {
        id: `line-${Date.now()}`,
        lineNo: prev.length + 1,
        accountId: defaultAcc,
        debit: side === "DEBIT" ? formatted : "",
        credit: side === "CREDIT" ? formatted : "",
        memo: "Penyeimbang selisih jurnal",
      },
    ])
    toast.info(`Baris penyeimbang ${side} Rp ${formatted} ditambahkan.`)
  }

  // Validasi Payload
  const validatePayload = () => {
    if (!description.trim()) {
      toast.error("Deskripsi transaksi wajib diisi.")
      return false
    }

    if (!totalDebit.equals(totalCredit) || totalDebit.isZero()) {
      toast.error("Jurnal tidak seimbang. Total debit wajib sama persis dengan total kredit.")
      return false
    }

    const missingAccount = lines.some((l) => !l.accountId)
    if (missingAccount) {
      toast.error("Semua baris wajib memilih akun buku besar postable.")
      return false
    }

    return true
  }

  // Simpan sebagai Draf (post=false)
  const handleSaveDraft = async () => {
    if (!validatePayload()) return

    try {
      setIsSubmitting(true)
      const payload = {
        entryDate,
        description: reference ? `${description.trim()} [Ref: ${reference.trim()}]` : description.trim(),
        source: "MANUAL",
        lines: lines.map((l) => ({
          accountId: Number(l.accountId),
          debit: parseFloat(l.debit || "0"),
          credit: parseFloat(l.credit || "0"),
          memo: l.memo || undefined,
        })),
      }

      await apiFetch<JournalResponse>("/journals?entityId=1&post=false", {
        method: "POST",
        body: JSON.stringify(payload),
      })

      toast.success("Draf jurnal berhasil disimpan!")
      navigate("/journals")
    } catch (err: any) {
      toast.error(err.message || "Gagal menyimpan draf jurnal")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Buat Draf lalu langsung Submit ke Antrean Persetujuan (Maker)
  const handleSubmitJournal = async () => {
    if (!validatePayload()) return

    try {
      setIsSubmitting(true)
      const payload = {
        entryDate,
        description: reference ? `${description.trim()} [Ref: ${reference.trim()}]` : description.trim(),
        source: "MANUAL",
        lines: lines.map((l) => ({
          accountId: Number(l.accountId),
          debit: parseFloat(l.debit || "0"),
          credit: parseFloat(l.credit || "0"),
          memo: l.memo || undefined,
        })),
      }

      // 1. Buat Jurnal Draf
      const draft = await apiFetch<JournalResponse>("/journals?entityId=1&post=false", {
        method: "POST",
        body: JSON.stringify(payload),
      })

      // 2. Submit ke Persetujuan
      await apiFetch<JournalResponse>(`/journals/${draft.id}/submit?userId=1`, {
        method: "POST",
      })

      toast.success("Jurnal berhasil diajukan ke antrean persetujuan (Maker-Checker)!")
      navigate("/journals")
    } catch (err: any) {
      toast.error(err.message || "Gagal mengajukan jurnal")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-24">
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
            <BreadcrumbPage>Entri Jurnal Baru</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="size-8 mr-1"
              onClick={() => navigate("/journals")}
            >
              <ArrowLeft className="size-4" />
            </Button>
            <h1 className="text-2xl font-bold tracking-tight text-foreground font-heading">
              Entri Jurnal Double-Entry
            </h1>
            <Badge variant="outline" className="border-teal-500/30 text-teal-700 dark:text-teal-400 text-xs">
              Periode Aktif (OPEN)
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 ml-9">
            Masukkan baris transaksi debit dan kredit. Nilai total debit harus sama persis dengan total kredit.
          </p>
        </div>
      </div>

      {/* Journal Header Information Card */}
      <Card>
        <CardHeader className="border-b border-border/30 pb-4">
          <CardTitle className="text-sm font-semibold">Informasi Transaksi</CardTitle>
          <CardDescription className="text-xs">
            Tanggal, nomor referensi bukti fisik/faktur, dan deskripsi tujuan transaksi.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field>
              <FieldLabel htmlFor="entryDate">Tanggal Transaksi</FieldLabel>
              <Input
                id="entryDate"
                type="date"
                value={entryDate}
                onChange={(e) => setEntryDate(e.target.value)}
                className="text-xs h-9"
                required
              />
              <FieldDescription>Wajib berada pada periode buku terbuka (OPEN).</FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="reference">No. Referensi Bukti (Opsional)</FieldLabel>
              <Input
                id="reference"
                placeholder="Contoh: REF-2026-0881 / BKK-012"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                className="text-xs h-9 font-mono"
              />
              <FieldDescription>Nomor kuitansi, faktur pajak, atau tagihan vendor.</FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="description">Uraian / Deskripsi Jurnal</FieldLabel>
              <Input
                id="description"
                placeholder="Contoh: Pembayaran sewa kantor cabang..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="text-xs h-9"
                required
              />
              <FieldDescription>Keterangan tujuan pembukuan transaksi.</FieldDescription>
            </Field>
          </div>
        </CardContent>
      </Card>

      {/* Lines Table Card */}
      <Card>
        <CardHeader className="border-b border-border/30 pb-4 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-semibold">Baris Pembukuan (Ledger Lines)</CardTitle>
            <CardDescription className="text-xs">
              Pilih akun postable dan tentukan posisi debit atau kredit.
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleAddLine} className="text-xs gap-1.5 h-8">
            <Plus className="size-3.5" />
            Tambah Baris Akun
          </Button>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border/30 bg-muted/10 hover:bg-muted/10">
                <TableHead className="w-[50px] pl-6 text-center font-semibold">#</TableHead>
                <TableHead className="w-[300px] font-semibold">Akun Buku Besar (Postable)</TableHead>
                <TableHead className="w-[180px] text-right font-semibold">Debit (IDR)</TableHead>
                <TableHead className="w-[180px] text-right font-semibold">Kredit (IDR)</TableHead>
                <TableHead className="font-semibold">Memo Baris (Opsional)</TableHead>
                <TableHead className="w-[60px] text-center pr-6 font-semibold">Hapus</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingAccounts ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-28 text-center text-muted-foreground text-xs">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="size-4 animate-spin text-primary" />
                      Memuat daftar akun postable...
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                lines.map((line, index) => (
                  <TableRow key={line.id} className="border-b border-border/20 hover:bg-muted/5">
                    <TableCell className="pl-6 text-center font-mono text-xs text-muted-foreground py-2.5">
                      {index + 1}
                    </TableCell>

                    {/* Account Selector */}
                    <TableCell className="py-2.5">
                      <Select
                        value={line.accountId}
                        onValueChange={(val) =>
                          setLines((prev) =>
                            prev.map((l) => (l.id === line.id ? { ...l, accountId: val } : l))
                          )
                        }
                      >
                        <SelectTrigger className="text-xs h-8">
                          <SelectValue placeholder="Pilih Akun Postable..." />
                        </SelectTrigger>
                        <SelectContent className="max-h-64">
                          <SelectGroup>
                            <SelectLabel>Akun Postable Tersedia</SelectLabel>
                            {postableAccounts.map((acc) => (
                              <SelectItem key={acc.id} value={String(acc.id)} className="text-xs">
                                <span className="font-mono font-semibold text-primary mr-1.5">{acc.code}</span>
                                <span>{acc.name}</span>
                                <span className="text-[10px] text-muted-foreground ml-2">({acc.type})</span>
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </TableCell>

                    {/* Debit Input */}
                    <TableCell className="py-2.5">
                      <Input
                        type="text"
                        inputMode="decimal"
                        placeholder="0.00"
                        value={line.debit}
                        onChange={(e) => handleDebitChange(line.id, e.target.value)}
                        className="text-xs h-8 text-right font-mono tabular-nums font-semibold"
                      />
                    </TableCell>

                    {/* Credit Input */}
                    <TableCell className="py-2.5">
                      <Input
                        type="text"
                        inputMode="decimal"
                        placeholder="0.00"
                        value={line.credit}
                        onChange={(e) => handleCreditChange(line.id, e.target.value)}
                        className="text-xs h-8 text-right font-mono tabular-nums font-semibold"
                      />
                    </TableCell>

                    {/* Line Memo */}
                    <TableCell className="py-2.5">
                      <Input
                        type="text"
                        placeholder="Keterangan rincian baris ini..."
                        value={line.memo}
                        onChange={(e) =>
                          setLines((prev) =>
                            prev.map((l) => (l.id === line.id ? { ...l, memo: e.target.value } : l))
                          )
                        }
                        className="text-xs h-8"
                      />
                    </TableCell>

                    {/* Remove Button */}
                    <TableCell className="text-center pr-6 py-2.5">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveLine(line.id)}
                        disabled={lines.length <= 2}
                        className="size-7 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="size-3.5" />
                        <span className="sr-only">Hapus Baris</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Balance Bar Paling Bawah */}
      <BalanceBar
        totalDebit={totalDebit}
        totalCredit={totalCredit}
        onAddBalancingLine={handleAddBalancingLine}
        onSaveDraft={handleSaveDraft}
        onSubmit={handleSubmitJournal}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
