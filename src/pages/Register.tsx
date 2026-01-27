import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Loader2, Sparkles, User } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useTranslation } from '../store/languageStore'
import SEO from '../components/SEO'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [googleReady, setGoogleReady] = useState(false)
  
  const { register, loginWithGoogle, isAuthenticated } = useAuthStore()
  const t = useTranslation()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  // Google Identity Services init
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
              console.error('Google register/login error:', err)
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

    checkGoogle()
  }, [loginWithGoogle, navigate])

  // Render Google button when ready
  useEffect(() => {
    if (googleReady) {
      const buttonDiv = document.getElementById('google-register-button')
      if (buttonDiv) {
        // @ts-ignore
        window.google.accounts.id.renderButton(buttonDiv, {
          theme: 'outline',
          size: 'large',
          width: buttonDiv.offsetWidth,
          text: 'continue_with',
          shape: 'rectangular',
        })
      }
    }
  }, [googleReady])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (password !== confirmPassword) {
      setError(t('passwordsDoNotMatch') || 'Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError(t('passwordTooShort') || 'Password must be at least 6 characters')
      return
    }

    setIsLoading(true)

    try {
      await register(email, password)
      navigate('/dashboard')
    } catch (err: any) {
      console.error('Register error:', err)
      let errorMessage = err.response?.data?.error || err.response?.data?.detail || err.message || t('registrationFailed') || 'Registration failed. Please try again.'
      
      // Handle validation errors
      if (err.response?.data) {
        const data = err.response.data
        if (data.email) {
          errorMessage = Array.isArray(data.email) ? data.email[0] : data.email
        } else if (data.password) {
          errorMessage = Array.isArray(data.password) ? data.password[0] : data.password
        } else if (typeof data === 'object') {
          const firstError = Object.values(data)[0]
          errorMessage = Array.isArray(firstError) ? firstError[0] : firstError
        }
      }
      
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg flex items-center justify-center px-6 py-12">
      <SEO 
        title="Qeydiyyat"
        description="Burlart-da qeydiyyatdan keçin və AI video və şəkil yaratmağa başlayın. 500 pulsuz kredit əldə edin."
        url="https://timera.ai/register"
      />
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="w-8 h-8 text-blue-400" />
            <span className="text-2xl font-bold italic text-gray-900 dark:text-white">
              Burlart
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t('createAccount') || 'Create Account'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('registerToGetStarted') || 'Register to get started with AI tools'}
          </p>
        </div>

        {/* Register Form */}
        <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg shadow-lg p-8">
          {/* Google Login */}
          {!googleReady ? (
            <div className="w-full mb-6 flex items-center justify-center border border-gray-300 dark:border-dark-border rounded-lg py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              <span>Loading Google...</span>
            </div>
          ) : (
            <div id="google-register-button" className="mb-6 flex justify-center"></div>
          )}

          {/* Divider */}
          <div className="flex items-center mb-6">
            <div className="flex-1 h-px bg-gray-200 dark:bg-dark-border" />
            <span className="px-3 text-xs uppercase tracking-wide text-gray-400">
              or
            </span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-dark-border" />
          </div>

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
                  minLength={6}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-hover text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t('enterPassword') || 'Enter your password'}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {t('passwordMinLength') || 'Minimum 6 characters'}
              </p>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('confirmPassword') || 'Confirm Password'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-hover text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t('confirmPassword') || 'Confirm your password'}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{t('registering') || 'Registering...'}</span>
                </>
              ) : (
                <span>{t('register') || 'Register'}</span>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('alreadyHaveAccount') || 'Already have an account?'}{' '}
              <Link
                to="/login"
                className="text-blue-500 hover:text-blue-600 font-medium"
              >
                {t('login') || 'Login'}
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            ← {t('backToHome') || 'Back to Home'}
          </Link>
        </div>
      </div>
    </div>
  )
}

