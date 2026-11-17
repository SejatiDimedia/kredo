import Decimal from "decimal.js"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoneyText } from "@/components/shared/MoneyText"
import { CheckCircle2, AlertTriangle, Plus, Save, Send } from "lucide-react"
import { cn } from "cn"

export interface BalanceBarProps {
  totalDebit: Decimal
  totalCredit: Decimal
  onAddBalancingLine?: (amount: Decimal, side: "DEBIT" | "CREDIT") => void
  onSaveDraft?: () => void
  onSubmit?: () => void
  isSubmitting?: boolean
  className?: string
}

export function BalanceBar({
  totalDebit,
  totalCredit,
  onAddBalancingLine,
  onSaveDraft,
  onSubmit,
  isSubmitting = false,
  className,
}: BalanceBarProps) {
  const diff = totalDebit.minus(totalCredit).abs()
  const isZero = totalDebit.isZero() && totalCredit.isZero()
  const isBalanced = totalDebit.equals(totalCredit) && !isZero
  const sideToBalance: "DEBIT" | "CREDIT" = totalDebit.greaterThan(totalCredit) ? "CREDIT" : "DEBIT"

  return (
    <div
      className={cn(
        "sticky bottom-0 z-30 w-full border-t bg-card/95 backdrop-blur-md px-6 py-3 shadow-md transition-all duration-200",
        isBalanced
          ? "border-teal-500/30 bg-teal-500/[0.04]"
          : !isZero
            ? "border-rose-500/30 bg-rose-500/[0.04]"
            : "border-border/60",
        className
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Left: Financial Totals */}
        <div className="flex flex-wrap items-center gap-6 text-xs">
          <div>
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block">
              Total Debit
            </span>
            <div className="font-mono text-base font-bold text-foreground tabular-nums">
              <MoneyText amount={totalDebit} />
            </div>
          </div>

          <span className="text-muted-foreground font-light text-base hidden sm:inline">−</span>

          <div>
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block">
              Total Kredit
            </span>
            <div className="font-mono text-base font-bold text-foreground tabular-nums">
              <MoneyText amount={totalCredit} />
            </div>
          </div>

          <span className="text-muted-foreground font-light text-base hidden sm:inline">=</span>

          <div>
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block">
              Selisih (Variance)
            </span>
            <div
              className={cn(
                "font-mono text-base font-bold tabular-nums",
                isBalanced
                  ? "text-emerald-700 dark:text-emerald-400"
                  : !isZero
                    ? "text-rose-700 dark:text-rose-400 font-extrabold"
                    : "text-muted-foreground"
              )}
            >
              <MoneyText amount={diff} />
            </div>
          </div>

          {/* Balance Status Badge */}
          <div className="flex items-center">
            {isBalanced ? (
              <Badge variant="success" size="lg" className="gap-1.5 font-semibold">
                <CheckCircle2 className="size-3.5" />
                Seimbang
              </Badge>
            ) : !isZero ? (
              <Badge variant="destructive" size="lg" className="gap-1.5 font-semibold">
                <AlertTriangle className="size-3.5" />
                Selisih Pembukuan
              </Badge>
            ) : (
              <Badge variant="secondary" size="lg" className="font-medium">
                Belum Ada Nominal
              </Badge>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5">
          {!isBalanced && !isZero && onAddBalancingLine && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onAddBalancingLine(diff, sideToBalance)}
              className="border-rose-500/40 text-rose-700 dark:text-rose-400 hover:bg-rose-500/10 text-xs gap-1.5"
            >
              <Plus className="size-3.5" />
              Baris Penyeimbang ({sideToBalance})
            </Button>
          )}

          {onSaveDraft && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onSaveDraft}
              className="text-xs gap-1.5"
            >
              <Save className="size-3.5" />
              Simpan Draf
            </Button>
          )}

          {onSubmit && (
            <Button
              type="button"
              size="sm"
              disabled={!isBalanced || isSubmitting}
              onClick={onSubmit}
              className="text-xs gap-1.5 font-semibold"
            >
              <Send className="size-3.5" />
              Ajukan Jurnal
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
