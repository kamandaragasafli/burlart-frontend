export interface SubscriptionPlan {
  id: 'starter' | 'pro' | 'agency'
  name: string
  price: number
  currency: string
  credits: number
  period: string
  popular?: boolean
  features?: string[]
}

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 19,
    currency: '₼',
    credits: 750,
    period: 'ay',
    features: [
      'Bütün AI alətlərinə giriş',
      '750 kredit / ay',
      'Avtomatik yenilənmə',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 39,
    currency: '₼',
    credits: 1800,
    period: 'ay',
    popular: true,
    features: [
      'Bütün AI alətlərinə giriş',
      '1,800 kredit / ay',
      'Avtomatik yenilənmə',
      'Prioritet dəstək',
    ],
  },
  {
    id: 'agency',
    name: 'Agency',
    price: 79,
    currency: '₼',
    credits: 4000,
    period: 'ay',
    features: [
      'Bütün AI alətlərinə giriş',
      '4,000 kredit / ay',
      'Avtomatik yenilənmə',
      'Prioritet dəstək',
      'Dedicated account manager',
    ],
  },
]

