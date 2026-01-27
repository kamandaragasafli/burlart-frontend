import SEO from '../components/SEO'
import { useTranslation } from '../store/languageStore'

export default function Documents() {
  const t = useTranslation()

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg">
      <SEO
        title="Legal & Documents - Burlart"
        description="Read Burlart legal documents: privacy policy, terms of use, cookie policy and refund policy."
        url="https://timera.ai/documents"
      />

      <div className="container mx-auto px-6 py-10 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t('legalDocuments') || 'Legal & documents'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          {t('documentsIntro') ||
            'Here you can review how Burlart handles your data, usage rules and refund conditions.'}
        </p>

        <div className="space-y-8">
          <section className="bg-gray-50 dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg p-5">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {t('privacyPolicy') || 'Privacy policy'}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Burlart collects only the minimum personal data required to operate your account, process
              payments and provide AI generation services. We never sell your data to third parties. Some
              providers (payment, analytics, AI infrastructure) may process data on our behalf to deliver
              the service securely and reliably.
            </p>
          </section>

          <section className="bg-gray-50 dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg p-5">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {t('termsOfUse') || 'Terms of use'}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              By using Burlart you agree not to generate illegal, violent, hateful or harmful content and
              to comply with the usage limits of your credit balance or subscription. We may suspend access
              in case of abuse, fraud or violation of applicable law or model provider policies.
            </p>
          </section>

          <section className="bg-gray-50 dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg p-5">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {t('cookiePolicy') || 'Cookie policy'}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              We use cookies and similar technologies to keep you logged in, remember your preferences
              (language, theme) and understand anonymised product usage. You can control cookies from your
              browser settings; disabling some cookies may affect functionality of the site.
            </p>
          </section>

          <section className="bg-gray-50 dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg p-5">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {t('refundPolicy') || 'Refund & cancellation policy'}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Digital credits and subscriptions are generally non-refundable once used. If you experience
              technical issues or are charged by mistake, please contact support and we will review each
              case individually. Where required by local law we will provide refunds or balance corrections.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}


