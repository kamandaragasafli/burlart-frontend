import { AITool } from '../types'

export const aiTools: AITool[] = [
  // Video Generation Tools (fal.ai models)
  {
    id: 'pika',
    name: 'Pika Labs',
    description: 'Fast video generation with good quality',
    icon: 'Video',
    category: 'video',
    creditCost: 52, // Satış Token: 52
    enabled: true,
    version: '2.2',
    tier: 'Fast',
    hasSound: false,
    duration: '4s',
    falModelId: 'fal-ai/pika/v2.2/text-to-video',
    tokenCost: 52, // Pika v2.2 (orta) - 52 token
  },
  {
    id: 'seedance',
    name: 'Seedance',
    description: 'ByteDance AI video generator',
    icon: 'Video',
    category: 'video',
    creditCost: 39, // Satış Token: 39
    enabled: true,
    version: '1.5',
    tier: 'Fast',
    hasSound: true,
    duration: '5s',
    falModelId: 'fal-ai/bytedance/seedance/v1/pro/fast/text-to-video',
    tokenCost: 39, // Seedance v1 Pro - 39 token
  },
  {
    id: 'wan',
    name: 'Wan',
    description: 'Advanced video generation',
    icon: 'Video',
    category: 'video',
    creditCost: 24, // Satış Token: 24
    enabled: true,
    version: '2.2',
    tier: 'High',
    hasSound: false,
    duration: '5s',
    falModelId: 'wan/v2.6/text-to-video',
    tokenCost: 24, // Wan v2.6 - 24 token
  },
  {
    id: 'luma',
    name: 'Luma AI',
    description: 'Professional video generation with photon technology',
    icon: 'Video',
    category: 'video',
    creditCost: 32, // Satış Token: 32
    enabled: true,
    version: '2.0',
    tier: 'Pro',
    hasSound: true,
    duration: '6s',
    falModelId: 'fal-ai/luma-photon/text-to-video',
    tokenCost: 32, // Luma Ray-2 Flash - 32 token
  },
  {
    id: 'kling',
    name: 'Kling AI',
    description: 'High-quality turbo video generation',
    icon: 'Video',
    category: 'video',
    creditCost: 55, // Satış Token: 55
    enabled: true,
    version: '2.6',
    tier: 'Pro',
    hasSound: true,
    duration: '5s',
    falModelId: 'fal-ai/kling-video/v2.5-turbo/pro/text-to-video',
    tokenCost: 55, // Kling v2.5 Turbo - 55 token
  },
  {
    id: 'veo',
    name: 'Veo',
    description: 'Next-gen AI video creation',
    icon: 'Video',
    category: 'video',
    creditCost: 238, // Satış Token: 238
    enabled: true,
    version: '3.1',
    tier: 'Fast',
    hasSound: true,
    duration: '6s',
    falModelId: 'fal-ai/veo3',
    tokenCost: 238, // Veo 3 (orta) - 238 token
  },
  {
    id: 'sora',
    name: 'Sora',
    description: 'Premium AI video generation',
    icon: 'Video',
    category: 'video',
    creditCost: 79, // Satış Token: 79
    enabled: true,
    version: '2.0',
    tier: 'Pro',
    hasSound: false,
    duration: '4s',
    falModelId: 'fal-ai/sora-2/text-to-video',
    tokenCost: 79, // Sora 2 - 79 token
  },
  // Image-to-Video Generation Tools (fal.ai models)
  {
    id: 'sora-i2v',
    name: 'Sora',
    description: 'Premium AI image-to-video generation',
    icon: 'Crown',
    category: 'video',
    creditCost: 79, // Satış Token: 79
    enabled: true,
    version: '2.0',
    tier: 'Pro',
    hasSound: false,
    duration: '4s',
    requiresImage: true,
    falModelId: 'fal-ai/sora-2/image-to-video',
    tokenCost: 79, // Sora-2 - 79 token
  },
  {
    id: 'veo-i2v',
    name: 'Veo',
    description: 'Next-gen AI image-to-video creation',
    icon: 'Film',
    category: 'video',
    creditCost: 238, // Satış Token: 238 (orta versiya)
    enabled: true,
    version: '3.1',
    tier: 'Fast',
    hasSound: true,
    duration: '6s',
    requiresImage: true,
    falModelId: 'fal-ai/veo3/image-to-video',
    tokenCost: 238, // Veo 3.1 (orta) - 238 token
  },
  {
    id: 'kling-i2v',
    name: 'Kling AI',
    description: 'High-quality turbo image-to-video generation',
    icon: 'Zap',
    category: 'video',
    creditCost: 55, // Satış Token: 55
    enabled: true,
    version: '2.6',
    tier: 'Pro',
    hasSound: true,
    duration: '5s',
    requiresImage: true,
    falModelId: 'fal-ai/kling-video/v2.5-turbo/pro/image-to-video',
    tokenCost: 55, // Kling v2.5 Turbo Pro - 55 token
  },
  {
    id: 'luma-i2v',
    name: 'Luma Photon',
    description: 'Professional image-to-video with photon technology',
    icon: 'Sparkles',
    category: 'video',
    creditCost: 32, // Satış Token: 32
    enabled: true,
    version: '2.0',
    tier: 'Pro',
    hasSound: true,
    duration: '6s',
    requiresImage: true,
    falModelId: 'fal-ai/luma-dream-machine/ray-2-flash/image-to-video',
    tokenCost: 32, // Luma Ray-2 Flash - 32 token
  },
  {
    id: 'seedance-i2v',
    name: 'Seedance',
    description: 'ByteDance AI image-to-video generator',
    icon: 'Video',
    category: 'video',
    creditCost: 98, // Satış Token: 98 (1080p versiyası)
    enabled: true,
    version: '1.5',
    tier: 'Pro',
    hasSound: true,
    duration: '5s',
    requiresImage: true,
    falModelId: 'fal-ai/bytedance/seedance/v1/pro/image-to-video',
    tokenCost: 98, // Seedance v1 Pro (1080p) - 98 token
  },
  {
    id: 'pika-i2v',
    name: 'Pika Labs',
    description: 'Fast image-to-video generation with good quality',
    icon: 'Video',
    category: 'video',
    creditCost: 71, // Satış Token: 71 (1080p versiyası)
    enabled: true,
    version: '2.2',
    tier: 'Fast',
    hasSound: false,
    duration: '4s',
    requiresImage: true,
    falModelId: 'fal-ai/pika/v2.2/image-to-video',
    tokenCost: 71, // Pika v2.2 (1080p) - 71 token
  },
  // Image Generation Tools (fal.ai models)
  {
    id: 'gpt-image',
    name: 'GPT Image',
    description: 'OpenAI GPT image generation',
    icon: 'Image',
    category: 'image',
    creditCost: 16, // Satış Token: 16
    enabled: true,
    version: '1.5',
    tier: 'Fast',
    tokenCost: 16, // GPT Image 1.5 (orta) - 16 token
  },
  {
    id: 'nano-banana',
    name: 'Nano Banana',
    description: 'Fast and efficient image generation',
    icon: 'Image',
    category: 'image',
    creditCost: 47, // Satış Token: 47
    enabled: true,
    version: 'Pro',
    tier: 'Fast',
    tokenCost: 47, // Nano Banana Pro (4K) - 47 token
  },
  {
    id: 'seedream',
    name: 'Seedream',
    description: 'ByteDance AI image generator',
    icon: 'Image',
    category: 'image',
    creditCost: 6, // Satış Token: 6
    enabled: true,
    version: '4.5',
    tier: 'Fast',
    tokenCost: 6, // Seedream v4.5 - 6 token
  },
  {
    id: 'flux',
    name: 'Flux',
    description: 'High-quality image generation',
    icon: 'Image',
    category: 'image',
    creditCost: 6, // Satış Token: 6
    enabled: true,
    version: '2.0',
    tier: 'Pro',
    tokenCost: 6, // Flux 2 Pro (orta) - 6 token
  },
  {
    id: 'z-image',
    name: 'Z-Image',
    description: 'Turbo LoRA image generation',
    icon: 'Image',
    category: 'image',
    creditCost: 2, // Satış Token: 2
    enabled: true,
    version: 'Turbo',
    tier: 'Fast',
    tokenCost: 2, // Z-Image (Turbo) - 2 token
  },
  {
    id: 'qwen',
    name: 'Qwen',
    description: 'Advanced AI image generation',
    icon: 'Image',
    category: 'image',
    creditCost: 6, // Satış Token: 6
    enabled: true,
    version: '2512',
    tier: 'Pro',
    tokenCost: 6, // Qwen Image 2512 - 6 token
  },
  {
    id: 'gpt-image-edit',
    name: 'GPT Image Edit',
    description: 'OpenAI GPT image editing',
    icon: 'Image',
    category: 'image',
    creditCost: 16, // Satış Token: 16 (temporary, needs confirmation)
    enabled: true,
    version: '1.5',
    tier: 'Fast',
    tokenCost: 16,
    falModelId: 'fal-ai/gpt-image-1.5/edit',
    requiresImage: true,
  },
  {
    id: 'nano-banana-edit',
    name: 'Nano Banana Edit',
    description: 'Fast and efficient image editing',
    icon: 'Image',
    category: 'image',
    creditCost: 47, // Satış Token: 47 (temporary, needs confirmation)
    enabled: true,
    version: 'Pro',
    tier: 'Fast',
    tokenCost: 47,
    falModelId: 'fal-ai/nano-banana/edit',
    requiresImage: true,
  },
  {
    id: 'seedream-edit',
    name: 'Seedream Edit',
    description: 'ByteDance AI image editing',
    icon: 'Image',
    category: 'image',
    creditCost: 7, // Satış Token: 7 (from table)
    enabled: true,
    version: '4.5',
    tier: 'Fast',
    tokenCost: 7,
    falModelId: 'fal-ai/bytedance/seedream/v4.5/edit',
    requiresImage: true,
  },
  {
    id: 'flux-edit',
    name: 'Flux Edit',
    description: 'High-quality image editing',
    icon: 'Image',
    category: 'image',
    creditCost: 6, // Satış Token: 6 (temporary, needs confirmation)
    enabled: true,
    version: '2.0',
    tier: 'Pro',
    tokenCost: 6,
    falModelId: 'fal-ai/flux-2-pro/edit',
    requiresImage: true,
  },
  {
    id: 'qwen-max-edit',
    name: 'Qwen Max Edit',
    description: 'Advanced AI image editing',
    icon: 'Image',
    category: 'image',
    creditCost: 6, // Satış Token: 6 (temporary, needs confirmation)
    enabled: true,
    version: 'Max',
    tier: 'Pro',
    tokenCost: 6,
    falModelId: 'fal-ai/qwen-image-max/edit',
    requiresImage: true,
  },
  // Audio Tools (Coming Soon)
  {
    id: 'audio-1',
    name: 'Audio Generation',
    description: 'Generate audio from text',
    icon: 'Music',
    category: 'audio',
    creditCost: 20,
    enabled: false,
  },
]
