import * as React from "react"
import { toast } from "sonner"

// Shadcn UI Components
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Card } from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { MoneyText } from "@/components/shared/MoneyText"

// Icons
import {
  CheckCircle2,
  Plus,
  SlidersHorizontal,
  Bell,
  Layers,
  LayoutGrid,
  FileText,
} from "lucide-react"

export function DesignSystemPage() {
  const [totalDebit, setTotalDebit] = React.useState(25000000)
  const [totalCredit, setTotalCredit] = React.useState(25000000)
  const isBalanced = totalDebit === totalCredit
  const difference = Math.abs(totalDebit - totalCredit)
  const [progressVal, setProgressVal] = React.useState(75)

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Breadcrumb Navigation */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Sistem</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Design System UI</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Title */}
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
          Kredo Component Showcase
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5 max-w-2xl">
          Katalog referensi warna Deep Teal (#0D6276) dan Slate (#101727) yang diterapkan pada seluruh reusable UI components shadcn.
        </p>
      </div>

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

        {/* TAB 1: OVERVIEW & SIGNATURE */}
        <TabsContent value="overview" className="space-y-10">
          {/* Balance Bar Signature Widget */}
          <div>
            <div className="mb-4 flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <h2 className="font-heading text-lg font-bold tracking-tight">Signature Component: Balance Bar</h2>
                <Badge variant="outline" className="border-primary/40 text-primary text-xs">Fitur Kunci</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Bilah pemantau saldo debit dan kredit jurnal secara real-time:
              </p>
            </div>

            <Card className="border-border/40 p-6 shadow-xs">
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
                    {isBalanced ? "SEIMBANG" : "SELISIH Rp 50.000,00"}
                  </strong>
                </span>
              </div>

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
                        <MoneyText amount={totalDebit} />
                      </div>
                    </div>
                    <div className="text-muted-foreground font-light text-xl">−</div>
                    <div>
                      <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Total Kredit</span>
                      <div className="font-mono text-lg font-bold text-foreground tabular-nums">
                        <MoneyText amount={totalCredit} />
                      </div>
                    </div>
                    <div className="text-muted-foreground font-light text-xl">=</div>
                    <div>
                      <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Variance</span>
                      <div className={`font-mono text-lg font-bold tabular-nums ${isBalanced ? "text-emerald-600" : "text-rose-600 font-extrabold"}`}>
                        <MoneyText amount={difference} />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {isBalanced ? (
                      <Badge className="gap-1.5 bg-emerald-600 text-white px-3 py-1 text-xs">
                        <CheckCircle2 className="size-3.5" /> Seimbang
                      </Badge>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-rose-500/40 text-rose-600 hover:bg-rose-500/10 text-xs gap-1"
                        onClick={() => setTotalCredit(totalDebit)}
                      >
                        <Plus className="size-3.5" /> Add Balancing Line
                      </Button>
                    )}
                    <Button
                      size="sm"
                      disabled={!isBalanced}
                      className="bg-primary text-primary-foreground font-semibold"
                      onClick={() => toast.success("Jurnal diajukan!")}
                    >
                      Submit Jurnal
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Color Palettes */}
          <div>
            <h2 className="font-heading text-lg font-bold tracking-tight mb-3">Color Foundations</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-[#0D6276] text-white">
                <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">Primary Teal</span>
                <div className="text-sm font-bold font-mono mt-1">#0D6276</div>
              </div>
              <div className="p-4 rounded-xl bg-[#101727] text-white">
                <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">Dark Slate</span>
                <div className="text-sm font-bold font-mono mt-1">#101727</div>
              </div>
              <div className="p-4 rounded-xl bg-[#14B8A6] text-slate-900">
                <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">Mint Accent</span>
                <div className="text-sm font-bold font-mono mt-1">#14B8A6</div>
              </div>
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-border/50 text-slate-800">
                <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">Canvas Surface</span>
                <div className="text-sm font-bold font-mono mt-1">#F8FAFC</div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* TAB 2: ACTIONS & BADGES */}
        <TabsContent value="actions" className="space-y-6">
          <Card className="border-border/40 p-6 shadow-xs">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Button Variants</h3>
            <div className="flex flex-wrap gap-3">
              <Button variant="default">Button Primary (#0D6276)</Button>
              <Button variant="secondary">Button Secondary</Button>
              <Button variant="outline">Button Outline</Button>
              <Button variant="ghost">Button Ghost</Button>
              <Button variant="destructive">Button Destructive</Button>
              <Button variant="link">Button Link</Button>
            </div>
          </Card>

          {/* Badge Showcase: Fintech Precision Design System */}
          <Card className="border-border/40 p-6 shadow-xs space-y-6">
            <div>
              <h3 className="text-sm font-semibold tracking-tight text-foreground">
                Fintech Status & Semantic Badges
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Standar badge akuntansi Kredo: sudut terstruktur (rounded-md), background soft-tinted, border halus, dan rasio kontras WCAG AAA (&gt;7:1).
              </p>
            </div>

            {/* Semantic Variants */}
            <div className="space-y-2">
              <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Semantic Color Tokens
              </span>
              <div className="flex flex-wrap gap-2.5 items-center">
                <Badge variant="default">Default Brand</Badge>
                <Badge variant="success">Success / Posted</Badge>
                <Badge variant="info">Info / In Progress</Badge>
                <Badge variant="warning">Warning / Submitted</Badge>
                <Badge variant="destructive">Destructive / Error</Badge>
                <Badge variant="purple">Purple / Equity</Badge>
                <Badge variant="blue">Blue / Approver</Badge>
                <Badge variant="secondary">Secondary / Draft</Badge>
                <Badge variant="outline">Outline Neutral</Badge>
              </div>
            </div>

            {/* Ledger Status Examples */}
            <div className="space-y-2">
              <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Status Siklus Jurnal (Journal Lifecycle)
              </span>
              <div className="flex flex-wrap gap-2.5 items-center">
                <Badge variant="secondary" size="sm" className="font-mono uppercase font-medium">DRAFT</Badge>
                <Badge variant="warning" size="sm" className="font-mono uppercase font-semibold">SUBMITTED</Badge>
                <Badge variant="info" size="sm" className="font-mono uppercase font-semibold">APPROVED</Badge>
                <Badge variant="success" size="sm" className="font-mono uppercase font-semibold">POSTED</Badge>
                <Badge variant="destructive" size="sm" className="font-mono uppercase font-medium">CANCELLED</Badge>
              </div>
            </div>

            {/* COA Category Examples */}
            <div className="space-y-2">
              <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Kategori Bagan Akun (COA Classification)
              </span>
              <div className="flex flex-wrap gap-2.5 items-center">
                <Badge variant="info" size="sm" className="font-mono font-semibold">1-000 ASET</Badge>
                <Badge variant="warning" size="sm" className="font-mono font-semibold">2-000 LIABILITAS</Badge>
                <Badge variant="purple" size="sm" className="font-mono font-semibold">3-000 EKUITAS</Badge>
                <Badge variant="success" size="sm" className="font-mono font-semibold">4-000 PENDAPATAN</Badge>
                <Badge variant="destructive" size="sm" className="font-mono font-semibold">5-000 BEBAN</Badge>
              </div>
            </div>

            {/* Sizes & Shapes */}
            <div className="space-y-2">
              <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Ukuran & Bentuk (Sizes & Shapes)
              </span>
              <div className="flex flex-wrap gap-3 items-center">
                <Badge variant="info" size="sm">Small (h-4)</Badge>
                <Badge variant="info" size="default">Default (h-5)</Badge>
                <Badge variant="info" size="lg">Large (h-6)</Badge>
                <Badge variant="success" shape="pill" size="sm">Pill Variant</Badge>
                <Badge variant="warning" shape="pill" size="default">Pill Status</Badge>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* TAB 3: FORMS */}
        <TabsContent value="forms" className="space-y-6">
          <Card className="border-border/40 p-6 shadow-xs max-w-xl">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Input & Selection</h3>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Nominal Uang (MoneyText Component Standard)</Label>
                <Input defaultValue="15.000.000,00" className="font-mono text-right tabular-nums font-semibold" />
              </div>
              <div className="flex items-center justify-between">
                <Label>Switch Keamanan Maker-Checker</Label>
                <Switch defaultChecked />
              </div>
              <div className="space-y-2">
                <Label>Slider Persentase</Label>
                <Slider value={[progressVal]} onValueChange={(val) => setProgressVal(val[0])} max={100} />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* TAB 4: DATA */}
        <TabsContent value="data" className="space-y-6">
          <Card className="border-border/40 p-6 shadow-xs">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Accordion & Progress</h3>
            <Accordion type="single" collapsible defaultValue="a1">
              <AccordionItem value="a1">
                <AccordionTrigger>Aturan Keseimbangan Jurnal</AccordionTrigger>
                <AccordionContent className="text-xs text-muted-foreground">
                  Σ debit harus sama persis dengan Σ kredit di setiap baris jurnal.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Card>
        </TabsContent>

        {/* TAB 5: OVERLAYS */}
        <TabsContent value="overlays" className="space-y-6">
          <Card className="border-border/40 p-6 shadow-xs">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Overlays & Dialogs</h3>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" size="sm" onClick={() => toast.success("Toast Berhasil!")}>
                Trigger Sonner Toast
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm">Buka Dialog Modal</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Dialog Title</DialogTitle>
                    <DialogDescription>Konten dialog modal standar shadcn.</DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
