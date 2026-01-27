import { useState } from 'react'
import { CreditCard } from 'lucide-react'
import CreditModal from './CreditModal'

export default function BuyCreditsButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
      >
        <CreditCard className="w-4 h-4" />
        <span>Buy Credits</span>
      </button>
      <CreditModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}

