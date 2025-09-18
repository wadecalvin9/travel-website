import type { AccountType, AccountTypeFeatures } from "@/types"

export const ACCOUNT_TYPE_FEATURES: Record<AccountType, AccountTypeFeatures> = {
  standard: {
    directBooking: false,
    accommodationBooking: false,
    prioritySupport: false,
    discounts: 0,
    advancedFeatures: false,
  },
  premium: {
    directBooking: true,
    accommodationBooking: true,
    prioritySupport: true,
    discounts: 5,
    advancedFeatures: true,
  },
  vip: {
    directBooking: true,
    accommodationBooking: true,
    prioritySupport: true,
    discounts: 10,
    advancedFeatures: true,
  },
}

export function getAccountTypeFeatures(accountType: AccountType = "standard"): AccountTypeFeatures {
  return ACCOUNT_TYPE_FEATURES[accountType]
}

export function canUserDirectBook(accountType: AccountType = "standard"): boolean {
  return getAccountTypeFeatures(accountType).directBooking
}

export function canUserBookAccommodation(accountType: AccountType = "standard"): boolean {
  return getAccountTypeFeatures(accountType).accommodationBooking
}

export function getUserDiscount(accountType: AccountType = "standard"): number {
  return getAccountTypeFeatures(accountType).discounts
}

export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  standard: "Standard",
  premium: "Premium",
  vip: "VIP",
}

export const ACCOUNT_TYPE_DESCRIPTIONS: Record<AccountType, string> = {
  standard: "Basic inquiry-based booking",
  premium: "Direct booking with accommodation options",
  vip: "All premium features plus priority support and higher discounts",
}
