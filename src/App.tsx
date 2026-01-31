import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import Header from './components/Header'
import Home from './pages/Home'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import ToolPage from './pages/ToolPage'
import Create from './pages/Create'
import Templates from './pages/Templates'
import Settings from './pages/Settings'
import Documents from './pages/Documents'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Register from './pages/Register'
import MyJobs from './pages/MyJobs'
import Billing from './pages/Billing'
import Checkout from './pages/Checkout'
import CheckoutSuccess from './pages/CheckoutSuccess'
import CheckoutCancel from './pages/CheckoutCancel'
import { useThemeStore } from './store/themeStore'
import { useAuthStore } from './store/authStore'
import ToastContainer from './components/ToastContainer'
import { useToastStore } from './store/toastStore'
import { subscriptionAPI } from './services/api'

function AppContent() {
  const location = useLocation()
  const { theme } = useThemeStore()
  const { initializeAuth, isLoading, isAuthenticated } = useAuthStore()
  const { toasts, removeToast } = useToastStore()
  const hideHeader = location.pathname === '/login' || location.pathname === '/register'

  // Initialize auth on app start - only once
  useEffect(() => {
    initializeAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Empty deps - only run once on mount

  // Subscription check is handled in individual components that need it

  useEffect(() => {
    // Apply theme class to document element
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(theme)
  }, [theme])

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-dark-bg flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg transition-colors">
      {!hideHeader && <Header />}
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <Routes>
        {/* Show Landing as main entry. Old Home is kept on /home if needed */}
        <Route path="/" element={<Landing />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tool/:toolId" element={<ToolPage />} />
        <Route path="/create" element={<Create />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/jobs" element={<MyJobs />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/checkout/success" element={<CheckoutSuccess />} />
        <Route path="/checkout/cancel" element={<CheckoutCancel />} />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <HelmetProvider>
      <Router>
        <AppContent />
      </Router>
    </HelmetProvider>
  )
}

export default App

