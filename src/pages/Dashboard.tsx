import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ToolCard from '../components/ToolCard'
import BuyCreditsButton from '../components/BuyCreditsButton'
import { aiTools } from '../data/tools'
import { AITool } from '../types'
import { useCreditStore } from '../store/creditStore'
import { useTranslation } from '../store/languageStore'
import { useAuthStore } from '../store/authStore'
import { useSearchStore } from '../store/searchStore'
import { useFavoritesStore } from '../store/favoritesStore'
import { authAPI } from '../services/api'
import CreditModal from '../components/CreditModal'
import SEO from '../components/SEO'
import StructuredData from '../components/StructuredData'
import { AlertCircle, Zap, Search, X, Heart } from 'lucide-react'

export default function Dashboard() {
  const navigate = useNavigate()
  const { credits } = useCreditStore()
  const { user, updateCredits, fetchProfile } = useAuthStore()
  const { showSearch, setShowSearch } = useSearchStore()
  const { favoriteTools, recentlyUsed, addRecentlyUsed } = useFavoritesStore()
  const t = useTranslation()
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'video' | 'image' | 'audio' | 'my'>('all')
  const [showCreditModal, setShowCreditModal] = useState(false)
  const [heldCredits, setHeldCredits] = useState(0)
  const [availableCredits, setAvailableCredits] = useState(0)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTools = (() => {
    let tools: AITool[]
    
    if (selectedCategory === 'my') {
      // Show favorite tools first, then recently used
      const favoriteToolIds = new Set(favoriteTools)
      const recentToolIds = new Set(recentlyUsed)
      const myToolIds = new Set([...favoriteTools, ...recentlyUsed])
      
      tools = aiTools.filter(tool => myToolIds.has(tool.id))
      // Sort: favorites first, then recently used, then by name
      tools.sort((a, b) => {
        const aIsFavorite = favoriteToolIds.has(a.id)
        const bIsFavorite = favoriteToolIds.has(b.id)
        if (aIsFavorite && !bIsFavorite) return -1
        if (!aIsFavorite && bIsFavorite) return 1
        
        const aIsRecent = recentToolIds.has(a.id)
        const bIsRecent = recentToolIds.has(b.id)
        if (aIsRecent && !bIsRecent) return -1
        if (!aIsRecent && bIsRecent) return 1
        
        return a.name.localeCompare(b.name)
      })
    } else if (selectedCategory === 'all') {
      tools = aiTools
    } else {
      tools = aiTools.filter(tool => tool.category === selectedCategory)
    }
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      tools = tools.filter(tool =>
        tool.name.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.id.toLowerCase().includes(query)
      )
    }
    
    return tools
  })()

  // Load user profile with held credits - only once on mount
  useEffect(() => {
    if (!user) {
      setHeldCredits(0)
      setAvailableCredits(0)
      setLoading(false)
      return
    }
    
    let isMounted = true
    let hasLoaded = false
    
    const loadProfile = async () => {
      if (hasLoaded || !isMounted) return
      hasLoaded = true
      
      try {
        setLoading(true)
        console.log('[Dashboard] Fetching profile with held credits')
        const profile = await authAPI.getProfile()
        
        if (!isMounted) return
        
        const newHeldCredits = profile.held_credits || 0
        const newAvailableCredits = profile.available_credits || profile.credits || 0
        
        setHeldCredits(newHeldCredits)
        setAvailableCredits(newAvailableCredits)
        updateCredits(profile.credits || 0)
      } catch (error) {
        console.error('Failed to load profile:', error)
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }
    
    // Load once on mount
    loadProfile()
    
    return () => {
      isMounted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Empty deps - only run once on mount

  const handleUseTool = (tool: AITool) => {
    if (credits < tool.creditCost) {
      setShowCreditModal(true)
      return
    }

    addRecentlyUsed(tool.id)
    // Navigate to Create page with selected tool
    navigate(`/create?tool=${tool.id}`)
  }

  const categories: Array<{
    id: 'all' | 'video' | 'image' | 'audio' | 'my'
    name: string
    icon?: typeof Heart
  }> = [
    { id: 'all', name: t('allTools') },
    { id: 'my', name: 'My' },
    { id: 'video', name: t('video') },
    { id: 'image', name: t('image') },
    { id: 'audio', name: t('audio') },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg">
      <SEO 
        title="Dashboard - AI Alətləri"
        description="AI video və şəkil yaratma alətlərinə daxil olun. Pika Labs, Sora, Kling AI, Flux və digər güclü modellər."
        url="https://timera.ai/dashboard"
      />
      <StructuredData type="SoftwareApplication" />
      <SEO 
        title="Dashboard - AI Alətləri"
        description="Burlart dashboard. Bütün AI video və şəkil yaratma alətlərinə çıxış əldə edin."
        keywords="AI tools, AI dashboard, video tools, image tools, Burlart"
        url="https://timera.ai/dashboard"
      />
      <div className="container mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('aiToolsDashboard')}</h1>
              <p className="text-gray-600 dark:text-gray-400">
                {t('accessTools')}
              </p>
            </div>
            <BuyCreditsButton />
          </div>

          {/* Credit Balance Banner */}
          <div className={`${availableCredits === 0 ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-500/30' : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-500/30'} border rounded-lg p-4 mb-6`}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-2">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('availableCredit')}</p>
                    <p className={`text-3xl font-bold ${availableCredits === 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                      {loading ? '...' : availableCredits}
                    </p>
                  </div>
                  {heldCredits > 0 && (
                    <div className="border-l border-gray-300 dark:border-gray-600 pl-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('heldCredits')}</p>
                      <p className="text-xl font-semibold text-orange-500 dark:text-orange-400">
                        {heldCredits}
                      </p>
                    </div>
                  )}
                  <div className="border-l border-gray-300 dark:border-gray-600 pl-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('totalBalance')}</p>
                    <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                      {loading ? '...' : credits}
                    </p>
                  </div>
                </div>
                {availableCredits === 0 && (
                  <div className="flex items-center space-x-2 text-sm text-red-600 dark:text-red-400 mt-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>Kreditləriniz bitib. Top-up alın ki, AI alətlərindən istifadə edə biləsiniz.</span>
                  </div>
                )}
                {heldCredits > 0 && availableCredits > 0 && (
                  <div className="flex items-center space-x-2 text-sm text-orange-600 dark:text-orange-400 mt-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>{t('creditsHeldProcessing').replace('{count}', heldCredits.toString())}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {availableCredits < credits * 0.2 && credits > 0 && (
                  <button
                    onClick={() => setShowCreditModal(true)}
                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
                  >
                    <Zap className="w-4 h-4" />
                    <span>{t('creditsLowTopup')}</span>
                  </button>
                )}
                {availableCredits === 0 && (
                  <button
                    onClick={() => setShowCreditModal(true)}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
                  >
                    <Zap className="w-4 h-4" />
                    <span>{t('topupContinue') || 'Top-up al'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Search and Category Filter */}
          <div className="mb-6 space-y-4">
            {/* Search Bar */}
            {showSearch && (
              <div className="relative transition-all duration-200 ease-in-out">
                <div className="flex items-center space-x-2">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder={t('searchModels') || 'Modelləri axtar...'}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                      className={`w-full pl-10 py-2 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${searchQuery ? 'pr-20' : 'pr-10'}`}
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        title="Clear search"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setSearchQuery('')
                        setShowSearch(false)
                      }}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      title="Close search"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Category Filter */}
            <div className="flex items-center space-x-2 flex-wrap gap-2">
              {categories.map((category) => {
                const Icon = category.icon
                const isMyCategory = category.id === 'my'
                const myToolsCount = isMyCategory ? new Set([...favoriteTools, ...recentlyUsed]).size : 0
                
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                      selectedCategory === category.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-dark-card text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-hover'
                    } ${isMyCategory && myToolsCount === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={isMyCategory && myToolsCount === 0}
                    title={isMyCategory && myToolsCount === 0 ? 'No favorite or recently used tools yet' : ''}
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                    <span>{category.name}</span>
                    {isMyCategory && myToolsCount > 0 && (
                      <span className="text-xs bg-blue-500/20 dark:bg-blue-400/20 px-2 py-0.5 rounded-full">
                        {myToolsCount}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} onUse={handleUseTool} />
          ))}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">{t('noToolsAvailable')}</p>
          </div>
        )}
      </div>

      <CreditModal isOpen={showCreditModal} onClose={() => setShowCreditModal(false)} />
    </div>
  )
}

