import * as React from "react"
import { useTheme } from "@/components/theme-provider"
import { Toaster, toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TooltipProvider } from "@/components/ui/tooltip"
import {
  Sun,
  Moon,
  CheckCircle2,
  AlertTriangle,
  Plus,
  RotateCcw,
  CreditCard,
  Wifi,
  TrendingUp,
  Download,
  FileSpreadsheet,
  ShieldCheck,
  Building2,
  ArrowUpRight,
  ArrowDownLeft,
  Sparkles,
  Scale
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

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
        {/* Toast Container */}
        <Toaster position="top-right" richColors />

        {/* Top Sticky Header */}
        <header className="sticky top-0 z-40 border-b border-border/80 bg-background/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                <Scale className="size-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-heading text-lg font-bold tracking-tight text-foreground">
                    Kredo
                  </span>
                  <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary text-[11px] font-semibold">
                    Design System v1.0
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Enterprise Accounting & General Ledger Core • shadcn/ui + Tailwind CSS v4
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Quick Jump Anchors */}
              <nav className="hidden items-center gap-1 md:flex">
                <a href="#colors" className="rounded-md px-2.5 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
                  Colors
                </a>
                <a href="#typography" className="rounded-md px-2.5 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
                  Typography
                </a>
                <a href="#buttons" className="rounded-md px-2.5 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
                  Actions
                </a>
                <a href="#forms" className="rounded-md px-2.5 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
                  Forms
                </a>
                <a href="#cards" className="rounded-md px-2.5 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
                  Fintech Cards
                </a>
                <a href="#balance-bar" className="rounded-md px-2.5 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
                  Balance Bar
                </a>
              </nav>

              <Separator orientation="vertical" className="hidden h-5 md:block" />

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

        {/* Hero Section */}
        <section className="border-b border-border bg-gradient-to-b from-primary/5 via-background to-background py-12">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex flex-col gap-3">
              <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-primary uppercase">
                <Sparkles className="size-3.5" />
                <span>Themed from Reference Specification</span>
              </div>
              <h1 className="font-heading text-3xl font-extrabold tracking-tight md:text-4xl">
                Setiap entri, seimbang.
              </h1>
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
                Design system Kredo menggabungkan presisi buku besar enterprise dengan estetika finansial modern 
                berwarna <strong>Deep Ocean Teal (#0D6276)</strong>, <strong>Dark Slate (#101727)</strong>, dan <strong>Mint Accent (#14B8A6)</strong>.
                Semua komponen dibangun 100% menggunakan <strong>shadcn/ui</strong>.
              </p>
            </div>
          </div>
        </section>

        {/* Main Content Sections */}
        <main className="mx-auto flex max-w-7xl flex-col gap-16 px-6 py-12">

          {/* Section 1: Colors & Foundations */}
          <section id="colors" className="scroll-mt-20">
            <div className="mb-6 flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <h2 className="font-heading text-xl font-bold tracking-tight">1. Color Palette & Roles</h2>
                <Badge variant="secondary" className="text-xs">WCAG AA Compliant</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Diekstrak langsung dari referensi visual kartu cerdas dan konsol ledger:
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {/* Primary Brand Teal */}
              <Card className="border border-border shadow-xs">
                <div className="h-24 w-full rounded-t-xl bg-[#0D6276] p-3 text-white flex flex-col justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider opacity-90">Primary Brand</span>
                  <span className="font-mono text-sm font-bold">#0D6276</span>
                </div>
                <CardContent className="pt-3 pb-3 text-xs">
                  <div className="font-semibold text-foreground">Deep Ocean Teal</div>
                  <div className="text-muted-foreground">oklch(0.46 0.079 219.1)</div>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>On White: 6.4:1</span>
                    <Badge variant="outline" className="border-emerald-500/30 text-emerald-600 bg-emerald-500/10 text-[10px] py-0 h-4">
                      Pass AA/AAA
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Dark Slate Card */}
              <Card className="border border-border shadow-xs">
                <div className="h-24 w-full rounded-t-xl bg-[#101727] p-3 text-white flex flex-col justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider opacity-90">Dark Slate Card</span>
                  <span className="font-mono text-sm font-bold">#101727</span>
                </div>
                <CardContent className="pt-3 pb-3 text-xs">
                  <div className="font-semibold text-foreground">Midnight Slate</div>
                  <div className="text-muted-foreground">oklch(0.206 0.034 265.5)</div>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>Surface & Heading</span>
                    <Badge variant="outline" className="text-slate-600 border-slate-300 dark:text-slate-300 text-[10px] py-0 h-4">
                      Solid
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Mint Accent */}
              <Card className="border border-border shadow-xs">
                <div className="h-24 w-full rounded-t-xl bg-[#14B8A6] p-3 text-slate-900 flex flex-col justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider opacity-90">Accent Mint</span>
                  <span className="font-mono text-sm font-bold">#14B8A6</span>
                </div>
                <CardContent className="pt-3 pb-3 text-xs">
                  <div className="font-semibold text-foreground">Vibrant Mint / Cyan</div>
                  <div className="text-muted-foreground">oklch(0.704 0.123 182.5)</div>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>Graph line & Positive</span>
                    <Badge variant="outline" className="border-teal-500/30 text-teal-600 bg-teal-500/10 text-[10px] py-0 h-4">
                      Accent
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Neutral Surface */}
              <Card className="border border-border shadow-xs">
                <div className="h-24 w-full rounded-t-xl bg-[#F8FAFC] border-b border-border p-3 text-slate-800 flex flex-col justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider opacity-90">Surface Background</span>
                  <span className="font-mono text-sm font-bold">#F8FAFC</span>
                </div>
                <CardContent className="pt-3 pb-3 text-xs">
                  <div className="font-semibold text-foreground">Clean Cool Grey</div>
                  <div className="text-muted-foreground">oklch(0.984 0.003 247.9)</div>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>Ledger Sheet Base</span>
                    <Badge variant="outline" className="text-slate-500 text-[10px] py-0 h-4">
                      Canvas
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Semantic Success */}
              <Card className="border border-border shadow-xs">
                <div className="h-20 w-full rounded-t-xl bg-emerald-600 p-3 text-white flex flex-col justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider opacity-90">Success</span>
                  <span className="font-mono text-xs">#059669</span>
                </div>
                <CardContent className="pt-2.5 pb-2.5 text-xs">
                  <div className="font-medium text-foreground">Posted / Balanced</div>
                </CardContent>
              </Card>

              {/* Semantic Warning */}
              <Card className="border border-border shadow-xs">
                <div className="h-20 w-full rounded-t-xl bg-amber-600 p-3 text-white flex flex-col justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider opacity-90">Warning</span>
                  <span className="font-mono text-xs">#D97706</span>
                </div>
                <CardContent className="pt-2.5 pb-2.5 text-xs">
                  <div className="font-medium text-foreground">Draft Pending / Review</div>
                </CardContent>
              </Card>

              {/* Semantic Destructive */}
              <Card className="border border-border shadow-xs">
                <div className="h-20 w-full rounded-t-xl bg-rose-600 p-3 text-white flex flex-col justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider opacity-90">Destructive</span>
                  <span className="font-mono text-xs">#E11D48</span>
                </div>
                <CardContent className="pt-2.5 pb-2.5 text-xs">
                  <div className="font-medium text-foreground">Unbalanced / Reversed</div>
                </CardContent>
              </Card>

              {/* Border & Rule */}
              <Card className="border border-border shadow-xs">
                <div className="h-20 w-full rounded-t-xl bg-slate-200 dark:bg-slate-700 p-3 text-slate-800 dark:text-white flex flex-col justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider opacity-90">Border & Rule</span>
                  <span className="font-mono text-xs">#E2E8F0</span>
                </div>
                <CardContent className="pt-2.5 pb-2.5 text-xs">
                  <div className="font-medium text-foreground">Table & Card Dividers</div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Section 2: Reference-Inspired Visual Cards */}
          <section id="cards" className="scroll-mt-20">
            <div className="mb-6 flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <h2 className="font-heading text-xl font-bold tracking-tight">2. Fintech Reference Components</h2>
                <Badge variant="default" className="text-xs bg-primary text-primary-foreground">
                  Reference Match
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Komposisi kartu cerdas, ringkasan saldo, dan grafik tren aktivitas yang diadaptasi langsung dari gambar referensi:
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Card 1: Virtual Smartpay / Entity Ledger Card */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0c596b] via-[#0D6276] to-[#101727] p-6 text-white shadow-lg">
                {/* Background decorative circles */}
                <div className="pointer-events-none absolute -right-12 -top-12 size-48 rounded-full bg-teal-400/10 blur-xl" />
                <div className="pointer-events-none absolute -bottom-12 -left-12 size-48 rounded-full bg-teal-300/10 blur-xl" />

                <div className="relative z-10 flex flex-col justify-between h-56">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[11px] font-medium tracking-wider text-teal-200/80 uppercase">Entity Vault</span>
                      <h3 className="font-heading text-lg font-bold">PT Maju Jaya Sejahtera</h3>
                    </div>
                    <div className="flex items-center gap-1.5 opacity-90">
                      <Wifi className="size-5 rotate-90" />
                      <CreditCard className="size-5" />
                    </div>
                  </div>

                  {/* Micro Chip Visual */}
                  <div className="my-auto flex items-center gap-3">
                    <div className="h-7 w-10 rounded-md border border-amber-300/40 bg-gradient-to-tr from-amber-400/80 to-yellow-200/80 shadow-xs" />
                    <span className="font-mono text-sm tracking-widest text-teal-100/90">•••• •••• •••• 1990</span>
                  </div>

                  <div className="flex items-end justify-between border-t border-teal-500/30 pt-3">
                    <div>
                      <span className="text-[10px] tracking-wider text-teal-200/80 uppercase">Available Liquid Balance</span>
                      <div className="font-mono text-2xl font-extrabold tracking-tight tabular-nums">
                        Rp 158.875.000,00
                      </div>
                    </div>
                    <Badge variant="outline" className="border-teal-300/30 bg-teal-300/20 text-white font-mono text-[11px]">
                      IDR Primary
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Card 2: Quick Operations / Action Tiles */}
              <Card className="flex flex-col justify-between p-6 shadow-xs border-border">
                <div>
                  <div className="flex items-center justify-between pb-3">
                    <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                      Quick Operations
                    </span>
                    <Badge variant="secondary" className="text-[10px]">4 Presets</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary hover:bg-primary/5 hover:shadow-xs group">
                      <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <ArrowDownLeft className="size-5" />
                      </div>
                      <span className="text-xs font-semibold text-foreground">Setor Kas</span>
                      <span className="text-[10px] text-muted-foreground">Debit Akun 1101</span>
                    </button>

                    <button className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary hover:bg-primary/5 hover:shadow-xs group">
                      <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <ArrowUpRight className="size-5" />
                      </div>
                      <span className="text-xs font-semibold text-foreground">Transfer Bank</span>
                      <span className="text-[10px] text-muted-foreground">1102 ke 1101</span>
                    </button>

                    <button className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary hover:bg-primary/5 hover:shadow-xs group">
                      <div className="flex size-10 items-center justify-center rounded-full bg-teal-500/10 text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                        <FileSpreadsheet className="size-5" />
                      </div>
                      <span className="text-xs font-semibold text-foreground">Impor Batch</span>
                      <span className="text-[10px] text-muted-foreground">Spring Batch CSV</span>
                    </button>

                    <button className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary hover:bg-primary/5 hover:shadow-xs group">
                      <div className="flex size-10 items-center justify-center rounded-full bg-muted text-foreground group-hover:bg-foreground group-hover:text-background transition-colors">
                        <RotateCcw className="size-5" />
                      </div>
                      <span className="text-xs font-semibold text-foreground">Jurnal Balik</span>
                      <span className="text-[10px] text-muted-foreground">Koreksi Otomatis</span>
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
                  <span>Maker-checker rule aktif</span>
                  <span className="font-semibold text-primary">Siap Input</span>
                </div>
              </Card>

              {/* Card 3: Spending Activity / Line Curve (Reference Image match) */}
              <Card className="flex flex-col justify-between p-6 shadow-xs border-border">
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                        Total Mutasi Periode
                      </span>
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

                  {/* SVG Wave Sparkline directly capturing reference image */}
                  <div className="relative mt-4 h-28 w-full">
                    <svg viewBox="0 0 300 100" className="size-full overflow-visible">
                      <defs>
                        <linearGradient id="tealGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#0D6276" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#0D6276" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M 0,70 Q 50,40 100,55 T 200,25 T 300,50 L 300,100 L 0,100 Z"
                        fill="url(#tealGrad)"
                      />
                      <path
                        d="M 0,70 Q 50,40 100,55 T 200,25 T 300,50"
                        fill="none"
                        stroke="#0D6276"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                      {/* Active highlight marker as in reference image */}
                      <circle cx="200" cy="25" r="5" fill="#0D6276" className="animate-pulse" />
                      <circle cx="200" cy="25" r="2" fill="#FFFFFF" />
                      {/* Tooltip bubble on sparkline */}
                      <g transform="translate(165, -8)">
                        <rect width="70" height="22" rx="6" fill="#0D6276" />
                        <text x="35" y="15" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontFamily="monospace" fontWeight="bold">
                          Rp 7.900K
                        </text>
                      </g>
                    </svg>
                  </div>

                  <div className="mt-2 flex justify-between text-[11px] font-medium text-muted-foreground">
                    <span>Sen</span>
                    <span>Sel</span>
                    <span>Rab</span>
                    <span className="text-primary font-bold">Kam</span>
                    <span>Jum</span>
                    <span>Sab</span>
                    <span>Min</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs">
                  <span className="text-muted-foreground">Mutasi Debit vs Kredit</span>
                  <span className="font-semibold text-emerald-600 flex items-center gap-1">
                    <TrendingUp className="size-3.5" /> +12.4% vs bulan lalu
                  </span>
                </div>
              </Card>
            </div>
          </section>

          {/* Section 3: Interactive Signature Component: Balance Bar (PRD 14.7) */}
          <section id="balance-bar" className="scroll-mt-20">
            <div className="mb-4 flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <h2 className="font-heading text-xl font-bold tracking-tight">3. Signature Accounting Component: Balance Bar</h2>
                <Badge variant="outline" className="border-primary/40 text-primary text-xs">PRD 14.7 Spesifik</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Bilah interaktif yang selalu menempel di bagian bawah formulir pembuatan jurnal. Coba toggle tombol di bawah untuk melihat respons visual seimbang vs tidak seimbang:
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
                    Simulasikan Seimbang (Debit = Kredit)
                  </Button>
                  <Button
                    size="sm"
                    variant={!isBalanced ? "destructive" : "outline"}
                    onClick={() => {
                      setTotalDebit(25000000)
                      setTotalCredit(24950000)
                    }}
                  >
                    Simulasikan Tidak Seimbang (Selisih Rp 50.000)
                  </Button>
                </div>

                <span className="text-xs text-muted-foreground">
                  Status Saat Ini: <strong className={isBalanced ? "text-emerald-600" : "text-rose-600"}>{isBalanced ? "SEIMBANG" : "SELISIH Rp 50.000,00"}</strong>
                </span>
              </div>

              {/* Rendered Live Balance Bar */}
              <div className={`rounded-xl border p-4 transition-all duration-200 ${
                isBalanced
                  ? "border-teal-500/30 bg-teal-50/50 dark:bg-teal-950/20"
                  : "border-rose-500/30 bg-rose-50/50 dark:bg-rose-950/20"
              }`}>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex flex-wrap items-center gap-6">
                    <div>
                      <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                        Total Debit
                      </span>
                      <div className="font-mono text-lg font-bold text-foreground tabular-nums">
                        Rp {totalDebit.toLocaleString("id-ID")},00
                      </div>
                    </div>

                    <div className="text-muted-foreground font-light text-xl">−</div>

                    <div>
                      <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                        Total Kredit
                      </span>
                      <div className="font-mono text-lg font-bold text-foreground tabular-nums">
                        Rp {totalCredit.toLocaleString("id-ID")},00
                      </div>
                    </div>

                    <div className="text-muted-foreground font-light text-xl">=</div>

                    <div>
                      <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                        Selisih (Variance)
                      </span>
                      <div className={`font-mono text-lg font-bold tabular-nums ${isBalanced ? "text-emerald-600" : "text-rose-600 font-extrabold"}`}>
                        Rp {difference.toLocaleString("id-ID")},00
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {isBalanced ? (
                      <Badge className="gap-1.5 bg-emerald-600 text-white px-3 py-1 text-xs">
                        <CheckCircle2 className="size-3.5" />
                        Jurnal Seimbang
                      </Badge>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-rose-500/40 text-rose-600 hover:bg-rose-500/10 text-xs gap-1"
                          onClick={() => setTotalCredit(totalDebit)}
                        >
                          <Plus className="size-3.5" />
                          Add Balancing Line
                        </Button>
                        <Badge variant="destructive" className="gap-1.5 px-3 py-1 text-xs">
                          <AlertTriangle className="size-3.5" />
                          Tidak Seimbang
                        </Badge>
                      </>
                    )}

                    <Button
                      size="sm"
                      disabled={!isBalanced}
                      className="bg-primary text-primary-foreground font-semibold"
                      onClick={() => toast.success("Jurnal berhasil diajukan untuk approval!")}
                    >
                      Ajukan Jurnal
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </section>

          {/* Section 4: Actions & Buttons */}
          <section id="buttons" className="scroll-mt-20">
            <div className="mb-6 flex flex-col gap-1">
              <h2 className="font-heading text-xl font-bold tracking-tight">4. Actions, Buttons & Badges</h2>
              <p className="text-xs text-muted-foreground">
                Varian tombol dengan warna brand teal dan semantic feedback:
              </p>
            </div>

            <Card className="border-border p-6 shadow-xs">
              <div className="flex flex-col gap-6">
                <div>
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Button Variants
                  </h3>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button variant="default">Primary Default (#0D6276)</Button>
                    <Button variant="secondary">Secondary Action</Button>
                    <Button variant="outline">Outline Border</Button>
                    <Button variant="ghost">Ghost Button</Button>
                    <Button variant="destructive">Destructive Action</Button>
                    <Button variant="link">Text Link Action</Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Button Sizes & Icon Integration
                  </h3>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button size="xs" variant="default">Button XS</Button>
                    <Button size="sm" variant="default">Button SM</Button>
                    <Button size="default" variant="default">Button Default</Button>
                    <Button size="lg" variant="default">Button LG</Button>
                    <Button variant="default" className="gap-1.5">
                      <Download className="size-4" /> Ekspor Neraca
                    </Button>
                    <Button variant="outline" className="gap-1.5">
                      <Plus className="size-4" /> Tambah Akun
                    </Button>
                    <Button size="icon" variant="outline" aria-label="Setting">
                      <Scale className="size-4" />
                    </Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Accounting State Badges (PRD 9.1 & 14.8)
                  </h3>
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge variant="outline" className="text-slate-600 dark:text-slate-300">
                      Draft
                    </Badge>
                    <Badge variant="outline" className="border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400">
                      Submitted (Menunggu Approval)
                    </Badge>
                    <Badge variant="outline" className="border-teal-500/40 bg-teal-500/10 text-teal-700 dark:text-teal-300">
                      Approved
                    </Badge>
                    <Badge className="bg-emerald-600 text-white hover:bg-emerald-700">
                      Posted (Immutable)
                    </Badge>
                    <Badge variant="destructive">
                      Cancelled / Reversed
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
          </section>

          {/* Section 5: Forms & Accounting Inputs */}
          <section id="forms" className="scroll-mt-20">
            <div className="mb-6 flex flex-col gap-1">
              <h2 className="font-heading text-xl font-bold tracking-tight">5. Forms & Financial Controls</h2>
              <p className="text-xs text-muted-foreground">
                Kontrol input untuk entri jurnal, pemilihan akun COA, dan nominal desimal akuntansi:
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card className="border-border p-6 shadow-xs">
                <CardHeader className="px-0 pt-0">
                  <CardTitle>Journal Entry Input Row</CardTitle>
                  <CardDescription>Baris pengisian akun dengan validasi debit atau kredit.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4 px-0 pb-0">
                  <div className="space-y-1.5">
                    <Label htmlFor="account-select">Pilih Akun (COA Leaf Postable)</Label>
                    <Select defaultValue="1101">
                      <SelectTrigger id="account-select" className="w-full">
                        <SelectValue placeholder="Pilih akun..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1101">1101 — Kas Kecil (Asset - Debit)</SelectItem>
                        <SelectItem value="1102">1102 — Bank Mandiri Utama (Asset - Debit)</SelectItem>
                        <SelectItem value="1200">1200 — Piutang Usaha (Asset - Debit)</SelectItem>
                        <SelectItem value="2100">2100 — Utang Usaha (Liability - Kredit)</SelectItem>
                        <SelectItem value="4100">4100 — Pendapatan Penjualan (Revenue - Kredit)</SelectItem>
                        <SelectItem value="6100">6100 — Beban Gaji (Expense - Debit)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="debit-val">Debit (Rp)</Label>
                      <Input
                        id="debit-val"
                        placeholder="0,00"
                        defaultValue="15.000.000,00"
                        className="font-mono text-right tabular-nums font-medium"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="credit-val">Kredit (Rp)</Label>
                      <Input
                        id="credit-val"
                        placeholder="0,00"
                        disabled
                        className="font-mono text-right tabular-nums bg-muted"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="memo">Memo / Catatan Baris</Label>
                    <Textarea
                      id="memo"
                      placeholder="Contoh: Penerimaan pembayaran piutang invoice INV-2026-001"
                      className="resize-none h-20"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border p-6 shadow-xs">
                <CardHeader className="px-0 pt-0">
                  <CardTitle>Accounting Period & Settings</CardTitle>
                  <CardDescription>Pengaturan status periode dan kontrol keamanan.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-5 px-0 pb-0">
                  <div className="flex items-center justify-between rounded-lg border border-border p-3.5">
                    <div className="space-y-0.5">
                      <div className="text-sm font-semibold text-foreground">Status Periode November 2026</div>
                      <div className="text-xs text-muted-foreground">Menerima posting jurnal baru</div>
                    </div>
                    <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/10 text-emerald-600 font-semibold">
                      OPEN
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-border p-3.5">
                    <div className="space-y-0.5">
                      <div className="text-sm font-semibold text-foreground">Maker-Checker Protection</div>
                      <div className="text-xs text-muted-foreground">Blokir persetujuan oleh pembuat jurnal</div>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-border p-3.5">
                    <div className="space-y-0.5">
                      <div className="text-sm font-semibold text-foreground">Formula Injection Guard</div>
                      <div className="text-xs text-muted-foreground">Sanitasi karakter `=`, `+`, `-`, `@` saat ekspor</div>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-foreground">Batas Maksimal Batch Impor</span>
                      <span className="font-mono font-bold text-primary">100.000 Baris</span>
                    </div>
                    <Slider defaultValue={[100]} max={500} step={50} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Section 6: Data Display Table (General Ledger) */}
          <section id="table" className="scroll-mt-20">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="font-heading text-xl font-bold tracking-tight">6. General Ledger Data Table</h2>
                <p className="text-xs text-muted-foreground">
                  Format tabel data kompak (~36px baris) dengan angka rata kanan dan perataan tabular:
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                  <Download className="size-3.5" /> CSV
                </Button>
                <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                  <FileSpreadsheet className="size-3.5" /> XLSX
                </Button>
              </div>
            </div>

            <Card className="border-border shadow-xs overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="w-[120px] font-semibold text-xs">No. Jurnal</TableHead>
                    <TableHead className="w-[100px] font-semibold text-xs">Tanggal</TableHead>
                    <TableHead className="font-semibold text-xs">Keterangan Transaksi</TableHead>
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
                      <Badge variant="outline" className="border-teal-500/40 bg-teal-500/10 text-teal-700 text-[10px] py-0">APPROVED</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono font-semibold text-slate-500">—</TableCell>
                    <TableCell className="font-mono text-muted-foreground">15 Nov 2026</TableCell>
                    <TableCell className="font-medium text-foreground">Beban Gaji Staf Operasional</TableCell>
                    <TableCell className="text-muted-foreground">6100 Beban Gaji</TableCell>
                    <TableCell className="font-mono text-right tabular-nums font-semibold text-foreground">5.000.000,00</TableCell>
                    <TableCell className="font-mono text-right tabular-nums text-muted-foreground">0,00</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="border-amber-500/40 bg-amber-500/10 text-amber-700 text-[10px] py-0">DRAFT</Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Card>
          </section>

          {/* Section 7: Feedback & Interactive Overlays */}
          <section id="feedback" className="scroll-mt-20">
            <div className="mb-6 flex flex-col gap-1">
              <h2 className="font-heading text-xl font-bold tracking-tight">7. Feedback & Dialog Overlays</h2>
              <p className="text-xs text-muted-foreground">
                Uji notifikasi toast, dialog konfirmasi tutup periode, dan drawer detail akun:
              </p>
            </div>

            <Card className="border-border p-6 shadow-xs">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* Sonner Toast Triggers */}
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Toast Notifications (Sonner)
                  </h3>
                  <div className="flex flex-col gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="justify-start text-xs font-medium"
                      onClick={() => toast.success("Jurnal JV-PTM-2026-000005 berhasil diposting!")}
                    >
                      <CheckCircle2 className="size-3.5 text-emerald-600" />
                      Toast: Posted Berhasil
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="justify-start text-xs font-medium"
                      onClick={() => toast.error("Pelanggaran: Total Debit tidak sama dengan Kredit!")}
                    >
                      <AlertTriangle className="size-3.5 text-rose-600" />
                      Toast: Error Tidak Seimbang
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="justify-start text-xs font-medium"
                      onClick={() => toast.info("Jurnal pembalik otomatis telah dibuat: JV-PTM-2026-REV-001")}
                    >
                      <RotateCcw className="size-3.5 text-teal-600" />
                      Toast: Jurnal Pembalik
                    </Button>
                  </div>
                </div>

                {/* Dialog Trigger */}
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Confirmation Dialog
                  </h3>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                        <ShieldCheck className="size-3.5 text-primary" />
                        Buka Dialog Tutup Periode
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Konfirmasi Tutup Periode Akuntansi</DialogTitle>
                        <DialogDescription>
                          Anda akan menutup periode <strong>November 2026</strong>. Setelah periode ditutup,
                          tidak ada transaksi jurnal baru yang dapat diposting ke tanggal periode ini.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="rounded-lg bg-muted p-3 text-xs space-y-1">
                        <div className="flex justify-between">
                          <span>Total Jurnal Terposting:</span>
                          <span className="font-mono font-bold">142 Jurnal</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Status Neraca Saldo:</span>
                          <span className="font-bold text-emerald-600">SEIMBANG (0 Selisih)</span>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" size="sm">Batal</Button>
                        <Button
                          size="sm"
                          className="bg-primary text-primary-foreground font-semibold"
                          onClick={() => toast.success("Periode November 2026 berhasil ditutup!")}
                        >
                          Tutup Periode
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Sheet / Drawer Trigger */}
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Slide-Over Drawer
                  </h3>
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                        <Building2 className="size-3.5 text-primary" />
                        Buka Detail Drawer Akun COA
                      </Button>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>1101 — Kas Kecil</SheetTitle>
                        <SheetDescription>Detail spesifikasi dan saldo berjalan akun.</SheetDescription>
                      </SheetHeader>
                      <div className="mt-6 flex flex-col gap-4 text-xs">
                        <div className="rounded-lg border border-border p-3 space-y-1">
                          <span className="text-muted-foreground">Jenis Akun:</span>
                          <div className="font-semibold text-foreground">ASSET (Aset Lancar)</div>
                        </div>
                        <div className="rounded-lg border border-border p-3 space-y-1">
                          <span className="text-muted-foreground">Saldo Normal:</span>
                          <div className="font-semibold text-foreground">DEBIT</div>
                        </div>
                        <div className="rounded-lg border border-border p-3 space-y-1">
                          <span className="text-muted-foreground">Saldo Berjalan Saat Ini:</span>
                          <div className="font-mono text-base font-bold text-primary">Rp 15.000.000,00</div>
                        </div>
                        <Button size="sm" className="mt-4" onClick={() => toast.info("Membuka riwayat buku besar akun 1101...")}>
                          Lihat Buku Besar Akun Ini
                        </Button>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
            </Card>
          </section>

        </main>

        {/* Footer */}
        <footer className="border-t border-border bg-card py-8 text-center text-xs text-muted-foreground">
          <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Scale className="size-4 text-primary" />
              <span className="font-semibold text-foreground">Kredo Enterprise Accounting</span>
              <span>— Setiap entri, seimbang.</span>
            </div>
            <div>
              Design system berbasis shadcn/ui • Palet referensi Fintech Teal & Slate
            </div>
          </div>
        </footer>
      </div>
    </TooltipProvider>
  )
}

export default App
