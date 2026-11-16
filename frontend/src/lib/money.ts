import Decimal from "decimal.js"

// Configure Decimal.js for banking/accounting precision
Decimal.set({
  precision: 28,
  rounding: Decimal.ROUND_HALF_UP,
  toExpNeg: -7,
  toExpPos: 21,
})

export type MoneyInput = string | number | Decimal

/**
 * Safely parse any input into a Decimal instance.
 * Throws an Error if input has more than 2 decimal places when strict is true.
 */
export function toDecimal(val: MoneyInput, strict = false): Decimal {
  if (val instanceof Decimal) return val
  if (typeof val === "number") {
    val = val.toString()
  }

  // Sanitize string (remove spaces)
  const cleanStr = (val || "0").trim()

  if (strict) {
    const parts = cleanStr.split(".")
    if (parts.length > 1 && parts[1].length > 2) {
      throw new Error("Nominal uang tidak boleh memiliki lebih dari 2 angka desimal.")
    }
  }

  try {
    return new Decimal(cleanStr)
  } catch {
    return new Decimal(0)
  }
}

/**
 * Format currency to Indonesian Rupiah standard (id-ID)
 * Options:
 * - showPrefix: whether to prepend "Rp " (default: true)
 * - accountingNegative: whether negative numbers appear in parentheses (1.250.000,00) (default: true)
 */
export function formatMoney(
  amount: MoneyInput,
  options: {
    showPrefix?: boolean
    accountingNegative?: boolean
  } = {}
): string {
  const { showPrefix = true, accountingNegative = true } = options
  const dec = toDecimal(amount)
  const isNegative = dec.isNegative()
  const absDec = dec.abs()

  // Format integer and fraction parts
  const parts = absDec.toFixed(2).split(".")
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  const decimalPart = parts[1] || "00"

  const formattedAbs = `${integerPart},${decimalPart}`
  const prefix = showPrefix ? "Rp " : ""

  if (isNegative) {
    if (accountingNegative) {
      return `(${prefix}${formattedAbs})`
    }
    return `-${prefix}${formattedAbs}`
  }

  return `${prefix}${formattedAbs}`
}

/**
 * Validate money string input:
 * - Must be a valid positive or negative number
 * - Max 2 decimal digits
 */
export function isValidMoneyString(val: string): boolean {
  if (!val || val.trim() === "") return false
  // Check format: optional negative, digits, optional decimal with up to 2 places
  const regex = /^-?\d+(\.\d{1,2})?$/
  return regex.test(val.trim())
}
