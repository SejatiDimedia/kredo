import * as React from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
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
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
  BookOpen,
  ArrowUpRight,
  Loader2,
  CalendarClock,
} from "lucide-react"
import { apiFetch } from "@/lib/api"
import type { GeneralLedgerResponse } from "../types"

interface AccountOption {
  id: number
  code: string
  name: string
  type: string
  isPostable: boolean
}

export function GeneralLedgerPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const [accounts, setAccounts] = React.useState<AccountOption[]>([])
  const [selectedAccountId, setSelectedAccountId] = React.useState<number | null>(null)
  const [ledgerData, setLedgerData] = React.useState<GeneralLedgerResponse | null>(null)
  const [isLoadingAccounts, setIsLoadingAccounts] = React.useState(true)
  const [isLoadingLedger, setIsLoadingLedger] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // 1. Fetch Daftar Akun
  React.useEffect(() => {
    async function loadAccounts() {
      try {
        setIsLoadingAccounts(true)
        const accList = await apiFetch<AccountOption[]>("/api/v1/accounts?entityId=1")
        const postableOnly = accList.filter((a) => a.isPostable)
        setAccounts(postableOnly)

        // Tentukan akun default: dari query param accountId/account atau akun pertama
        const queryAccountId = searchParams.get("accountId")
        const queryCode = searchParams.get("account")

        let initialAccount: AccountOption | undefined
        if (queryAccountId) {
          initialAccount = postableOnly.find((a) => a.id === Number(queryAccountId))
        } else if (queryCode) {
          initialAccount = postableOnly.find((a) => a.code === queryCode)
        }

        if (!initialAccount && postableOnly.length > 0) {
          initialAccount = postableOnly.find((a) => a.code === "1101") || postableOnly[0]
        }

        if (initialAccount) {
          setSelectedAccountId(initialAccount.id)
        }
      } catch (err) {
        toast.error("Gagal memuat daftar akun buku besar")
      } finally {
        setIsLoadingAccounts(false)
      }
    }

    loadAccounts()
  }, [searchParams])

  // 2. Fetch Mutasi Buku Besar saat selectedAccountId berubah
  React.useEffect(() => {
    if (!selectedAccountId) return

    async function loadLedger(accId: number) {
      try {
        setIsLoadingLedger(true)
        setError(null)
        const data = await apiFetch<GeneralLedgerResponse>(
          `/api/v1/reports/general-ledger?entityId=1&periodId=11&accountId=${accId}`
        )
        setLedgerData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal memuat buku besar")
      } finally {
        setIsLoadingLedger(false)
      }
    }

    loadLedger(selectedAccountId)
  }, [selectedAccountId])

  const handleAccountSelect = (accountIdStr: string) => {
    const accId = Number(accountIdStr)
    setSelectedAccountId(accId)
    const acc = accounts.find((a) => a.id === accId)
    if (acc) {
      setSearchParams({ accountId: String(accId), account: acc.code })
    }
  }

  const selectedAccount = accounts.find((a) => a.id === selectedAccountId)

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
            Rincian mutasi debit, kredit, dan saldo berjalan (running balance) per akun buku besar.
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

      {/* Account Selector Card */}
      <Card>
        <CardHeader className="border-b border-border/30 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5 w-full sm:max-w-md">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <BookOpen className="size-3.5 text-primary" />
                Pilih Akun Buku Besar (Postable)
              </label>
              <Select
                value={selectedAccountId ? String(selectedAccountId) : ""}
                onValueChange={handleAccountSelect}
                disabled={isLoadingAccounts}
              >
                <SelectTrigger className="text-xs h-9">
                  <SelectValue placeholder={isLoadingAccounts ? "Memuat akun..." : "Pilih Akun..."} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Akun Aktif Entitas</SelectLabel>
                    {accounts.map((acc) => (
                      <SelectItem key={acc.id} value={String(acc.id)} className="text-xs">
                        <span className="font-mono font-semibold text-primary mr-1.5">{acc.code}</span>
                        <span>{acc.name}</span>
                        <span className="text-[10px] text-muted-foreground ml-2">({acc.type})</span>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CalendarClock className="size-4 text-primary" />
              <span>Periode Aktif: <strong>November 2026</strong> (Bulan ke-11)</span>
            </div>
          </div>
        </CardHeader>

        {/* Account Financial Balance Summary (4 Metrics) */}
        <CardContent className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3 rounded-lg border border-border/40 bg-muted/10">
            <span className="text-muted-foreground block text-[11px] uppercase font-semibold">
              Saldo Awal (Nov 2026)
            </span>
            <div className="font-mono text-base font-bold text-foreground mt-1 tabular-nums">
              <MoneyText amount={ledgerData?.beginningBalance ?? "0"} />
            </div>
          </div>

          <div className="p-3 rounded-lg border border-border/40 bg-muted/10">
            <span className="text-muted-foreground block text-[11px] uppercase font-semibold">
              Total Mutasi Debit
            </span>
            <div className="font-mono text-base font-bold text-foreground mt-1 tabular-nums">
              <MoneyText amount={ledgerData?.totalDebit ?? "0"} />
            </div>
          </div>

          <div className="p-3 rounded-lg border border-border/40 bg-muted/10">
            <span className="text-muted-foreground block text-[11px] uppercase font-semibold">
              Total Mutasi Kredit
            </span>
            <div className="font-mono text-base font-bold text-foreground mt-1 tabular-nums">
              <MoneyText amount={ledgerData?.totalCredit ?? "0"} />
            </div>
          </div>

          <div className="p-3 rounded-lg border border-teal-500/30 bg-teal-500/5">
            <span className="text-teal-700 dark:text-teal-400 block text-[11px] uppercase font-semibold">
              Saldo Akhir Berjalan
            </span>
            <div className="font-mono text-base font-extrabold text-foreground mt-1 tabular-nums">
              <MoneyText amount={ledgerData?.endingBalance ?? "0"} />
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
                Kartu Buku Besar: {ledgerData?.accountCode || selectedAccount?.code || "—"} — {ledgerData?.accountName || selectedAccount?.name || ""}
              </CardTitle>
              {ledgerData && (
                <Badge variant="outline" className="text-[10px]">
                  Saldo Normal: {ledgerData.normalBalance}
                </Badge>
              )}
            </div>
            <CardDescription className="text-xs">
              Semua mutasi dibukukan secara otomatis dari jurnal berstatus <code>POSTED</code>.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border/30 bg-muted/10 hover:bg-muted/10">
                <TableHead className="w-[110px] pl-6 font-semibold">Tanggal</TableHead>
                <TableHead className="w-[180px] font-semibold">No. Jurnal</TableHead>
                <TableHead className="font-semibold">Deskripsi Transaksi</TableHead>
                <TableHead className="font-semibold">Memo Baris</TableHead>
                <TableHead className="w-[140px] text-right font-semibold">Debit (IDR)</TableHead>
                <TableHead className="w-[140px] text-right font-semibold">Kredit (IDR)</TableHead>
                <TableHead className="w-[160px] text-right pr-6 font-semibold">Saldo Berjalan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingLedger ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-12 text-center text-muted-foreground">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="size-4 animate-spin text-primary" />
                      <span>Memuat mutasi buku besar...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-8 text-center text-destructive">
                    {error}
                  </TableCell>
                </TableRow>
              ) : !ledgerData || ledgerData.lines.length === 0 ? (
                <>
                  {/* Row 0: Opening Balance Row */}
                  <TableRow className="border-b border-border/20 bg-muted/5 font-medium">
                    <TableCell className="pl-6 font-mono text-xs text-muted-foreground py-2.5">
                      01 Nov 2026
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
                      <MoneyText amount={ledgerData?.beginningBalance ?? "0"} />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={7} className="py-10 text-center text-xs text-muted-foreground">
                      Belum ada transaksi POSTED pada akun ini di periode berjalan.
                    </TableCell>
                  </TableRow>
                </>
              ) : (
                <>
                  {/* Row 0: Opening Balance Row */}
                  <TableRow className="border-b border-border/20 bg-muted/5 font-medium">
                    <TableCell className="pl-6 font-mono text-xs text-muted-foreground py-2.5">
                      01 Nov 2026
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
                      <MoneyText amount={ledgerData.beginningBalance} />
                    </TableCell>
                  </TableRow>

                  {/* Transaction Rows with Running Balance */}
                  {ledgerData.lines.map((line) => (
                    <TableRow key={line.lineId} className="border-b border-border/20 hover:bg-muted/10 transition-colors">
                      <TableCell className="pl-6 font-mono text-xs text-muted-foreground py-3">
                        {line.entryDate}
                      </TableCell>
                      <TableCell className="font-mono text-xs py-3">
                        <button
                          type="button"
                          onClick={() => navigate(`/journals/${line.journalId}`)}
                          className="font-semibold text-primary hover:underline inline-flex items-center gap-1 cursor-pointer"
                        >
                          {line.journalNo}
                          <ArrowUpRight className="size-3" />
                        </button>
                      </TableCell>
                      <TableCell className="text-xs font-medium text-foreground py-3">
                        {line.description}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground py-3">
                        {line.memo || "—"}
                      </TableCell>
                      <TableCell className="text-right text-xs font-mono py-3">
                        {Number(line.debit) !== 0 ? <MoneyText amount={line.debit} /> : <span className="text-muted-foreground">—</span>}
                      </TableCell>
                      <TableCell className="text-right text-xs font-mono py-3">
                        {Number(line.credit) !== 0 ? <MoneyText amount={line.credit} /> : <span className="text-muted-foreground">—</span>}
                      </TableCell>
                      <TableCell className="text-right pr-6 text-xs font-mono font-bold text-foreground py-3">
                        <MoneyText amount={line.runningBalance} />
                      </TableCell>
                    </TableRow>
                  ))}

                  {/* Total Summary Row */}
                  <TableRow className="border-t-2 border-border/60 bg-muted/20 font-bold">
                    <TableCell colSpan={4} className="pl-6 text-foreground text-xs py-3">
                      TOTAL MUTASI & SALDO AKHIR ({ledgerData.accountCode} — {ledgerData.accountName})
                    </TableCell>
                    <TableCell className="text-right text-xs font-mono py-3">
                      <MoneyText amount={ledgerData.totalDebit} className="font-bold text-foreground" />
                    </TableCell>
                    <TableCell className="text-right text-xs font-mono py-3">
                      <MoneyText amount={ledgerData.totalCredit} className="font-bold text-foreground" />
                    </TableCell>
                    <TableCell className="text-right pr-6 text-xs font-mono font-extrabold text-foreground py-3">
                      <MoneyText amount={ledgerData.endingBalance} className="font-extrabold text-foreground" />
                    </TableCell>
                  </TableRow>
                </>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
