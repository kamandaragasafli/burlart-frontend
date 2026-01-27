import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Loader2, CreditCard, Package, ArrowRight } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useTranslation } from '../store/languageStore'
import { subscriptionAPI, topupAPI } from '../services/api'
import { subscriptionPlans } from '../data/subscriptionPlans'
import SEO from '../components/SEO'

export default function Checkout() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user } = useAuthStore()
  const t = useTranslation()
  
  const type = searchParams.get('type') // 'subscription' or 'topup'
  const planId = searchParams.get('plan')
  const packageId = searchParams.get('package')
  
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(window.location.href)}`)
      return
    }

    if (!type || (type === 'subscription' && !planId) || (type === 'topup' && !packageId)) {
      navigate('/landing')
      return
    }
  }, [user, type, planId, packageId, navigate])

  const handlePayment = async () => {
    if (!user) return

    try {
      setProcessing(true)

      // Mock E-point payment flow
      // In production, this would redirect to E-point payment page
      // For now, we'll simulate the payment process

      if (type === 'subscription' && planId) {
        // Create subscription
        await subscriptionAPI.createSubscription(planId, true)
        
        // Mock: Simulate E-point redirect
        // In production: window.location.href = result.payment_url
        setTimeout(() => {
          navigate(`/checkout/success?type=subscription&plan=${planId}&payment_id=mock_${Date.now()}`)
        }, 2000)
      } else if (type === 'topup' && packageId) {
        // Create top-up
        const result = await topupAPI.createTopup(packageId)
        
        // Mock: Simulate E-point redirect
        // In production: window.location.href = result.payment_url
        setTimeout(() => {
          navigate(`/checkout/success?type=topup&package=${packageId}&purchase_id=${result.id}&payment_id=mock_${Date.now()}`)
        }, 2000)
      }
    } catch (error: any) {
      console.error('Payment error:', error)
      navigate(`/checkout/cancel?error=${encodeURIComponent(error.response?.data?.detail || 'Payment failed')}`)
    } finally {
      setProcessing(false)
    }
  }

  const selectedPlan = type === 'subscription' && planId 
    ? subscriptionPlans.find(p => p.id === planId)
    : null

  const [topupPackage, setTopupPackage] = useState<any>(null)

  useEffect(() => {
    if (type === 'topup' && packageId) {
      topupAPI.getPackages().then(packages => {
        const pkg = packages.find((p: any) => p.id === packageId)
        setTopupPackage(pkg)
      })
    }
  }, [type, packageId])

  if (!user || !type) {
    return null
  }

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg">
      <SEO 
        title="Checkout - Ödəniş"
        description="Ödənişi tamamlayın"
        url="https://timera.ai/checkout"
      />
      
      <div className="container mx-auto px-6 py-16 max-w-2xl">
        <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {type === 'subscription' ? t('packages') : t('topupCredit')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {type === 'subscription' 
                ? 'Abunəlik planınızı seçin və ödənişi tamamlayın'
                : 'Əlavə kredit alın və ödənişi tamamlayın'}
            </p>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 dark:bg-dark-hover rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Sifariş xülasəsi
            </h2>
            
            {type === 'subscription' && selectedPlan && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Package className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedPlan.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedPlan.credits.toLocaleString()} {t('credits')} / {t('perMonth')}
                      </p>
                    </div>
                  </div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {selectedPlan.price} ₼
                  </p>
                </div>
              </div>
            )}

            {type === 'topup' && topupPackage && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{topupPackage.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {topupPackage.total_credits?.toLocaleString() || topupPackage.credits?.toLocaleString()} {t('credits')}
                      </p>
                    </div>
                  </div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {topupPackage.price} ₼
                  </p>
                </div>
              </div>
            )}

            <div className="border-t border-gray-200 dark:border-dark-border mt-4 pt-4">
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold text-gray-900 dark:text-white">Ümumi</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedPlan?.price || topupPackage?.price} ₼
                </p>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Ödəniş metodu
            </h2>
            <div className="bg-gray-50 dark:bg-dark-hover rounded-lg p-4 border border-gray-200 dark:border-dark-border">
              <div className="flex items-center space-x-3">
                <CreditCard className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">E-point</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    E-point ilə təhlükəsiz ödəniş
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Button */}
          <button
            onClick={handlePayment}
            disabled={processing}
            className="w-full py-4 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg font-semibold text-lg transition-colors flex items-center justify-center space-x-2"
          >
            {processing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Ödəniş emal olunur...</span>
              </>
            ) : (
              <>
                <span>Ödənişi tamamla</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
            Ödənişi tamamlayaraq, istifadə şərtlərimizi qəbul etmiş olursunuz.
          </p>
        </div>
      </div>
    </div>
  )
}

