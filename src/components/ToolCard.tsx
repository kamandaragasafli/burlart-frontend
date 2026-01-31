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
        ? 'bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20' 
        : 'bg-white dark:bg-dark-card'} rounded-xl border-2 p-6 transition-all duration-300 overflow-hidden ${
        tool.enabled
          ? tool.requiresImage
            ? 'border-emerald-200 dark:border-emerald-800 hover:border-emerald-400 dark:hover:border-emerald-500 cursor-pointer shadow-lg hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1'
            : 'border-gray-200 dark:border-dark-border hover:border-blue-400 dark:hover:border-blue-500 cursor-pointer shadow-lg hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1'
          : 'border-gray-200 dark:border-dark-border opacity-60 cursor-not-allowed'
      }`}
      onClick={() => canUse && onUse(tool)}
    >
      {/* Gradient overlay on hover */}
      {tool.enabled && (
        <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
      )}

      {/* Credit Cost Badge */}
      <div className={`absolute top-4 right-4 bg-gradient-to-r ${gradientClass} px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-lg flex items-center space-x-1 z-10`}>
        <span>{tool.creditCost}</span>
        <span className="opacity-90">kredit</span>
      </div>

      {!tool.enabled && (
        <div className="absolute top-14 right-4 bg-gray-100 dark:bg-dark-hover px-3 py-1 rounded-full text-xs text-gray-500 dark:text-gray-400 flex items-center space-x-1 shadow-sm z-10">
          <Lock className="w-3 h-3" />
          <span>Coming Soon</span>
        </div>
      )}

      <div className="relative z-10 flex flex-col h-full">
        {/* Icon and Title */}
        <div className="flex items-start space-x-4 mb-4">
          <div className={`p-3 bg-gradient-to-br ${gradientClass} rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {tool.name}
            </h3>
            <span className={`inline-block px-2.5 py-1 text-xs font-semibold text-white bg-gradient-to-r ${gradientClass} rounded-full uppercase tracking-wide shadow-sm`}>
              {tool.requiresImage ? 'IMAGE-TO-VIDEO' : tool.category.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Action Button */}
        {canUse && (
          <button className={`w-full py-3 bg-gradient-to-r ${gradientClass} hover:shadow-xl text-white rounded-lg text-sm font-bold transition-all duration-300 transform hover:scale-105 shadow-md`}>
            Use Tool
          </button>
        )}
        
        {!canUse && tool.enabled && (
          <div className="w-full py-3 bg-gray-100 dark:bg-dark-hover text-gray-500 dark:text-gray-400 rounded-lg text-sm font-semibold text-center">
            Insufficient Credits
          </div>
        )}
      </div>
    </div>
  )
}

