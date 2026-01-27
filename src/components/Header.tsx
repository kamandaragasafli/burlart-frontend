import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, History, Zap, Sparkles } from 'lucide-react'
import { useCreditStore } from '../store/creditStore'
import { useAuthStore } from '../store/authStore'
import { useTranslation } from '../store/languageStore'
import { useSearchStore } from '../store/searchStore'
import UpgradeModal from './UpgradeModal'
import ProfileDropdown from './ProfileDropdown'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  const { credits } = useCreditStore()
  const { isAuthenticated, fetchProfile, isLoading } = useAuthStore()
  const { toggleSearch } = useSearchStore()
  const navigate = useNavigate()
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const t = useTranslation()

  // Profile is already fetched by App.tsx initializeAuth, no need to fetch here

  return (
    <>
      <header className="sticky top-0 z-50 bg-white dark:bg-dark-bg border-b border-gray-200 dark:border-dark-border">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Link to="/" className="flex items-center space-x-2 text-xl font-bold italic text-gray-900 dark:text-white">
                <Sparkles className="w-5 h-5 text-blue-400" />
                <span>Burlart</span>
              </Link>
              <nav className="hidden md:flex items-center space-x-4">
                <Link
                  to="/landing"
                  className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  {t('packages')}
                </Link>
                <Link
                  to="/documents"
                  className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  {t('documents') || 'Documents'}
                </Link>
                <Link
                  to="/create"
                  className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  {t('create')}
                </Link>
                <Link
                  to="/dashboard"
                  className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  {t('dashboard')}
                </Link>
                {isAuthenticated && (
                  <>
                    <Link
                      to="/jobs"
                      className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      {t('jobs')}
                    </Link>
                    <Link
                      to="/billing"
                      className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      {t('billing')}
                    </Link>
                  </>
                )}
              </nav>
            </div>

            <div className="flex items-center space-x-2">
              <ThemeToggle />
              
              {isAuthenticated ? (
                <>
                  <button 
                    onClick={() => {
                      // Navigate to dashboard if not already there
                      if (window.location.pathname !== '/dashboard') {
                        navigate('/dashboard')
                        // Small delay to ensure navigation completes before toggling
                        setTimeout(() => toggleSearch(), 100)
                      } else {
                        toggleSearch()
                      }
                    }}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-dark-hover rounded-lg transition-colors"
                    title={t('searchModels') || 'Search AI Models'}
                  >
                    <Search className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  </button>
                  <Link
                    to="/jobs"
                    className="p-2 hover:bg-gray-100 dark:hover:bg-dark-hover rounded-lg transition-colors"
                    title={t('jobs')}
                  >
                    <History className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  </Link>
                  <div className="flex items-center space-x-2 px-3 py-1.5 bg-gray-100 dark:bg-dark-card rounded-lg border border-gray-200 dark:border-dark-border">
                    <span className="text-xs text-gray-600 dark:text-gray-400">{t('credits')}:</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{credits}</span>
                  </div>
                  <button
                    onClick={() => setShowUpgradeModal(true)}
                    className="flex items-center space-x-2 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{t('upgrade')}</span>
                  </button>
                  <ProfileDropdown />
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-sm font-medium capitalize"
                  >
                    {t('login')}
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors capitalize"
                  >
                    {t('register')}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />
    </>
  )
}

