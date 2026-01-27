import { Video, Sparkles, FileText, ScrollText, Image, Music, Lock } from 'lucide-react'
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
}

export default function ToolCard({ tool, onUse }: ToolCardProps) {
  const { credits, hasEnoughCredits } = useCreditStore()
  const Icon = iconMap[tool.icon] || Video
  const canUse = tool.enabled && hasEnoughCredits(tool.creditCost)

  return (
    <div
      className={`relative bg-white dark:bg-dark-card rounded-lg border-2 p-6 transition-all ${
        tool.enabled
          ? 'border-gray-200 dark:border-dark-border hover:border-blue-300 dark:hover:border-gray-500 cursor-pointer shadow-sm hover:shadow-md'
          : 'border-gray-200 dark:border-dark-border opacity-60 cursor-not-allowed'
      }`}
      onClick={() => canUse && onUse(tool)}
    >
      {/* Credit Cost Badge */}
      <div className="absolute top-4 right-4 bg-blue-100 dark:bg-blue-500/20 border border-blue-300 dark:border-blue-500/50 px-3 py-1 rounded-full text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center space-x-1">
        <span>{tool.creditCost}</span>
        <span className="text-blue-500 dark:text-blue-300">kredit</span>
      </div>

      {!tool.enabled && (
        <div className="absolute top-12 right-4 bg-gray-100 dark:bg-dark-hover px-3 py-1 rounded-full text-xs text-gray-500 dark:text-gray-400 flex items-center space-x-1">
          <Lock className="w-3 h-3" />
          <span>Coming Soon</span>
        </div>
      )}

      <div className="flex items-start space-x-4">
        <div className="p-3 bg-gray-100 dark:bg-dark-hover rounded-lg">
          <Icon className="w-6 h-6 text-blue-500 dark:text-blue-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{tool.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{tool.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500 dark:text-gray-500 uppercase tracking-wide">
                {tool.category}
              </span>
              <span className="text-gray-400 dark:text-gray-600">•</span>
            </div>
            {canUse && (
              <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors">
                Use Tool
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

