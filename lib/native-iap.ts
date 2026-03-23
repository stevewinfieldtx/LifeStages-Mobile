/**
 * Native In-App Purchases Bridge
 *
 * Uses @capgo/capacitor-purchases for StoreKit 2 (iOS)
 * and Google Play Billing (Android).
 *
 * Falls back gracefully when running in web browser (dev mode).
 */

import { isNative, getPlatform } from "./native-features"

// Product IDs — must match App Store Connect / Google Play Console
export const PRODUCT_IDS = {
  MONTHLY: "com.lifestagesai.bible.premium.monthly",
  YEARLY: "com.lifestagesai.bible.premium.yearly",
} as const

export type SubscriptionStatus =
  | "active"
  | "trialing"
  | "expired"
  | "canceled"
  | "none"

export interface IAPProduct {
  id: string
  title: string
  description: string
  price: string // Localized price string from the store (e.g. "$4.99")
  priceAmount: number
  currency: string
  period: "monthly" | "yearly"
}

export interface IAPSubscriptionInfo {
  status: SubscriptionStatus
  productId: string | null
  expiresAt: number | null // timestamp
  isTrialing: boolean
  willRenew: boolean
}

// ============================================
// Initialize Store
// ============================================

let storeReady = false

export async function initializeIAP(): Promise<boolean> {
  if (!isNative()) {
    console.log("[IAP] Not native — skipping init")
    return false
  }

  if (storeReady) return true

  try {
    const { InAppPurchases } = await import("@capgo/capacitor-purchases")

    const platform = getPlatform()
    if (platform === "ios") {
      // Apple App Store — no API key needed for StoreKit 2
      await InAppPurchases.initialize({})
    } else if (platform === "android") {
      // Google Play — uses the app's own billing key from Play Console
      await InAppPurchases.initialize({})
    }

    storeReady = true
    console.log("[IAP] Store initialized")
    return true
  } catch (e) {
    console.error("[IAP] Failed to initialize:", e)
    return false
  }
}

// ============================================
// Load Products
// ============================================

export async function getProducts(): Promise<IAPProduct[]> {
  if (!isNative()) {
    // Return mock products for web dev
    return [
      {
        id: PRODUCT_IDS.MONTHLY,
        title: "Premium Monthly",
        description: "Full access to all features",
        price: "$4.99",
        priceAmount: 4.99,
        currency: "USD",
        period: "monthly",
      },
      {
        id: PRODUCT_IDS.YEARLY,
        title: "Premium Yearly",
        description: "Full access — save 25%",
        price: "$44.99",
        priceAmount: 44.99,
        currency: "USD",
        period: "yearly",
      },
    ]
  }

  try {
    const { InAppPurchases } = await import("@capgo/capacitor-purchases")
    const result = await InAppPurchases.getProducts({
      productIds: [PRODUCT_IDS.MONTHLY, PRODUCT_IDS.YEARLY],
    })

    return (result.products || []).map((p: any) => ({
      id: p.productId || p.id,
      title: p.title || (p.productId?.includes("yearly") ? "Premium Yearly" : "Premium Monthly"),
      description: p.description || "Full access to all features",
      price: p.localizedPrice || p.price || "$4.99",
      priceAmount: p.priceAmount || parseFloat(String(p.price || "4.99").replace(/[^0-9.]/g, "")),
      currency: p.currency || "USD",
      period: (p.productId || p.id || "").includes("yearly") ? "yearly" as const : "monthly" as const,
    }))
  } catch (e) {
    console.error("[IAP] Failed to load products:", e)
    return []
  }
}

// ============================================
// Purchase
// ============================================

export async function purchaseProduct(productId: string): Promise<boolean> {
  if (!isNative()) {
    console.log("[IAP] Web mode — simulating purchase of:", productId)
    // In dev, simulate success
    localStorage.setItem("iap_mock_status", JSON.stringify({
      status: "trialing",
      productId,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
      isTrialing: true,
      willRenew: true,
    }))
    return true
  }

  try {
    const { InAppPurchases } = await import("@capgo/capacitor-purchases")
    const result = await InAppPurchases.purchaseProduct({ productId })

    if (result.transactionId) {
      console.log("[IAP] Purchase successful:", result.transactionId)

      // Send receipt to our server for validation
      await validateReceipt(result.receipt || result.transactionId)
      return true
    }

    return false
  } catch (e: any) {
    if (e?.code === "USER_CANCELLED" || e?.message?.includes("cancel")) {
      console.log("[IAP] User cancelled purchase")
      return false
    }
    console.error("[IAP] Purchase failed:", e)
    throw e
  }
}

// ============================================
// Restore Purchases
// ============================================

export async function restorePurchases(): Promise<IAPSubscriptionInfo> {
  const noSub: IAPSubscriptionInfo = {
    status: "none",
    productId: null,
    expiresAt: null,
    isTrialing: false,
    willRenew: false,
  }

  if (!isNative()) {
    // Check mock status for dev
    const mock = localStorage.getItem("iap_mock_status")
    if (mock) return JSON.parse(mock)
    return noSub
  }

  try {
    const { InAppPurchases } = await import("@capgo/capacitor-purchases")
    const result = await InAppPurchases.restorePurchases()

    if (result.activeSubscriptions && result.activeSubscriptions.length > 0) {
      const sub = result.activeSubscriptions[0]
      return {
        status: sub.isTrialPeriod ? "trialing" : "active",
        productId: sub.productId,
        expiresAt: sub.expiresDate ? new Date(sub.expiresDate).getTime() : null,
        isTrialing: !!sub.isTrialPeriod,
        willRenew: !sub.willAutoRenew === false,
      }
    }

    return noSub
  } catch (e) {
    console.error("[IAP] Restore failed:", e)
    return noSub
  }
}

// ============================================
// Check Current Subscription
// ============================================

export async function getSubscriptionInfo(): Promise<IAPSubscriptionInfo> {
  const noSub: IAPSubscriptionInfo = {
    status: "none",
    productId: null,
    expiresAt: null,
    isTrialing: false,
    willRenew: false,
  }

  if (!isNative()) {
    const mock = localStorage.getItem("iap_mock_status")
    if (mock) {
      const parsed = JSON.parse(mock)
      // Check if mock trial expired
      if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
        localStorage.removeItem("iap_mock_status")
        return noSub
      }
      return parsed
    }
    return noSub
  }

  try {
    // Try restore to get current status
    return await restorePurchases()
  } catch (e) {
    console.error("[IAP] Failed to get subscription info:", e)
    return noSub
  }
}

// ============================================
// Receipt Validation (server-side)
// ============================================

async function validateReceipt(receipt: string): Promise<boolean> {
  try {
    const { apiUrl } = await import("./api-base")
    const response = await fetch(apiUrl("/api/iap/validate"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        receipt,
        platform: getPlatform(),
        email: getStoredEmail(),
      }),
    })

    if (response.ok) {
      const data = await response.json()
      return data.valid === true
    }

    return false
  } catch (e) {
    console.error("[IAP] Receipt validation failed:", e)
    // Don't block the user — Apple's receipt is the source of truth
    return true
  }
}

function getStoredEmail(): string | null {
  try {
    return localStorage.getItem("bible_user_email")
  } catch {
    return null
  }
}
