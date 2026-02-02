import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, History, Zap, Sparkles, Menu, X } from 'lucide-react'
import { useCreditStore } from '../store/creditStore'
import { useAuthStore } from '../store/authStore'
import { useTranslation } from '../store/languageStore'
import { useSearchStore } from '../store/searchStore'
import UpgradeModal from './UpgradeModal'
import ProfileDropdown from './ProfileDropdown'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  const { credits } = useCreditStore()
  const { isAuthenticated } = useAuthStore()
  const { toggleSearch } = useSearchStore()
  const navigate = useNavigate()
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const t = useTranslation()

  return (
    <>
      <header className="sticky top-0 z-50 bg-white dark:bg-dark-bg border-b border-gray-200 dark:border-dark-border">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 py-2 sm:py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 sm:space-x-4 md:space-x-6">
              <Link to="/" className="flex items-center space-x-1.5 sm:space-x-2 text-lg sm:text-xl font-bold italic text-gray-900 dark:text-white">
                <img 
                  src="/burlart-logo.png" 
                  alt="Burlart Logo" 
                  className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
                  onError={(e) => {
                    // Fallback to icon if logo fails to load
                    e.currentTarget.style.display = 'none'
                    const fallback = e.currentTarget.nextElementSibling as HTMLElement
                    if (fallback) fallback.style.display = 'block'
                  }}
                />
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 hidden" />
                <span>Burlart</span>
              </Link>
              <nav className="hidden md:flex items-center space-x-3 lg:space-x-4">
                <Link
                  to="/landing"
                  className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  {t('packages')}
                </Link>
                <Link
                  to="/create"
                  className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  {t('create')}
                </Link>
                {isAuthenticated && (
                  <Link
                    to="/jobs"
                    className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    {t('jobs')}
                  </Link>
                )}
                <Link
                  to="/about"
                  className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  {t('about') || 'About'}
                </Link>
                <Link
                  to="/documents"
                  className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  {t('documents') || 'Documents'}
                </Link>
                {isAuthenticated && (
                  <Link
                    to="/billing"
                    className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    {t('billing')}
                  </Link>
                )}
              </nav>
            </div>

            <div className="flex items-center space-x-1 sm:space-x-2">
              <ThemeToggle />
              
              {isAuthenticated ? (
                <>
                  <button 
                    onClick={() => {
                      // Navigate to create if not already there
                      if (window.location.pathname !== '/create') {
                        navigate('/create')
                        // Small delay to ensure navigation completes before toggling
                        setTimeout(() => toggleSearch(), 100)
                      } else {
                        toggleSearch()
                      }
                    }}
                    className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-dark-hover rounded-lg transition-colors"
                    title={t('searchModels') || 'Search AI Models'}
                  >
                    <Search className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  </button>
                  <Link
                    to="/jobs"
                    className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-dark-hover rounded-lg transition-colors hidden sm:block"
                    title={t('jobs')}
                  >
                    <History className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  </Link>
                  <div className="hidden sm:flex items-center space-x-1.5 sm:space-x-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-100 dark:bg-dark-card rounded-lg border border-gray-200 dark:border-dark-border">
                    <span className="text-xs text-gray-600 dark:text-gray-400">{t('credits')}:</span>
                    <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">{credits}</span>
                  </div>
                  <button
                    onClick={() => setShowUpgradeModal(true)}
                    className="hidden sm:flex items-center space-x-1.5 sm:space-x-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs sm:text-sm font-medium transition-colors"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span className="hidden lg:inline">{t('upgrade')}</span>
                  </button>
                  <ProfileDropdown />
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-xs sm:text-sm font-medium capitalize"
                  >
                    {t('login')}
                  </Link>
                  <Link
                    to="/register"
                    className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs sm:text-sm font-medium transition-colors capitalize"
                  >
                    {t('register')}
                  </Link>
                </>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-dark-hover rounded-lg transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-3 pt-3 border-t border-gray-200 dark:border-dark-border">
              <nav className="flex flex-col space-y-2">
                <Link
                  to="/landing"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-dark-hover rounded-lg transition-colors"
                >
                  {t('packages')}
                </Link>
                <Link
                  to="/create"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-dark-hover rounded-lg transition-colors"
                >
                  {t('create')}
                </Link>
                {isAuthenticated && (
                  <>
                    <Link
                      to="/jobs"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-dark-hover rounded-lg transition-colors"
                    >
                      {t('jobs')}
                    </Link>
                    <div className="flex items-center justify-between px-3 py-2 bg-gray-100 dark:bg-dark-card rounded-lg">
                      <span className="text-xs text-gray-600 dark:text-gray-400">{t('credits')}:</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{credits}</span>
                    </div>
                    <button
                      onClick={() => {
                        setShowUpgradeModal(true)
                        setMobileMenuOpen(false)
                      }}
                      className="flex items-center justify-center space-x-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      <Zap className="w-4 h-4" />
                      <span>{t('upgrade')}</span>
                    </button>
                  </>
                )}
                <Link
                  to="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-dark-hover rounded-lg transition-colors"
                >
                  {t('about') || 'About'}
                </Link>
                <Link
                  to="/documents"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-dark-hover rounded-lg transition-colors"
                >
                  {t('documents') || 'Documents'}
                </Link>
                {isAuthenticated && (
                  <Link
                    to="/billing"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-dark-hover rounded-lg transition-colors"
                  >
                    {t('billing')}
                  </Link>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />
    </>
  )
}

