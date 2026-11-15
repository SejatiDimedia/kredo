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
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { BalanceBar } from "@/components/shared/BalanceBar"
import {
  Plus,
  Trash2,
  Info,
  ArrowLeft,
} from "lucide-react"

interface LineEntry {
  id: string
  lineNo: number
  accountCode: string
  debit: string
  credit: string
  memo: string
}

// Available postable accounts (PRD FR-COA-02 & INV-04)
const POSTABLE_ACCOUNTS = [
  { code: "1101", name: "Kas Kecil Operasional", category: "ASET" },
  { code: "1102", name: "Bank BCA Operasional", category: "ASET" },
  { code: "1103", name: "Bank Mandiri Payroll", category: "ASET" },
  { code: "1201", name: "Piutang Dagang Pihak Ketiga", category: "ASET" },
  { code: "1301", name: "Persediaan Barang Dagang", category: "ASET" },
  { code: "2101", name: "Utang Usaha Vendor", category: "LIABILITAS" },
  { code: "2102", name: "Utang Pajak PPN Keluaran", category: "LIABILITAS" },
  { code: "2103", name: "Beban Akrual Gaji", category: "LIABILITAS" },
  { code: "3101", name: "Modal Saham Pemilik", category: "EKUITAS" },
  { code: "4101", name: "Pendapatan Penjualan Produk", category: "PENDAPATAN" },
  { code: "5100", name: "Harga Pokok Penjualan (HPP)", category: "BEBAN" },
  { code: "6101", name: "Beban Gaji Karyawan", category: "BEBAN" },
  { code: "6201", name: "Beban Sewa Kantor Cabang", category: "BEBAN" },
  { code: "6202", name: "Beban Utilitas Listrik & Air", category: "BEBAN" },
]

export function JournalEditorPage() {
  const navigate = useNavigate()

  // Header State
  const [entryDate, setEntryDate] = React.useState("2026-11-15")
  const [description, setDescription] = React.useState("")
  const [reference, setReference] = React.useState("")

  // Lines State (Minimum 2 lines)
  const [lines, setLines] = React.useState<LineEntry[]>([
    { id: "line-1", lineNo: 1, accountCode: "6201", debit: "12500000", credit: "", memo: "Sewa Gedung Nov 2026" },
    { id: "line-2", lineNo: 2, accountCode: "1102", debit: "", credit: "12500000", memo: "Transfer via BCA Operasional" },
  ])

  // Real-time Decimal Calculations
  const totalDebit = React.useMemo(() => {
    return lines.reduce((acc, line) => {
      if (!line.debit) return acc
      return acc.plus(toDecimal(line.debit))
    }, new Decimal(0))
  }, [lines])

  const totalCredit = React.useMemo(() => {
    return lines.reduce((acc, line) => {
      if (!line.credit) return acc
      return acc.plus(toDecimal(line.credit))
    }, new Decimal(0))
  }, [lines])

  // Handle Debit Change (auto clear credit in same row)
  const handleDebitChange = (id: string, value: string) => {
    // Disallow non-numeric characters (allow digits and max 1 decimal point)
    const clean = value.replace(/[^0-9.]/g, "")
    // Disallow more than 2 decimals (PRD FR-JRN-02)
    const parts = clean.split(".")
    if (parts.length > 2 || (parts[1] && parts[1].length > 2)) return

    setLines((prev) =>
      prev.map((l) => (l.id === id ? { ...l, debit: clean, credit: "" } : l))
    )
  }

  // Handle Credit Change (auto clear debit in same row)
  const handleCreditChange = (id: string, value: string) => {
    const clean = value.replace(/[^0-9.]/g, "")
    const parts = clean.split(".")
    if (parts.length > 2 || (parts[1] && parts[1].length > 2)) return

    setLines((prev) =>
      prev.map((l) => (l.id === id ? { ...l, credit: clean, debit: "" } : l))
    )
  }

  // Add line
  const handleAddLine = () => {
    const nextLineNo = lines.length + 1
    const newLine: LineEntry = {
      id: `line-${Date.now()}`,
      lineNo: nextLineNo,
      accountCode: "",
      debit: "",
      credit: "",
      memo: "",
    }
    setLines((prev) => [...prev, newLine])
  }

  // Remove line
  const handleRemoveLine = (id: string) => {
    if (lines.length <= 2) {
      toast.warning("Jurnal double-entry minimal harus memiliki 2 baris akun.")
      return
    }
    setLines((prev) => {
      const filtered = prev.filter((l) => l.id !== id)
      return filtered.map((l, index) => ({ ...l, lineNo: index + 1 }))
    })
  }

  // Add Balancing Line
  const handleAddBalancingLine = (amount: Decimal, side: "DEBIT" | "CREDIT") => {
    // Check if there is an empty line at the end
    const lastLine = lines[lines.length - 1]
    if (lastLine && !lastLine.debit && !lastLine.credit && !lastLine.accountCode) {
      setLines((prev) =>
        prev.map((l) =>
          l.id === lastLine.id
            ? {
                ...l,
                debit: side === "DEBIT" ? amount.toString() : "",
                credit: side === "CREDIT" ? amount.toString() : "",
              }
            : l
        )
      )
      toast.info(`Nilai penyeimbang ${amount.toString()} ditambahkan ke baris ${lastLine.lineNo}`)
      return
    }

    // Otherwise append new line
    const newLine: LineEntry = {
      id: `line-${Date.now()}`,
      lineNo: lines.length + 1,
      accountCode: "",
      debit: side === "DEBIT" ? amount.toString() : "",
      credit: side === "CREDIT" ? amount.toString() : "",
      memo: "Penyeimbang selisih jurnal",
    }
    setLines((prev) => [...prev, newLine])
    toast.info(`Baris penyeimbang baru ditambahkan (${side}: ${amount.toString()})`)
  }

  // Save Draft
  const handleSaveDraft = () => {
    if (!description.trim()) {
      toast.error("Deskripsi transaksi wajib diisi sebelum menyimpan draf.")
      return
    }
    toast.success("Draf jurnal DFT-2026-091 berhasil disimpan.")
    navigate("/journals")
  }

  // Submit for Approval
  const handleSubmitJournal = () => {
    if (!description.trim()) {
      toast.error("Deskripsi transaksi wajib diisi.")
      return
    }

    if (!totalDebit.equals(totalCredit) || totalDebit.isZero()) {
      toast.error("Jurnal tidak seimbang. Total debit wajib sama dengan total kredit (INV-01).")
      return
    }

    // Verify all lines have accountCode
    const missingAccount = lines.some((l) => !l.accountCode)
    if (missingAccount) {
      toast.error("Setiap baris wajib memilih akun buku besar postable.")
      return
    }

    toast.success("Jurnal berhasil diajukan ke antrean persetujuan (Maker-Checker).")
    navigate("/journals")
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
              Periode: Nov 2026 (OPEN)
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 ml-9">
            Masukkan baris transaksi debit dan kredit. Aturan Invariant INV-01 mengharuskan nilai total debit sama persis dengan total kredit.
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
              <div className="relative">
                <Input
                  id="entryDate"
                  type="date"
                  value={entryDate}
                  onChange={(e) => setEntryDate(e.target.value)}
                  className="text-xs h-9"
                  required
                />
              </div>
              <FieldDescription>Wajib berada pada periode buku terbuka (OPEN).</FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="reference">No. Referensi Bukti (Opsional)</FieldLabel>
              <Input
                id="reference"
                placeholder="Contoh: INV-2026-0881 / BKK-012"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                className="text-xs h-9 font-mono"
              />
              <FieldDescription>Nomor faktur vendor atau bukti kas keluar.</FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="description">Deskripsi Transaksi</FieldLabel>
              <Input
                id="description"
                placeholder="Contoh: Pembayaran Beban Sewa Kantor Cabang"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="text-xs h-9"
                required
              />
              <FieldDescription>Uraian transaksi untuk laporan buku besar.</FieldDescription>
            </Field>
          </div>
        </CardContent>
      </Card>

      {/* Accounting Invariant Notice */}
      <Alert className="border-border/60 bg-muted/20">
        <Info className="size-4 text-primary" />
        <AlertTitle className="text-xs font-semibold">Aturan Pengisian Baris Akun (FR-JRN-02)</AlertTitle>
        <AlertDescription className="text-xs text-muted-foreground">
          Satu baris hanya boleh diisi salah satu sisi (Debit atau Kredit). Mengisi nominal debit akan otomatis mengosongkan sisi kredit dan sebaliknya.
        </AlertDescription>
      </Alert>

      {/* Journal Lines Table Card */}
      <Card>
        <CardHeader className="border-b border-border/30 pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-semibold">Rincian Baris Jurnal ({lines.length} Baris)</CardTitle>
            <CardDescription className="text-xs">
              Hanya akun daun bertanda <strong>Postable</strong> yang dapat dipilih.
            </CardDescription>
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleAddLine}
            className="text-xs gap-1.5"
          >
            <Plus className="size-3.5" />
            Tambah Baris
          </Button>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border/30 bg-muted/10 hover:bg-muted/10">
                <TableHead className="w-[50px] pl-6 text-center font-semibold">#</TableHead>
                <TableHead className="w-[280px] font-semibold">Akun Buku Besar (Postable)</TableHead>
                <TableHead className="w-[180px] text-right font-semibold">Debit (IDR)</TableHead>
                <TableHead className="w-[180px] text-right font-semibold">Kredit (IDR)</TableHead>
                <TableHead className="font-semibold">Memo Baris (Opsional)</TableHead>
                <TableHead className="w-[60px] text-center pr-6 font-semibold">Hapus</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lines.map((line, index) => (
                <TableRow key={line.id} className="border-b border-border/20 hover:bg-muted/5">
                  <TableCell className="pl-6 text-center font-mono text-xs text-muted-foreground py-2.5">
                    {index + 1}
                  </TableCell>

                  {/* Account Selector */}
                  <TableCell className="py-2.5">
                    <Select
                      value={line.accountCode}
                      onValueChange={(val) =>
                        setLines((prev) =>
                          prev.map((l) => (l.id === line.id ? { ...l, accountCode: val } : l))
                        )
                      }
                    >
                      <SelectTrigger className="text-xs h-8">
                        <SelectValue placeholder="Pilih Akun Postable..." />
                      </SelectTrigger>
                      <SelectContent className="max-h-64">
                        <SelectGroup>
                          <SelectLabel>Akun Postable Aktif</SelectLabel>
                          {POSTABLE_ACCOUNTS.map((acc) => (
                            <SelectItem key={acc.code} value={acc.code} className="text-xs">
                              <span className="font-mono font-semibold text-primary mr-1.5">{acc.code}</span>
                              <span>{acc.name}</span>
                              <span className="text-[10px] text-muted-foreground ml-2">({acc.category})</span>
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
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pinned Bottom Balance Bar (PRD 14.7 Signature Element) */}
      <BalanceBar
        totalDebit={totalDebit}
        totalCredit={totalCredit}
        onAddBalancingLine={handleAddBalancingLine}
        onSaveDraft={handleSaveDraft}
        onSubmit={handleSubmitJournal}
      />
    </div>
  )
}
