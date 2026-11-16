export interface TrialBalanceRow {
  accountId: number
  accountCode: string
  accountName: string
  accountType: "ASSET" | "LIABILITY" | "EQUITY" | "REVENUE" | "EXPENSE"
  normalBalance: "DEBIT" | "CREDIT"
  debitTotal: number | string
  creditTotal: number | string
  endingBalance: number | string
}

export interface TrialBalanceResponse {
  entityId: number
  periodId: number
  periodNo: number
  fiscalYear: number
  rows: TrialBalanceRow[]
  totalDebit: number | string
  totalCredit: number | string
  isBalanced: boolean
}

export interface GeneralLedgerLine {
  lineId: number
  journalId: number
  journalNo: string
  entryDate: string
  description: string
  memo: string
  debit: number | string
  credit: number | string
  runningBalance: number | string
}

export interface GeneralLedgerResponse {
  entityId: number
  periodId: number
  accountId: number
  accountCode: string
  accountName: string
  accountType: "ASSET" | "LIABILITY" | "EQUITY" | "REVENUE" | "EXPENSE"
  normalBalance: "DEBIT" | "CREDIT"
  beginningBalance: number | string
  lines: GeneralLedgerLine[]
  totalDebit: number | string
  totalCredit: number | string
  endingBalance: number | string
}
