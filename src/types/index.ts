export interface AITool {
  id: string
  name: string
  description: string
  icon: string
  category: 'video' | 'image' | 'audio'
  creditCost: number
  enabled: boolean
  // Additional metadata for display
  version?: string
  tier?: 'Fast' | 'Pro' | 'High'
  hasSound?: boolean
  duration?: string // e.g., "4s", "5s", "6s"
  requiresImage?: boolean // For image-to-video models
  falModelId?: string // Backend fal.ai model ID
  tokenCost?: number // Token cost for text-to-video models
}

export interface User {
  id: number
  email: string
  credits: number
  language: string
  theme: string
  first_name?: string
  last_name?: string
  avatar?: string
  created_at?: string
}

