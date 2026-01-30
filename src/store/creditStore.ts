import { create } from 'zustand'

interface CreditStore {
  credits: number
  addCredits: (amount: number) => void
  deductCredits: (amount: number) => void
  hasEnoughCredits: (amount: number) => boolean
}

export const useCreditStore = create<CreditStore>((set, get) => ({
  credits: 0, // Initial credits (will be updated from API after login)
  addCredits: (amount) => set((state) => ({ credits: state.credits + amount })),
  deductCredits: (amount) =>
    set((state) => ({ credits: Math.max(0, state.credits - amount) })),
  hasEnoughCredits: (amount) => get().credits >= amount,
}))

