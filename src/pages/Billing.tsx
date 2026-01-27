import { useState, useEffect } from 'react'
import { useAuthStore } from '../store/authStore'
import { useTranslation } from '../store/languageStore'
import { subscriptionAPI, topupAPI } from '../services/api'
import SEO from '../components/SEO'
import CreditModal from '../components/CreditModal'
import { Calendar, CreditCard, Package, Download } from 'lucide-react'

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
  const { user } = useAuthStore()
  const t = useTranslation()
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreditModal, setShowCreditModal] = useState(false)

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
      const formattedInvoices: Invoice[] = topupHistory.map((purchase: any) => ({
        id: purchase.id,
        type: 'topup' as const,
        amount: purchase.price,
        currency: purchase.currency,
        status: purchase.status,
        created_at: purchase.created_at,
      }))

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
      <div className="min-h-screen bg-white dark:bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">{t('pleaseLogin')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg">
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

              {/* Top-up Purchase */}
              <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                    <CreditCard className="w-5 h-5" />
                    <span>{t('topupCredit')}</span>
                  </h2>
                  <button
                    onClick={() => setShowCreditModal(true)}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                  >
                    {t('buyTopup')}
                  </button>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('topupDescription')}
                </p>
              </div>
            </div>

            {/* Invoices */}
            <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
                <Download className="w-5 h-5" />
                <span>{t('invoices')}</span>
              </h2>

              {invoices.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                  {t('noInvoices')}
                </p>
              ) : (
                <div className="space-y-4">
                  {invoices.map((invoice) => (
                    <div
                      key={invoice.id}
                      className="border border-gray-200 dark:border-dark-border rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {invoice.type === 'subscription' ? t('subscription') : t('topupCredit')}
                        </span>
                        <span className={`text-sm font-semibold ${
                          invoice.status === 'completed' ? 'text-green-500' : 'text-gray-500'
                        }`}>
                          {invoice.status === 'completed' ? t('completed') : invoice.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
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
    </div>
  )
}

