import { create } from 'zustand'
import { Toast, ToastType } from '../components/Toast'

interface ToastStore {
  toasts: Toast[]
  showToast: (type: ToastType, message: string, duration?: number) => string
  removeToast: (id: string) => void
  success: (message: string, duration?: number) => string
  error: (message: string, duration?: number) => string
  info: (message: string, duration?: number) => string
  warning: (message: string, duration?: number) => string
}

let toastIdCounter = 0

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  showToast: (type, message, duration) => {
    const id = `toast-${++toastIdCounter}`
    const newToast: Toast = {
      id,
      type,
      message,
      duration,
    }
    set((state) => ({ toasts: [...state.toasts, newToast] }))
    return id
  },
  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) }))
  },
  success: (message, duration) => {
    return useToastStore.getState().showToast('success', message, duration)
  },
  error: (message, duration) => {
    return useToastStore.getState().showToast('error', message, duration)
  },
  info: (message, duration) => {
    return useToastStore.getState().showToast('info', message, duration)
  },
  warning: (message, duration) => {
    return useToastStore.getState().showToast('warning', message, duration)
  },
}))

