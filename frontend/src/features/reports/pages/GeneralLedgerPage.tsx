import * as React from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
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
import { MoneyText } from "@/components/shared/MoneyText"
import {
  Download,
  Printer,
  Calendar,
  BookOpen,
  ArrowUpRight,
} from "lucide-react"

interface LedgerTransaction {
  id: string
  date: string
  journalNo: string
  description: string
  memo: string
  debit: string
  credit: string
}

interface AccountLedgerData {
  code: string
  name: string
  category: "ASSET" | "LIABILITY" | "EQUITY" | "REVENUE" | "EXPENSE"
  normalBalance: "DEBIT" | "CREDIT"
  openingBalance: string
  transactions: LedgerTransaction[]
}

const LEDGER_ACCOUNTS: Record<string, AccountLedgerData> = {
  "1101": {
    code: "1101",
    name: "Kas Kecil Operasional",
    category: "ASSET",
    normalBalance: "DEBIT",
    openingBalance: "5000000",
    transactions: [
      {
        id: "tx-1",
        date: "14 Nov 2026",
        journalNo: "JV-PTM-2026-000001",
        description: "Setoran Modal Pemilik Tunai",
        memo: "Kas masuk setoran awal modal disetor",
        debit: "100000000",
        credit: "0",
      },
      {
        id: "tx-2",
        date: "14 Nov 2026",
        journalNo: "JV-PTM-2026-000002",
        description: "Pembelian Persediaan Barang Dagang",
        memo: "Pembayaran tunai persediaan ke supplier",
        debit: "0",
        credit: "20000000",
      },
      {
        id: "tx-3",
        date: "15 Nov 2026",
        journalNo: "JV-PTM-2026-000006",
        description: "Beban Operasional & Konsumsi Kantor",
        memo: "Reimbursement kas kecil petty cash",
        debit: "0",
        credit: "5000000",
      },
    ],
  },
  "1102": {
    code: "1102",
    name: "Bank BCA Operasional",
    category: "ASSET",
    normalBalance: "DEBIT",
    openingBalance: "80000000",
    transactions: [
      {
        id: "tx-4",
        date: "14 Nov 2026",
        journalNo: "JV-PTM-2026-000004",
        description: "Penerimaan Pelunasan Piutang Pelanggan",
        memo: "Transfer masuk PT Mitra Sejahtera",
        debit: "32500000",
        credit: "0",
      },
      {
        id: "tx-5",
        date: "15 Nov 2026",
        journalNo: "JV-PTM-2026-000005",
        description: "Pembayaran Beban Sewa Kantor Cabang",
        memo: "Transfer keluar via KlikBCA Bisnis",
        debit: "0",
        credit: "12500000",
      },
    ],
  },
  "1201": {
    code: "1201",
    name: "Piutang Dagang Pihak Ketiga",
    category: "ASSET",
    normalBalance: "DEBIT",
    openingBalance: "0",
    transactions: [
      {
        id: "tx-6",
        date: "15 Nov 2026",
        journalNo: "JV-PTM-2026-000003",
        description: "Penjualan Kredit Barang Dagang",
        memo: "Faktur INV/2026/11/0088 termin 30 hari",
        debit: "15000000",
        credit: "0",
      },
    ],
  },
  "2101": {
    code: "2101",
    name: "Utang Usaha Vendor",
    category: "LIABILITY",
    normalBalance: "CREDIT",
    openingBalance: "15000000",
    transactions: [
      {
        id: "tx-7",
        date: "14 Nov 2026",
        journalNo: "JV-PTM-2026-000002",
        description: "Pembelian Persediaan Barang Dagang",
        memo: "Faktur supplier jatuh tempo 30 hari",
        debit: "0",
        credit: "20000000",
      },
    ],
  },
  "4101": {
    code: "4101",
    name: "Pendapatan Penjualan Produk",
    category: "REVENUE",
    normalBalance: "CREDIT",
    openingBalance: "435000000",
    transactions: [
      {
        id: "tx-8",
        date: "15 Nov 2026",
        journalNo: "JV-PTM-2026-000003",
        description: "Penjualan Kredit Barang Dagang",
        memo: "Pengakuan pendapatan atas faktur INV/2026/11/0088",
        debit: "0",
        credit: "15000000",
      },
    ],
  },
  "6201": {
    code: "6201",
    name: "Beban Sewa Kantor Cabang",
    category: "EXPENSE",
    normalBalance: "DEBIT",
    openingBalance: "0",
    transactions: [
      {
        id: "tx-9",
        date: "15 Nov 2026",
        journalNo: "JV-PTM-2026-000005",
        description: "Pembayaran Beban Sewa Kantor Cabang",
        memo: "Sewa gedung lantai 3 periode Nov 2026",
        debit: "12500000",
        credit: "0",
      },
    ],
  },
}

export function GeneralLedgerPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  // Selected Account Code (from URL query or default to 1101)
  const initialAccount = searchParams.get("account") || "1101"
  const [selectedCode, setSelectedCode] = React.useState<string>(
    LEDGER_ACCOUNTS[initialAccount] ? initialAccount : "1101"
  )

  // Date Filter State
  const [startDate, setStartDate] = React.useState("2026-11-01")
  const [endDate, setEndDate] = React.useState("2026-11-30")

  // Current Account Data
  const accountData = LEDGER_ACCOUNTS[selectedCode] || LEDGER_ACCOUNTS["1101"]

  // Calculate Running Balances
  const calculatedRows = React.useMemo(() => {
    let currentBalance = toDecimal(accountData.openingBalance)
    let totalDebitSum = new Decimal(0)
    let totalCreditSum = new Decimal(0)

    const rowsWithBalance = accountData.transactions.map((tx) => {
      const debitDec = toDecimal(tx.debit || 0)
      const creditDec = toDecimal(tx.credit || 0)

      totalDebitSum = totalDebitSum.plus(debitDec)
      totalCreditSum = totalCreditSum.plus(creditDec)

      if (accountData.normalBalance === "DEBIT") {
        currentBalance = currentBalance.plus(debitDec).minus(creditDec)
      } else {
        currentBalance = currentBalance.plus(creditDec).minus(debitDec)
      }

      return {
        ...tx,
        runningBalance: currentBalance,
      }
    })

    return {
      rows: rowsWithBalance,
      totalDebit: totalDebitSum,
      totalCredit: totalCreditSum,
      endingBalance: currentBalance,
    }
  }, [accountData])

  // Handle Account Change
  const handleAccountSelect = (code: string) => {
    setSelectedCode(code)
    setSearchParams({ account: code })
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
            <BreadcrumbLink href="/reports">Laporan Keuangan</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Buku Besar Akun (General Ledger)</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header and Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-heading">
            Buku Besar Umum (General Ledger)
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Rincian mutasi debit, kredit, dan saldo berjalan (running balance) per akun buku besar (PRD 6.6 FR-LED-02).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => toast.info("Ekspor CSV buku besar diunduh...")}>
            <Download className="size-3.5 mr-1.5" />
            Ekspor CSV
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="size-3.5 mr-1.5" />
            Cetak PDF
          </Button>
        </div>
      </div>

      {/* Account Selector and Date Filter Card */}
      <Card>
        <CardHeader className="border-b border-border/30 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            {/* Account Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <BookOpen className="size-3.5 text-primary" />
                Pilih Akun Buku Besar (Postable)
              </label>
              <Select value={selectedCode} onValueChange={handleAccountSelect}>
                <SelectTrigger className="text-xs h-9">
                  <SelectValue placeholder="Pilih Akun..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Akun Aktif</SelectLabel>
                    {Object.values(LEDGER_ACCOUNTS).map((acc) => (
                      <SelectItem key={acc.code} value={acc.code} className="text-xs">
                        <span className="font-mono font-semibold text-primary mr-1.5">{acc.code}</span>
                        <span>{acc.name}</span>
                        <span className="text-[10px] text-muted-foreground ml-2">({acc.category})</span>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Date Range Start */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Calendar className="size-3.5 text-muted-foreground" />
                Dari Tanggal
              </label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="text-xs h-9 font-mono"
              />
            </div>

            {/* Date Range End */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Calendar className="size-3.5 text-muted-foreground" />
                Sampai Tanggal
              </label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="text-xs h-9 font-mono"
              />
            </div>
          </div>
        </CardHeader>

        {/* Account Financial Balance Summary (4 Metrics) */}
        <CardContent className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3 rounded-lg border border-border/40 bg-muted/10">
            <span className="text-muted-foreground block text-[11px] uppercase font-semibold">
              Saldo Awal ({startDate})
            </span>
            <div className="font-mono text-base font-bold text-foreground mt-1 tabular-nums">
              <MoneyText amount={accountData.openingBalance} />
            </div>
          </div>

          <div className="p-3 rounded-lg border border-border/40 bg-muted/10">
            <span className="text-muted-foreground block text-[11px] uppercase font-semibold">
              Total Mutasi Debit
            </span>
            <div className="font-mono text-base font-bold text-foreground mt-1 tabular-nums">
              <MoneyText amount={calculatedRows.totalDebit} />
            </div>
          </div>

          <div className="p-3 rounded-lg border border-border/40 bg-muted/10">
            <span className="text-muted-foreground block text-[11px] uppercase font-semibold">
              Total Mutasi Kredit
            </span>
            <div className="font-mono text-base font-bold text-foreground mt-1 tabular-nums">
              <MoneyText amount={calculatedRows.totalCredit} />
            </div>
          </div>

          <div className="p-3 rounded-lg border border-teal-500/30 bg-teal-500/5">
            <span className="text-teal-700 dark:text-teal-400 block text-[11px] uppercase font-semibold">
              Saldo Akhir ({endDate})
            </span>
            <div className="font-mono text-base font-extrabold text-foreground mt-1 tabular-nums">
              <MoneyText amount={calculatedRows.endingBalance} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table with Running Balance */}
      <Card>
        <CardHeader className="border-b border-border/30 pb-3 flex flex-row items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-semibold">
                Kartu Buku Besar: {accountData.code} — {accountData.name}
              </CardTitle>
              <Badge variant="outline" className="text-[10px]">
                Saldo Normal: {accountData.normalBalance}
              </Badge>
            </div>
            <CardDescription className="text-xs">
              Semua mutasi telah diverifikasi seimbang dan dibukukan dari jurnal berstatus <code>POSTED</code>.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border/30 bg-muted/10 hover:bg-muted/10">
                <TableHead className="w-[110px] pl-6 font-semibold">Tanggal</TableHead>
                <TableHead className="w-[170px] font-semibold">No. Jurnal</TableHead>
                <TableHead className="font-semibold">Deskripsi Transaksi</TableHead>
                <TableHead className="font-semibold">Memo Baris</TableHead>
                <TableHead className="w-[140px] text-right font-semibold">Debit (IDR)</TableHead>
                <TableHead className="w-[140px] text-right font-semibold">Kredit (IDR)</TableHead>
                <TableHead className="w-[160px] text-right pr-6 font-semibold">Saldo Berjalan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Row 0: Opening Balance Row */}
              <TableRow className="border-b border-border/20 bg-muted/5 font-medium">
                <TableCell className="pl-6 font-mono text-xs text-muted-foreground py-2.5">
                  {startDate}
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground py-2.5">
                  —
                </TableCell>
                <TableCell colSpan={2} className="text-xs font-semibold text-foreground py-2.5">
                  SALDO AWAL (OPENING BALANCE)
                </TableCell>
                <TableCell className="text-right text-xs font-mono py-2.5">—</TableCell>
                <TableCell className="text-right text-xs font-mono py-2.5">—</TableCell>
                <TableCell className="text-right pr-6 text-xs font-mono font-bold text-foreground py-2.5">
                  <MoneyText amount={accountData.openingBalance} />
                </TableCell>
              </TableRow>

              {/* Transaction Rows with Running Balance */}
              {calculatedRows.rows.map((row) => (
                <TableRow key={row.id} className="border-b border-border/20 hover:bg-muted/10 transition-colors">
                  <TableCell className="pl-6 font-mono text-xs text-muted-foreground py-3">
                    {row.date}
                  </TableCell>
                  <TableCell className="font-mono text-xs py-3">
                    <button
                      type="button"
                      onClick={() => navigate(`/journals/${row.journalNo}`)}
                      className="font-semibold text-primary hover:underline inline-flex items-center gap-1"
                    >
                      {row.journalNo}
                      <ArrowUpRight className="size-3" />
                    </button>
                  </TableCell>
                  <TableCell className="text-xs font-medium text-foreground py-3">
                    {row.description}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground py-3">
                    {row.memo}
                  </TableCell>
                  <TableCell className="text-right text-xs font-mono py-3">
                    {row.debit !== "0" ? <MoneyText amount={row.debit} /> : <span className="text-muted-foreground">—</span>}
                  </TableCell>
                  <TableCell className="text-right text-xs font-mono py-3">
                    {row.credit !== "0" ? <MoneyText amount={row.credit} /> : <span className="text-muted-foreground">—</span>}
                  </TableCell>
                  <TableCell className="text-right pr-6 text-xs font-mono font-bold text-foreground py-3">
                    <MoneyText amount={row.runningBalance} />
                  </TableCell>
                </TableRow>
              ))}

              {/* Total Summary Row */}
              <TableRow className="border-t-2 border-border/60 bg-muted/20 font-bold">
                <TableCell colSpan={4} className="pl-6 text-foreground text-xs py-3">
                  TOTAL MUTASI & SALDO AKHIR ({accountData.code} — {accountData.name})
                </TableCell>
                <TableCell className="text-right text-xs font-mono py-3">
                  <MoneyText amount={calculatedRows.totalDebit} className="font-bold text-foreground" />
                </TableCell>
                <TableCell className="text-right text-xs font-mono py-3">
                  <MoneyText amount={calculatedRows.totalCredit} className="font-bold text-foreground" />
                </TableCell>
                <TableCell className="text-right pr-6 text-xs font-mono font-extrabold text-foreground py-3">
                  <MoneyText amount={calculatedRows.endingBalance} className="font-extrabold text-foreground" />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
