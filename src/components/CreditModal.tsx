import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Loader2 } from 'lucide-react'
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
  const navigate = useNavigate()
  const [packages, setPackages] = useState<TopUpPackage[]>([])
  const [loading, setLoading] = useState(false)
  const [purchasing, setPurchasing] = useState<string | null>(null)
  const [purchasedPackages, setPurchasedPackages] = useState<string[]>([])

  useEffect(() => {
    if (isOpen) {
      loadPackages()
      loadPurchaseHistory()
    }
  }, [isOpen])

  const loadPurchaseHistory = async () => {
    if (!user) return
    try {
      const history = await topupAPI.getHistory()
      // Get list of purchased package IDs
      const purchasedIds = history
        .filter((item: any) => item.status === 'completed')
        .map((item: any) => item.package)
      setPurchasedPackages(purchasedIds)
    } catch (error) {
      console.error('Failed to load purchase history:', error)
    }
  }

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

  const handlePurchase = (packageId: string) => {
    if (!user) {
      alert('Please login first')
      return
    }

    // Don't allow purchasing the same package again
    if (purchasedPackages.includes(packageId)) {
      return
    }

    // Navigate to checkout page for payment
    navigate(`/checkout?type=topup&package=${packageId}`)
    onClose()
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
              {packages.map((pkg) => {
                const isPurchased = purchasedPackages.includes(pkg.id)
                return (
                  <div
                    key={pkg.id}
                    className={`relative p-6 rounded-lg border-2 transition-all ${
                      isPurchased ? 'opacity-75 cursor-not-allowed' : ''
                    } ${
                      pkg.popular
                        ? 'border-blue-500 bg-dark-hover'
                        : 'border-dark-border hover:border-gray-500'
                    }`}
                  >
                    {pkg.popular && (
                      <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-xs px-3 py-1 rounded-full">
                        Most Popular
                      </span>
                    )}
                    {isPurchased && (
                      <span className="absolute top-4 right-4 bg-green-500 text-white text-xs px-3 py-1 rounded-full">
                        Alınmış
                      </span>
                    )}
                    <div className="mb-4">
                      <div className="text-2xl font-bold text-white">
                        {pkg.currency}{pkg.price}
                      </div>
                      <div className="text-sm text-gray-400 mt-1">
                        {pkg.credits} credits
                        {pkg.bonus_credits > 0 && (
                          <span className="text-green-400 ml-1">+{pkg.bonus_credits} bonus</span>
                        )}
                        <span className="text-gray-500 ml-1">({pkg.total_credits} total)</span>
                      </div>
                    </div>
                    {!isPurchased && (
                      <button
                        onClick={() => handlePurchase(pkg.id)}
                        disabled={purchasing === pkg.id}
                        className={`w-full py-3 rounded-lg font-medium transition-colors ${
                          pkg.popular
                            ? 'bg-blue-500 hover:bg-blue-600 text-white'
                            : 'bg-dark-card hover:bg-gray-700 text-white border border-dark-border'
                        } ${purchasing === pkg.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {purchasing === pkg.id ? (
                          <Loader2 className="w-5 h-5 animate-spin inline" />
                        ) : (
                          'Al'
                        )}
                      </button>
                    )}
                    {isPurchased && (
                      <button
                        disabled
                        className="w-full py-3 rounded-lg font-medium bg-dark-card text-gray-500 cursor-not-allowed border border-dark-border"
                      >
                        Alınmış Paket
                      </button>
                    )}
                  </div>
                )
              })}
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

