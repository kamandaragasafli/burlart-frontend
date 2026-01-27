import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Zap, Sparkles, Info, ArrowRight, Star } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useTranslation } from '../store/languageStore'
import { subscriptionPlans } from '../data/subscriptionPlans'
import { topupAPI } from '../services/api'
import SEO from '../components/SEO'
import StructuredData from '../components/StructuredData'
import CreditModal from '../components/CreditModal'

interface TopUpPackage {
  id: string
  name: string
  price: number
  currency: string
  credits: number
  total_credits: number
  popular?: boolean
}

export default function Landing() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const t = useTranslation()
  const [topupPackages, setTopupPackages] = useState<TopUpPackage[]>([])
  const [showCreditModal, setShowCreditModal] = useState(false)
  const [loadingTopup, setLoadingTopup] = useState(false)

  // Load top-up packages
  useEffect(() => {
    const loadTopupPackages = async () => {
      try {
        setLoadingTopup(true)
        const packages = await topupAPI.getPackages()
        setTopupPackages(packages)
      } catch (error) {
        console.error('Failed to load top-up packages:', error)
      } finally {
        setLoadingTopup(false)
      }
    }
    loadTopupPackages()
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

  const handleSelectTopup = (packageId: string) => {
    if (user) {
      navigate(`/checkout?type=topup&package=${packageId}`)
    } else {
      navigate(`/register?redirect=/checkout?type=topup&package=${packageId}`)
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
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <Sparkles className="w-16 h-16 text-blue-400 mx-auto mb-4" />
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {t('heroTitle')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              {t('heroSubtitle')}
            </p>
          </div>

          <button
            onClick={handleGetStarted}
            className="flex items-center space-x-2 px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold text-lg transition-colors mx-auto"
          >
            <Zap className="w-5 h-5" />
            <span>{t('startButton')}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="bg-gray-50 dark:bg-dark-card py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('packagesTitle')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t('packagesSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {subscriptionPlans.map((plan) => {
              const isStarter = plan.id === 'starter'
              const isPro = plan.id === 'pro'
              const isAgency = plan.id === 'agency'

              return (
                <div
                  key={plan.id}
                  className={`relative bg-white dark:bg-dark-bg border-2 rounded-lg p-8 ${
                    plan.popular
                      ? 'border-blue-500 shadow-xl scale-105'
                      : 'border-gray-200 dark:border-dark-border'
                  }`}
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

          <div className="mt-12 max-w-4xl mx-auto bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
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

      {/* Top-up Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('topupTitle')}
          </h2>
          <div className="max-w-2xl mx-auto">
            <div className="text-2xl mb-2">{t('topupSubtitle')}</div>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {t('topupDescription')}
            </p>
          </div>
        </div>

        {loadingTopup ? (
          <div className="text-center py-12">
            <div className="text-gray-400">{t('loading')}</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {topupPackages.map((pkg) => {
              const isSmall = pkg.id === 'small'
              const isMedium = pkg.id === 'medium'
              const isLarge = pkg.id === 'large'

              return (
                <div
                  key={pkg.id}
                  className={`relative bg-white dark:bg-dark-bg border-2 rounded-lg p-8 ${
                    pkg.popular
                      ? 'border-blue-500 shadow-xl'
                      : 'border-gray-200 dark:border-dark-border'
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                        <Star className="w-4 h-4" />
                        <span>{t('mostPopular')}</span>
                      </span>
                    </div>
                  )}

                  <div className="mb-6">
                    <div className={`text-4xl mb-2 ${isSmall ? 'text-green-500' : isMedium ? 'text-blue-500' : 'text-purple-500'}`}>
                      {isSmall ? '🟢' : isMedium ? '🔵' : '🟣'}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {pkg.name}
                    </h3>
                    <div className="flex items-baseline space-x-1 mb-2">
                      <span className="text-4xl font-bold text-gray-900 dark:text-white">
                        {pkg.price}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">₼</span>
                    </div>
                    <div className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                      {pkg.total_credits.toLocaleString()} {t('credits')}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      {isSmall && t('topupSuitableSmall')}
                      {isMedium && t('topupSuitableMedium')}
                      {isLarge && t('topupSuitableLarge')}
                    </div>
                  </div>

                  <div className="mb-6 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    {isSmall && (
                      <>
                        {t('topupSmallFeatures').split('\n').map((line, idx) => (
                          <div key={idx}>{line}</div>
                        ))}
                        <div className="mt-4 italic">{t('topupSmallNote')}</div>
                      </>
                    )}
                    {isMedium && (
                      <>
                        {t('topupMediumFeatures').split('\n').map((line, idx) => (
                          <div key={idx}>{line}</div>
                        ))}
                        <div className="mt-4 italic">{t('topupMediumNote')}</div>
                      </>
                    )}
                    {isLarge && (
                      <>
                        {t('topupLargeFeatures').split('\n').map((line, idx) => (
                          <div key={idx}>{line}</div>
                        ))}
                        <div className="mt-4 italic">{t('topupLargeNote')}</div>
                      </>
                    )}
                  </div>

                  <button
                    onClick={() => handleSelectTopup(pkg.id)}
                    className={`w-full py-3 rounded-lg font-medium transition-colors ${
                      pkg.popular
                        ? 'bg-blue-500 hover:bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-dark-hover hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white'
                    }`}
                  >
                    {t('buyTopup')}
                  </button>
                </div>
              )
            })}
          </div>
        )}

        <div className="mt-12 max-w-4xl mx-auto bg-gray-50 dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-gray-700 dark:text-gray-300">
              <div className="font-semibold mb-2">{t('topupInfoTitle')}</div>
              <div className="space-y-2">
                <div>
                  <div className="font-medium mb-1">{t('topupWhatIs')}</div>
                  <div>{t('topupWhatIsText')}</div>
                </div>
                <div>
                  <div className="font-medium mb-1">{t('topupDifference')}</div>
                  <div>{t('topupDifferenceText')}</div>
                </div>
                <div className="mt-3 text-xs italic">
                  {t('topupTip')}
                </div>
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

