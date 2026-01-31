import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { 
  Plus, 
  Sliders, 
  ArrowRight, 
  Eraser,
  ChevronDown,
  Image as ImageIcon,
  Video as VideoIcon,
  Loader2,
  Zap,
  Search,
  X,
  Download,
  ImagePlus,
  Video as VideoLucide,
  Sparkles,
  FileText,
  ScrollText,
  Music,
  Film,
  Crown,
  Maximize2,
  Eye
} from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { videoAPI, imageAPI, subscriptionAPI } from '../services/api'
import { aiTools } from '../data/tools'
import { templates } from '../data/templates'
import { AITool } from '../types'
import { useTranslation } from '../store/languageStore'
import { useToastStore } from '../store/toastStore'
import SEO from '../components/SEO'
import CreditModal from '../components/CreditModal'
import ModernBackground from '../components/ModernBackground'

type ContentType = 'image' | 'video'

export default function Create() {
  const [searchParams] = useSearchParams()
  const toolFromUrl = searchParams.get('tool')
  
  const [prompt, setPrompt] = useState('')
  const [contentType, setContentType] = useState<ContentType>('video')
  const [selectedTool, setSelectedTool] = useState(() => {
    // Set initial tool from URL if provided, otherwise default to 'pika'
    if (toolFromUrl) {
      const tool = aiTools.find(t => t.id === toolFromUrl)
      if (tool) {
        return toolFromUrl
      }
    }
    return 'pika'
  })
  const [showToolsDropdown, setShowToolsDropdown] = useState(false)
  const [showControlsDropdown, setShowControlsDropdown] = useState(false)
  const [toolSearchQuery, setToolSearchQuery] = useState('')
  const [showPromptMenu, setShowPromptMenu] = useState(false)
  const [showPromptLibrary, setShowPromptLibrary] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedTemplatePreview, setSelectedTemplatePreview] = useState<typeof templates[0] | null>(null)
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [referenceImage, setReferenceImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  
  // Controls state
  const [version, setVersion] = useState<'fast' | 'standard'>('fast')
  const [characterReference, setCharacterReference] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [resolution, setResolution] = useState<'720p' | '1080p'>('720p')
  const [duration, setDuration] = useState(4) // in seconds (allowed: 4, 8, 12)
  const [seed, setSeed] = useState('')
  const [randomizeSeed, setRandomizeSeed] = useState(true)
  const [negativePrompt, setNegativePrompt] = useState('')
  
  const { user, updateCredits, fetchProfile } = useAuthStore()
  const [showCreditModal, setShowCreditModal] = useState(false)
  const [hasSubscription, setHasSubscription] = useState<boolean | null>(null)
  const t = useTranslation()
  const { success, info, error: showError } = useToastStore()

  // Get available tools based on content type and reference image
  const availableTools = aiTools.filter(tool => {
    if (tool.category !== contentType || !tool.enabled) return false
    
    // For video category, show both text-to-video and image-to-video models
    // Image-to-video models will be available when user has a reference image
    if (contentType === 'video') {
      // Show all video models (both text-to-video and image-to-video)
      return true
    }
    
    return true
  })
  const selectedToolData = availableTools.find(tool => tool.id === selectedTool) || availableTools[0]
  
  // Set tool from URL when component mounts or URL changes
  useEffect(() => {
    if (toolFromUrl) {
      const tool = aiTools.find(t => t.id === toolFromUrl)
      if (tool && tool.enabled) {
        // Set content type based on tool category
        if (tool.category === 'video' || tool.category === 'image') {
          setContentType(tool.category)
        }
        setSelectedTool(toolFromUrl)
      }
    }
  }, [toolFromUrl])

  // Set default tool when content type changes or if current selection is invalid
  // Also reselect tool when reference image is added/removed
  useEffect(() => {
    if (availableTools.length > 0 && (!selectedTool || !availableTools.find(t => t.id === selectedTool))) {
      setSelectedTool(availableTools[0].id)
    }
  }, [contentType, availableTools, selectedTool, referenceImage])

  // Check subscription status
  useEffect(() => {
    const checkSubscription = async () => {
      if (!user) {
        setHasSubscription(false)
        return
      }
      try {
        const subscriptionInfo = await subscriptionAPI.getInfo()
        setHasSubscription(subscriptionInfo.has_subscription && subscriptionInfo.is_active)
      } catch (error) {
        console.error('Error checking subscription:', error)
        setHasSubscription(false)
      }
    }
    checkSubscription()
  }, [user])

  // Generate random seed
  const generateRandomSeed = () => {
    return Math.floor(Math.random() * 100000000).toString()
  }

  useEffect(() => {
    if (randomizeSeed) {
      setSeed(generateRandomSeed())
    }
  }, [randomizeSeed])

  // Image upload for prompt helpers (Image menu)
  const handleImageMenuClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
    setShowPromptMenu(false)
  }

  const handleImageSelected: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0]
    if (!file) {
      console.log('No file selected')
      return
    }

    console.log('File selected:', file.name, file.type, file.size)

    // Validate file type - check both MIME type and file extension
    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/bmp', 'image/svg+xml']
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg']
    const fileName = file.name.toLowerCase()
    const fileExtension = fileName.includes('.') ? '.' + fileName.split('.').pop() : ''

    // Check if file type is valid (MIME type or extension)
    const hasValidMimeType = file.type && (validImageTypes.includes(file.type.toLowerCase()) || file.type.startsWith('image/'))
    const hasValidExtension = fileExtension && validExtensions.includes(fileExtension)

    // If neither MIME type nor extension is valid, reject the file
    if (!hasValidMimeType && !hasValidExtension) {
      console.error('Invalid file type:', {
        name: file.name,
        type: file.type,
        extension: fileExtension,
        size: file.size
      })
      showError(`Yalnız şəkil faylları yükləyə bilərsiniz. (JPG, PNG, GIF, WEBP, BMP, SVG)\nFayl: ${file.name}\nTip: ${file.type || 'məlum deyil'}`)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      showError('Şəkil ölçüsü 10MB-dan böyük ola bilməz.')
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      return
    }

    try {
      // Create object URL for preview
      const url = URL.createObjectURL(file)
      console.log('Created object URL:', url)
      setReferenceImage(url)
      
      // Only auto-switch to video mode if we're not already in image mode
      // If in image mode, stay in image mode (for image editing models)
      if (contentType !== 'image') {
        // Auto-switch to video mode (image-to-video) when user uploads an image
        setContentType('video')
        
        // Auto-select an image-to-video model if available
        const imageToVideoTools = aiTools.filter(tool => tool.category === 'video' && tool.requiresImage && tool.enabled)
        if (imageToVideoTools.length > 0) {
          // Select the first available image-to-video tool
          setSelectedTool(imageToVideoTools[0].id)
        }
      } else {
        // We're in image mode, auto-select an image editing model if available
        const imageEditTools = aiTools.filter(tool => tool.category === 'image' && tool.requiresImage && tool.enabled)
        if (imageEditTools.length > 0) {
          // Select the first available image editing tool
          setSelectedTool(imageEditTools[0].id)
        }
      }
      
      success('Şəkil uğurla yükləndi!')
    } catch (error) {
      console.error('Error creating object URL:', error)
      showError('Şəkil yüklənərkən xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.')
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  // Prompt helper actions (Sliders menu)
  const addTextToPrompt = (text: string) => {
    setPrompt((prev) => {
      if (!prev.trim()) return text
      return `${prev.trim()}\n\n${text}`
    })
  }

  const handleAddToPrompt = () => {
    // Open advanced prompt presets modal
    setShowPromptLibrary(true)
    setShowPromptMenu(false)
  }

  const handlePromptStyle = () => {
    const styleSuffix = ' in cinematic, high‑quality, detailed style.'
    setPrompt((prev) => (prev || '') + styleSuffix)
    setShowPromptMenu(false)
  }

  const handleCreate = async () => {
    if (!prompt.trim()) {
      alert(t('enterPrompt') || 'Please enter a prompt')
      return
    }

    if (!user) {
      alert(t('loginRequired') || 'Please login first')
      return
    }

    // Check if user has active subscription
    if (hasSubscription === false) {
      showError('Abunəlik tələb olunur. Zəhmət olmasa paket seçin.')
      setTimeout(() => {
        window.location.href = '/landing'
      }, 2000)
      return
    }

    const tool = availableTools.find(t => t.id === selectedTool)
    if (!tool) {
      alert(t('selectTool') || 'Please select a tool')
      return
    }

    if (user.credits < tool.creditCost) {
      const creditText = user.credits === 0 
        ? 'Kreditləriniz bitib. Top-up alın.' 
        : `Kredit yetərsizdir. Tələb olunan: ${tool.creditCost} kredit, Mövcud: ${user.credits} kredit. Top-up alın.`
      showError(creditText)
      setShowCreditModal(true)
      return
    }

    setIsGenerating(true)
    setGeneratedVideo(null)
    setGeneratedImage(null)

    try {
      // Show job submitted toast
      info(`${contentType === 'video' ? 'Video' : 'Image'} job göndərildi. Kreditlər hold edildi.`)

    if (contentType === 'video') {
        // Prepare options for video
        const options = {
          version,
          characterReference,
          soundEnabled: selectedToolData?.hasSound ? soundEnabled : false,
          resolution,
          duration,
          seed: randomizeSeed ? generateRandomSeed() : seed,
          negativePrompt: negativePrompt.trim() || undefined,
          referenceImage,
        }
        
        const result = await videoAPI.generateVideo(prompt, selectedTool, options)
        
        // Update credits - backend handles hold/confirm/release
        if (result.user?.credits !== undefined) {
          updateCredits(result.user.credits)
        } else if (result.credits !== undefined) {
          updateCredits(result.credits)
        } else {
          // If credits not in response, fetch profile to get updated credits
          await fetchProfile()
        }
        
        // Set the generated video URL
        if (result.video_url) {
          setGeneratedVideo(result.video_url)
          success('Video uğurla yaradıldı! Kreditlər təsdiqləndi.')
        } else {
          info('Video emal olunur. Kreditlər job tamamlananda təsdiqlənəcək.')
        }
      } else if (contentType === 'image') {
        // Prepare options for image
        const options = {
          seed: randomizeSeed ? generateRandomSeed() : seed,
          negativePrompt: negativePrompt.trim() || undefined,
          referenceImage,
        }
        
        const result = await imageAPI.generateImage(prompt, selectedTool, options)
        
        // Update credits - backend handles hold/confirm/release
        if (result.user?.credits !== undefined) {
          updateCredits(result.user.credits)
        } else if (result.credits !== undefined) {
          updateCredits(result.credits)
        } else {
          // If credits not in response, fetch profile to get updated credits
          await fetchProfile()
        }
        
        // Set the generated image URL
        if (result.image_url) {
          setGeneratedImage(result.image_url)
          success('Şəkil uğurla yaradıldı! Kreditlər təsdiqləndi.')
        } else {
          info('Şəkil emal olunur. Kreditlər job tamamlananda təsdiqlənəcək.')
        }
      }
    } catch (error: any) {
      console.error(`${contentType} generation error:`, error)
      
      // Credits will be released by backend on error
      if (error.response?.data?.error_type === 'INSUFFICIENT_CREDITS') {
        const required = error.response.data.required_credits
        const available = error.response.data.available_credits
        showError(`Kredit yetərsizdir. Tələb olunan: ${required}, Mövcud: ${available}`)
        setShowCreditModal(true)
      } else if (error.response?.data?.error) {
        showError(error.response.data.error)
      } else {
        const errorMsg = contentType === 'video' 
          ? 'Video yaradılması uğursuz oldu. Kreditlər geri qaytarıldı.'
          : 'Şəkil yaradılması uğursuz oldu. Kreditlər geri qaytarıldı.'
        showError(errorMsg)
      }
    } finally {
      setIsGenerating(false)
    }
  }

  // Format tool details for display
  const getToolDetails = (tool: typeof selectedToolData) => {
    if (!tool) return ''
    const parts = []
    if (tool.version) parts.push(tool.version)
    if (tool.tier) parts.push(tool.tier)
    if (tool.hasSound) parts.push('Sound')
    if (tool.duration) parts.push(tool.duration)
    return parts.join(' · ')
  }

  // Get icon for tool
  const getToolIcon = (tool: typeof selectedToolData) => {
    if (!tool) return Zap
    // Image-to-video models use ImagePlus icon
    if (tool.requiresImage) return ImagePlus
    
    const iconMap: Record<string, any> = {
      Video: VideoLucide,
      Sparkles,
      FileText,
      ScrollText,
      Image: ImageIcon,
      Music,
      Film,
      Zap,
      Crown,
    }
    
    return iconMap[tool.icon] || Zap
  }

  // Get icon for tool in dropdown list
  const getToolIconForList = (tool: AITool) => {
    if (tool.requiresImage) return ImagePlus
    
    const iconMap: Record<string, any> = {
      Video: VideoLucide,
      Sparkles,
      FileText,
      ScrollText,
      Image: ImageIcon,
      Music,
      Film,
      Zap,
      Crown,
    }
    
    return iconMap[tool.icon] || Zap
  }

  return (
    <ModernBackground className="flex flex-col">
      <SEO 
        title="Yaradıcılıq - AI Video və Şəkil Yarat"
        description="AI modelləri ilə video və şəkillər yaradın. Pika Labs, Sora, Kling AI, Flux, GPT Image və digər güclü alətlər."
        url="https://timera.ai/create"
      />
      <SEO 
        title="AI Video və Şəkil Yarat"
        description="Burlart ilə AI video və şəkillər yaradın. Pika Labs, Sora, Kling AI, Flux və digər modellərlə yaradıcılığınızı həyata keçirin."
        keywords="AI video yarat, AI şəkil yarat, video generator, image generator, Burlart"
        url="https://timera.ai/create"
      />
      {/* Main Content Area */}
      <div className="flex-1 flex items-start justify-center px-6 pt-10 pb-16 md:pt-16">
        <div className="w-full max-w-4xl">
          {/* Input Section */}
          <div className="relative mb-8">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={t('createPromptPlaceholder') || 'What do you want to create?'}
              className={`w-full h-48 bg-white dark:bg-dark-card border-2 border-gray-200 dark:border-dark-border rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none shadow-sm ${
                referenceImage ? 'pl-24 pr-12 pt-6 pb-6' : 'p-6'
              }`}
              disabled={isGenerating}
            />
            
            {/* Reference image preview inside textarea */}
            {referenceImage && (
              <div className="absolute top-6 left-6 w-20 h-20 rounded-md border-2 border-blue-400 dark:border-blue-500 overflow-hidden bg-gray-100 dark:bg-dark-hover shadow-lg group z-10">
                <img
                  src={referenceImage}
                  alt="Reference thumbnail"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error('Error loading image:', referenceImage)
                    showError('Şəkil yüklənə bilmədi. Zəhmət olmasa yenidən cəhd edin.')
                    setReferenceImage(null)
                    if (fileInputRef.current) {
                      fileInputRef.current.value = ''
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (referenceImage && referenceImage.startsWith('blob:')) {
                      URL.revokeObjectURL(referenceImage)
                    }
                    setReferenceImage(null)
                    if (fileInputRef.current) {
                      fileInputRef.current.value = ''
                    }
                  }}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label={t('removeImage') || 'Remove image'}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
            
            {/* Eraser Button */}
            {prompt && !isGenerating && (
              <button
                onClick={() => setPrompt('')}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-dark-hover rounded-lg transition-colors"
              >
                <Eraser className="w-5 h-5 text-gray-500 dark:text-gray-300" />
              </button>
            )}
          </div>

          {generatedVideo && (
            <div className="mb-6 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg p-4 shadow-sm">
              <h3 className="text-gray-900 dark:text-white font-medium mb-3">{t('generatedVideo') || 'Generated Video'}</h3>
              <video 
                src={generatedVideo} 
                controls 
                className="w-full rounded-lg"
              />
            </div>
          )}
          {generatedImage && (
            <div className="mb-6 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-gray-900 dark:text-white font-medium">{t('generatedImage') || 'Generated Image'}</h3>
                <button
                  onClick={() => {
                    const link = document.createElement('a')
                    link.href = generatedImage
                    link.download = `burlart-image-${Date.now()}.png`
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>{t('download') || 'Download'}</span>
                </button>
              </div>
              <img 
                src={generatedImage} 
                alt="Generated" 
                className="w-full rounded-lg"
              />
            </div>
          )}

          {/* Action Buttons Row */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <button 
                onClick={handleImageMenuClick}
                className="p-3 bg-gray-100 dark:bg-dark-card hover:bg-gray-200 dark:hover:bg-dark-hover border border-gray-200 dark:border-dark-border rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5 text-gray-800 dark:text-white" />
              </button>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowPromptMenu((prev) => !prev)}
                  className="p-3 bg-gray-100 dark:bg-dark-card hover:bg-gray-200 dark:hover:bg-dark-hover border border-gray-200 dark:border-dark-border rounded-lg transition-colors"
                >
                  <Sliders className="w-5 h-5 text-gray-800 dark:text-white" />
                </button>

                {showPromptMenu && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowPromptMenu(false)}
                    />

                    {/* Prompt actions menu */}
                    <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg shadow-lg z-20 py-2">
                      <button
                        type="button"
                        onClick={handleAddToPrompt}
                        className="w-full px-4 py-2 text-left text-sm text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-dark-hover flex items-center space-x-2"
                      >
                        <span>Add to prompt</span>
                      </button>
                      <button
                        type="button"
                        onClick={handlePromptStyle}
                        className="w-full px-4 py-2 text-left text-sm text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-dark-hover flex items-center space-x-2"
                      >
                        <span>Prompt style</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleImageMenuClick}
                        className="w-full px-4 py-2 text-left text-sm text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-dark-hover flex items-center space-x-2"
                      >
                        <span>Image</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Hidden file input for image upload */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageSelected}
            />

            {/* Submit Button */}
            <button
              onClick={handleCreate}
              disabled={!prompt.trim() || isGenerating}
              className="w-14 h-14 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-colors"
            >
              {isGenerating ? (
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              ) : (
                <ArrowRight className="w-6 h-6 text-white" />
              )}
            </button>
          </div>

          {/* Content Type and Tools Selection */}
          <div className="flex items-center space-x-3 flex-wrap gap-2">
            {/* Image/Video Toggle */}
            <button
              onClick={() => setContentType('image')}
              disabled={isGenerating}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                contentType === 'image'
                  ? 'bg-blue-600 text-white border border-blue-600'
                  : 'bg-gray-100 dark:bg-dark-card border border-gray-200 dark:border-dark-border text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-dark-hover'
              } ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>{t('image') || 'Image'}</span>
            </button>
            
            <button
              onClick={() => setContentType('video')}
              disabled={isGenerating}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                contentType === 'video'
                  ? 'bg-blue-600 text-white border border-blue-600'
                  : 'bg-gray-100 dark:bg-dark-card border border-gray-200 dark:border-dark-border text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-dark-hover'
              } ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <VideoIcon className="w-4 h-4" />
              <span>{t('video') || 'Video'}</span>
            </button>

            {/* Tool Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowToolsDropdown(!showToolsDropdown)}
                disabled={isGenerating}
                className={`px-4 py-2 bg-gray-100 dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg font-medium text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-dark-hover transition-colors flex items-center space-x-2 ${
                  isGenerating ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {selectedToolData && (() => {
                  const ToolIcon = getToolIcon(selectedToolData)
                  return (
                    <>
                      <ToolIcon className="w-4 h-4 text-blue-400" />
                      <span className="text-white font-medium">{selectedToolData.creditCost}</span>
                      <span className="text-gray-300">{selectedToolData.name}</span>
                      {getToolDetails(selectedToolData) && (
                        <span className="px-3 py-1 bg-dark-hover rounded-full text-xs text-gray-400">
                          {getToolDetails(selectedToolData)}
                        </span>
                      )}
                    </>
                  )
                })()}
                <ChevronDown className="w-4 h-4 ml-2" />
              </button>

              {showToolsDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowToolsDropdown(false)}
                  />
                    <div className="absolute top-full left-0 mt-2 w-96 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg shadow-lg z-20 max-h-96 overflow-hidden flex flex-col">
                    {/* Search Input */}
                    <div className="p-3 border-b border-gray-200 dark:border-dark-border">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder={t('searchModels') || 'Modelləri axtar...'}
                          value={toolSearchQuery}
                          onChange={(e) => setToolSearchQuery(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full pl-9 pr-9 py-2 bg-gray-50 dark:bg-dark-hover border border-gray-200 dark:border-dark-border rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                        {toolSearchQuery && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setToolSearchQuery('')
                            }}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {/* Tools List */}
                    <div className="overflow-y-auto max-h-80">
                      {availableTools
                        .filter(tool => {
                          if (!toolSearchQuery.trim()) return true
                          const query = toolSearchQuery.toLowerCase()
                          return (
                            tool.name.toLowerCase().includes(query) ||
                            tool.description.toLowerCase().includes(query) ||
                            tool.id.toLowerCase().includes(query)
                          )
                        })
                        .map((tool) => (
                          <button
                            key={tool.id}
                            onClick={() => {
                              setSelectedTool(tool.id)
                              setShowToolsDropdown(false)
                              setToolSearchQuery('')
                            }}
                            className={`w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-dark-hover first:rounded-t-lg last:rounded-b-lg transition-colors flex items-center justify-between ${
                              selectedTool === tool.id ? 'bg-gray-100 dark:bg-dark-hover' : ''
                            }`}
                          >
                            <div className="flex items-center space-x-3 flex-1 min-w-0">
                              {(() => {
                                const ToolIcon = getToolIconForList(tool)
                                return <ToolIcon className="w-4 h-4 text-blue-400 flex-shrink-0" />
                              })()}
                              <span className="text-gray-900 dark:text-white font-medium text-sm">{tool.creditCost}</span>
                              <div className="flex items-center space-x-2 flex-1 min-w-0">
                                <span className="text-gray-600 dark:text-gray-300 text-sm truncate">{tool.name}</span>
                                {tool.requiresImage && (
                                  <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-[10px] font-medium flex-shrink-0">
                                    I2V
                                  </span>
                                )}
                              </div>
                            </div>
                            {getToolDetails(tool) && (
                              <span className="px-3 py-1 bg-gray-100 dark:bg-dark-hover rounded-full text-xs text-gray-500 dark:text-gray-400 ml-3">
                                {getToolDetails(tool)}
                              </span>
                            )}
                          </button>
                        ))}
                      {availableTools.filter(tool => {
                        if (!toolSearchQuery.trim()) return false
                        const query = toolSearchQuery.toLowerCase()
                        return (
                          tool.name.toLowerCase().includes(query) ||
                          tool.description.toLowerCase().includes(query) ||
                          tool.id.toLowerCase().includes(query)
                        )
                      }).length === 0 && toolSearchQuery && (
                        <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                          {t('noModelsFound') || 'Model tapılmadı'}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Controls Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowControlsDropdown(!showControlsDropdown)}
                disabled={isGenerating}
                className={`px-4 py-2 bg-gray-100 dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg font-medium text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-dark-hover transition-colors flex items-center space-x-2 ${
                  isGenerating ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <span>{t('controls') || 'Controls'}</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {showControlsDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowControlsDropdown(false)}
                  />
                  <div className="absolute top-full right-0 mt-2 w-96 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg shadow-lg z-20 p-6 max-h-[80vh] overflow-y-auto">
                    {/* Cost */}
                    <div className="mb-6 pb-4 border-b border-gray-200 dark:border-dark-border">
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('cost') || 'Cost'}</div>
                      <div className="text-2xl font-bold text-blue-400">+{selectedToolData?.creditCost || 0}</div>
                      {contentType === 'video' && selectedToolData?.tokenCost && (
                        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                          {selectedToolData.tokenCost} token
                        </div>
                      )}
                      {contentType === 'image' && selectedToolData?.tokenCost && (
                        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                          {selectedToolData.tokenCost} token
                        </div>
                      )}
                    </div>

                    {/* Video-specific controls */}
                    {contentType === 'video' && (
                      <>
                        {/* Version */}
                        {selectedTool === 'veo' && (
                          <div className="mb-6">
                            <div className="text-sm text-gray-400 mb-3">{t('version') || 'Version'}</div>
                            <div className="space-y-2">
                              <label className="flex items-center space-x-3 cursor-pointer">
                                <input
                                  type="radio"
                                  name="version"
                                  checked={version === 'fast'}
                                  onChange={() => setVersion('fast')}
                                  className="w-4 h-4 text-blue-500 border-gray-600 focus:ring-blue-500 bg-dark-hover"
                                />
                                <span className="text-white">3.1 Fast</span>
                              </label>
                              <label className="flex items-center space-x-3 cursor-pointer">
                                <input
                                  type="radio"
                                  name="version"
                                  checked={version === 'standard'}
                                  onChange={() => setVersion('standard')}
                                  className="w-4 h-4 text-blue-500 border-gray-600 focus:ring-blue-500 bg-dark-hover"
                                />
                                <span className="text-white">3.1</span>
                              </label>
                            </div>
                          </div>
                        )}

                        {/* Character Reference */}
                        {selectedTool === 'veo' && (
                          <div className="mb-6">
                            <label className="flex items-center space-x-3 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={characterReference}
                                onChange={(e) => setCharacterReference(e.target.checked)}
                                className="w-4 h-4 text-blue-500 border-gray-600 rounded focus:ring-blue-500 bg-dark-hover"
                              />
                              <span className="text-white">{t('characterReference') || '3.1 + Character'}</span>
                            </label>
                          </div>
                        )}

                        {/* Sound Generation */}
                        <div className="mb-6">
                          <div className="text-sm text-gray-400 mb-3">{t('soundGeneration') || 'Sound generation'}</div>
                          <div className="space-y-2">
                            <label className="flex items-center space-x-3 cursor-pointer">
                              <input
                                type="radio"
                                name="sound"
                                checked={soundEnabled}
                                onChange={() => setSoundEnabled(true)}
                                disabled={!selectedToolData?.hasSound}
                                className="w-4 h-4 text-blue-500 border-gray-600 focus:ring-blue-500 bg-dark-hover disabled:opacity-50"
                              />
                              <span className={`text-white ${!selectedToolData?.hasSound ? 'opacity-50' : ''}`}>{t('videoWithSound') || 'Video + sound'}</span>
                            </label>
                            <label className="flex items-center space-x-3 cursor-pointer">
                              <input
                                type="radio"
                                name="sound"
                                checked={!soundEnabled}
                                onChange={() => setSoundEnabled(false)}
                                className="w-4 h-4 text-blue-500 border-gray-600 focus:ring-blue-500 bg-dark-hover"
                              />
                              <span className="text-white">{t('videoOnly') || 'Video only'}</span>
                            </label>
                          </div>
                        </div>

                        {/* Resolution */}
                        <div className="mb-6">
                          <div className="text-sm text-gray-400 mb-3">{t('resolution') || 'Resolution'}</div>
                          <div className="space-y-2">
                            <label className="flex items-center space-x-3 cursor-pointer">
                              <input
                                type="radio"
                                name="resolution"
                                checked={resolution === '720p'}
                                onChange={() => setResolution('720p')}
                                className="w-4 h-4 text-blue-500 border-gray-600 focus:ring-blue-500 bg-dark-hover"
                              />
                              <span className="text-white">720p</span>
                            </label>
                            <label className="flex items-center space-x-3 cursor-pointer">
                              <input
                                type="radio"
                                name="resolution"
                                checked={resolution === '1080p'}
                                onChange={() => setResolution('1080p')}
                                className="w-4 h-4 text-blue-500 border-gray-600 focus:ring-blue-500 bg-dark-hover"
                              />
                              <span className="text-white">1080p</span>
                            </label>
                          </div>
                        </div>

                        {/* Length */}
                        <div className="mb-6">
                          <div className="text-sm text-gray-400 mb-3">{t('length') || 'Length'}</div>
                          <div className="relative">
                            <input
                              type="range"
                              min="4"
                              max="12"
                              step="4"
                              value={duration}
                              onChange={(e) => setDuration(Number(e.target.value))}
                              className="w-full h-2 bg-dark-hover rounded-lg appearance-none cursor-pointer slider"
                              style={{
                                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((duration - 4) / 8) * 100}%, #1f2937 ${((duration - 4) / 8) * 100}%, #1f2937 100%)`
                              }}
                            />
                            <div className="flex justify-between mt-2 text-xs text-gray-400">
                              <span>4s</span>
                              <span>8s</span>
                              <span>12s</span>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Image-specific controls */}
                    {contentType === 'image' && (
                      <>
                        {/* Resolution for images */}
                        <div className="mb-6">
                          <div className="text-sm text-gray-400 mb-3">{t('resolution') || 'Resolution'}</div>
                          <div className="space-y-2">
                            <label className="flex items-center space-x-3 cursor-pointer">
                              <input
                                type="radio"
                                name="resolution"
                                checked={resolution === '720p'}
                                onChange={() => setResolution('720p')}
                                className="w-4 h-4 text-blue-500 border-gray-600 focus:ring-blue-500 bg-dark-hover"
                              />
                              <span className="text-white">720p</span>
                            </label>
                            <label className="flex items-center space-x-3 cursor-pointer">
                              <input
                                type="radio"
                                name="resolution"
                                checked={resolution === '1080p'}
                                onChange={() => setResolution('1080p')}
                                className="w-4 h-4 text-blue-500 border-gray-600 focus:ring-blue-500 bg-dark-hover"
                              />
                              <span className="text-white">1080p</span>
                            </label>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Seed - Common for both */}
                    <div className="mb-6">
                      <div className="text-sm text-gray-400 mb-2">{t('seed') || 'Seed'}</div>
                      <div className="flex items-center space-x-3">
                        <input
                          type="text"
                          value={seed}
                          onChange={(e) => setSeed(e.target.value)}
                          disabled={randomizeSeed}
                          className="flex-1 px-3 py-2 bg-dark-hover border border-dark-border rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                          placeholder={t('seedPlaceholder') || 'Enter seed'}
                        />
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={randomizeSeed}
                            onChange={(e) => setRandomizeSeed(e.target.checked)}
                            className="w-4 h-4 text-blue-500 border-gray-600 rounded focus:ring-blue-500 bg-dark-hover"
                          />
                          <span className="text-white text-sm">{t('randomize') || 'Randomize'}</span>
                        </label>
                      </div>
                    </div>

                    {/* Negative Prompt - Common for both */}
                    <div className="mb-4">
                      <div className="text-sm text-gray-400 mb-2">{t('negativePrompt') || 'Negative prompt'}</div>
                      <textarea
                        value={negativePrompt}
                        onChange={(e) => setNegativePrompt(e.target.value)}
                        className="w-full px-3 py-2 bg-dark-hover border border-dark-border rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        rows={3}
                        placeholder={contentType === 'video' 
                          ? (t('negativePromptPlaceholder') || 'What to avoid in the video...')
                          : (t('negativePromptPlaceholderImage') || 'What to avoid in the image...')
                        }
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Additional Options */}
            

          </div>

          {/* Status Message */}
          {isGenerating && (
            <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <p className="text-blue-400 text-center">
                {contentType === 'video' 
                  ? (t('generatingVideo') || 'Generating video... This may take a few moments.')
                  : (t('generatingImage') || 'Generating image... This may take a few moments.')
                }
              </p>
            </div>
          )}

          {/* Templates Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {t('templates') || 'Templates'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {templates
                .filter(template => template.type === contentType)
                .map((template) => (
                  <div
                    key={template.id}
                    className="bg-white dark:bg-dark-card rounded-lg border border-gray-200 dark:border-dark-border p-0 hover:border-blue-500 dark:hover:border-blue-500 transition-colors group overflow-hidden relative"
                  >
                    <button
                      onClick={() => {
                        setPrompt(template.prompt)
                        // Auto-switch content type if needed
                        if (template.type !== contentType) {
                          setContentType(template.type)
                        }
                        // Auto-select model if specified
                        if (template.modelId) {
                          const modelExists = availableTools.find(tool => tool.id === template.modelId)
                          if (modelExists) {
                            setSelectedTool(template.modelId)
                          }
                        }
                        // If template requires image, show info and open file input
                        if (template.requiresImage) {
                          info('Bu template üçün şəkil seçməlisiniz.')
                          setTimeout(() => {
                            if (fileInputRef.current) {
                              fileInputRef.current.click()
                            }
                          }, 300)
                        }
                      }}
                      className="w-full text-left"
                    >
                    <div 
                      className="aspect-[16/10] bg-gray-100 dark:bg-dark-hover rounded-lg overflow-hidden relative"
                      onMouseEnter={(e) => {
                        if (template.type === 'video') {
                          const video = e.currentTarget.querySelector('video') as HTMLVideoElement
                          if (video) {
                            video.play().catch(() => {})
                          }
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (template.type === 'video') {
                          const video = e.currentTarget.querySelector('video') as HTMLVideoElement
                          if (video) {
                            video.pause()
                            video.currentTime = 0
                          }
                        }
                      }}
                    >
                      {template.type === 'video' ? (
                        <video
                          src={template.thumbnail}
                          className="w-full h-full object-cover"
                          muted
                          loop
                          playsInline
                          preload="metadata"
                        />
                      ) : (
                        <img
                          src={template.thumbnail}
                          alt={template.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <ArrowRight className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white px-3 py-2">
                      {template.name}
                    </h3>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedTemplatePreview(template)
                      }}
                      className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      title="Preview"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Template Preview Modal */}
      {selectedTemplatePreview && (
        <>
          <div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedTemplatePreview(null)}
          >
            <div
              className="bg-white dark:bg-dark-card rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-dark-border">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {selectedTemplatePreview.name}
                </h3>
                <button
                  onClick={() => setSelectedTemplatePreview(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-dark-hover rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              {/* Preview Content */}
              <div className="flex-1 overflow-auto p-4">
                <div className="aspect-video bg-gray-100 dark:bg-dark-hover rounded-lg overflow-hidden mb-4">
                  {selectedTemplatePreview.type === 'video' ? (
                    <video
                      src={selectedTemplatePreview.thumbnail}
                      className="w-full h-full object-contain"
                      controls
                      autoPlay
                      loop
                      muted
                    />
                  ) : (
                    <img
                      src={selectedTemplatePreview.thumbnail}
                      alt={selectedTemplatePreview.name}
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>

                {/* Prompt */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Prompt:
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-dark-hover p-3 rounded-lg">
                    {selectedTemplatePreview.prompt}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-200 dark:border-dark-border flex items-center justify-end space-x-3">
                <button
                  onClick={() => setSelectedTemplatePreview(null)}
                  className="px-4 py-2 bg-gray-100 dark:bg-dark-hover hover:bg-gray-200 dark:hover:bg-dark-border text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                >
                  Bağla
                </button>
                <button
                  onClick={() => {
                    setPrompt(selectedTemplatePreview.prompt)
                    const templateModelId = selectedTemplatePreview.modelId
                    const templateType = selectedTemplatePreview.type
                    const templateRequiresImage = selectedTemplatePreview.requiresImage
                    
                    // Auto-switch content type if needed
                    if (templateType !== contentType) {
                      setContentType(templateType)
                    }
                    
                    // Auto-select model - wait for contentType to update if it changed
                    if (templateModelId) {
                      if (templateType !== contentType) {
                        // Wait for contentType to update and availableTools to refresh
                        setTimeout(() => {
                          const updatedAvailableTools = aiTools.filter(tool => {
                            if (tool.category !== templateType || !tool.enabled) return false
                            return true
                          })
                          const modelExists = updatedAvailableTools.find(tool => tool.id === templateModelId)
                          if (modelExists) {
                            setSelectedTool(templateModelId)
                          }
                        }, 100)
                      } else {
                        // Content type already matches, select immediately
                        const modelExists = availableTools.find(tool => tool.id === templateModelId)
                        if (modelExists) {
                          setSelectedTool(templateModelId)
                        }
                      }
                    }
                    
                    // If template requires image, show info and open file input
                    if (templateRequiresImage) {
                      info('Bu template üçün şəkil seçməlisiniz.')
                      setTimeout(() => {
                        if (fileInputRef.current) {
                          fileInputRef.current.click()
                        }
                      }, templateType !== contentType ? 500 : 300)
                    }
                    
                    setSelectedTemplatePreview(null)
                    // Scroll to top
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
                >
                  İstifadə Et
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Add to prompt presets modal */}
      {showPromptLibrary && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60">
          <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl shadow-2xl max-w-3xl w-full mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-dark-border">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('addToPrompt') || 'Add to prompt'}
              </h2>
              <button
                onClick={() => setShowPromptLibrary(false)}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-dark-hover text-gray-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-6">
              {/* Camera section */}
              <div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Camera
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    {
                      label: 'Zoom in',
                      text:
                        'The camera slowly zooms in on the main subject, pulling the viewer closer with every second. ' +
                        'Details on the face, clothing and environment become sharper and more dramatic, creating an intimate, emotional focus.'
                    },
                    {
                      label: 'Zoom out',
                      text:
                        'The camera gradually zooms out from a tight close-up to a wide establishing shot, revealing the full scale of the environment. ' +
                        'As the framing opens up, the character starts to feel smaller against the vast landscape, emphasizing mood and scale.'
                    },
                    {
                      label: '360 view',
                      text:
                        'The camera performs a smooth 360° orbit around the subject, gliding in a perfectly stabilized circular motion. ' +
                        'Background parallax and moving light reflections add a highly cinematic, dynamic feeling to the shot.'
                    },
                    {
                      label: 'Low angle',
                      text:
                        'The scene is shot from a low angle, with the camera positioned near the ground and tilted slightly upward. ' +
                        'This makes the subject feel towering, heroic and powerful, while the sky and environment frame them dramatically.'
                    },
                    {
                      label: 'High angle shot',
                      text:
                        'The scene is captured from a high angle, looking down on the subject from above. ' +
                        'This perspective makes the character feel smaller and more vulnerable, emphasizing isolation within the larger environment.'
                    },
                    {
                      label: 'Drone shot',
                      text:
                        'A cinematic aerial drone shot glides smoothly above the scene, slowly drifting forward and tilting down. ' +
                        'Wide, sweeping movement reveals roads, buildings and natural shapes, giving a dramatic sense of scale and geography.'
                    },
                    {
                      label: 'Tracking shot',
                      text:
                        'The camera tracks and follows the subject as they move through the scene, keeping them perfectly centered in frame. ' +
                        'Background elements slide past in parallax, creating a smooth, immersive sense of motion and journey.'
                    },
                    {
                      label: 'Extreme close-up',
                      text:
                        'An extreme close-up focuses tightly on small details like eyes, hands, fabric texture or metal surfaces. ' +
                        'Shallow depth of field, soft lighting and sharp micro‑details create a highly dramatic, almost abstract feeling.'
                    },
                  ].map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => {
                        addTextToPrompt(item.text)
                        setShowPromptLibrary(false)
                      }}
                      className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-dark-hover text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      
      <CreditModal 
        isOpen={showCreditModal} 
        onClose={() => setShowCreditModal(false)} 
      />
    </ModernBackground>
  )
}
