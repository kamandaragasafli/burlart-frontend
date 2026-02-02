import { Video, Sparkles, FileText, ScrollText, Image, Music, Lock, ImagePlus, Film, Zap, Crown } from 'lucide-react'
import { AITool } from '../types'
import { useCreditStore } from '../store/creditStore'

interface ToolCardProps {
  tool: AITool
  onUse: (tool: AITool) => void
}

const iconMap: Record<string, any> = {
  Video,
  Sparkles,
  FileText,
  ScrollText,
  Image,
  Music,
  ImagePlus,
  Film,
  Zap,
  Crown,
}

export default function ToolCard({ tool, onUse }: ToolCardProps) {
  const { hasEnoughCredits } = useCreditStore()
  // For image-to-video models, use ImagePlus icon, otherwise use the tool's icon
  const Icon = tool.requiresImage 
    ? ImagePlus 
    : (iconMap[tool.icon] || Video)
  const canUse = tool.enabled && hasEnoughCredits(tool.creditCost)

  // Define gradient colors based on category
  const categoryColors = {
    video: 'from-blue-500 to-cyan-500',
    image: 'from-purple-500 to-pink-500',
    audio: 'from-orange-500 to-red-500',
  }
  
  // Special color for image-to-video models
  const imageToVideoGradient = 'from-emerald-500 to-teal-500'
  
  const gradientClass = tool.requiresImage 
    ? imageToVideoGradient 
    : (categoryColors[tool.category as keyof typeof categoryColors] || 'from-blue-500 to-purple-500')

  return (
    <div
      className={`group relative ${tool.requiresImage 
        ? 'bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/10 dark:to-teal-900/10' 
        : 'bg-white dark:bg-dark-card'} rounded-lg border p-4 transition-all duration-200 overflow-hidden ${
        tool.enabled
          ? tool.requiresImage
            ? 'border-emerald-200 dark:border-emerald-800/50 hover:border-emerald-400 dark:hover:border-emerald-500 cursor-pointer shadow hover:shadow-md'
            : 'border-gray-200 dark:border-dark-border hover:border-blue-400 dark:hover:border-blue-500 cursor-pointer shadow hover:shadow-md'
          : 'border-gray-200 dark:border-dark-border opacity-60 cursor-not-allowed'
      }`}
      onClick={() => canUse && onUse(tool)}
    >
      {/* Credit Cost Badge */}
      <div className={`absolute top-2 right-2 bg-gradient-to-r ${gradientClass} px-2 py-0.5 rounded text-[10px] font-bold text-white shadow-sm z-10`}>
        {tool.creditCost}
      </div>

      {!tool.enabled && (
        <div className="absolute top-10 right-2 bg-gray-100 dark:bg-dark-hover px-1.5 py-0.5 rounded text-[9px] text-gray-500 dark:text-gray-400 flex items-center space-x-1 z-10">
          <Lock className="w-2 h-2" />
          <span>Soon</span>
        </div>
      )}

      <div className="relative z-10 flex flex-col h-full">
        {/* Icon and Title */}
        <div className="flex items-center space-x-2.5 mb-3">
          <div className={`p-2 bg-gradient-to-br ${gradientClass} rounded-lg shadow-sm group-hover:scale-105 transition-transform duration-200 flex-shrink-0`}>
            <Icon className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
              {tool.name}
            </h3>
            <span className={`inline-block px-1.5 py-0.5 text-[9px] font-medium text-white bg-gradient-to-r ${gradientClass} rounded`}>
              {tool.requiresImage ? 'I2V' : tool.category.charAt(0).toUpperCase() + tool.category.slice(1)}
            </span>
          </div>
        </div>

        {/* Action Button */}
        {canUse && (
          <button className={`w-full py-2 bg-gradient-to-r ${gradientClass} hover:shadow-md text-white rounded-md text-[11px] font-semibold transition-all duration-200 shadow-sm mt-auto`}>
            İstifadə et
          </button>
        )}
        
        {!canUse && tool.enabled && (
          <div className="w-full py-2 bg-gray-100 dark:bg-dark-hover text-gray-500 dark:text-gray-400 rounded-md text-[11px] font-medium text-center">
            Kifayət deyil
          </div>
        )}
      </div>
    </div>
  )
}

