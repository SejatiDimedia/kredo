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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { FieldGroup, Field, FieldLabel, FieldDescription } from "@/components/ui/field"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import {
  Plus,
  Upload,
  Search,
  ChevronRight,
  ChevronDown,
  MoreHorizontal,
  BookOpen,
  Info,
  FolderPlus,
  CheckCircle2,
  Lock,
} from "lucide-react"
import { apiFetch } from "@/lib/api"
import { Loader2 } from "lucide-react"

export interface CoaAccount {
  id: string
  code: string
  name: string
  level: number
  category: "ASSET" | "LIABILITY" | "EQUITY" | "REVENUE" | "EXPENSE"
  normalBalance: "DEBIT" | "CREDIT"
  reportGroup: string
  isPostable: boolean
  parentId?: string
}

const INITIAL_ACCOUNTS: CoaAccount[] = [
  // 1000 ASET
  { id: "1000", code: "1000", name: "ASET", level: 1, category: "ASSET", normalBalance: "DEBIT", reportGroup: "NERACA", isPostable: false },
  { id: "1100", code: "1100", name: "Kas dan Setara Kas", level: 2, category: "ASSET", normalBalance: "DEBIT", reportGroup: "CASH_EQUIVALENT", isPostable: false, parentId: "1000" },
  { id: "1101", code: "1101", name: "Kas Kecil Operasional", level: 3, category: "ASSET", normalBalance: "DEBIT", reportGroup: "CASH", isPostable: true, parentId: "1100" },
  { id: "1102", code: "1102", name: "Bank BCA Operasional (IDR)", level: 3, category: "ASSET", normalBalance: "DEBIT", reportGroup: "BANK", isPostable: true, parentId: "1100" },
  { id: "1103", code: "1103", name: "Bank Mandiri Payroll (IDR)", level: 3, category: "ASSET", normalBalance: "DEBIT", reportGroup: "BANK", isPostable: true, parentId: "1100" },
  { id: "1200", code: "1200", name: "Piutang Usaha", level: 2, category: "ASSET", normalBalance: "DEBIT", reportGroup: "RECEIVABLES", isPostable: false, parentId: "1000" },
  { id: "1201", code: "1201", name: "Piutang Dagang Pihak Ketiga", level: 3, category: "ASSET", normalBalance: "DEBIT", reportGroup: "RECEIVABLES", isPostable: true, parentId: "1200" },
  { id: "1209", code: "1209", name: "Cadangan Kerugian Penurunan Nilai", level: 3, category: "ASSET", normalBalance: "CREDIT", reportGroup: "CONTRA_ASSET", isPostable: true, parentId: "1200" },
  { id: "1300", code: "1300", name: "Persediaan", level: 2, category: "ASSET", normalBalance: "DEBIT", reportGroup: "INVENTORY", isPostable: false, parentId: "1000" },
  { id: "1301", code: "1301", name: "Persediaan Barang Dagang", level: 3, category: "ASSET", normalBalance: "DEBIT", reportGroup: "INVENTORY", isPostable: true, parentId: "1300" },

  // 2000 LIABILITAS
  { id: "2000", code: "2000", name: "LIABILITAS", level: 1, category: "LIABILITY", normalBalance: "CREDIT", reportGroup: "NERACA", isPostable: false },
  { id: "2100", code: "2100", name: "Liabilitas Jangka Pendek", level: 2, category: "LIABILITY", normalBalance: "CREDIT", reportGroup: "SHORT_TERM_LIABILITIES", isPostable: false, parentId: "2000" },
  { id: "2101", code: "2101", name: "Utang Usaha Vendor", level: 3, category: "LIABILITY", normalBalance: "CREDIT", reportGroup: "PAYABLES", isPostable: true, parentId: "2100" },
  { id: "2102", code: "2102", name: "Utang Pajak PPN Keluaran", level: 3, category: "LIABILITY", normalBalance: "CREDIT", reportGroup: "TAX_PAYABLES", isPostable: true, parentId: "2100" },
  { id: "2103", code: "2103", name: "Beban Akrual Gaji & THR", level: 3, category: "LIABILITY", normalBalance: "CREDIT", reportGroup: "ACCRUED_EXPENSES", isPostable: true, parentId: "2100" },

  // 3000 EKUITAS
  { id: "3000", code: "3000", name: "EKUITAS", level: 1, category: "EQUITY", normalBalance: "CREDIT", reportGroup: "NERACA", isPostable: false },
  { id: "3100", code: "3100", name: "Modal Saham & Disetor", level: 2, category: "EQUITY", normalBalance: "CREDIT", reportGroup: "EQUITY", isPostable: false, parentId: "3000" },
  { id: "3101", code: "3101", name: "Modal Saham Pemilik", level: 3, category: "EQUITY", normalBalance: "CREDIT", reportGroup: "EQUITY", isPostable: true, parentId: "3100" },
  { id: "3200", code: "3200", name: "Laba Ditahan (Retained Earnings)", level: 2, category: "EQUITY", normalBalance: "CREDIT", reportGroup: "EQUITY", isPostable: true, parentId: "3000" },
  { id: "3300", code: "3300", name: "Ikhtisar Laba Rugi Berjalan", level: 2, category: "EQUITY", normalBalance: "CREDIT", reportGroup: "EQUITY", isPostable: true, parentId: "3000" },

  // 4000 PENDAPATAN
  { id: "4000", code: "4000", name: "PENDAPATAN", level: 1, category: "REVENUE", normalBalance: "CREDIT", reportGroup: "LABA_RUGI", isPostable: false },
  { id: "4100", code: "4100", name: "Pendapatan Usaha Utama", level: 2, category: "REVENUE", normalBalance: "CREDIT", reportGroup: "REVENUE", isPostable: false, parentId: "4000" },
  { id: "4101", code: "4101", name: "Pendapatan Penjualan Produk", level: 3, category: "REVENUE", normalBalance: "CREDIT", reportGroup: "REVENUE", isPostable: true, parentId: "4100" },
  { id: "4102", code: "4102", name: "Retur dan Potongan Penjualan", level: 3, category: "REVENUE", normalBalance: "DEBIT", reportGroup: "CONTRA_REVENUE", isPostable: true, parentId: "4100" },

  // 5000 BEBAN POKOK PENJUALAN
  { id: "5000", code: "5000", name: "BEBAN POKOK PENJUALAN", level: 1, category: "EXPENSE", normalBalance: "DEBIT", reportGroup: "LABA_RUGI", isPostable: false },
  { id: "5100", code: "5100", name: "Harga Pokok Penjualan (HPP)", level: 2, category: "EXPENSE", normalBalance: "DEBIT", reportGroup: "COGS", isPostable: true, parentId: "5000" },

  // 6000 BEBAN OPERASIONAL
  { id: "6000", code: "6000", name: "BEBAN OPERASIONAL", level: 1, category: "EXPENSE", normalBalance: "DEBIT", reportGroup: "LABA_RUGI", isPostable: false },
  { id: "6100", code: "6100", name: "Beban Ketenagakerjaan", level: 2, category: "EXPENSE", normalBalance: "DEBIT", reportGroup: "OPERATING_EXPENSE", isPostable: false, parentId: "6000" },
  { id: "6101", code: "6101", name: "Beban Gaji & Tunjangan", level: 3, category: "EXPENSE", normalBalance: "DEBIT", reportGroup: "OPERATING_EXPENSE", isPostable: true, parentId: "6100" },
  { id: "6200", code: "6200", name: "Beban Kantor & Administrasi", level: 2, category: "EXPENSE", normalBalance: "DEBIT", reportGroup: "OPERATING_EXPENSE", isPostable: false, parentId: "6000" },
  { id: "6201", code: "6201", name: "Beban Sewa Kantor", level: 3, category: "EXPENSE", normalBalance: "DEBIT", reportGroup: "OPERATING_EXPENSE", isPostable: true, parentId: "6200" },
  { id: "6202", code: "6202", name: "Beban Utilitas (Listrik & Air)", level: 3, category: "EXPENSE", normalBalance: "DEBIT", reportGroup: "OPERATING_EXPENSE", isPostable: true, parentId: "6200" },
]

export function CoaPage() {
  const navigate = useNavigate()
  const [accounts, setAccounts] = React.useState<CoaAccount[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [categoryFilter, setCategoryFilter] = React.useState<string>("ALL")
  const [natureFilter, setNatureFilter] = React.useState<string>("ALL")

  // Set of collapsed parent account codes
  const [collapsedNodes, setCollapsedNodes] = React.useState<Set<string>>(new Set())

  // Dialog Add State
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [newCode, setNewCode] = React.useState("")
  const [newName, setNewName] = React.useState("")
  const [newCategory, setNewCategory] = React.useState<CoaAccount["category"]>("ASSET")
  const [newNormalBalance, setNewNormalBalance] = React.useState<CoaAccount["normalBalance"]>("DEBIT")
  const [newParentCode, setNewParentCode] = React.useState<string>("1100")
  const [newIsPostable, setNewIsPostable] = React.useState<boolean>(true)

  // Toggle node collapse
  const toggleNode = (code: string) => {
    setCollapsedNodes((prev) => {
      const next = new Set(prev)
      if (next.has(code)) {
        next.delete(code)
      } else {
        next.add(code)
      }
      return next
    })
  }

  const expandAll = () => setCollapsedNodes(new Set())
  const collapseAll = () => {
    const parentCodes = accounts.filter(a => !a.isPostable).map(a => a.code)
    setCollapsedNodes(new Set(parentCodes))
  }

  // Filter accounts
  const filteredAccounts = React.useMemo(() => {
    return accounts.filter((acc) => {
      // If parent is collapsed and no active search, hide children
      if (!searchQuery) {
        let currentParentId = acc.parentId
        while (currentParentId) {
          if (collapsedNodes.has(currentParentId)) {
            return false
          }
          const parent = accounts.find(a => a.code === currentParentId)
          currentParentId = parent?.parentId
        }
      }

      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesQuery = acc.code.toLowerCase().includes(query) || acc.name.toLowerCase().includes(query)
        if (!matchesQuery) return false
      }

      // Category filter
      if (categoryFilter !== "ALL" && acc.category !== categoryFilter) {
        return false
      }

      // Nature filter
      if (natureFilter === "POSTABLE" && !acc.isPostable) return false
      if (natureFilter === "HEADER" && acc.isPostable) return false

      return true
    })
  }, [accounts, searchQuery, categoryFilter, natureFilter, collapsedNodes])

  // Fungsi untuk mengambil data akun live dari Backend PostgreSQL
  const fetchAccounts = React.useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await apiFetch<Array<{
        id: number
        code: string
        name: string
        type: "ASSET" | "LIABILITY" | "EQUITY" | "REVENUE" | "EXPENSE"
        normalBalance: "DEBIT" | "CREDIT"
        reportGroup: string
        parentId: number | null
        isPostable: boolean
      }>>("/accounts?entityId=1")

      // Menghitung level hierarki (1 = Induk, 2 = Sub-induk, 3 = Akun Transaksi)
      const idToCodeMap = new Map<number, string>()
      data.forEach(acc => idToCodeMap.set(acc.id, acc.code))

      const mappedAccounts: CoaAccount[] = data.map(acc => {
        let level = 1
        if (acc.parentId) {
          level = acc.isPostable ? 3 : 2
        }
        return {
          id: String(acc.id),
          code: acc.code,
          name: acc.name,
          level,
          category: acc.type,
          normalBalance: acc.normalBalance,
          reportGroup: acc.reportGroup,
          isPostable: acc.isPostable,
          parentId: acc.parentId ? idToCodeMap.get(acc.parentId) : undefined,
        }
      })

      setAccounts(mappedAccounts)
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Gagal memuat data akun"
      toast.error(errorMsg)
      // Fallback ke data lokal jika backend belum dinyalakan
      setAccounts(INITIAL_ACCOUNTS)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Panggil fetchAccounts saat halaman pertama kali dibuka
  React.useEffect(() => {
    fetchAccounts()
  }, [fetchAccounts])

  // Handle Add Account
  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCode.trim() || !newName.trim()) {
      toast.error("Kode akun dan nama akun wajib diisi")
      return
    }

    try {
      setIsSubmitting(true)
      const parent = accounts.find(a => a.code === newParentCode)

      await apiFetch("/accounts?entityId=1", {
        method: "POST",
        body: JSON.stringify({
          code: newCode.trim(),
          name: newName.trim(),
          type: newCategory,
          normalBalance: newNormalBalance,
          reportGroup: parent ? parent.reportGroup : "GENERAL",
          parentId: parent ? Number(parent.id) : null,
          isPostable: newIsPostable,
        }),
      })

      toast.success(`Akun ${newCode} — ${newName} berhasil disimpan ke database PostgreSQL!`)
      setIsDialogOpen(false)
      setNewCode("")
      setNewName("")
      await fetchAccounts() // Refresh data langsung dari database
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Gagal menyimpan akun"
      toast.error(errorMsg)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getCategoryBadge = (category: CoaAccount["category"]) => {
    switch (category) {
      case "ASSET":
        return <Badge variant="info" size="sm" className="font-mono uppercase font-semibold">ASET</Badge>
      case "LIABILITY":
        return <Badge variant="warning" size="sm" className="font-mono uppercase font-semibold">LIABILITAS</Badge>
      case "EQUITY":
        return <Badge variant="purple" size="sm" className="font-mono uppercase font-semibold">EKUITAS</Badge>
      case "REVENUE":
        return <Badge variant="success" size="sm" className="font-mono uppercase font-semibold">PENDAPATAN</Badge>
      case "EXPENSE":
        return <Badge variant="destructive" size="sm" className="font-mono uppercase font-semibold">BEBAN</Badge>
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
            <BreadcrumbPage>Chart of Accounts (COA)</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page Title & Primary Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-heading">
            Chart of Accounts
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Struktur hierarkis bagan akun 5 level sesuai standar PSAK. Akun daun (postable) dapat digunakan pada jurnal.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => toast.info("Fitur impor CSV dibuka...")}>
            <Upload className="size-3.5 mr-1.5" />
            Impor CSV
          </Button>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="size-3.5 mr-1.5" />
                Tambah Akun
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Tambah Akun Baru</DialogTitle>
                <DialogDescription>
                  Masukkan rincian kode akun dan klasifikasi normal saldo. Akun induk tidak dapat diposting langsung pada jurnal.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleCreateAccount} className="space-y-4 py-2">
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="newCode">Kode Akun</FieldLabel>
                    <Input
                      id="newCode"
                      placeholder="Contoh: 1104"
                      value={newCode}
                      onChange={(e) => setNewCode(e.target.value)}
                      className="font-mono text-sm"
                      required
                    />
                    <FieldDescription>Gunakan format numerik hierarkis (misal 1104 untuk turunan 1100).</FieldDescription>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="newName">Nama Akun</FieldLabel>
                    <Input
                      id="newName"
                      placeholder="Contoh: Bank BNI Operasional"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      required
                    />
                  </Field>

                  <div className="grid grid-cols-2 gap-4">
                    <Field>
                      <FieldLabel htmlFor="newCategory">Kategori Akun</FieldLabel>
                      <Select
                        value={newCategory}
                        onValueChange={(val) => setNewCategory(val as CoaAccount["category"])}
                      >
                        <SelectTrigger id="newCategory">
                          <SelectValue placeholder="Pilih Kategori" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Kategori Akuntansi</SelectLabel>
                            <SelectItem value="ASSET">Aset (Asset)</SelectItem>
                            <SelectItem value="LIABILITY">Liabilitas (Liability)</SelectItem>
                            <SelectItem value="EQUITY">Ekuitas (Equity)</SelectItem>
                            <SelectItem value="REVENUE">Pendapatan (Revenue)</SelectItem>
                            <SelectItem value="EXPENSE">Beban (Expense)</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="newNormalBalance">Saldo Normal</FieldLabel>
                      <Select
                        value={newNormalBalance}
                        onValueChange={(val) => setNewNormalBalance(val as CoaAccount["normalBalance"])}
                      >
                        <SelectTrigger id="newNormalBalance">
                          <SelectValue placeholder="Pilih Saldo Normal" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Posisi Saldo</SelectLabel>
                            <SelectItem value="DEBIT">DEBIT</SelectItem>
                            <SelectItem value="CREDIT">KREDIT</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>

                  <Field>
                    <FieldLabel htmlFor="newParentCode">Akun Induk (Parent Node)</FieldLabel>
                    <Select
                      value={newParentCode}
                      onValueChange={setNewParentCode}
                    >
                      <SelectTrigger id="newParentCode">
                        <SelectValue placeholder="Pilih Akun Induk" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Akun Induk (Header)</SelectLabel>
                          {accounts.filter(a => !a.isPostable).map((parent) => (
                            <SelectItem key={parent.code} value={parent.code}>
                              {parent.code} - {parent.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>

                  <div className="flex items-center gap-3 pt-2">
                    <Checkbox
                      id="isPostable"
                      checked={newIsPostable}
                      onCheckedChange={(c) => setNewIsPostable(!!c)}
                    />
                    <div className="grid gap-0.5 leading-none">
                      <label htmlFor="isPostable" className="text-xs font-medium cursor-pointer text-foreground">
                        Akun Daun (Postable Account)
                      </label>
                      <p className="text-[11px] text-muted-foreground">
                        Centang bila akun ini dapat menerima entri posting langsung pada baris jurnal.
                      </p>
                    </div>
                  </div>
                </FieldGroup>

                <DialogFooter className="pt-4">
                  <Button type="button" variant="outline" size="sm" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
                    Batal
                  </Button>
                  <Button type="submit" size="sm" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="size-3.5 mr-1.5 animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      "Simpan Akun"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Accounting Notice */}
      <Alert className="border-border/60 bg-muted/20">
        <Info className="size-4 text-primary" />
        <AlertTitle className="text-xs font-semibold">Aturan Integritas Buku Besar</AlertTitle>
        <AlertDescription className="text-xs text-muted-foreground">
          Akun Induk bertanda <strong>Header</strong> hanya berfungsi mengelompokkan saldo laporan dan dilarang digunakan dalam jurnal langsung. Seluruh transaksi wajib dibukukan ke akun <strong>Postable</strong>.
        </AlertDescription>
      </Alert>

      {/* Main Table Card using shadcn Card Composition */}
      <Card>
        <CardHeader className="border-b border-border/30 pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base font-semibold">Daftar Rekening Buku Besar</CardTitle>
              <CardDescription className="text-xs">
                Total {accounts.length} akun terdaftar ({accounts.filter(a => a.isPostable).length} akun aktif postable).
              </CardDescription>
            </div>

            <CardAction>
              <div className="flex flex-wrap items-center gap-2">
                <Button variant="ghost" size="xs" onClick={expandAll} className="text-xs text-muted-foreground hover:text-foreground">
                  Buka Semua
                </Button>
                <span className="text-border text-xs">•</span>
                <Button variant="ghost" size="xs" onClick={collapseAll} className="text-xs text-muted-foreground hover:text-foreground">
                  Tutup Semua
                </Button>
              </div>
            </CardAction>
          </div>

          {/* Filter and Search Bar inside Header */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
              <Input
                placeholder="Cari kode atau nama akun..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 text-xs h-8"
              />
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="text-xs h-8">
                <SelectValue placeholder="Semua Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Semua Kategori</SelectItem>
                <SelectItem value="ASSET">Aset (1000)</SelectItem>
                <SelectItem value="LIABILITY">Liabilitas (2000)</SelectItem>
                <SelectItem value="EQUITY">Ekuitas (3000)</SelectItem>
                <SelectItem value="REVENUE">Pendapatan (4000)</SelectItem>
                <SelectItem value="EXPENSE">Beban (5000-6000)</SelectItem>
              </SelectContent>
            </Select>

            <Select value={natureFilter} onValueChange={setNatureFilter}>
              <SelectTrigger className="text-xs h-8">
                <SelectValue placeholder="Semua Klasifikasi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Semua Klasifikasi</SelectItem>
                <SelectItem value="POSTABLE">Hanya Akun Postable</SelectItem>
                <SelectItem value="HEADER">Hanya Akun Header</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border/30 bg-muted/10 hover:bg-muted/10">
                <TableHead className="w-[180px] pl-6 font-semibold">Kode Akun</TableHead>
                <TableHead className="font-semibold">Nama Akun</TableHead>
                <TableHead className="w-[140px] font-semibold">Kategori</TableHead>
                <TableHead className="w-[120px] font-semibold">Saldo Normal</TableHead>
                <TableHead className="w-[140px] font-semibold">Klasifikasi</TableHead>
                <TableHead className="w-[80px] text-center pr-6 font-semibold">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground text-xs">
                    <Loader2 className="size-4 animate-spin inline mr-2 text-primary" />
                    Memuat data akun dari database PostgreSQL...
                  </TableCell>
                </TableRow>
              ) : filteredAccounts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground text-xs">
                    Tidak ada akun yang sesuai dengan pencarian atau filter.
                  </TableCell>
                </TableRow>
              ) : (
                filteredAccounts.map((account) => {
                  const hasChildren = accounts.some(a => a.parentId === account.code)
                  const isCollapsed = collapsedNodes.has(account.code)
                  const indentPx = (account.level - 1) * 20

                  return (
                    <TableRow
                      key={account.code}
                      className={`border-b border-border/20 transition-colors ${account.level === 1
                        ? "bg-muted/20 font-semibold"
                        : account.level === 2
                          ? "bg-muted/5 font-medium"
                          : "hover:bg-muted/20"
                        }`}
                    >
                      {/* Account Code Column */}
                      <TableCell className="font-mono text-xs pl-6 py-2.5">
                        <div className="flex items-center gap-1.5" style={{ paddingLeft: `${indentPx}px` }}>
                          {hasChildren ? (
                            <button
                              type="button"
                              onClick={() => toggleNode(account.code)}
                              className="size-4 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                              aria-label={isCollapsed ? "Expand node" : "Collapse node"}
                            >
                              {isCollapsed ? <ChevronRight className="size-3.5" /> : <ChevronDown className="size-3.5" />}
                            </button>
                          ) : (
                            <span className="size-4 inline-block" />
                          )}
                          <span className={account.isPostable ? "text-primary font-semibold" : "text-foreground font-bold"}>
                            {account.code}
                          </span>
                        </div>
                      </TableCell>

                      {/* Account Name Column */}
                      <TableCell className="py-2.5">
                        <div className="flex items-center gap-2">
                          <span className={account.level === 1 ? "font-bold text-foreground" : "text-foreground"}>
                            {account.name}
                          </span>
                          {!account.isPostable && (
                            <span className="text-[10px] text-muted-foreground/70 font-normal">
                              (Induk)
                            </span>
                          )}
                        </div>
                      </TableCell>

                      {/* Category Badge */}
                      <TableCell className="py-2.5">
                        {getCategoryBadge(account.category)}
                      </TableCell>

                      {/* Normal Balance */}
                      <TableCell className="py-2.5 font-mono text-xs">
                        <span className={account.normalBalance === "DEBIT" ? "text-teal-700 dark:text-teal-300 font-semibold" : "text-slate-700 dark:text-slate-300 font-semibold"}>
                          {account.normalBalance}
                        </span>
                      </TableCell>

                      {/* Postable Classification */}
                      <TableCell className="py-2.5">
                        {account.isPostable ? (
                          <Badge variant="secondary" className="gap-1 text-[11px] font-normal">
                            <CheckCircle2 className="size-3 text-emerald-600" />
                            Postable
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="gap-1 text-[11px] font-normal text-muted-foreground border-border/60">
                            <Lock className="size-3" />
                            Header
                          </Badge>
                        )}
                      </TableCell>

                      {/* Action Dropdown */}
                      <TableCell className="py-2.5 text-center pr-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-7">
                              <MoreHorizontal className="size-3.5" />
                              <span className="sr-only">Menu Aksi</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 text-xs">
                            <DropdownMenuItem onClick={() => navigate(`/reports/general-ledger?account=${account.code}`)}>
                              <BookOpen className="size-3.5 mr-2" />
                              Lihat Buku Besar
                            </DropdownMenuItem>
                            {!account.isPostable && (
                              <DropdownMenuItem onClick={() => {
                                setNewParentCode(account.code)
                                setNewCategory(account.category)
                                setNewNormalBalance(account.normalBalance)
                                setIsDialogOpen(true)
                              }}>
                                <FolderPlus className="size-3.5 mr-2" />
                                Tambah Sub-Akun
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => toast.info(`Edit akun ${account.code}`)}>
                              Ubah Informasi
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
