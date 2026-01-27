import { useNavigate, useSearchParams } from 'react-router-dom'
import { XCircle, ArrowLeft } from 'lucide-react'
import SEO from '../components/SEO'

export default function CheckoutCancel() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const error = searchParams.get('error')

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg">
      <SEO 
        title="Ödəniş Ləğv Edildi - Checkout Cancel"
        description="Ödəniş ləğv edildi"
        url="https://timera.ai/checkout/cancel"
      />
      
      <div className="container mx-auto px-6 py-16 max-w-2xl">
        <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Ödəniş ləğv edildi
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {error || 'Ödəniş prosesi ləğv edildi və ya uğursuz oldu.'}
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => navigate('/landing')}
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Paketlərə qayıt</span>
            </button>
            <button
              onClick={() => navigate('/billing')}
              className="w-full py-3 bg-gray-100 dark:bg-dark-hover hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium transition-colors"
            >
              Ödəniş səhifəsinə qayıt
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

