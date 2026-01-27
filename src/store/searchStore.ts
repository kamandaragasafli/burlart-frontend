import { create } from 'zustand'

interface SearchStore {
  showSearch: boolean
  toggleSearch: () => void
  setShowSearch: (show: boolean) => void
}

export const useSearchStore = create<SearchStore>((set) => ({
  showSearch: false,
  toggleSearch: () => set((state) => ({ showSearch: !state.showSearch })),
  setShowSearch: (show) => set({ showSearch: show }),
}))

