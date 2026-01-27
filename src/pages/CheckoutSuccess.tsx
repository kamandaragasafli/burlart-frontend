import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle, ArrowRight } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useTranslation } from '../store/languageStore'
import { subscriptionAPI, topupAPI } from '../services/api'
import { useToastStore } from '../store/toastStore'
import SEO from '../components/SEO'

export default function CheckoutSuccess() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user, updateCredits, fetchProfile } = useAuthStore()
  const { success } = useToastStore()

  const type = searchParams.get('type')
  const planId = searchParams.get('plan')
  const packageId = searchParams.get('package')
  const purchaseId = searchParams.get('purchase_id')
  const paymentId = searchParams.get('payment_id')

  const [processing, setProcessing] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    const completePayment = async () => {
      try {
        if (type === 'subscription' && planId && paymentId) {
          // Subscription payment completed
          await subscriptionAPI.getInfo() // Refresh subscription info
          success('Abunəlik uğurla aktivləşdirildi!')
        } else if (type === 'topup' && purchaseId && paymentId) {
          // Top-up payment completed
          const result = await topupAPI.completeTopup(parseInt(purchaseId), paymentId)
          
          // Update user credits
          if (result.user?.credits !== undefined) {
            updateCredits(result.user.credits)
          }
          
          // Refresh profile to get updated credits
          await fetchProfile()
          
          success(`${result.credits_purchased || result.total_credits} kredit hesabınıza əlavə olundu!`)
        }
      } catch (error: any) {
        console.error('Payment completion error:', error)
      } finally {
        setProcessing(false)
      }
    }

    completePayment()
  }, [user, type, planId, packageId, purchaseId, paymentId, navigate, updateCredits, fetchProfile, success])

  if (processing) {
    return (
      <div className="min-h-screen bg-white dark:bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Ödəniş yoxlanılır...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg">
      <SEO 
        title="Ödəniş Uğurlu - Checkout Success"
        description="Ödənişiniz uğurla tamamlandı"
        url="https://timera.ai/checkout/success"
      />
      
      <div className="container mx-auto px-6 py-16 max-w-2xl">
        <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Ödəniş uğurlu!
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {type === 'subscription' 
                ? 'Abunəliyiniz aktivləşdirildi. Kreditlər hesabınıza əlavə olundu.'
                : 'Kreditlər hesabınıza uğurla əlavə olundu.'}
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <span>Dashboard-a keç</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/billing')}
              className="w-full py-3 bg-gray-100 dark:bg-dark-hover hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium transition-colors"
            >
              Ödəniş tarixçəsinə bax
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

