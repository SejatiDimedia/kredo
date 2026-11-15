import * as React from "react"
import { formatMoney, toDecimal, type MoneyInput } from "@/lib/money"
import { cn } from "cn"

export interface MoneyTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  amount: MoneyInput
  showPrefix?: boolean
  accountingNegative?: boolean
  highlightNegative?: boolean
  highlightPositive?: boolean
}

export function MoneyText({
  amount,
  showPrefix = true,
  accountingNegative = true,
  highlightNegative = false,
  highlightPositive = false,
  className,
  ...props
}: MoneyTextProps) {
  const dec = React.useMemo(() => toDecimal(amount), [amount])
  const formatted = React.useMemo(
    () => formatMoney(dec, { showPrefix, accountingNegative }),
    [dec, showPrefix, accountingNegative]
  )

  const isNegative = dec.isNegative()
  const isPositive = dec.isPositive() && !dec.isZero()

  return (
    <span
      data-slot="money-text"
      className={cn(
        "font-mono tabular-nums text-right font-medium",
        isNegative && highlightNegative && "text-destructive",
        isPositive && highlightPositive && "text-emerald-600 dark:text-emerald-400",
        className
      )}
      {...props}
    >
      {formatted}
    </span>
  )
}
