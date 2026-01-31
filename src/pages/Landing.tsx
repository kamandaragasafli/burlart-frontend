import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Zap, Info, ArrowRight, Star } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useTranslation } from '../store/languageStore'
import { useThemeStore } from '../store/themeStore'
import { subscriptionPlans } from '../data/subscriptionPlans'
import { subscriptionAPI } from '../services/api'
import SEO from '../components/SEO'
import StructuredData from '../components/StructuredData'
import CreditModal from '../components/CreditModal'

export default function Landing() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuthStore()
  const { theme } = useThemeStore()
  const t = useTranslation()
  const [showCreditModal, setShowCreditModal] = useState(false)

  // Check subscription and redirect if user has subscription
  useEffect(() => {
    const checkSubscription = async () => {
      if (isAuthenticated) {
        try {
          const subscriptionInfo = await subscriptionAPI.getInfo()
          if (subscriptionInfo.has_subscription) {
            // If user has subscription, redirect to dashboard
            navigate('/dashboard')
          }
        } catch (error) {
          console.error('Error checking subscription:', error)
        }
      }
    }

    checkSubscription()
  }, [isAuthenticated, navigate])

  // Scroll reveal animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active')
          }
        })
      },
      {
        threshold: 0.15,
        rootMargin: '0px'
      }
    )

    const elements = document.querySelectorAll('.scroll-reveal')
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard')
    } else {
      navigate('/register')
    }
  }

  const handleSelectPlan = (planId: string) => {
    if (user) {
      navigate(`/checkout?type=subscription&plan=${planId}`)
    } else {
      navigate(`/register?redirect=/checkout?type=subscription&plan=${planId}`)
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg">
      <SEO 
        title="Burlart - AI Video və Şəkil Yaratma Platforması"
        description="Burlart ilə saniyələr ərzində peşəkar AI video və şəkillər yaradın. Pika Labs, Sora, Kling AI, Flux və digər güclü AI modelləri."
        keywords="AI video generator, AI şəkil yaratma, suni intellekt, Pika Labs, Sora AI, Kling AI, Flux AI, Burlart"
        url="https://timera.ai"
      />
      <StructuredData type="WebSite" />
      <StructuredData type="Organization" />

      {/* Hero Section */}
      <div className="relative overflow-hidden min-h-[90vh] flex items-center">
        {/* Video Background - Full Size, Centered - Changes based on theme */}
        <div className="absolute inset-0 z-0">
          <video
            key={theme} // Force re-render when theme changes
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source 
              src={theme === 'dark' ? '/backround.mp4' : '/background-white.mp4'} 
              type="video/mp4" 
            />
          </video>
        </div>

        <div className="container mx-auto px-6 py-24 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="mb-12 space-y-8">
              {/* Logo */}
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-2xl opacity-40 animate-pulse"></div>
                <img 
                  src="/favicon.jpeg" 
                  alt="Burlart Logo" 
                  className="w-20 h-20 mx-auto relative z-10 object-contain"
                />
              </div>

              {/* Main Heading with Gradient */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400">
                  {t('heroTitle')}
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-gray-100 dark:text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed">
                {t('heroSubtitle')}
              </p>
            </div>

            {/* CTA Button with Glow Effect */}
            <div className="flex justify-center items-center space-x-4">
              <button
                onClick={handleGetStarted}
                className="group relative inline-flex items-center space-x-3 px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl font-bold text-lg transition-all duration-300 shadow-2xl hover:shadow-blue-500/50 dark:shadow-purple-500/50 transform hover:scale-105"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                <Zap className="w-6 h-6 relative z-10 group-hover:animate-pulse" />
                <span className="relative z-10">{t('startButton')}</span>
                <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Features Pills */}
            <div className="flex flex-wrap justify-center gap-3 mt-12">
              <span className="px-4 py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                🎥 AI Video
              </span>
              <span className="px-4 py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                🖼️ AI Image
              </span>
              <span className="px-4 py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                ⚡ Instant Results
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="relative bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-blue-950/20 dark:to-purple-950/20 py-16 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-purple-400/20 dark:bg-purple-500/10 rounded-full blur-3xl animate-blob" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-pink-400/20 dark:bg-pink-500/10 rounded-full blur-3xl animate-blob" style={{ animationDelay: '4s' }}></div>
        </div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-30 dark:opacity-20"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('packagesTitle')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t('packagesSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {subscriptionPlans.map((plan, index) => {
              const isStarter = plan.id === 'starter'
              const isPro = plan.id === 'pro'
              const isAgency = plan.id === 'agency'

              return (
                <div
                  key={plan.id}
                  className={`relative bg-white dark:bg-dark-bg border-2 rounded-lg p-8 scroll-reveal ${
                    plan.popular
                      ? 'border-blue-500 shadow-xl scale-105'
                      : 'border-gray-200 dark:border-dark-border'
                  }`}
                  style={{ transitionDelay: `${index * 0.1}s` }}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                        <Star className="w-4 h-4" />
                        <span>{t('mostPopular')}</span>
                      </span>
                    </div>
                  )}

                  <div className="mb-6">
                    <div className={`text-4xl mb-2 ${isStarter ? 'text-green-500' : isPro ? 'text-blue-500' : 'text-purple-500'}`}>
                      {isStarter ? '🟢' : isPro ? '🔵' : '🟣'}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {plan.name}
                    </h3>
                    <div className="flex items-baseline space-x-1 mb-2">
                      <span className="text-4xl font-bold text-gray-900 dark:text-white">
                        {plan.price}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">₼ {t('perMonth')}</span>
                    </div>
                    <div className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                      {plan.credits.toLocaleString()} {t('credits')}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      {isStarter && `${t('suitableFor')} ${t('starterSuitable')}`}
                      {isPro && `${t('suitableFor')} ${t('proSuitable')}`}
                      {isAgency && `${t('suitableFor')} ${t('agencySuitable')}`}
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      {t('estimatedUsage')}
                    </div>
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <div>{t('aiVideo')}</div>
                      {isStarter && (
                        <>
                          <div className="pl-4">• {t('standardVideo').replace('{count}', '21')} (Pika)</div>
                          <div className="pl-4">• {t('premiumVideo').replace('{count}', '6')} (Kling)</div>
                        </>
                      )}
                      {isPro && (
                        <>
                          <div className="pl-4">• {t('standardVideo').replace('{count}', '51')}</div>
                          <div className="pl-4">• {t('premiumVideo').replace('{count}', '15')}</div>
                        </>
                      )}
                      {isAgency && (
                        <>
                          <div className="pl-4">• {t('standardVideo').replace('{count}', '114')}</div>
                          <div className="pl-4">• {t('premiumVideo').replace('{count}', '33')}</div>
                        </>
                      )}
                      <div>{t('aiImage')}</div>
                      {isStarter && <div className="pl-4">• {t('images').replace('{count}', '75')}</div>}
                      {isPro && <div className="pl-4">• {t('images').replace('{count}', '180')}</div>}
                      {isAgency && <div className="pl-4">• {t('images').replace('{count}', '400')}</div>}
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      {t('included')}
                    </div>
                    <div className="space-y-2">
                      {plan.features?.map((feature, idx) => (
                        <div key={idx} className="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-400">
                          <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6 text-sm text-gray-500 dark:text-gray-400 italic">
                    {isStarter && t('starterNote')}
                    {isPro && t('proNote')}
                    {isAgency && t('agencyNote')}
                  </div>

                  <button
                    onClick={() => handleSelectPlan(plan.id)}
                    className={`w-full py-3 rounded-lg font-medium transition-colors ${
                      plan.popular
                        ? 'bg-blue-500 hover:bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-dark-hover hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white'
                    }`}
                  >
                    {t('selectPlan')}
                  </button>
                </div>
              )
            })}
          </div>

          <div className="mt-12 max-w-4xl mx-auto bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 scroll-reveal">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-gray-700 dark:text-gray-300">
                <div className="font-semibold mb-2">{t('importantNote')}</div>
                <div>{t('importantNoteText')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How Credits Work Section */}
      <div className="bg-gray-50 dark:bg-dark-card py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              {t('creditsHowTitle')}
            </h2>
            <div className="space-y-6 text-gray-700 dark:text-gray-300">
              <div className="bg-white dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-3">{t('creditsStep1Title')}</h3>
                <p>{t('creditsStep1Text')}</p>
              </div>
              <div className="bg-white dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-3">{t('creditsStep2Title')}</h3>
                <p>{t('creditsStep2Text')}</p>
              </div>
              <div className="bg-white dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-3">{t('creditsStep3Title')}</h3>
                <p>{t('creditsStep3Text')}</p>
              </div>
              <div className="bg-white dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-3">{t('creditsStep4Title')}</h3>
                <p>{t('creditsStep4Text')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CreditModal 
        isOpen={showCreditModal} 
        onClose={() => setShowCreditModal(false)} 
      />
    </div>
  )
}

