import { create } from 'zustand';
import { authAPI } from '../services/api';
import { useCreditStore } from './creditStore';

interface User {
  id: number;
  email: string;
  credits: number;
  language: string;
  theme: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchProfile: () => Promise<void>;
  updateCredits: (credits: number) => void;
  initializeAuth: () => Promise<void>;
}

// Request deduplication - prevent multiple simultaneous profile requests
let profileFetchPromise: Promise<void> | null = null;
let lastProfileFetch: number = 0;
const PROFILE_CACHE_TTL = 2000; // 2 seconds cache

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  
  login: async (email: string, password: string) => {
    const data = await authAPI.login(email, password);
    localStorage.setItem('access_token', data.tokens.access);
    localStorage.setItem('refresh_token', data.tokens.refresh);
    set({ user: data.user, isAuthenticated: true, isLoading: false });
    
    // Sync credits with creditStore
    useCreditStore.getState().credits = data.user.credits;
  },

  loginWithGoogle: async (idToken: string) => {
    const data = await authAPI.loginWithGoogle(idToken);
    localStorage.setItem('access_token', data.tokens.access);
    localStorage.setItem('refresh_token', data.tokens.refresh);
    set({ user: data.user, isAuthenticated: true, isLoading: false });

    // Sync credits with creditStore
    useCreditStore.getState().credits = data.user.credits;
  },
  
  register: async (email: string, password: string) => {
    const data = await authAPI.register(email, password);
    localStorage.setItem('access_token', data.tokens.access);
    localStorage.setItem('refresh_token', data.tokens.refresh);
    set({ user: data.user, isAuthenticated: true, isLoading: false });
    
    // Sync credits with creditStore
    useCreditStore.getState().credits = data.user.credits;
  },
  
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    set({ user: null, isAuthenticated: false, isLoading: false });
    
    // Reset credits
    useCreditStore.getState().credits = 0;
  },
  
  fetchProfile: async () => {
    // Check cache TTL - don't fetch if recently fetched
    const now = Date.now();
    if (now - lastProfileFetch < PROFILE_CACHE_TTL) {
      console.log('[authStore] Skipping profile fetch (cached)')
      return; // Skip fetch if within cache window
    }
    
    // If a profile fetch is already in progress, wait for it
    if (profileFetchPromise) {
      console.log('[authStore] Profile fetch already in progress, waiting...')
      return profileFetchPromise;
    }
    
    console.log('[authStore] Fetching profile from API')
    // Update last fetch timestamp
    lastProfileFetch = now;
    
    // Create new fetch promise
    profileFetchPromise = (async () => {
      try {
        const user = await authAPI.getProfile();
        set({ user, isAuthenticated: true, isLoading: false });
        
        // Sync credits with creditStore
        const { useCreditStore } = await import('./creditStore');
        useCreditStore.getState().credits = user.credits;
      } catch (error) {
        set({ user: null, isAuthenticated: false, isLoading: false });
      } finally {
        // Clear promise after completion
        profileFetchPromise = null;
      }
    })();
    
    return profileFetchPromise;
  },
  
  updateCredits: (credits: number) => {
    set((state) => ({
      user: state.user ? { ...state.user, credits } : null,
    }));
    
    // Sync credits with creditStore
    useCreditStore.getState().credits = credits;
  },
  
  initializeAuth: async () => {
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      set({ isLoading: false, isAuthenticated: false, user: null });
      return;
    }
    
    // Use fetchProfile to benefit from request deduplication
    try {
      await get().fetchProfile();
    } catch (error) {
      // Token is invalid, clear it
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));

