import { useState } from 'react'
import { X, Zap, Check } from 'lucide-react'
import { useSubscriptionStore, SubscriptionPlan as PlanType } from '../store/subscriptionStore'
import { subscriptionPlans } from '../data/subscriptionPlans'
import { useCreditStore } from '../store/creditStore'

interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  const { subscription, setSubscription } = useSubscriptionStore()
  const { addCredits } = useCreditStore()
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null)

  if (!isOpen) return null

  const handlePurchase = (planId: PlanType) => {
    const plan = subscriptionPlans.find((p) => p.id === planId)
    if (!plan) return

    // Set subscription with auto-renew always enabled in backend
    setSubscription(planId, true)

    // Add credits to balance (existing credits remain)
    addCredits(plan.credits)

    alert(
      `Təbriklər! ${plan.name} paketi aktivləşdirildi. ${plan.credits} kredit hesabınıza əlavə olundu.`
    )
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-card rounded-lg border border-dark-border max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-dark-card border-b border-dark-border p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
              <Zap className="w-6 h-6 text-blue-400" />
              <span>Paketlərə Abunə Olun</span>
            </h2>
            <p className="text-gray-400 mt-1">
              Bütün paketlər bütün AI alətlərinə giriş verir. Fərq yalnız kredit sayıdır.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-dark-hover rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-300" />
          </button>
        </div>

        <div className="p-6">
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

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {subscriptionPlans.map((plan) => {
              const isCurrentPlan = subscription.plan === plan.id
              const isSelected = selectedPlan === plan.id

              return (
                <div
                  key={plan.id}
                  className={`relative bg-dark-hover rounded-lg border-2 p-6 transition-all cursor-pointer ${
                    plan.popular
                      ? 'border-blue-500'
                      : isSelected
                        ? 'border-gray-500'
                        : 'border-dark-border hover:border-gray-500'
                  } ${isCurrentPlan ? 'opacity-75' : ''}`}
                  onClick={() => !isCurrentPlan && setSelectedPlan(plan.id)}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                      Ən Populyar
                    </div>
                  )}

                  {isCurrentPlan && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                      Aktiv
                    </div>
                  )}

                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {plan.name}
                    </h3>
                    <div className="flex items-baseline space-x-1">
                      <span className="text-3xl font-bold text-white">
                        {plan.price}
                        {plan.currency}
                      </span>
                      <span className="text-gray-400">/ {plan.period}</span>
                    </div>
                    <div className="mt-2 text-sm text-gray-400">
                      {plan.credits.toLocaleString()} kredit
                    </div>
                  </div>

                  <div className="space-y-2 mb-6">
                    {plan.features?.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-start space-x-2 text-sm text-gray-300"
                      >
                        <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {!isCurrentPlan && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedPlan(plan.id)
                        handlePurchase(plan.id)
                      }}
                      className={`w-full py-3 rounded-lg font-medium transition-colors ${
                        plan.popular
                          ? 'bg-blue-500 hover:bg-blue-600 text-white'
                          : 'bg-dark-card hover:bg-gray-700 text-white border border-dark-border'
                      }`}
                    >
                      Seçin
                    </button>
                  )}

                  {isCurrentPlan && (
                    <button
                      disabled
                      className="w-full py-3 rounded-lg font-medium bg-dark-card text-gray-500 cursor-not-allowed border border-dark-border"
                    >
                      Aktiv Paket
                    </button>
                  )}
                </div>
              )
            })}
          </div>

          {/* Info */}
          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-sm text-gray-300">
              💡 <strong>Qeyd:</strong> Bütün paketlər bütün AI alətlərinə giriş
              verir. Paketlərarası fərq yalnız aylıq kredit miqdarındadır.
              Qalıq kreditlər paket yenilənməsindən sonra da qorunur.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

