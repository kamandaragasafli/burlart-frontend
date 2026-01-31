export interface Template {
  id: string
  name: string
  thumbnail: string
  prompt: string
  type: 'video' | 'image'
  modelId?: string // Optional model ID to auto-select when template is clicked
  requiresImage?: boolean // For image-to-video templates
}

export const templates: Template[] = [
  {
    id: 'flux_knight_1',
    name: 'Flux Knight Battle',
    thumbnail: '/templates/flux2_pro_t2i_output.png',
    prompt: 'An intense close-up of knight\'s visor reflecting battle, sword raised, flames in background, chiaroscuro helmet shadows, hyper-detailed armor, square medieval, cinematic lighting',
    type: 'image',
    modelId: 'flux'
  },
  {
    id: 'sora_breakup_1',
    name: 'Sora Breakup Scene',
    thumbnail: '/templates/sora_t2v_output.mp4',
    prompt: 'A dramatic Hollywood breakup scene at dusk on a quiet suburban street. A man and a woman in their 30s face each other, speaking softly but emotionally, lips syncing to breakup dialogue. Cinematic lighting, warm sunset tones, shallow depth of field, gentle breeze moving autumn leaves, realistic natural sound, no background music',
    type: 'video',
    modelId: 'sora'
  },
  {
    id: 'sora_skydiver_1',
    name: 'Sora Skydiver Action Cam',
    thumbnail: '/templates/sora_2_i2v_output.mp4',
    prompt: 'Front-facing \'invisible\' action-cam on a skydiver in freefall above bright clouds; camera locked on his face. He speaks over the wind with clear lipsync: \'This is insanely fun! You\'ve got to try it—book a tandem and go!\' Natural wind roar, voice close-mic\'d and slightly compressed so it\'s intelligible. Midday sun, goggles and jumpsuit flutter, altimeter visible, parachute rig on shoulders. Energetic but stable framing with subtle shake; brief horizon roll. End on first tug of canopy and wind noise dropping.',
    type: 'video',
    modelId: 'sora'
  },
  {
    id: 'veo3_1',
    name: 'Veo3 Street Interview',
    thumbnail: '/templates/Veo3.mp4',
    prompt: 'A casual street interview on a busy New York City sidewalk in the afternoon. The interviewer holds a plain, unbranded microphone and asks: Have you seen Google\'s new Veo3 model It is a super good model. Person replies: Yeah I saw it, it\'s already available on fal. It\'s crazy good.',
    type: 'video',
    modelId: 'veo'
  },
  {
    id: 'veo31_1',
    name: 'Veo3.1 First-Last-Frame',
    thumbnail: '/templates/veo31-flf2v-output.mp4',
    prompt: 'A woman looks into the camera, breathes in, then exclaims energetically, "have you guys checked out Veo3.1 First-Last-Frame-to-Video on Fal? It\'s incredible!"',
    type: 'video',
    modelId: 'veo'
  },
  {
    id: 'pika_poodle_1',
    name: 'Pika Poodle on Yacht',
    thumbnail: '/templates/pika_t2v_v22_output.mp4',
    prompt: 'Large elegant white poodle standing proudly on the deck of a white yacht, wearing oversized glamorous sunglasses and a luxurious silk Gucci-style scarf tied around its neck, layered pearl necklaces draped across its chest, photographed from outside the yacht at a low upward angle, clear blue sky background, strong midday sunlight, washed-out faded tones, slightly overexposed 2000s fashion editorial aesthetic, cinematic analog film texture, playful luxury mood, glossy magazine style, bright harsh light and soft shadows, stylish and extravagant atmosphere. camera slow orbit and dolly in',
    type: 'video',
    modelId: 'pika'
  },
  {
    id: 'pika_horse_1',
    name: 'Pika Man and Horse',
    thumbnail: '/templates/pika_i2v_v22_output.mp4',
    prompt: 'The man and the horse are slowly walking towards the camera, the camera orbits and dolly out',
    type: 'video',
    modelId: 'pika-i2v',
    requiresImage: true
  },
  {
    id: 'seedance_martial_1',
    name: 'Seedance Martial Arts',
    thumbnail: '/templates/seedance_fast_t2v_output.mp4',
    prompt: 'Inside a quiet dojo, a martial artist moves with precision and grace. The performance highlights the beauty and discipline inherent in the ancient practice. Each form unfolds clearly, a testament to dedication and skill.',
    type: 'video',
    modelId: 'seedance'
  },
  {
    id: 'seedance_skier_1',
    name: 'Seedance Skier',
    thumbnail: '/templates/seedance_pro_i2v.mp4',
    prompt: 'A skier glides over fresh snow, joyously smiling while kicking up large clouds of snow as he turns. Accelerating gradually down the slope, the camera moves smoothly alongside.',
    type: 'video',
    modelId: 'seedance-i2v',
    requiresImage: true
  },
  {
    id: 'wan_fox_1',
    name: 'Wan Fox Director',
    thumbnail: '/templates/Wan.mp4',
    prompt: 'Humorous but premium mini-trailer: a tiny fox 3D director proves "multi-scene" by calling simple commands that instantly change the set. Extreme photoreal 4K, cinematic lighting, subtle film grain, smooth camera. No subtitles, no UI, no watermark.',
    type: 'video',
    modelId: 'wan'
  },
  {
    id: 'kling_lord_1',
    name: 'Kling Noble Lord',
    thumbnail: '/templates/kling-v2.5-turbo-pro-text-to-video-output.mp4',
    prompt: 'A noble lord walks among his people, his presence a comforting reassurance. He greets them with a gentle smile, embodying their hopes and earning their respect through simple interactions. The atmosphere is intimate and sincere, highlighting the bond between the leader and community.',
    type: 'video',
    modelId: 'kling'
  },
  {
    id: 'kling_race_1',
    name: 'Kling Car Race',
    thumbnail: '/templates/kling-v2.5-turbo-pro-image-to-video-output.mp4',
    prompt: 'A stark starting line divides two powerful cars, engines revving for the challenge ahead. They surge forward in the heat of competition, a blur of speed and chrome. The finish line looms as they vie for victory.',
    type: 'video',
    modelId: 'kling-i2v',
    requiresImage: true
  },
  {
    id: 'luma_tokyo_1',
    name: 'Luma Tokyo Street',
    thumbnail: '/templates/luma.mp4',
    prompt: 'A stylish woman walks down a Tokyo street filled with warm glowing neon and animated city signage.',
    type: 'video',
    modelId: 'luma-i2v',
    requiresImage: true
  },
  {
    id: 'gpt_image_titanic_1',
    name: 'GPT Image Titanic',
    thumbnail: '/templates/gpt-image.png',
    prompt: 'create a realistic image taken with iphone at these coordinates 41°43′32″N 49°56′49″W 15 April 1912',
    type: 'image',
    modelId: 'gpt-image'
  },
  {
    id: 'nano_banana_lab_1',
    name: 'Nano Banana Lab Swimming',
    thumbnail: '/templates/nano-banana-t2i-output.png',
    prompt: 'An action shot of a black lab swimming in an inground suburban swimming pool. The camera is placed meticulously on the water line, dividing the image in half, revealing both the dogs head above water holding a tennis ball in it\'s mouth, and it\'s paws paddling underwater.',
    type: 'image',
    modelId: 'nano-banana'
  },
  {
    id: 'seedream_cat_1',
    name: 'Seedream Cat at Eiffel Tower',
    thumbnail: '/templates/seedrem.png',
    prompt: 'A selfie of a cat, with the cat as the protagonist. The setting is twilight at the Eiffel Tower. The cat is happy, holding a piece of baklava in its paw. The photo has a slight motion blur and is slightly overexposed. From a selfie angle, with a bit of motion blur, the overall image presents a sense of calm madness. The text "Seedream 4.5 is on Burlart" should be written on the picture at the top in clearly visible font and crisp lettering. The image has a 4:3 aspect ratio',
    type: 'image',
    modelId: 'seedream'
  },
  {
    id: 'z_image_tribal_1',
    name: 'Z-Image Tribal Elder',
    thumbnail: '/templates/z-image-turbo-output.png',
    prompt: 'A hyper-realistic, close-up portrait of a tribal elder from the Omo Valley, painted with intricate white chalk patterns and adorned with a headdress made of dried flowers, seed pods, and rusted bottle caps. The focus is razor-sharp on the texture of the skin, showing every pore, wrinkle, and scar that tells a story of survival. The background is a blurred, smoky hut interior, with the warm glow of a cooking fire reflecting in the subject\'s dark, soulful eyes. Shot on a Leica M6 with Kodak Portra 400 film grain aesthetic.',
    type: 'image',
    modelId: 'z-image'
  },
  {
    id: 'qwen_rose_1',
    name: 'Qwen Rose on Marble',
    thumbnail: '/templates/qwen-image.png',
    prompt: 'Single red rose in a clear glass vase on white marble streaked with black and gold veins, harsh directional shadow, high contrast, editorial style, clean negative space.',
    type: 'image',
    modelId: 'qwen'
  },
  {
    id: 'qwen_puppies_1',
    name: 'Qwen Change Wolves to Puppies',
    thumbnail: '/templates/qwen i2i.png',
    prompt: 'Change wolves with extremely realistic small puppies of different colors.',
    type: 'image',
    modelId: 'qwen-max-edit',
    requiresImage: true
  },
  {
    id: 'nano_banana_california_1',
    name: 'Nano Banana California Coastline',
    thumbnail: '/templates/nano-banana-i2i-output.png',
    prompt: 'make a photo of the man driving the car down the california coastline',
    type: 'image',
    modelId: 'nano-banana-edit',
    requiresImage: true
  },
  {
    id: 'seedream_product_replace_1',
    name: 'Seedream Product Replacement',
    thumbnail: '/templates/seedrem.png',
    prompt: 'Replace the product in Figure 1 with that in Figure 2. For the title copy the text in Figure 3 to the top of the screen, the title should have a clear contrast with the background but not be overly eye-catching.',
    type: 'image',
    modelId: 'seedream-edit',
    requiresImage: true
  },
  {
    id: 'flux_coffee_flames_1',
    name: 'Flux Coffee Cup Flames',
    thumbnail: '/templates/flux2_pro_i2i_output.png',
    prompt: 'Place realistic flames emerging from the top of the coffee cup, dancing above the rim',
    type: 'image',
    modelId: 'flux-edit',
    requiresImage: true
  }
]

