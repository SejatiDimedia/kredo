import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoneyText } from "@/components/shared/MoneyText"
import { Download, FileSpreadsheet, Printer, CheckCircle2 } from "lucide-react"

export function ReportsPage() {
  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Laporan Keuangan Enterprise
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Snapshot transaksi konsisten (REPEATABLE READ). Neraca Saldo, Laba Rugi, dan Neraca.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="gap-1.5 text-xs">
            <Download className="size-3.5" /> CSV
          </Button>
          <Button size="sm" variant="outline" className="gap-1.5 text-xs">
            <FileSpreadsheet className="size-3.5" /> Excel
          </Button>
          <Button size="sm" className="gap-1.5 text-xs bg-primary text-primary-foreground font-semibold">
            <Printer className="size-3.5" /> Cetak PDF
          </Button>
        </div>
      </div>

      <Tabs defaultValue="trial-balance" className="w-full space-y-6">
        <TabsList className="bg-muted/60 p-1">
          <TabsTrigger value="trial-balance" className="text-xs">Neraca Saldo (Trial Balance)</TabsTrigger>
          <TabsTrigger value="income-statement" className="text-xs">Laba Rugi (Income Statement)</TabsTrigger>
          <TabsTrigger value="balance-sheet" className="text-xs">Neraca (Balance Sheet)</TabsTrigger>
        </TabsList>

        <TabsContent value="trial-balance">
          <div className="overflow-hidden rounded-xl border border-border/40 bg-card shadow-xs">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border/30 bg-muted/20">
                  <TableHead className="w-[120px] pl-5">Kode Akun</TableHead>
                  <TableHead>Nama Akun</TableHead>
                  <TableHead className="w-[160px] text-right">Saldo Awal</TableHead>
                  <TableHead className="w-[160px] text-right">Mutasi Debit</TableHead>
                  <TableHead className="w-[160px] text-right">Mutasi Kredit</TableHead>
                  <TableHead className="w-[160px] text-right pr-5">Saldo Akhir</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-b border-border/20">
                  <TableCell className="font-mono pl-5 text-primary font-bold">1101</TableCell>
                  <TableCell className="font-medium text-foreground">Kas Kecil</TableCell>
                  <TableCell className="text-right"><MoneyText amount="0" /></TableCell>
                  <TableCell className="text-right"><MoneyText amount="100000000" /></TableCell>
                  <TableCell className="text-right"><MoneyText amount="20000000" /></TableCell>
                  <TableCell className="text-right pr-5 font-bold"><MoneyText amount="80000000" /></TableCell>
                </TableRow>
                <TableRow className="border-b border-border/20">
                  <TableCell className="font-mono pl-5 text-primary font-bold">1200</TableCell>
                  <TableCell className="font-medium text-foreground">Piutang Usaha</TableCell>
                  <TableCell className="text-right"><MoneyText amount="0" /></TableCell>
                  <TableCell className="text-right"><MoneyText amount="15000000" /></TableCell>
                  <TableCell className="text-right"><MoneyText amount="0" /></TableCell>
                  <TableCell className="text-right pr-5 font-bold"><MoneyText amount="15000000" /></TableCell>
                </TableRow>
                <TableRow className="border-b border-border/20">
                  <TableCell className="font-mono pl-5 text-primary font-bold">1300</TableCell>
                  <TableCell className="font-medium text-foreground">Persediaan Barang Dagang</TableCell>
                  <TableCell className="text-right"><MoneyText amount="0" /></TableCell>
                  <TableCell className="text-right"><MoneyText amount="20000000" /></TableCell>
                  <TableCell className="text-right"><MoneyText amount="0" /></TableCell>
                  <TableCell className="text-right pr-5 font-bold"><MoneyText amount="20000000" /></TableCell>
                </TableRow>
                <TableRow className="border-t-2 border-primary/20 bg-muted/30 font-bold">
                  <TableCell colSpan={3} className="pl-5 text-foreground">TOTAL KESEIMBANGAN (INV-01)</TableCell>
                  <TableCell className="text-right"><MoneyText amount="135000000" className="font-bold text-foreground" /></TableCell>
                  <TableCell className="text-right"><MoneyText amount="135000000" className="font-bold text-foreground" /></TableCell>
                  <TableCell className="text-right pr-5 text-emerald-600 font-extrabold flex items-center justify-end gap-1">
                    <CheckCircle2 className="size-3.5" /> SEIMBANG
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="income-statement">
          <Card className="p-6 border-border/40 shadow-xs">
            <h3 className="font-heading text-lg font-bold">Laporan Laba Rugi Komparatif</h3>
            <p className="text-xs text-muted-foreground mt-1 mb-4">Periode: 01 Jan 2026 – 15 Nov 2026</p>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b pb-2">
                <span>Pendapatan Penjualan Bersih (Akun 4100)</span>
                <MoneyText amount="450000000" highlightPositive />
              </div>
              <div className="flex justify-between border-b pb-2">
                <span>Harga Pokok Penjualan (Akun 5000)</span>
                <MoneyText amount="-270000000" accountingNegative />
              </div>
              <div className="flex justify-between font-bold pt-1">
                <span>Laba Kotor</span>
                <MoneyText amount="180000000" highlightPositive />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="balance-sheet">
          <Card className="p-6 border-border/40 shadow-xs">
            <h3 className="font-heading text-lg font-bold">Neraca Keuangan (Balance Sheet)</h3>
            <p className="text-xs text-muted-foreground mt-1 mb-4">Posisi per 15 November 2026 • Invariant: Aset = Liabilitas + Ekuitas</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="rounded-xl border border-border/40 p-4 space-y-2">
                <span className="text-xs font-semibold uppercase text-muted-foreground">Aktiva / Aset</span>
                <div className="flex justify-between font-bold text-base pt-2">
                  <span>Total Aset</span>
                  <MoneyText amount="115000000" className="text-primary font-bold" />
                </div>
              </div>
              <div className="rounded-xl border border-border/40 p-4 space-y-2">
                <span className="text-xs font-semibold uppercase text-muted-foreground">Pasiva / Liabilitas & Ekuitas</span>
                <div className="flex justify-between font-bold text-base pt-2">
                  <span>Total Pasiva</span>
                  <MoneyText amount="115000000" className="text-primary font-bold" />
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
