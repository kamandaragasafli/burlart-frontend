import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useTranslation } from '../store/languageStore'
import { subscriptionAPI, topupAPI } from '../services/api'
import { useToastStore } from '../store/toastStore'
import SEO from '../components/SEO'
import CreditModal from '../components/CreditModal'
import ModernBackground from '../components/ModernBackground'
import { Calendar, CreditCard, Package, Download, X, AlertTriangle } from 'lucide-react'

interface Subscription {
  plan: string
  status: string
  auto_renew: boolean
  next_renewal_date?: string
  created_at: string
}

interface Invoice {
  id: number
  type: 'subscription' | 'topup'
  amount: number
  currency: string
  status: string
  created_at: string
}

export default function Billing() {
  const navigate = useNavigate()
  const { user, updateCredits } = useAuthStore()
  const t = useTranslation()
  const { success, error } = useToastStore()
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreditModal, setShowCreditModal] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)

  useEffect(() => {
    if (user) {
      loadBillingData()
    }
  }, [user])

  const loadBillingData = async () => {
    if (!user) return

    try {
      setLoading(true)
      const [subInfo, topupHistory] = await Promise.all([
        subscriptionAPI.getInfo().catch(() => null),
        topupAPI.getHistory().catch(() => []),
      ])

      setSubscription(subInfo)
      
      // Format invoices from top-up history
      const formattedInvoices: Invoice[] = []
      
      // Add subscription payment if exists
      if (subInfo && subInfo.has_subscription && subInfo.start_date) {
        // Get plan price from subscription info or use a default
        const planPrices: Record<string, number> = {
          demo: 0.1,
          starter: 19,
          pro: 39,
          agency: 79,
        }
        formattedInvoices.push({
          id: -1, // Use negative ID for subscription
          type: 'subscription',
          amount: planPrices[subInfo.plan || 'starter'] || 0,
          currency: '₼',
          status: subInfo.status === 'active' ? 'completed' : subInfo.status || 'pending',
          created_at: subInfo.start_date,
        })
      }
      
      // Add top-up payments
      const topupInvoices = topupHistory.map((purchase: any) => ({
        id: purchase.id,
        type: 'topup' as const,
        amount: purchase.price,
        currency: purchase.currency,
        status: purchase.status,
        created_at: purchase.created_at,
      }))
      
      formattedInvoices.push(...topupInvoices)
      
      // Sort by date (newest first)
      formattedInvoices.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )

      setInvoices(formattedInvoices)
    } catch (error) {
      console.error('Failed to load billing data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChangePlan = () => {
    // Navigate to checkout or upgrade modal
    window.location.href = '/checkout?type=subscription'
  }

  const handleCancelSubscription = async () => {
    if (!subscription) return

    try {
      setCancelling(true)
      await subscriptionAPI.cancelSubscription()
      // Update user credits to 0 in store
      updateCredits(0)
      success('Abunəlik uğurla ləğv edildi. Kreditlər sıfırlandı.')
      await loadBillingData() // Reload data
      setShowCancelConfirm(false)
      // Redirect to landing page
      setTimeout(() => {
        navigate('/landing')
      }, 1500)
    } catch (err: any) {
      error(err.response?.data?.error || 'Abunəliyi ləğv etmək mümkün olmadı')
    } finally {
      setCancelling(false)
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('az-AZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getPlanName = (planId: string) => {
    const plans: Record<string, string> = {
      starter: 'Starter',
      pro: 'Pro',
      agency: 'Agency',
    }
    return plans[planId] || planId
  }

  if (!user) {
    return (
      <ModernBackground className="flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">{t('pleaseLogin')}</p>
        </div>
      </ModernBackground>
    )
  }

  return (
    <ModernBackground>
      <SEO 
        title="Billing - Ödəniş və Abunəlik"
        description="Abunəlik planınızı, ödəniş tarixçənizi və fakturaları görüntüləyin."
        url="https://timera.ai/billing"
      />
      
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('billingSubscription')}</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('billingDescription')}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">{t('loading')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Current Plan */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                    <Package className="w-5 h-5" />
                    <span>{t('currentPlan')}</span>
                  </h2>
                  <button
                    onClick={handleChangePlan}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                  >
                    {t('changePlan')}
                  </button>
                </div>

                {subscription ? (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('plan')}</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {getPlanName(subscription.plan)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('status')}</p>
                      <p className={`text-lg font-semibold ${
                        subscription.status === 'active' ? 'text-green-500' : 'text-gray-500'
                      }`}>
                        {subscription.status === 'active' ? t('active') : subscription.status}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{t('nextBillingDate')}</span>
                      </p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {formatDate(subscription.next_renewal_date)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('autoRenewal')}</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {subscription.auto_renew ? t('active') : t('inactive')}
                      </p>
                    </div>
                    
                    {subscription.status === 'active' && (
                      <div className="pt-4 border-t border-gray-200 dark:border-dark-border">
                        <button
                          onClick={() => setShowCancelConfirm(true)}
                          className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                        >
                          <X className="w-4 h-4" />
                          <span>Abunəliyi ləğv et</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{t('noActiveSubscription')}</p>
                    <button
                      onClick={() => window.location.href = '/checkout?type=subscription'}
                      className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                    >
                      {t('selectPackage')}
                    </button>
                  </div>
                )}
              </div>

              {/* Top-up Purchase (only for users with active subscription) */}
              <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                    <CreditCard className="w-5 h-5" />
                    <span>{t('topupCredit')}</span>
                  </h2>
                  {subscription && subscription.status === 'active' ? (
                    <button
                      onClick={() => setShowCreditModal(true)}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                    >
                      {t('buyTopup')}
                    </button>
                  ) : (
                    <button
                      onClick={() => window.location.href = '/checkout?type=subscription'}
                      className="px-4 py-2 bg-gray-200 dark:bg-dark-hover text-gray-700 dark:text-gray-300 rounded-lg font-medium cursor-pointer"
                    >
                      {t('selectPackage')}
                    </button>
                  )}
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  {t('topupDescription')}
                </p>
                {(!subscription || subscription.status !== 'active') && (
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    {t('topupRequiresSubscription')}
                  </p>
                )}
              </div>
            </div>

            {/* Payment History */}
            <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
                <Download className="w-5 h-5" />
                <span>Ödəniş Tarixçəsi</span>
              </h2>

              {invoices.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                  {t('noInvoices')}
                </p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {invoices.map((invoice) => (
                    <div
                      key={invoice.id}
                      className="border border-gray-200 dark:border-dark-border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-dark-hover transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {invoice.type === 'subscription' ? (
                            <Package className="w-4 h-4 text-blue-500" />
                          ) : (
                            <CreditCard className="w-4 h-4 text-green-500" />
                          )}
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {invoice.type === 'subscription' ? 'Abunəlik' : 'Top-up'}
                          </span>
                        </div>
                        <span className={`text-xs font-semibold px-2 py-1 rounded ${
                          invoice.status === 'completed' 
                            ? 'text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/20' 
                            : invoice.status === 'pending'
                            ? 'text-yellow-700 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20'
                            : 'text-gray-700 bg-gray-100 dark:text-gray-400 dark:bg-gray-800'
                        }`}>
                          {invoice.status === 'completed' ? 'Tamamlandı' : 
                           invoice.status === 'pending' ? 'Gözləyir' : 
                           invoice.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                          {invoice.amount} {invoice.currency}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(invoice.created_at)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <CreditModal 
        isOpen={showCreditModal} 
        onClose={() => setShowCreditModal(false)} 
      />

      {/* Cancel Subscription Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-dark-card rounded-lg border border-gray-200 dark:border-dark-border max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Abunəliyi ləğv et
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Bu əməliyyat geri alına bilməz
                </p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                Abunəliyinizi ləğv etmək istədiyinizə əminsiniz?
              </p>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside">
                <li>Abunəliyiniz dərhal ləğv ediləcək</li>
                <li>Qalan kreditlər qorunacaq</li>
                <li>Avtomatik yenilənmə dayandırılacaq</li>
              </ul>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-dark-hover hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium transition-colors"
              >
                Ləğv et
              </button>
              <button
                onClick={handleCancelSubscription}
                disabled={cancelling}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-red-400 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                {cancelling ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Ləğv edilir...</span>
                  </>
                ) : (
                  <>
                    <X className="w-4 h-4" />
                    <span>Bəli, ləğv et</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </ModernBackground>
  )
}

