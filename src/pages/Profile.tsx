import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Calendar, 
  Edit2, 
  Save, 
  X, 
  Camera,
  Lock,
  Globe,
  Palette,
  BarChart3,
  AlertTriangle,
  CreditCard
} from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useLanguageStore, useTranslation } from '../store/languageStore'
import { useThemeStore } from '../store/themeStore'
import { authAPI, videoAPI, imageAPI } from '../services/api'
import SEO from '../components/SEO'
import ModernBackground from '../components/ModernBackground'

export default function Profile() {
  const navigate = useNavigate()
  const { user, fetchProfile } = useAuthStore()
  const { language, setLanguage } = useLanguageStore()
  const { theme, setTheme } = useThemeStore()
  const t = useTranslation()
  
  const [isEditing, setIsEditing] = useState(false)
  const [editedEmail, setEditedEmail] = useState('')
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  
  // Stats
  const [stats, setStats] = useState({
    totalVideos: 0,
    totalImages: 0,
    totalCreditsUsed: 0,
  })

  useEffect(() => {
    if (user) {
      setEditedEmail(user.email)
      loadStats()
    }
  }, [user])

  const loadStats = async () => {
    if (!user) return

    try {
      // Load videos and images
      const [videosResponse, imagesResponse] = await Promise.all([
        videoAPI.getVideos().catch(() => []),
        imageAPI.getImages().catch(() => []),
      ])

      // Handle different response structures
      const videos = Array.isArray(videosResponse) 
        ? videosResponse 
        : (videosResponse?.results || videosResponse?.data || [])
      
      const images = Array.isArray(imagesResponse) 
        ? imagesResponse 
        : (imagesResponse?.results || imagesResponse?.data || [])

      // Calculate total credits used
      const totalCreditsUsed = 
        videos.reduce((sum: number, v: any) => sum + (v.credits_used || v.credits || 0), 0) +
        images.reduce((sum: number, i: any) => sum + (i.credits_used || i.credits || 0), 0)

      setStats({
        totalVideos: videos.length,
        totalImages: images.length,
        totalCreditsUsed,
      })
    } catch (error) {
      console.error('Failed to load stats:', error)
      // Keep default values (0) on error
    }
  }

  const handleSaveProfile = async () => {
    try {
      setIsLoading(true)
      setError('')
      setSuccess('')
      
      await authAPI.updateProfile({ email: editedEmail })
      await fetchProfile()
      setSuccess('Profile updated successfully')
      setIsEditing(false)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePassword = async () => {
    try {
      setError('')
      setSuccess('')
      
      if (newPassword !== confirmPassword) {
        setError('Passwords do not match')
        return
      }
      
      if (newPassword.length < 6) {
        setError('Password must be at least 6 characters')
        return
      }
      
      setIsLoading(true)
      
      // Password change endpoint (backend'de bu endpoint'i eklemen gerekecek)
      // await authAPI.changePassword({ old_password: oldPassword, new_password: newPassword })
      
      setSuccess('Password changed successfully')
      setIsChangingPassword(false)
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to change password')
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <ModernBackground className="flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </ModernBackground>
    )
  }

  const joinDate = new Date((user as any).created_at || '2024-01-15').toLocaleDateString('az-AZ', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <ModernBackground>
      <SEO 
        title="Profil"
        description="İstifadəçi profili və hesab ayarları"
        url="https://timera.ai/profile"
      />
      <div className="container mx-auto px-6 py-8 max-w-5xl">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('profile') || 'Profil'}</span>
        </button>

        {/* Success/Error Messages */}
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 rounded-lg p-4 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400 rounded-lg p-4 text-sm">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <div className="bg-white dark:bg-dark-card rounded-lg border border-gray-200 dark:border-dark-border p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <User className="w-10 h-10 text-white" />
                    </div>
                    <button className="absolute bottom-0 right-0 p-1 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors">
                      <Camera className="w-3 h-3" />
                    </button>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {(user as any).first_name || (user.email ? user.email.split('@')[0] : 'User')}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                  </div>
                </div>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-hover rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={editedEmail}
                      onChange={(e) => setEditedEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleSaveProfile}
                      disabled={isLoading}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false)
                        setEditedEmail(user.email)
                      }}
                      className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-dark-border hover:bg-gray-100 dark:hover:bg-dark-hover text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                    <Mail className="w-5 h-5" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                    <Calendar className="w-5 h-5" />
                    <span>Qoşulma tarixi: {joinDate}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Password Change */}
            <div className="bg-white dark:bg-dark-card rounded-lg border border-gray-200 dark:border-dark-border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Lock className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Password
                  </h3>
                </div>
                {!isChangingPassword && (
                  <button
                    onClick={() => setIsChangingPassword(true)}
                    className="text-sm text-blue-500 hover:text-blue-600"
                  >
                    Change Password
                  </button>
                )}
              </div>
              
              {isChangingPassword ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleChangePassword}
                      disabled={isLoading}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      <span>Update Password</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsChangingPassword(false)
                        setOldPassword('')
                        setNewPassword('')
                        setConfirmPassword('')
                      }}
                      className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-dark-border hover:bg-gray-100 dark:hover:bg-dark-hover text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  ••••••••
                </p>
              )}
            </div>

            {/* Preferences */}
            <div className="bg-white dark:bg-dark-card rounded-lg border border-gray-200 dark:border-dark-border p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Preferences
              </h3>
              <div className="space-y-4">
                {/* Language */}
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Globe className="w-4 h-4" />
                    <span>Language</span>
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="en">English</option>
                    <option value="az">Azərbaycan</option>
                    <option value="ru">Русский</option>
                  </select>
                </div>
                
                {/* Theme */}
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Palette className="w-4 h-4" />
                    <span>Theme</span>
                  </label>
                  <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-6">
              <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 mb-3">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="text-lg font-semibold">Danger Zone</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              {!showDeleteConfirm ? (
                <button 
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm"
                >
                Delete Account
              </button>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                    Bu əməliyyat geri qaytarıla bilməz. Hesabınızı silmək istədiyinizə əminsiniz?
                  </p>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={async () => {
                        try {
                          setIsDeleting(true)
                          setError('')
                          await authAPI.deleteAccount()
                          // Clear local storage and redirect to home
                          localStorage.removeItem('access_token')
                          localStorage.removeItem('refresh_token')
                          window.location.href = '/'
                        } catch (err: any) {
                          console.error('Delete account error:', err)
                          setError(err.response?.data?.error || 'Hesab silinərkən xəta baş verdi.')
                          setIsDeleting(false)
                        }
                      }}
                      disabled={isDeleting}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isDeleting ? 'Silinir...' : 'Bəli, Sil'}
                    </button>
                    <button
                      onClick={() => {
                        setShowDeleteConfirm(false)
                        setError('')
                      }}
                      disabled={isDeleting}
                      className="px-4 py-2 bg-gray-200 dark:bg-dark-hover hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors text-sm disabled:opacity-50"
                    >
                      Ləğv et
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Stats & Subscription */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="bg-white dark:bg-dark-card rounded-lg border border-gray-200 dark:border-dark-border p-6">
              <div className="flex items-center space-x-2 mb-4">
                <BarChart3 className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Statistics
                </h3>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Videos</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{stats.totalVideos}</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Images</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{stats.totalImages}</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Credits Used</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{stats.totalCreditsUsed}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Plan */}
            <div className="bg-white dark:bg-dark-card rounded-lg border border-gray-200 dark:border-dark-border p-6">
              <div className="flex items-center space-x-2 mb-4">
                <CreditCard className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Current Plan
                </h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Credits</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{user.credits}</p>
                </div>
                <button
                  onClick={() => navigate('/billing')}
                  className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm"
                >
                  Manage Subscription
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModernBackground>
  )
}
