import { create } from 'zustand'

export type SubscriptionPlan = 'demo' | 'starter' | 'pro' | 'agency' | null

export interface Subscription {
  plan: SubscriptionPlan
  startDate: Date | null
  nextRenewalDate: Date | null
  autoRenew: boolean
}

interface SubscriptionStore {
  subscription: Subscription
  setSubscription: (plan: SubscriptionPlan, autoRenew?: boolean) => void
  cancelSubscription: () => void
  toggleAutoRenew: () => void
}

export const useSubscriptionStore = create<SubscriptionStore>((set) => ({
  subscription: {
    plan: null,
    startDate: null,
    nextRenewalDate: null,
    autoRenew: true,
  },
  setSubscription: (plan, autoRenew = true) => {
    const now = new Date()
    const nextMonth = new Date(now)
    // Demo paket üçün daha qısa müddət (məs: 7 gün), digərləri üçün 1 ay
    if (plan === 'demo') {
      nextMonth.setDate(nextMonth.getDate() + 7)
    } else {
      nextMonth.setMonth(nextMonth.getMonth() + 1)
    }

    set({
      subscription: {
        plan,
        startDate: now,
        nextRenewalDate: nextMonth,
        autoRenew: autoRenew ?? true,
      },
    })
  },
  cancelSubscription: () =>
    set({
      subscription: {
        plan: null,
        startDate: null,
        nextRenewalDate: null,
        autoRenew: false,
      },
    }),
  toggleAutoRenew: () =>
    set((state) => ({
      subscription: {
        ...state.subscription,
        autoRenew: !state.subscription.autoRenew,
      },
    })),
}))

