import * as React from "react"
import { useTheme } from "@/components/theme-provider"
import { Toaster, toast } from "sonner"

// Shadcn UI Components (Actions & Buttons)
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Kbd } from "@/components/ui/kbd"
import { Toggle } from "@/components/ui/toggle"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

// Shadcn UI Components (Forms & Inputs)
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"

// Shadcn UI Components (Layout, Containers & Data Display)
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from "@/components/ui/empty"

// Shadcn UI Components (Overlays & Feedback)
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Spinner } from "@/components/ui/spinner"

// Lucide Icons
import {
  Sun,
  Moon,
  CheckCircle2,
  AlertTriangle,
  Plus,
  RotateCcw,
  CreditCard,
  Wifi,
  Download,
  FileSpreadsheet,
  Building2,
  ArrowUpRight,
  ArrowDownLeft,
  Sparkles,
  Scale,
  MoreVertical,
  SlidersHorizontal,
  Bookmark,
  Bell,
  Lock,
  Layers,
  LayoutGrid,
  FileText,
  HelpCircle,
  FolderOpen
} from "lucide-react"

export function App() {
  const { theme, setTheme } = useTheme()
  const isDark = theme === "dark"

  // Balance bar interactive state
  const [totalDebit, setTotalDebit] = React.useState(25000000)
  const [totalCredit, setTotalCredit] = React.useState(25000000)
  const isBalanced = totalDebit === totalCredit
  const difference = Math.abs(totalDebit - totalCredit)

  // Timeframe selector
  const [timeframe, setTimeframe] = React.useState("week")
  const [progressVal, setProgressVal] = React.useState(75)

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
        <Toaster position="top-right" richColors />

        {/* Top Header */}
        <header className="sticky top-0 z-40 border-b border-border/80 bg-background/85 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
                <Scale className="size-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-heading text-lg font-bold tracking-tight text-foreground">
                    Kredo
                  </span>
                  <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary text-[11px] font-semibold">
                    Full shadcn/ui Component Catalog
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Semua Reusable UI Components dari shadcn/ui dengan Palet Teal & Slate
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs font-medium"
                onClick={() => setTheme(isDark ? "light" : "dark")}
              >
                {isDark ? <Sun className="size-3.5 text-amber-500" /> : <Moon className="size-3.5 text-slate-700" />}
                <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Breadcrumb Section */}
        <div className="border-b border-border/60 bg-muted/30 px-6 py-2.5">
          <div className="mx-auto max-w-7xl">
            <Breadcrumb>
              <BreadcrumbList className="text-xs">
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">Kredo Enterprise</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">UI Library</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-semibold text-primary">All Reusable Components (shadcn/ui)</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        {/* Hero Banner */}
        <section className="border-b border-border bg-gradient-to-b from-primary/5 via-background to-background py-10">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex flex-col gap-2.5">
              <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-primary uppercase">
                <Sparkles className="size-3.5" />
                <span>100% Menggunakan Seluruh Komponen Reusable dari shadcn/ui</span>
              </div>
              <h1 className="font-heading text-3xl font-extrabold tracking-tight md:text-4xl">
                Katalog Lengkap Reusable Components
              </h1>
              <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
                Setiap komponen di bawah ini diimpor langsung dari folder <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-primary font-semibold">src/components/ui/*</code>. 
                Warna komponen mengadopsi token semantik <strong>Deep Teal (#0D6276)</strong>, <strong>Dark Slate (#101727)</strong>, dan <strong>Mint Accent (#14B8A6)</strong> dari referensi gambar Anda.
              </p>
            </div>
          </div>
        </section>

        {/* Main Content Tabs */}
        <main className="mx-auto max-w-7xl px-6 py-10">
          <Tabs defaultValue="overview" className="w-full space-y-8">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto p-1 bg-muted/60">
              <TabsTrigger value="overview" className="gap-1.5 py-2 text-xs">
                <LayoutGrid className="size-3.5" /> Overview & Referensi
              </TabsTrigger>
              <TabsTrigger value="actions" className="gap-1.5 py-2 text-xs">
                <Layers className="size-3.5" /> Actions & Badges
              </TabsTrigger>
              <TabsTrigger value="forms" className="gap-1.5 py-2 text-xs">
                <FileText className="size-3.5" /> Forms & Selection
              </TabsTrigger>
              <TabsTrigger value="data" className="gap-1.5 py-2 text-xs">
                <SlidersHorizontal className="size-3.5" /> Data & Display
              </TabsTrigger>
              <TabsTrigger value="overlays" className="gap-1.5 py-2 text-xs">
                <Bell className="size-3.5" /> Overlays & Feedback
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: OVERVIEW & FINTECH REFERENCE */}
            <TabsContent value="overview" className="space-y-12">
              {/* Balance Bar Signature Widget */}
              <div>
                <div className="mb-4 flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <h2 className="font-heading text-xl font-bold tracking-tight">Signature Component: Balance Bar (PRD 14.7)</h2>
                    <Badge variant="outline" className="border-primary/40 text-primary text-xs">PRD Fitur Kunci</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Komponen khas yang memastikan setiap entri seimbang sebelum disetujui (Σ Debit = Σ Kredit):
                  </p>
                </div>

                <Card className="border-border p-6 shadow-xs">
                  <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant={isBalanced ? "default" : "outline"}
                        onClick={() => {
                          setTotalDebit(25000000)
                          setTotalCredit(25000000)
                        }}
                      >
                        Simulasikan Seimbang
                      </Button>
                      <Button
                        size="sm"
                        variant={!isBalanced ? "destructive" : "outline"}
                        onClick={() => {
                          setTotalDebit(25000000)
                          setTotalCredit(24950000)
                        }}
                      >
                        Simulasikan Selisih Rp 50.000
                      </Button>
                    </div>

                    <span className="text-xs text-muted-foreground">
                      Status: <strong className={isBalanced ? "text-emerald-600 font-bold" : "text-rose-600 font-bold"}>
                        {isBalanced ? "SEIMBANG (0 Variance)" : "SELISIH Rp 50.000,00"}
                      </strong>
                    </span>
                  </div>

                  {/* Balance Bar UI */}
                  <div className={`rounded-xl border p-4 transition-all duration-200 ${
                    isBalanced
                      ? "border-teal-500/30 bg-teal-50/50 dark:bg-teal-950/20"
                      : "border-rose-500/30 bg-rose-50/50 dark:bg-rose-950/20"
                  }`}>
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex flex-wrap items-center gap-6">
                        <div>
                          <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Total Debit</span>
                          <div className="font-mono text-lg font-bold text-foreground tabular-nums">
                            Rp {totalDebit.toLocaleString("id-ID")},00
                          </div>
                        </div>

                        <div className="text-muted-foreground font-light text-xl">−</div>

                        <div>
                          <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Total Kredit</span>
                          <div className="font-mono text-lg font-bold text-foreground tabular-nums">
                            Rp {totalCredit.toLocaleString("id-ID")},00
                          </div>
                        </div>

                        <div className="text-muted-foreground font-light text-xl">=</div>

                        <div>
                          <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Variance</span>
                          <div className={`font-mono text-lg font-bold tabular-nums ${isBalanced ? "text-emerald-600" : "text-rose-600 font-extrabold"}`}>
                            Rp {difference.toLocaleString("id-ID")},00
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {isBalanced ? (
                          <Badge className="gap-1.5 bg-emerald-600 text-white px-3 py-1 text-xs">
                            <CheckCircle2 className="size-3.5" /> Seimbang
                          </Badge>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-rose-500/40 text-rose-600 hover:bg-rose-500/10 text-xs gap-1"
                              onClick={() => setTotalCredit(totalDebit)}
                            >
                              <Plus className="size-3.5" /> Add Balancing Line
                            </Button>
                            <Badge variant="destructive" className="gap-1.5 px-3 py-1 text-xs">
                              <AlertTriangle className="size-3.5" /> Out of Balance
                            </Badge>
                          </>
                        )}

                        <Button
                          size="sm"
                          disabled={!isBalanced}
                          className="bg-primary text-primary-foreground font-semibold"
                          onClick={() => toast.success("Jurnal berhasil diajukan untuk approval maker-checker!")}
                        >
                          Submit Jurnal
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Fintech Cards From User Reference Image */}
              <div>
                <div className="mb-4">
                  <h2 className="font-heading text-xl font-bold tracking-tight">Fintech Cards (Dari Gambar Referensi)</h2>
                  <p className="text-xs text-muted-foreground">Kombinasi kartu cerdas dan kurva mutasi kas bergaya modern:</p>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                  {/* Card 1: Virtual Card */}
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0c596b] via-[#0D6276] to-[#101727] p-6 text-white shadow-lg">
                    <div className="pointer-events-none absolute -right-12 -top-12 size-48 rounded-full bg-teal-400/10 blur-xl" />
                    <div className="relative z-10 flex flex-col justify-between h-56">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[11px] font-medium tracking-wider text-teal-200/80 uppercase">Corporate Vault</span>
                          <h3 className="font-heading text-lg font-bold">PT Maju Jaya Sejahtera</h3>
                        </div>
                        <div className="flex items-center gap-1.5 opacity-90">
                          <Wifi className="size-5 rotate-90" />
                          <CreditCard className="size-5" />
                        </div>
                      </div>

                      <div className="my-auto flex items-center gap-3">
                        <div className="h-7 w-10 rounded-md border border-amber-300/40 bg-gradient-to-tr from-amber-400/80 to-yellow-200/80 shadow-xs" />
                        <span className="font-mono text-sm tracking-widest text-teal-100/90">•••• •••• •••• 1990</span>
                      </div>

                      <div className="flex items-end justify-between border-t border-teal-500/30 pt-3">
                        <div>
                          <span className="text-[10px] tracking-wider text-teal-200/80 uppercase">Available Cash Balance</span>
                          <div className="font-mono text-2xl font-extrabold tracking-tight tabular-nums">
                            Rp 158.875.000,00
                          </div>
                        </div>
                        <Badge variant="outline" className="border-teal-300/30 bg-teal-300/20 text-white font-mono text-[11px]">
                          IDR
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Quick Actions */}
                  <Card className="flex flex-col justify-between p-6 shadow-xs border-border">
                    <div>
                      <div className="flex items-center justify-between pb-3">
                        <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                          Preset Transaksi Cepat
                        </span>
                        <Badge variant="secondary" className="text-[10px]">4 Aksi</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <button className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary hover:bg-primary/5 group">
                          <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            <ArrowDownLeft className="size-5" />
                          </div>
                          <span className="text-xs font-semibold text-foreground">Setor Tunai</span>
                          <span className="text-[10px] text-muted-foreground">Debit 1101</span>
                        </button>

                        <button className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary hover:bg-primary/5 group">
                          <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            <ArrowUpRight className="size-5" />
                          </div>
                          <span className="text-xs font-semibold text-foreground">Transfer Bank</span>
                          <span className="text-[10px] text-muted-foreground">Kredit 1102</span>
                        </button>

                        <button className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary hover:bg-primary/5 group">
                          <div className="flex size-10 items-center justify-center rounded-full bg-teal-500/10 text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                            <FileSpreadsheet className="size-5" />
                          </div>
                          <span className="text-xs font-semibold text-foreground">Spring Batch</span>
                          <span className="text-[10px] text-muted-foreground">Impor CSV</span>
                        </button>

                        <button className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary hover:bg-primary/5 group">
                          <div className="flex size-10 items-center justify-center rounded-full bg-muted text-foreground group-hover:bg-foreground group-hover:text-background transition-colors">
                            <RotateCcw className="size-5" />
                          </div>
                          <span className="text-xs font-semibold text-foreground">Jurnal Balik</span>
                          <span className="text-[10px] text-muted-foreground">Koreksi Entri</span>
                        </button>
                      </div>
                    </div>
                  </Card>

                  {/* Card 3: Spending Sparkline Curve */}
                  <Card className="flex flex-col justify-between p-6 shadow-xs border-border">
                    <div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">Mutasi Mingguan</span>
                          <div className="font-mono text-2xl font-bold tracking-tight text-foreground tabular-nums">
                            Rp 98.345.000,00
                          </div>
                        </div>

                        <ToggleGroup
                          type="single"
                          value={timeframe}
                          onValueChange={(val) => val && setTimeframe(val)}
                          className="border border-border rounded-lg p-0.5"
                        >
                          <ToggleGroupItem value="day" className="h-6 px-2 text-[11px]">Hari</ToggleGroupItem>
                          <ToggleGroupItem value="week" className="h-6 px-2 text-[11px]">Minggu</ToggleGroupItem>
                          <ToggleGroupItem value="month" className="h-6 px-2 text-[11px]">Bulan</ToggleGroupItem>
                        </ToggleGroup>
                      </div>

                      <div className="relative mt-4 h-28 w-full">
                        <svg viewBox="0 0 300 100" className="size-full overflow-visible">
                          <defs>
                            <linearGradient id="tealGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#0D6276" stopOpacity="0.3" />
                              <stop offset="100%" stopColor="#0D6276" stopOpacity="0.0" />
                            </linearGradient>
                          </defs>
                          <path d="M 0,70 Q 50,40 100,55 T 200,25 T 300,50 L 300,100 L 0,100 Z" fill="url(#tealGrad)" />
                          <path d="M 0,70 Q 50,40 100,55 T 200,25 T 300,50" fill="none" stroke="#0D6276" strokeWidth="3" strokeLinecap="round" />
                          <circle cx="200" cy="25" r="5" fill="#0D6276" className="animate-pulse" />
                          <circle cx="200" cy="25" r="2" fill="#FFFFFF" />
                          <g transform="translate(165, -8)">
                            <rect width="70" height="22" rx="6" fill="#0D6276" />
                            <text x="35" y="15" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontFamily="monospace" fontWeight="bold">
                              Rp 7.900K
                            </text>
                          </g>
                        </svg>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs">
                      <span className="text-muted-foreground">Status Rekonsiliasi</span>
                      <span className="font-semibold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="size-3.5" /> Sinkron dengan Bank
                      </span>
                    </div>
                  </Card>
                </div>
              </div>

              {/* General Ledger Table */}
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="font-heading text-xl font-bold tracking-tight">Tabel Buku Besar (General Ledger Table)</h2>
                    <p className="text-xs text-muted-foreground">Menggunakan komponen shadcn Table dengan baris kompak:</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                      <Download className="size-3.5" /> Ekspor CSV
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                      <FileSpreadsheet className="size-3.5" /> Ekspor Excel
                    </Button>
                  </div>
                </div>

                <Card className="border-border shadow-xs overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50 hover:bg-muted/50">
                        <TableHead className="w-[140px] font-semibold text-xs">No. Jurnal</TableHead>
                        <TableHead className="w-[100px] font-semibold text-xs">Tanggal</TableHead>
                        <TableHead className="font-semibold text-xs">Deskripsi Transaksi</TableHead>
                        <TableHead className="w-[180px] font-semibold text-xs">Akun Terkait</TableHead>
                        <TableHead className="w-[150px] text-right font-semibold text-xs">Debit (IDR)</TableHead>
                        <TableHead className="w-[150px] text-right font-semibold text-xs">Kredit (IDR)</TableHead>
                        <TableHead className="w-[100px] text-center font-semibold text-xs">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="text-xs">
                      <TableRow>
                        <TableCell className="font-mono font-semibold text-primary">JV-PTM-2026-000001</TableCell>
                        <TableCell className="font-mono text-muted-foreground">14 Nov 2026</TableCell>
                        <TableCell className="font-medium text-foreground">Setoran Modal Pemilik Tunai</TableCell>
                        <TableCell className="text-muted-foreground">1101 Kas Kecil</TableCell>
                        <TableCell className="font-mono text-right tabular-nums font-semibold text-foreground">100.000.000,00</TableCell>
                        <TableCell className="font-mono text-right tabular-nums text-muted-foreground">0,00</TableCell>
                        <TableCell className="text-center">
                          <Badge className="bg-emerald-600 text-white text-[10px] py-0">POSTED</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono font-semibold text-primary">JV-PTM-2026-000002</TableCell>
                        <TableCell className="font-mono text-muted-foreground">14 Nov 2026</TableCell>
                        <TableCell className="font-medium text-foreground">Pembelian Persediaan Barang Dagang</TableCell>
                        <TableCell className="text-muted-foreground">1300 Persediaan</TableCell>
                        <TableCell className="font-mono text-right tabular-nums font-semibold text-foreground">20.000.000,00</TableCell>
                        <TableCell className="font-mono text-right tabular-nums text-muted-foreground">0,00</TableCell>
                        <TableCell className="text-center">
                          <Badge className="bg-emerald-600 text-white text-[10px] py-0">POSTED</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono font-semibold text-primary">JV-PTM-2026-000003</TableCell>
                        <TableCell className="font-mono text-muted-foreground">15 Nov 2026</TableCell>
                        <TableCell className="font-medium text-foreground">Penjualan Kredit Barang Dagang</TableCell>
                        <TableCell className="text-muted-foreground">1200 Piutang Usaha</TableCell>
                        <TableCell className="font-mono text-right tabular-nums font-semibold text-foreground">15.000.000,00</TableCell>
                        <TableCell className="font-mono text-right tabular-nums text-muted-foreground">0,00</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className="border-teal-500/40 bg-teal-500/10 text-teal-700 dark:text-teal-300 text-[10px] py-0">APPROVED</Badge>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Card>

                {/* Shadcn Pagination Component */}
                <div className="mt-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious href="#" />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#" isActive>1</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#">2</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#">3</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationNext href="#" />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </div>
            </TabsContent>

            {/* TAB 2: ACTIONS & BADGES */}
            <TabsContent value="actions" className="space-y-8">
              <Card className="border-border p-6 shadow-xs">
                <CardHeader className="px-0 pt-0">
                  <CardTitle>Shadcn Button Component Variants</CardTitle>
                  <CardDescription>Semua varian tombol shadcn mengadopsi warna semantik Kredo.</CardDescription>
                </CardHeader>
                <CardContent className="px-0 space-y-6">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-3">Variants</span>
                    <div className="flex flex-wrap items-center gap-3">
                      <Button variant="default">Button Default (Primary Teal #0D6276)</Button>
                      <Button variant="secondary">Button Secondary</Button>
                      <Button variant="outline">Button Outline</Button>
                      <Button variant="ghost">Button Ghost</Button>
                      <Button variant="destructive">Button Destructive</Button>
                      <Button variant="link">Button Link</Button>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-3">Sizes</span>
                    <div className="flex flex-wrap items-center gap-3">
                      <Button size="xs" variant="default">Size XS</Button>
                      <Button size="sm" variant="default">Size SM</Button>
                      <Button size="default" variant="default">Size Default</Button>
                      <Button size="lg" variant="default">Size LG</Button>
                      <Button size="icon" variant="outline" aria-label="Setting">
                        <SlidersHorizontal className="size-4" />
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-3">Toggle & ToggleGroup Components</span>
                    <div className="flex flex-wrap items-center gap-4">
                      <Toggle aria-label="Toggle bookmark" className="border border-border">
                        <Bookmark className="size-4" /> Bookmark
                      </Toggle>

                      <ToggleGroup type="multiple" defaultValue={["bold"]} className="border border-border rounded-lg p-0.5">
                        <ToggleGroupItem value="bold" aria-label="Toggle bold">Debit</ToggleGroupItem>
                        <ToggleGroupItem value="italic" aria-label="Toggle italic">Kredit</ToggleGroupItem>
                        <ToggleGroupItem value="underline" aria-label="Toggle underline">Memo</ToggleGroupItem>
                      </ToggleGroup>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-3">Kbd Component (Keyboard Shortcuts)</span>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-xs text-muted-foreground">Simpan Jurnal:</span>
                      <div className="flex items-center gap-1">
                        <Kbd>Ctrl</Kbd> + <Kbd>S</Kbd>
                      </div>
                      <span className="text-xs text-muted-foreground ml-4">Submit Jurnal:</span>
                      <div className="flex items-center gap-1">
                        <Kbd>Ctrl</Kbd> + <Kbd>Enter</Kbd>
                      </div>
                      <span className="text-xs text-muted-foreground ml-4">Tambah Baris:</span>
                      <Kbd>Enter</Kbd>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-3">Shadcn Badge Component Variants</span>
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge variant="default">Default Badge</Badge>
                      <Badge variant="secondary">Secondary Badge</Badge>
                      <Badge variant="outline">Outline Badge</Badge>
                      <Badge variant="destructive">Destructive Badge</Badge>
                      <Badge className="bg-emerald-600 text-white">Posted (Success)</Badge>
                      <Badge variant="outline" className="border-amber-500/40 bg-amber-500/10 text-amber-700">Submitted (Warning)</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 3: FORMS & SELECTION */}
            <TabsContent value="forms" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-border p-6 shadow-xs">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle>Shadcn Input, Label, Textarea, Select</CardTitle>
                    <CardDescription>Form controls standar dengan state validasi.</CardDescription>
                  </CardHeader>
                  <CardContent className="px-0 space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="entity-name">Nama Entitas Bisnis</Label>
                      <Input id="entity-name" defaultValue="PT Maju Jaya Sejahtera" />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="acc-type">Jenis Akun Akuntansi</Label>
                      <Select defaultValue="asset">
                        <SelectTrigger id="acc-type" className="w-full">
                          <SelectValue placeholder="Pilih jenis..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="asset">ASSET (Aset / Harta)</SelectItem>
                          <SelectItem value="liability">LIABILITY (Liabilitas / Utang)</SelectItem>
                          <SelectItem value="equity">EQUITY (Ekuitas / Modal)</SelectItem>
                          <SelectItem value="revenue">REVENUE (Pendapatan)</SelectItem>
                          <SelectItem value="expense">EXPENSE (Beban Operasional)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="journal-desc">Deskripsi Jurnal</Label>
                      <Textarea id="journal-desc" defaultValue="Pembayaran sewa kantor bulan November 2026" className="resize-none h-20" />
                    </div>

                    <div className="space-y-1.5">
                      <Label>Input OTP / Kode Otorisasi (InputOTP Component)</Label>
                      <InputOTP maxLength={6} defaultValue="123456">
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border p-6 shadow-xs">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle>Selection & Toggle Controls</CardTitle>
                    <CardDescription>Checkbox, RadioGroup, Switch, Slider dari shadcn.</CardDescription>
                  </CardHeader>
                  <CardContent className="px-0 space-y-6">
                    <div className="space-y-2">
                      <Label>Aturan Persetujuan (RadioGroup Component)</Label>
                      <RadioGroup defaultValue="maker-checker">
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="maker-checker" id="r1" />
                          <Label htmlFor="r1" className="font-normal cursor-pointer">Maker-checker ketat (wajib 2 pengguna berbeda)</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="auto-post" id="r2" />
                          <Label htmlFor="r2" className="font-normal cursor-pointer">Auto-post untuk importir Controller</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="chk1" className="cursor-pointer">Kunci Periode Tertutup</Label>
                        <p className="text-xs text-muted-foreground">Tolak seluruh request posting ke periode CLOSED</p>
                      </div>
                      <Checkbox id="chk1" defaultChecked />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="sw1" className="cursor-pointer">Audit Hash Sealing</Label>
                        <p className="text-xs text-muted-foreground">Rantai hash kriptografis untuk tabel audit</p>
                      </div>
                      <Switch id="sw1" defaultChecked />
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <Label>Persentase Kapasitas Cache Saldo (Slider Component)</Label>
                        <span className="font-mono font-bold text-primary">{progressVal}%</span>
                      </div>
                      <Slider value={[progressVal]} onValueChange={(val) => setProgressVal(val[0])} max={100} step={5} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* TAB 4: DATA & DISPLAY */}
            <TabsContent value="data" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Accordion Component */}
                <Card className="border-border p-6 shadow-xs">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle>Shadcn Accordion Component</CardTitle>
                    <CardDescription>Menampilkan hierarki akun COA dan FAQ akuntansi.</CardDescription>
                  </CardHeader>
                  <CardContent className="px-0">
                    <Accordion type="single" collapsible defaultValue="item-1">
                      <AccordionItem value="item-1">
                        <AccordionTrigger>1000 — Golongan Akun Aset (ASSET)</AccordionTrigger>
                        <AccordionContent className="text-xs text-muted-foreground">
                          Akun aset memiliki saldo normal DEBIT. Contoh: 1101 Kas Kecil, 1102 Bank Mandiri, 1200 Piutang Usaha.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-2">
                        <AccordionTrigger>2000 — Golongan Akun Liabilitas (LIABILITY)</AccordionTrigger>
                        <AccordionContent className="text-xs text-muted-foreground">
                          Akun liabilitas memiliki saldo normal KREDIT. Contoh: 2100 Utang Usaha, 2200 Utang Gaji, 2500 Utang Bank.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-3">
                        <AccordionTrigger>3000 — Golongan Akun Ekuitas (EQUITY)</AccordionTrigger>
                        <AccordionContent className="text-xs text-muted-foreground">
                          Akun modal dan laba ditahan pemilik entitas. Saldo normal KREDIT.
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>

                {/* Progress, Skeleton, Avatar, Empty State */}
                <Card className="border-border p-6 shadow-xs">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle>Avatar, Progress, Skeleton, Empty</CardTitle>
                    <CardDescription>Komponen visual pendukung dari shadcn/ui.</CardDescription>
                  </CardHeader>
                  <CardContent className="px-0 space-y-6">
                    {/* Avatars */}
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">Avatar Component</span>
                      <div className="flex items-center gap-3">
                        <Avatar size="lg">
                          <AvatarFallback className="bg-primary text-primary-foreground font-bold">DN</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-xs font-semibold">Dina (Accounting Maker)</div>
                          <div className="text-[11px] text-muted-foreground">dina@kredo.dev</div>
                        </div>

                        <Avatar size="lg" className="ml-4">
                          <AvatarFallback className="bg-teal-600 text-white font-bold">RK</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-xs font-semibold">Raka (Senior Approver)</div>
                          <div className="text-[11px] text-muted-foreground">raka@kredo.dev</div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Progress */}
                    <div>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="font-medium">Proses Impor Spring Batch (Progress Component)</span>
                        <span className="font-mono text-primary font-bold">75% (75.000 / 100.000 baris)</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>

                    <Separator />

                    {/* Skeleton */}
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">Skeleton Component (Loading State)</span>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Empty State Component */}
              <Card className="border-border p-6 shadow-xs">
                <Empty>
                  <EmptyHeader>
                    <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary mx-auto mb-2">
                      <FolderOpen className="size-6" />
                    </div>
                    <EmptyTitle>Tidak Ada Jurnal Menunggu Approval</EmptyTitle>
                    <EmptyDescription>
                      Semua antrean jurnal telah diproses oleh approver. Anda dapat membuat draf jurnal baru atau mengimpor file CSV.
                    </EmptyDescription>
                  </EmptyHeader>
                  <div className="flex gap-2 justify-center mt-2">
                    <Button size="sm" variant="default" className="gap-1.5">
                      <Plus className="size-3.5" /> Buat Jurnal Baru
                    </Button>
                    <Button size="sm" variant="outline">
                      Lihat Riwayat Audit
                    </Button>
                  </div>
                </Empty>
              </Card>
            </TabsContent>

            {/* TAB 5: OVERLAYS & FEEDBACK */}
            <TabsContent value="overlays" className="space-y-8">
              <Card className="border-border p-6 shadow-xs">
                <CardHeader className="px-0 pt-0">
                  <CardTitle>Shadcn Overlays & Popovers</CardTitle>
                  <CardDescription>Dialog, AlertDialog, Sheet, DropdownMenu, Popover, HoverCard, Tooltip.</CardDescription>
                </CardHeader>
                <CardContent className="px-0 space-y-6">
                  {/* Alert Component */}
                  <div className="space-y-3">
                    <Alert className="border-teal-500/40 bg-teal-50/50 dark:bg-teal-950/20">
                      <CheckCircle2 className="size-4 text-primary" />
                      <AlertTitle className="text-xs font-bold text-primary">Sistem Konsisten & Terverifikasi</AlertTitle>
                      <AlertDescription className="text-xs text-muted-foreground">
                        Job rekonsiliasi harian selesai: total mutasi baris jurnal cocok 100% dengan tabel ringkasan saldo account_balance.
                      </AlertDescription>
                    </Alert>

                    <Alert variant="destructive">
                      <AlertTriangle className="size-4" />
                      <AlertTitle className="text-xs font-bold">Peringatan Tutup Periode</AlertTitle>
                      <AlertDescription className="text-xs">
                        Masih terdapat 1 jurnal berstatus DRAFT pada periode Oktober 2026. Selesaikan atau batalkan sebelum menutup periode.
                      </AlertDescription>
                    </Alert>
                  </div>

                  <Separator />

                  {/* Overlays Grid */}
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-3">Interactive Triggers</span>
                    <div className="flex flex-wrap items-center gap-3">
                      {/* Dialog Component */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="default" size="sm" className="gap-1.5">
                            <Layers className="size-3.5" /> Buka Modal Dialog
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Form Input Jurnal Cepat</DialogTitle>
                            <DialogDescription>
                              Menggunakan komponen Dialog bawaan shadcn dengan aksesibilitas Radix.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-3 py-2">
                            <div className="space-y-1">
                              <Label>Nomor Referensi Transaksi</Label>
                              <Input placeholder="REF-2026-X" />
                            </div>
                            <div className="space-y-1">
                              <Label>Nominal Transaksi (IDR)</Label>
                              <Input placeholder="Rp 0,00" />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" size="sm">Batal</Button>
                            <Button size="sm">Simpan Draft</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      {/* AlertDialog Component */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm" className="gap-1.5">
                            <RotateCcw className="size-3.5" /> Buka Alert Dialog
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Balik Jurnal Ini (Journal Reversal)?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Jurnal yang sudah diposting bersifat immutable. Aksi ini akan membuat jurnal baru dengan sisi debit dan kredit yang ditukar secara otomatis.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction className="bg-destructive text-destructive-foreground">Ya, Buat Jurnal Pembalik</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      {/* Sheet Component */}
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button variant="outline" size="sm" className="gap-1.5">
                            <Building2 className="size-3.5" /> Buka Sheet Drawer
                          </Button>
                        </SheetTrigger>
                        <SheetContent>
                          <SheetHeader>
                            <SheetTitle>Audit Trail Viewer</SheetTitle>
                            <SheetDescription>Log kejadian append-only terverifikasi hash.</SheetDescription>
                          </SheetHeader>
                          <div className="mt-4 space-y-3 text-xs">
                            <div className="p-3 rounded-lg border border-border">
                              <div className="font-semibold text-primary">POST_JOURNAL</div>
                              <div className="text-muted-foreground">Actor: Raka (Approver) • IP: 192.168.1.10</div>
                            </div>
                          </div>
                        </SheetContent>
                      </Sheet>

                      {/* DropdownMenu Component */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="gap-1.5">
                            Dropdown Menu <MoreVertical className="size-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Aksi Jurnal</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => toast.info("Melihat linimasa status...")}>Lihat Linimasa Status</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toast.info("Mengunduh bukti jurnal...")}>Unduh Bukti PDF</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onClick={() => toast.error("Meminta pembatalan...")}>Ajukan Pembatalan</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      {/* Popover Component */}
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm" className="gap-1.5">
                            Popover <HelpCircle className="size-3.5" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 text-xs">
                          <div className="font-semibold mb-1 text-primary">Aturan Double-Entry</div>
                          <p className="text-muted-foreground">
                            Setiap transaksi harus mencatat debit dan kredit dengan total yang seimbang. Kredo menolak penyimpanan entri yang tidak seimbang.
                          </p>
                        </PopoverContent>
                      </Popover>

                      {/* HoverCard Component */}
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-primary underline">
                            HoverCard Info
                          </Button>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80 text-xs">
                          <div className="font-bold text-foreground">PostgreSQL Advisory Lock</div>
                          <p className="text-muted-foreground mt-1">
                            Digunakan untuk mencegah race condition antara penutupan periode dan pemostingan jurnal massal secara bersamaan.
                          </p>
                        </HoverCardContent>
                      </HoverCard>

                      {/* Tooltip Component */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="icon" aria-label="Lock status">
                            <Lock className="size-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Terkunci: Data diproteksi Row-Level Security</p>
                        </TooltipContent>
                      </Tooltip>

                      {/* Spinner Component */}
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground ml-2">
                        <Spinner className="size-4 text-primary" />
                        <span>Spinner Loader</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>

        {/* Footer */}
        <footer className="border-t border-border bg-card py-8 text-center text-xs text-muted-foreground">
          <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Scale className="size-4 text-primary" />
              <span className="font-semibold text-foreground">Kredo Enterprise Accounting</span>
              <span>— Seluruh komponen reusable dari shadcn/ui.</span>
            </div>
            <div>
              Dibuat dengan React 19 + TypeScript + Vite + Tailwind CSS v4 + shadcn/ui
            </div>
          </div>
        </footer>
      </div>
    </TooltipProvider>
  )
}

export default App
