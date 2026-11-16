export interface AuditLogItem {
  id: number
  entityId: number
  actorId: number
  actorName: string
  actorRole: string
  action: string
  targetType: string
  targetId: number | null
  detail: string
  ip: string
  correlationId: string
  occurredAt: string
  sealId: string
}

export interface AuditIntegrityResponse {
  isTamperFree: boolean
  totalRecords: number
  currentChainHash: string
  verifiedAt: string
  message: string
}

export interface DiscrepancyDetail {
  accountId: number
  accountCode: string
  accountName: string
  snapshotDebit: number | string
  recalculatedDebit: number | string
  debitDiff: number | string
  snapshotCredit: number | string
  recalculatedCredit: number | string
  creditDiff: number | string
}

export interface ReconciliationResponse {
  entityId: number
  periodId: number
  periodName: string
  isBalanced: boolean
  isInvariantMaintained: boolean
  totalRecalculatedDebit: number | string
  totalRecalculatedCredit: number | string
  totalSnapshotDebit: number | string
  totalSnapshotCredit: number | string
  totalAccountsAudited: number
  discrepancyCount: number
  discrepancies: DiscrepancyDetail[]
  systemStatus: "HEALTHY" | "DISCREPANCY_DETECTED"
  reconciledAt: string
  message: string
}
