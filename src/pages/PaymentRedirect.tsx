import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

/**
 * Payment redirect component for EPOINT callbacks
 * EPOINT redirects to /payment/success or /payment/error
 * This component extracts parameters and redirects to backend API
 */
export default function PaymentRedirect({ type }: { type: 'success' | 'error' }) {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { fetchProfile } = useAuthStore()
  const [status, setStatus] = useState<'loading' | 'checking' | 'success' | 'error'>('loading')

  useEffect(() => {
    const handleRedirect = async () => {
      // Get all query parameters from EPOINT
      const params = new URLSearchParams(searchParams)
      const transactionId = params.get('transaction') || params.get('transaction_id')
      
      // Backend API URL - detect production environment
      const isProduction = window.location.hostname === 'burlart.az' || 
                          window.location.hostname === 'www.burlart.az'
      const backendUrl = isProduction 
        ? 'https://api.burlart.az'
        : 'http://localhost:8000'
      
      // If we have transaction ID, redirect to backend
      if (transactionId) {
        const redirectUrl = `${backendUrl}/api/auth/payment/${type}/?${params.toString()}`
        console.log(`Redirecting to backend ${type} endpoint:`, redirectUrl)
        window.location.href = redirectUrl
        return
      }
      
      // If no transaction ID (EPOINT didn't send it), wait for webhook
      if (type === 'success') {
        setStatus('checking')
        
        // Wait a bit for webhook to process (webhook might complete payment)
        // Check multiple times if payment was completed
        let attempts = 0
        const maxAttempts = 5
        
        while (attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          // Try to refresh profile to see if credits were added
          try {
            await fetchProfile()
            
            // Check if user has credits (webhook completed payment)
            // If credits increased, payment was completed
            const user = useAuthStore.getState().user
            if (user && user.credits > 0) {
              // Payment completed! Redirect to success page
              navigate('/checkout/success?type=subscription')
              return
            }
          } catch (error) {
            console.error('Error fetching profile:', error)
          }
          
          attempts++
        }
        
        // After max attempts, redirect anyway (webhook might be delayed)
        navigate('/checkout/success?type=subscription')
      } else {
        // Error case - redirect to cancel page
        navigate('/checkout/cancel?error=Payment failed')
      }
    }

    handleRedirect()
  }, [searchParams, type, navigate, fetchProfile])

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">
          {status === 'loading' && (type === 'success' ? 'Ödəniş yoxlanılır...' : 'Yönləndirilir...')}
          {status === 'checking' && 'Ödəniş tamamlanır...'}
        </p>
      </div>
    </div>
  )
}

