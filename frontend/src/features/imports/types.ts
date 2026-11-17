export type ImportStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED"

export interface ImportErrorDetail {
  journalRef: string
  lineNo: number
  accountCode: string
  reason: string
}

export interface ImportJobResponse {
  id: number
  entityId: number
  fileName: string
  fileHash: string
  totalRows: number
  processedRows: number
  successCount: number
  failureCount: number
  status: ImportStatus
  errors: ImportErrorDetail[]
  createdBy: number
  createdAt: string
  completedAt: string | null
  message?: string
}
