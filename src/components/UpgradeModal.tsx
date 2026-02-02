import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Zap, Check, CreditCard } from 'lucide-react'
import { useSubscriptionStore, SubscriptionPlan as PlanType } from '../store/subscriptionStore'
import { subscriptionPlans } from '../data/subscriptionPlans'
import { subscriptionAPI, topupAPI } from '../services/api'
import { useAuthStore } from '../store/authStore'

interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
}

interface TopUpPackage {
  id: string
  name: string
  price: number
  currency: string
  credits: number
  bonus_credits: number
  total_credits: number
  popular?: boolean
  locked: boolean
}

export default function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  const { subscription } = useSubscriptionStore()
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null)
  const [currentSubscriptionPlan, setCurrentSubscriptionPlan] = useState<string | null>(null)
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(false)
  const [hasSubscription, setHasSubscription] = useState(false)
  const [topupPackages, setTopupPackages] = useState<TopUpPackage[]>([])
  const [loadingTopup, setLoadingTopup] = useState(false)
  const [activeTab, setActiveTab] = useState<'subscription' | 'topup'>('subscription')

  // Get current subscription plan and top-up packages
  useEffect(() => {
    if (isOpen && user) {
      const fetchData = async () => {
        try {
          setIsLoadingSubscription(true)
          const subscriptionInfo = await subscriptionAPI.getInfo()
          if (subscriptionInfo.plan) {
            setCurrentSubscriptionPlan(subscriptionInfo.plan)
            setHasSubscription(subscriptionInfo.has_subscription || false)
            
            // If user has subscription, load top-up packages
            if (subscriptionInfo.has_subscription) {
              setLoadingTopup(true)
              try {
                const packages = await topupAPI.getPackages()
                setTopupPackages(packages)
                // Set topup as active tab if user has subscription
                setActiveTab('topup')
              } catch (error) {
                console.error('Error loading top-up packages:', error)
              } finally {
                setLoadingTopup(false)
              }
            }
          }
        } catch (error) {
          console.error('Error fetching subscription info:', error)
        } finally {
          setIsLoadingSubscription(false)
        }
      }
      fetchData()
    }
  }, [isOpen, user])

  if (!isOpen) return null

  const handlePurchase = (planId: PlanType) => {
    // Don't allow selecting the same plan that user already has
    if (currentSubscriptionPlan === planId) {
      return
    }

    // Navigate to checkout page for payment
    navigate(`/checkout?type=subscription&plan=${planId}`)
    onClose()
  }

  const handleTopupPurchase = (packageId: string) => {
    // Navigate to checkout page for top-up payment
    navigate(`/checkout?type=topup&package=${packageId}`)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-dark-card via-dark-card to-dark-hover rounded-xl border border-dark-border shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="sticky top-0 bg-gradient-to-r from-dark-card to-dark-hover border-b border-dark-border p-6 z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white flex items-center space-x-3 mb-2">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Zap className="w-7 h-7 text-blue-400" />
                </div>
                <span>Paketlər və Top-up</span>
              </h2>
              <p className="text-gray-300 mt-2 text-base">
                {hasSubscription 
                  ? 'Abunəliyiniz aktivdir. Top-up kredit alın və ya paketi dəyişdirin.'
                  : 'Bütün paketlər bütün AI alətlərinə giriş verir. Fərq yalnız kredit sayıdır.'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="ml-4 p-2 hover:bg-dark-hover rounded-lg transition-colors group"
            >
              <X className="w-6 h-6 text-gray-300 group-hover:text-white" />
            </button>
          </div>

          {/* Tabs */}
          {hasSubscription && (
            <div className="flex space-x-1 bg-dark-hover/50 p-1 rounded-lg border border-dark-border">
              <button
                onClick={() => setActiveTab('subscription')}
                className={`flex-1 px-4 py-2.5 font-semibold transition-all rounded-md ${
                  activeTab === 'subscription'
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                    : 'text-gray-400 hover:text-gray-300 hover:bg-dark-hover'
                }`}
              >
                <Zap className="w-4 h-4 inline mr-2" />
                Paket Dəyişdir
              </button>
              <button
                onClick={() => setActiveTab('topup')}
                className={`flex-1 px-4 py-2.5 font-semibold transition-all rounded-md ${
                  activeTab === 'topup'
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                    : 'text-gray-400 hover:text-gray-300 hover:bg-dark-hover'
                }`}
              >
                <CreditCard className="w-4 h-4 inline mr-2" />
                Top-up Kredit
              </button>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Current Subscription Info */}
          {subscription.plan && (
            <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <p className="text-sm text-gray-400 mb-1">Cari Paket:</p>
              <p className="text-lg font-semibold text-white">
                {
                  subscriptionPlans.find((p) => p.id === subscription.plan)
                    ?.name
                }
              </p>
              {subscription.nextRenewalDate && (
                <p className="text-sm text-gray-400 mt-1">
                  Növbəti yenilənmə:{' '}
                  {subscription.nextRenewalDate.toLocaleDateString('az-AZ')}
                </p>
              )}
            </div>
          )}

          {/* Subscription Plans Tab */}
          {activeTab === 'subscription' && (
            <>
              {/* Plans Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {subscriptionPlans.map((plan) => {
              const isCurrentPlan = currentSubscriptionPlan === plan.id || subscription.plan === plan.id
              const isSelected = selectedPlan === plan.id

              return (
                <div
                  key={plan.id}
                  className={`relative bg-gradient-to-br from-dark-hover to-dark-card rounded-xl border-2 p-6 transition-all transform ${
                    isCurrentPlan ? 'cursor-not-allowed opacity-75' : 'cursor-pointer hover:scale-[1.02] hover:shadow-xl'
                  } ${
                    plan.popular
                      ? 'border-blue-500 shadow-lg shadow-blue-500/20'
                      : isSelected
                        ? 'border-blue-400 shadow-md'
                        : 'border-dark-border hover:border-blue-400/50'
                  }`}
                  onClick={() => !isCurrentPlan && setSelectedPlan(plan.id)}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs px-4 py-1.5 rounded-full font-semibold shadow-lg shadow-blue-500/50">
                      ⭐ Ən Populyar
                    </div>
                  )}

                  {isCurrentPlan && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-lg">
                      ✓ Aktiv
                    </div>
                  )}

                  <div className="mb-5">
                    <h3 className="text-2xl font-bold text-white mb-3">
                      {plan.name}
                    </h3>
                    <div className="flex items-baseline space-x-1 mb-2">
                      <span className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                        {plan.price}
                        {plan.currency}
                      </span>
                      <span className="text-gray-400 text-lg">/ {plan.period}</span>
                    </div>
                    <div className="mt-3 px-3 py-2 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                      <span className="text-base font-semibold text-blue-400">
                        {plan.credits.toLocaleString()} kredit
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2.5 mb-6">
                    {plan.features?.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-start space-x-2 text-sm text-gray-300"
                      >
                        <div className="mt-0.5 p-0.5 bg-green-500/20 rounded-full">
                          <Check className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                        </div>
                        <span className="leading-relaxed">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {!isCurrentPlan && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handlePurchase(plan.id)
                      }}
                      disabled={isLoadingSubscription}
                      className={`w-full py-3.5 rounded-lg font-semibold transition-all transform ${
                        plan.popular
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:scale-[1.02]'
                          : 'bg-dark-card hover:bg-gray-700 text-white border-2 border-dark-border hover:border-blue-400/50'
                      } ${isLoadingSubscription ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {isLoadingSubscription ? 'Yüklənir...' : 'Seçin'}
                    </button>
                  )}

                  {isCurrentPlan && (
                    <button
                      disabled
                      className="w-full py-3.5 rounded-lg font-semibold bg-dark-card text-gray-500 cursor-not-allowed border-2 border-dark-border"
                    >
                      Seçilmiş Paket
                    </button>
                  )}
                </div>
              )
              })}
              </div>

              {/* Info */}
              <div className="mt-6 p-5 bg-gradient-to-r from-blue-500/10 via-blue-500/5 to-transparent border border-blue-500/30 rounded-xl">
                <p className="text-sm text-gray-300 leading-relaxed">
                  <span className="text-lg mr-2">💡</span>
                  <strong className="text-blue-400">Qeyd:</strong> Bütün paketlər bütün AI alətlərinə giriş
                  verir. Paketlərarası fərq yalnız aylıq kredit miqdarındadır.
                  Qalıq kreditlər paket yenilənməsindən sonra da qorunur.
                </p>
              </div>
            </>
          )}

          {/* Top-up Packages Tab */}
          {hasSubscription && activeTab === 'topup' && (
            <>
              {loadingTopup ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    {topupPackages.map((pkg) => (
                      <div
                        key={pkg.id}
                        className={`relative bg-gradient-to-br from-dark-hover to-dark-card rounded-xl border-2 p-6 transition-all transform hover:scale-[1.02] hover:shadow-xl ${
                          pkg.popular
                            ? 'border-blue-500 shadow-lg shadow-blue-500/20'
                            : 'border-dark-border hover:border-blue-400/50'
                        }`}
                      >
                        {pkg.popular && (
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs px-4 py-1.5 rounded-full font-semibold shadow-lg shadow-blue-500/50">
                            ⭐ Ən Populyar
                          </div>
                        )}

                        <div className="mb-5">
                          <h3 className="text-2xl font-bold text-white mb-3">
                            {pkg.name}
                          </h3>
                          <div className="flex items-baseline space-x-1 mb-2">
                            <span className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                              {pkg.price}
                              {pkg.currency}
                            </span>
                          </div>
                          <div className="mt-3 px-3 py-2 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                            <span className="text-base font-semibold text-blue-400">
                              {pkg.total_credits.toLocaleString()} kredit
                            </span>
                            {pkg.bonus_credits > 0 && (
                              <span className="text-green-400 ml-2 font-semibold">
                                (+{pkg.bonus_credits} bonus)
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => handleTopupPurchase(pkg.id)}
                          className={`w-full py-3.5 rounded-lg font-semibold transition-all transform ${
                            pkg.popular
                              ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:scale-[1.02]'
                              : 'bg-dark-card hover:bg-gray-700 text-white border-2 border-dark-border hover:border-blue-400/50'
                          }`}
                        >
                          Al
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Top-up Info */}
                  <div className="mt-6 p-5 bg-gradient-to-r from-blue-500/10 via-blue-500/5 to-transparent border border-blue-500/30 rounded-xl">
                    <p className="text-sm text-gray-300 leading-relaxed">
                      <span className="text-lg mr-2">💡</span>
                      <strong className="text-blue-400">Qeyd:</strong> Top-up kredit paketinizə əlavə olunur,
                      paketi dəyişmir. Kreditlər bitənə qədər qalır və heç vaxt itmir.
                    </p>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

