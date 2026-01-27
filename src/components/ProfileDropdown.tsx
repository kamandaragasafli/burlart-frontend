import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Settings, LogOut, ChevronDown, History, CreditCard } from 'lucide-react'
import { useTranslation } from '../store/languageStore'
import { useAuthStore } from '../store/authStore'

interface ProfileDropdownProps {
  onClose?: () => void
}

export default function ProfileDropdown({ onClose }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const t = useTranslation()
  const { logout } = useAuthStore()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleItemClick = (path: string) => {
    navigate(path)
    setIsOpen(false)
    onClose?.()
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 dark:hover:bg-dark-hover rounded-lg transition-colors flex items-center space-x-2"
      >
        <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-300" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg shadow-lg z-50">
          <div className="py-2">
            <button
              onClick={() => handleItemClick('/profile')}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-dark-hover text-gray-900 dark:text-white flex items-center space-x-3 transition-colors"
            >
              <User className="w-4 h-4" />
              <span>{t('profile')}</span>
            </button>
            <button
              onClick={() => handleItemClick('/jobs')}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-dark-hover text-gray-900 dark:text-white flex items-center space-x-3 transition-colors"
            >
              <History className="w-4 h-4" />
              <span>{t('jobs')}</span>
            </button>
            <button
              onClick={() => handleItemClick('/billing')}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-dark-hover text-gray-900 dark:text-white flex items-center space-x-3 transition-colors"
            >
              <CreditCard className="w-4 h-4" />
              <span>{t('billing')}</span>
            </button>
            <button
              onClick={() => handleItemClick('/settings')}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-dark-hover text-gray-900 dark:text-white flex items-center space-x-3 transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>{t('settings')}</span>
            </button>
            <div className="border-t border-gray-200 dark:border-dark-border my-2"></div>
            <button
              onClick={() => {
                logout()
                setIsOpen(false)
                navigate('/')
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-dark-hover text-red-600 dark:text-red-400 flex items-center space-x-3 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>{t('logout')}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

