import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface FavoritesStore {
  favoriteTools: string[]
  recentlyUsed: string[]
  addFavorite: (toolId: string) => void
  removeFavorite: (toolId: string) => void
  addRecentlyUsed: (toolId: string) => void
  isFavorite: (toolId: string) => boolean
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favoriteTools: [],
      recentlyUsed: [],
      addFavorite: (toolId) =>
        set((state) => ({
          favoriteTools: state.favoriteTools.includes(toolId)
            ? state.favoriteTools
            : [...state.favoriteTools, toolId],
        })),
      removeFavorite: (toolId) =>
        set((state) => ({
          favoriteTools: state.favoriteTools.filter((id) => id !== toolId),
        })),
      addRecentlyUsed: (toolId) =>
        set((state) => {
          const filtered = state.recentlyUsed.filter((id) => id !== toolId)
          return {
            recentlyUsed: [toolId, ...filtered].slice(0, 10), // Keep last 10
          }
        }),
      isFavorite: (toolId) => get().favoriteTools.includes(toolId),
    }),
    {
      name: 'favorites-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

