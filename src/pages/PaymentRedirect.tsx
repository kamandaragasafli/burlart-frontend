import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

/**
 * Payment redirect component for EPOINT callbacks
 * EPOINT redirects to /payment/success or /payment/error
 * This component extracts parameters and redirects to backend API
 */
export default function PaymentRedirect({ type }: { type: 'success' | 'error' }) {
  const [searchParams] = useSearchParams()

  useEffect(() => {
    // Get all query parameters from EPOINT
    const params = new URLSearchParams(searchParams)
    
    // Backend API URL - detect production environment
    const isProduction = window.location.hostname === 'burlart.az' || 
                        window.location.hostname === 'www.burlart.az'
    const backendUrl = isProduction 
      ? 'https://api.burlart.az'
      : 'http://localhost:8000'
    
    // Redirect to backend with all parameters
    const redirectUrl = `${backendUrl}/api/auth/payment/${type}/?${params.toString()}`
    
    console.log(`Redirecting to backend ${type} endpoint:`, redirectUrl)
    window.location.href = redirectUrl
  }, [searchParams, type])

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">
          {type === 'success' ? 'Ödəniş yoxlanılır...' : 'Yönləndirilir...'}
        </p>
      </div>
    </div>
  )
}

