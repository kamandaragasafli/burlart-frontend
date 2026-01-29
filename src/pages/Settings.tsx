import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Globe, Bell, Moon, Sun, Shield, CreditCard, Palette, History, Package } from 'lucide-react'
import {
  useLanguageStore,
  useTranslation,
  Language,
} from '../store/languageStore'
import { useThemeStore } from '../store/themeStore'
import SEO from '../components/SEO'
import ModernBackground from '../components/ModernBackground'

export default function Settings() {
  const navigate = useNavigate()
  const { language, setLanguage } = useLanguageStore()
  const { theme, setTheme } = useThemeStore()
  const t = useTranslation()
  const [notifications, setNotifications] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)

  const languages: { code: Language; name: string }[] = [
    { code: 'en', name: t('english') },
    { code: 'az', name: t('azerbaijani') },
    { code: 'ru', name: t('russian') },
  ]

  return (
    <ModernBackground>
      <SEO 
        title="Tənzimləmələr"
        description="Hesab tənzimləmələri, dil və tema seçimləri"
        url="https://timera.ai/settings"
      />
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('settings')}</span>
        </button>

        <div className="space-y-6">
          {/* Language Settings */}
          <div className="bg-gray-100 dark:bg-dark-card rounded-lg border border-gray-200 dark:border-dark-border p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Globe className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t('language')}
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              {t('selectLanguage')}
            </p>
            <div className="space-y-2 mb-6">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
                    language === lang.code
                      ? 'bg-blue-500/20 border-blue-500 text-gray-900 dark:text-white'
                      : 'bg-white dark:bg-dark-hover border-gray-200 dark:border-dark-border text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{lang.name}</span>
                    {language === lang.code && (
                      <span className="text-blue-400">✓</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
            
            {/* Quick Links */}
            <div className="border-t border-gray-200 dark:border-dark-border pt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{t('quickLinks')}:</p>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/landing"
                  className="flex items-center space-x-2 px-3 py-2 bg-white dark:bg-dark-hover border border-gray-200 dark:border-dark-border rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm"
                >
                  <Package className="w-4 h-4" />
                  <span>{t('packages')}</span>
                </Link>
                <Link
                  to="/jobs"
                  className="flex items-center space-x-2 px-3 py-2 bg-white dark:bg-dark-hover border border-gray-200 dark:border-dark-border rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm"
                >
                  <History className="w-4 h-4" />
                  <span>{t('jobs')}</span>
                </Link>
                <Link
                  to="/billing"
                  className="flex items-center space-x-2 px-3 py-2 bg-white dark:bg-dark-hover border border-gray-200 dark:border-dark-border rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>{t('billing')}</span>
                </Link>
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 px-3 py-2 bg-white dark:bg-dark-hover border border-gray-200 dark:border-dark-border rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm"
                >
                  <Globe className="w-4 h-4" />
                  <span>{t('dashboard')}</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Notifications Settings */}
          <div className="bg-gray-100 dark:bg-dark-card rounded-lg border border-gray-200 dark:border-dark-border p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Bell className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t('notifications')}
              </h2>
            </div>
            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <div className="text-gray-900 dark:text-white font-medium">{t('enableNotifications')}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {t('receiveSystemNotifications')}
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 dark:border-dark-border bg-white dark:bg-dark-card text-blue-500 focus:ring-blue-500 focus:ring-2"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <div className="text-gray-900 dark:text-white font-medium">{t('emailNotifications')}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {t('receiveEmailNotifications')}
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 dark:border-dark-border bg-white dark:bg-dark-card text-blue-500 focus:ring-blue-500 focus:ring-2"
                />
              </label>
            </div>
          </div>

          {/* Appearance Settings */}
          <div className="bg-gray-100 dark:bg-dark-card rounded-lg border border-gray-200 dark:border-dark-border p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Palette className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t('theme')}
              </h2>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => setTheme('dark')}
                className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all flex items-center justify-between ${
                  theme === 'dark'
                    ? 'bg-blue-500/10 dark:bg-blue-500/20 border-blue-500 text-white'
                    : 'bg-white dark:bg-dark-hover border-gray-300 dark:border-dark-border text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Moon className={`w-5 h-5 ${theme === 'dark' ? 'text-blue-400' : 'text-gray-600 dark:text-gray-400'}`} />
                  <div>
                    <div className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{t('darkMode')}</div>
                    <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}`}>{t('darkTheme')}</div>
                  </div>
                </div>
                {theme === 'dark' && (
                  <span className="text-blue-400 font-bold">✓</span>
                )}
              </button>
              <button
                onClick={() => setTheme('light')}
                className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all flex items-center justify-between ${
                  theme === 'light'
                    ? 'bg-blue-500/10 dark:bg-blue-500/20 border-blue-500 text-white'
                    : 'bg-white dark:bg-dark-hover border-gray-300 dark:border-dark-border text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Sun className={`w-5 h-5 ${theme === 'light' ? 'text-blue-400' : 'text-gray-600 dark:text-gray-400'}`} />
                  <div>
                    <div className={`font-medium ${theme === 'light' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{t('lightMode')}</div>
                    <div className={`text-sm ${theme === 'light' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}`}>{t('lightTheme')}</div>
                  </div>
                </div>
                {theme === 'light' && (
                  <span className="text-blue-400 font-bold">✓</span>
                )}
              </button>
            </div>
          </div>

          {/* Account Settings */}
          <div className="bg-gray-100 dark:bg-dark-card rounded-lg border border-gray-200 dark:border-dark-border p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t('account')}
              </h2>
            </div>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 bg-white dark:bg-dark-hover border border-gray-200 dark:border-dark-border rounded-lg text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                {t('changePassword')}
              </button>
              <button className="w-full text-left px-4 py-3 bg-white dark:bg-dark-hover border border-gray-200 dark:border-dark-border rounded-lg text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                {t('changeEmail')}
              </button>
            </div>
          </div>

          {/* Billing Settings */}
          <div className="bg-gray-100 dark:bg-dark-card rounded-lg border border-gray-200 dark:border-dark-border p-6">
            <div className="flex items-center space-x-3 mb-4">
              <CreditCard className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t('payment')}</h2>
            </div>
            <div className="space-y-3">
              <Link
                to="/billing"
                className="block w-full text-left px-4 py-3 bg-white dark:bg-dark-hover border border-gray-200 dark:border-dark-border rounded-lg text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {t('billing')}
              </Link>
              <button className="w-full text-left px-4 py-3 bg-white dark:bg-dark-hover border border-gray-200 dark:border-dark-border rounded-lg text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                {t('managePaymentMethods')}
              </button>
              <button className="w-full text-left px-4 py-3 bg-white dark:bg-dark-hover border border-gray-200 dark:border-dark-border rounded-lg text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                {t('accountInvoice')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </ModernBackground>
  )
}

