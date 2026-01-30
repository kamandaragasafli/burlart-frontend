import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Loader2, Sparkles, ArrowRight } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useTranslation } from '../store/languageStore'
import { useThemeStore } from '../store/themeStore'
import SEO from '../components/SEO'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [googleReady, setGoogleReady] = useState(false)
  
  const { login, loginWithGoogle, isAuthenticated } = useAuthStore()
  const t = useTranslation()
  const navigate = useNavigate()
  const { theme } = useThemeStore()
  const videoSrc = theme === 'dark' ? '/backround.mp4' : '/background-white.mp4'

  // Show Google login only on main server (not on localhost)
  const isLocalhost =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  const showGoogleLogin = !isLocalhost

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  // Wait for Google Identity Services to load and render button
  useEffect(() => {
    const checkGoogle = () => {
      // @ts-ignore
      if (window.google && window.google.accounts && window.google.accounts.id) {
        // @ts-ignore
        window.google.accounts.id.initialize({
          client_id: '831644999809-ftanfb31r6lnainviigku5o70dhvo130.apps.googleusercontent.com',
          callback: async (response: any) => {
            if (!response || !response.credential) {
              setError('No credential from Google')
              return
            }
            try {
              await loginWithGoogle(response.credential)
              navigate('/dashboard')
            } catch (err: any) {
              console.error('Google login error:', err)
              const msg =
                err.response?.data?.error ||
                err.message ||
                'Google login failed. Please try again.'
              setError(msg)
            }
          },
        })
        setGoogleReady(true)
      } else {
        // Retry after a short delay
        setTimeout(checkGoogle, 100)
      }
    }

    // Start checking after component mounts
    checkGoogle()
  }, [loginWithGoogle, navigate])
  
  // Render Google button when ready
  useEffect(() => {
    if (googleReady) {
      const buttonDiv = document.getElementById('google-signin-button')
      if (buttonDiv) {
        // @ts-ignore
        window.google.accounts.id.renderButton(
          buttonDiv,
          {
            theme: 'outline',
            size: 'large',
            width: buttonDiv.offsetWidth,
            text: 'continue_with',
            shape: 'rectangular',
          }
        )
      }
    }
  }, [googleReady])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      console.log('[Login] Attempting login with email:', email)
      await login(email, password)
      
      // Check if login was successful
      const { isAuthenticated: authStatus } = useAuthStore.getState()
      console.log('[Login] Login completed, isAuthenticated:', authStatus)
      
      if (authStatus) {
        console.log('[Login] Login successful, navigating to dashboard')
        navigate('/dashboard', { replace: true })
      } else {
        console.warn('[Login] Login completed but isAuthenticated is false')
        setError('Login failed. Please try again.')
      }
    } catch (err: any) {
      console.error('[Login] Login error:', err)
      console.error('[Login] Error response:', err.response)
      console.error('[Login] Error message:', err.message)
      console.error('[Login] Full error:', JSON.stringify(err, null, 2))
      
      // Better error handling
      let errorMessage = t('loginFailed') || 'Login failed. Please try again.'
      
      if (err.response) {
        // Server responded with error
        const status = err.response.status
        const data = err.response.data
        
        console.error('[Login] Server error status:', status)
        console.error('[Login] Server error data:', data)
        
        errorMessage = data?.error || 
                      data?.detail || 
                      data?.message ||
                      `Server error: ${status}`
      } else if (err.request) {
        // Request was made but no response received
        console.error('[Login] No response received from server')
        errorMessage = 'Cannot connect to server. Please check if backend is running at http://localhost:8000'
      } else {
        // Something else happened
        console.error('[Login] Unknown error:', err)
        errorMessage = err.message || errorMessage
      }
      
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg flex">
      <SEO 
        title="Daxil ol"
        description="Burlart hesabınıza daxil olun və AI video və şəkil yaratmağa başlayın."
        url="https://timera.ai/login"
      />
      
      {/* Left Side - Promotional/Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0">
          <video
            key={videoSrc}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 via-purple-900/50 to-pink-900/40"></div>
        </div>
        
        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Sparkles className="w-8 h-8 text-blue-400" />
            <span className="text-2xl font-bold italic">Burlart</span>
          </div>
          
          {/* Tagline */}
          <div className="mb-16">
            <h2 className="text-4xl font-bold mb-4">
              {t('heroTitle') || 'Create Amazing Content with AI'}
            </h2>
            <p className="text-xl text-white/90">
              {t('heroSubtitle') || 'Get access to powerful AI tools and create professional videos and images in seconds'}
            </p>
          </div>
          
          {/* Back to Home Link */}
          <Link
            to="/"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 transition-all"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            <span>Ana Səhifəyə Qayıt</span>
          </Link>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-white dark:bg-dark-bg">
          <div className="w-full max-w-md">
          {/* Logo and Title - Mobile */}
          <div className="lg:hidden text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
              <Sparkles className="w-8 h-8 text-blue-500" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Burlart
            </span>
          </div>
        </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {t('welcomeBack') || 'Xoş gəlmisiniz'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            {t('loginToAccount') || 'Hesabınıza daxil olun'}
          </p>

          {/* Login Form Card */}
          <div className="bg-white dark:bg-dark-card rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-dark-border">
            {/* Google Login (only on main server) */}
            {showGoogleLogin && (
              <>
          {!googleReady ? (
            <div className="w-full mb-6 flex items-center justify-center border border-gray-300 dark:border-dark-border rounded-lg py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              <span>Loading Google...</span>
            </div>
          ) : (
            <div id="google-signin-button" className="mb-6 flex justify-center"></div>
          )}

          {/* Divider */}
          <div className="flex items-center mb-6">
            <div className="flex-1 h-px bg-gray-200 dark:bg-dark-border" />
            <span className="px-3 text-xs uppercase tracking-wide text-gray-400">
              or
            </span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-dark-border" />
          </div>
              </>
            )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-4 text-sm">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('email') || 'Email'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                    autoComplete="email"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-hover text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t('enterEmail') || 'Enter your email'}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('password') || 'Password'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                    autoComplete="current-password"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-hover text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t('enterPassword') || 'Enter your password'}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg shadow-lg text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all duration-300 transform hover:scale-[1.02]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{t('loggingIn') || 'Logging in...'}</span>
                </>
              ) : (
                <span>Login</span>
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('dontHaveAccount') || "Don't have an account?"}{' '}
              <Link
                to="/register"
                  className="text-blue-500 hover:text-blue-600 font-semibold"
              >
                {t('register') || 'Register'}
              </Link>
            </p>
        </div>
          </div>
        </div>
      </div>
    </div>
  )
}

