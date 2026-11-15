import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AppShell } from "@/components/layout/AppShell"
import { DashboardPage } from "@/features/dashboard/pages/DashboardPage"
import { CoaPage } from "@/features/coa/pages/CoaPage"
import { JournalsPage } from "@/features/journals/pages/JournalsPage"
import { JournalEditorPage } from "@/features/journals/pages/JournalEditorPage"
import { JournalDetailPage } from "@/features/journals/pages/JournalDetailPage"
import { ApprovalsPage } from "@/features/approvals/pages/ApprovalsPage"
import { PeriodsPage } from "@/features/periods/pages/PeriodsPage"
import { ReportsPage } from "@/features/reports/pages/ReportsPage"
import { GeneralLedgerPage } from "@/features/reports/pages/GeneralLedgerPage"
import { ImportsPage } from "@/features/imports/pages/ImportsPage"
import { AuditPage } from "@/features/audit/pages/AuditPage"
import { DesignSystemPage } from "@/features/design-system/pages/DesignSystemPage"
import { Toaster } from "sonner"
import { TooltipProvider } from "@/components/ui/tooltip"

export function App() {
  return (
    <TooltipProvider>
      <BrowserRouter>
        <Toaster position="top-right" richColors />
        <Routes>
          <Route path="/" element={<AppShell />}>
            <Route index element={<DashboardPage />} />
            <Route path="accounts" element={<CoaPage />} />
            <Route path="journals" element={<JournalsPage />} />
            <Route path="journals/new" element={<JournalEditorPage />} />
            <Route path="journals/:id" element={<JournalDetailPage />} />
            <Route path="approvals" element={<ApprovalsPage />} />
            <Route path="periods" element={<PeriodsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="reports/general-ledger" element={<GeneralLedgerPage />} />
            <Route path="imports" element={<ImportsPage />} />
            <Route path="audit" element={<AuditPage />} />
            <Route path="design-system" element={<DesignSystemPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  )
}

export default App
