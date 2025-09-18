import { SUPPORTED_CURRENCIES, type CurrencyCode } from "@/types"

/**
 * Format a price with currency symbol
 */
export function formatPrice(price: number | null, currency: CurrencyCode = "USD"): string {
  if (price === null || price === undefined) {
    return "Contact for pricing"
  }

  const currencyInfo = SUPPORTED_CURRENCIES.find((c) => c.code === currency)
  const symbol = currencyInfo?.symbol || "$"

  // Format the number with commas
  const formattedNumber = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price)

  return `${symbol}${formattedNumber}`
}

/**
 * Get currency symbol by code
 */
export function getCurrencySymbol(currency: CurrencyCode): string {
  const currencyInfo = SUPPORTED_CURRENCIES.find((c) => c.code === currency)
  return currencyInfo?.symbol || "$"
}

/**
 * Get currency name by code
 */
export function getCurrencyName(currency: CurrencyCode): string {
  const currencyInfo = SUPPORTED_CURRENCIES.find((c) => c.code === currency)
  return currencyInfo?.name || "US Dollar"
}

/**
 * Validate if a currency code is supported
 */
export function isSupportedCurrency(currency: string): currency is CurrencyCode {
  return SUPPORTED_CURRENCIES.some((c) => c.code === currency)
}
