import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoneyText } from "@/components/shared/MoneyText"
import {
  ArrowDownLeft,
  ArrowUpRight,
  RotateCcw,
  FileSpreadsheet,
  Plus,
  CheckCircle2,
  Wifi,
  CreditCard,
  Calendar
} from "lucide-react"

export function DashboardPage() {
  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
              Dashboard Keuangan
            </h1>
            <Badge variant="outline" className="border-teal-500/30 bg-teal-500/10 text-teal-700 text-xs">
              Live Ledger
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Ringkasan buku besar, mutasi kas likuid, dan antrean persetujuan jurnal periode berjalan.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="gap-1.5 text-xs">
            <Calendar className="size-3.5" />
            Bulan Ini: Nov 2026
          </Button>
          <Button size="sm" className="gap-1.5 text-xs bg-primary text-primary-foreground font-semibold">
            <Plus className="size-3.5" />
            Entri Jurnal Baru
          </Button>
        </div>
      </div>

      {/* Metric Cards Row (Fintech Style from Reference) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Virtual Card: Liquid Cash */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0c596b] via-[#0D6276] to-[#101727] p-6 text-white shadow-md">
          <div className="pointer-events-none absolute -right-12 -top-12 size-48 rounded-full bg-teal-400/10 blur-xl" />
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

            <div className="my-auto flex items-center gap-3">
              <div className="h-7 w-10 rounded-md border border-amber-300/40 bg-gradient-to-tr from-amber-400/80 to-yellow-200/80 shadow-xs" />
              <span className="font-mono text-sm tracking-widest text-teal-100/90">•••• •••• •••• 1990</span>
            </div>

            <div className="flex items-end justify-between border-t border-teal-500/30 pt-3">
              <div>
                <span className="text-[10px] tracking-wider text-teal-200/80 uppercase">Total Saldo Kas & Bank</span>
                <div className="text-2xl font-extrabold tracking-tight">
                  <MoneyText amount="158875000" className="text-white text-2xl font-extrabold" />
                </div>
              </div>
              <Badge variant="outline" className="border-teal-300/30 bg-teal-300/20 text-white font-mono text-[11px]">
                Akun 1100
              </Badge>
            </div>
          </div>
        </div>

        {/* Quick Operations Preset */}
        <Card className="flex flex-col justify-between p-6 shadow-xs border-border/40">
          <div>
            <div className="flex items-center justify-between pb-3">
              <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Aksi Cepat Akuntansi
              </span>
              <Badge variant="secondary" className="text-[10px]">SOP Aktif</Badge>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border/40 bg-card p-4 transition-all hover:border-primary hover:bg-primary/5 group text-left">
                <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <ArrowDownLeft className="size-5" />
                </div>
                <span className="text-xs font-semibold text-foreground">Setor Tunai</span>
                <span className="text-[10px] text-muted-foreground">Debit 1101</span>
              </button>

              <button className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border/40 bg-card p-4 transition-all hover:border-primary hover:bg-primary/5 group text-left">
                <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <ArrowUpRight className="size-5" />
                </div>
                <span className="text-xs font-semibold text-foreground">Transfer Bank</span>
                <span className="text-[10px] text-muted-foreground">Kredit 1102</span>
              </button>

              <button className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border/40 bg-card p-4 transition-all hover:border-primary hover:bg-primary/5 group text-left">
                <div className="flex size-10 items-center justify-center rounded-full bg-teal-500/10 text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                  <FileSpreadsheet className="size-5" />
                </div>
                <span className="text-xs font-semibold text-foreground">Impor CSV</span>
                <span className="text-[10px] text-muted-foreground">Spring Batch</span>
              </button>

              <button className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border/40 bg-card p-4 transition-all hover:border-primary hover:bg-primary/5 group text-left">
                <div className="flex size-10 items-center justify-center rounded-full bg-muted text-foreground group-hover:bg-foreground group-hover:text-background transition-colors">
                  <RotateCcw className="size-5" />
                </div>
                <span className="text-xs font-semibold text-foreground">Jurnal Balik</span>
                <span className="text-[10px] text-muted-foreground">Koreksi Entri</span>
              </button>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-border/30 pt-3 text-xs text-muted-foreground">
            <span>Maker-Checker rule: Aktif</span>
            <span className="font-semibold text-primary">Sistem Siap</span>
          </div>
        </Card>

        {/* Mutasi & Rekonsiliasi */}
        <Card className="flex flex-col justify-between p-6 shadow-xs border-border/40">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  Mutasi Bulan Berjalan
                </span>
                <div className="text-2xl font-bold tracking-tight text-foreground">
                  <MoneyText amount="98345000" className="text-2xl font-bold" />
                </div>
              </div>
              <Badge variant="outline" className="border-teal-500/30 text-teal-600 text-xs font-semibold">
                +12.4% vs Okt
              </Badge>
            </div>

            {/* Sparkline curve */}
            <div className="relative mt-4 h-28 w-full">
              <svg viewBox="0 0 300 100" className="size-full overflow-visible">
                <defs>
                  <linearGradient id="dbTealGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#0D6276" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#0D6276" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path d="M 0,70 Q 50,40 100,55 T 200,25 T 300,50 L 300,100 L 0,100 Z" fill="url(#dbTealGrad)" />
                <path d="M 0,70 Q 50,40 100,55 T 200,25 T 300,50" fill="none" stroke="#0D6276" strokeWidth="3" strokeLinecap="round" />
                <circle cx="200" cy="25" r="5" fill="#0D6276" />
                <circle cx="200" cy="25" r="2" fill="#FFFFFF" />
              </svg>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-border/30 pt-3 text-xs">
            <span className="text-muted-foreground">Status Keseimbangan</span>
            <span className="font-semibold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="size-3.5" /> Neraca Saldo Seimbang
            </span>
          </div>
        </Card>
      </div>

      {/* Summary Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-border/40 shadow-xs">
          <span className="text-xs text-muted-foreground">Total Pendapatan (YTD)</span>
          <div className="text-lg font-bold text-foreground mt-1">
            <MoneyText amount="450000000" highlightPositive />
          </div>
        </Card>

        <Card className="p-4 border-border/40 shadow-xs">
          <span className="text-xs text-muted-foreground">Total Beban Operasional (YTD)</span>
          <div className="text-lg font-bold text-foreground mt-1">
            <MoneyText amount="285000000" />
          </div>
        </Card>

        <Card className="p-4 border-border/40 shadow-xs">
          <span className="text-xs text-muted-foreground">Laba Bersih Berjalan</span>
          <div className="text-lg font-bold text-foreground mt-1">
            <MoneyText amount="165000000" highlightPositive />
          </div>
        </Card>

        <Card className="p-4 border-border/40 shadow-xs">
          <span className="text-xs text-muted-foreground">Jurnal Menunggu Approval</span>
          <div className="flex items-center justify-between mt-1">
            <span className="font-mono text-lg font-bold text-amber-600">2 Jurnal</span>
            <Badge variant="outline" className="border-amber-500/30 text-amber-700 bg-amber-500/10 text-[10px]">
              Perlu Review
            </Badge>
          </div>
        </Card>
      </div>
    </div>
  )
}
