import { useState, useEffect } from 'react'
import { X, Loader2 } from 'lucide-react'
import { useCreditStore } from '../store/creditStore'
import { useAuthStore } from '../store/authStore'
import { useToastStore } from '../store/toastStore'
import { topupAPI } from '../services/api'

interface CreditModalProps {
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

export default function CreditModal({ isOpen, onClose }: CreditModalProps) {
  const { user, updateCredits } = useAuthStore()
  const { success, error: showError } = useToastStore()
  const [packages, setPackages] = useState<TopUpPackage[]>([])
  const [loading, setLoading] = useState(false)
  const [purchasing, setPurchasing] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      loadPackages()
    }
  }, [isOpen])

  const loadPackages = async () => {
    try {
      setLoading(true)
      const data = await topupAPI.getPackages()
      setPackages(data)
    } catch (error) {
      console.error('Failed to load top-up packages:', error)
      showError('Kredit paketləri yüklənmədi. Yenidən cəhd edin.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  const handlePurchase = async (packageId: string) => {
    if (!user) {
      alert('Please login first')
      return
    }

    setPurchasing(packageId)
    try {
      // In production, integrate with payment processor here
      // For now, we'll create the purchase and auto-complete it
      const result = await topupAPI.createTopup(packageId, `mock_payment_${Date.now()}`)
      
      // Update user credits in store
      if (result.user_credits !== undefined) {
        updateCredits(result.user_credits)
      } else if (result.user?.credits !== undefined) {
        updateCredits(result.user.credits)
      }
      
      const pkg = packages.find(p => p.id === packageId)
      const creditsAdded = pkg?.total_credits || result.total_credits || result.credits_purchased || result.credits || 0
      success(`${creditsAdded} kredit uğurla əlavə olundu!`)
      onClose()
    } catch (error: any) {
      console.error('Purchase failed:', error)
      
      // More detailed error messages
      let errorMessage = 'Ödəniş uğursuz oldu. Yenidən cəhd edin.'
      
      if (error.response?.data) {
        const errorData = error.response.data
        if (errorData.error) {
          errorMessage = errorData.error
        } else if (errorData.detail) {
          errorMessage = errorData.detail
        } else if (typeof errorData === 'string') {
          errorMessage = errorData
        } else if (errorData.message) {
          errorMessage = errorData.message
        }
      } else if (error.message) {
        errorMessage = error.message
      }
      
      showError(errorMessage)
    } finally {
      setPurchasing(null)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-card rounded-lg border border-dark-border max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-dark-card border-b border-dark-border p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Buy Credits</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-dark-hover rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-300" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-400 mb-6">
            Choose a credit package to continue using AI tools
          </p>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {packages.map((pkg) => (
                <button
                  key={pkg.id}
                  onClick={() => handlePurchase(pkg.id)}
                  disabled={purchasing === pkg.id}
                  className={`relative p-6 rounded-lg border-2 transition-all text-left ${
                    pkg.popular
                      ? 'border-blue-500 bg-dark-hover'
                      : 'border-dark-border hover:border-gray-500'
                  } ${purchasing === pkg.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {pkg.popular && (
                    <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-xs px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  )}
                  <div className="mb-2">
                    <div className="text-2xl font-bold text-white">
                      {purchasing === pkg.id ? (
                        <Loader2 className="w-6 h-6 animate-spin inline" />
                      ) : (
                        `${pkg.currency}${pkg.price}`
                      )}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">
                      {pkg.credits} credits
                      {pkg.bonus_credits > 0 && (
                        <span className="text-green-400 ml-1">+{pkg.bonus_credits} bonus</span>
                      )}
                      <span className="text-gray-500 ml-1">({pkg.total_credits} total)</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          <div className="mt-6 p-4 bg-dark-hover rounded-lg">
            <p className="text-sm text-gray-400">
              💳 Secure payment processing. Credits never expire.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

