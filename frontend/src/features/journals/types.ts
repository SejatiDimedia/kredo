export type JournalStatus = "DRAFT" | "SUBMITTED" | "APPROVED" | "POSTED" | "CANCELLED"
export type JournalSource = "MANUAL" | "IMPORT" | "REVERSAL" | "CLOSING" | "OPENING"

export interface JournalLineResponse {
  id: number
  lineNo: number
  accountId: number
  accountCode?: string
  accountName?: string
  debit: number
  credit: number
  memo: string | null
}

export interface JournalResponse {
  id: number
  entityId: number
  journalNo: string | null
  entryDate: string
  description: string
  source: JournalSource
  status: JournalStatus
  totalAmount: number
  createdBy: number
  postedAt: string | null
  lines: JournalLineResponse[]
}

export interface CreateJournalLineRequest {
  accountId: number
  debit: number
  credit: number
  memo?: string
}

export interface CreateJournalRequest {
  entryDate: string
  description: string
  periodId?: number
  source?: JournalSource
  lines: CreateJournalLineRequest[]
}
