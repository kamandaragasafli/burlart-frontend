import { Helmet } from 'react-helmet-async'

interface StructuredDataProps {
  type: 'WebSite' | 'Organization' | 'Product' | 'SoftwareApplication' | 'BreadcrumbList'
  data?: any
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  const getStructuredData = () => {
    switch (type) {
      case 'WebSite':
        return {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Burlart',
          url: 'https://timera.ai',
          description: 'AI video və şəkil yaratma platforması. Pika Labs, Sora, Kling AI, Flux və digər güclü AI modelləri.',
          potentialAction: {
            '@type': 'SearchAction',
            target: 'https://timera.ai/search?q={search_term_string}',
            'query-input': 'required name=search_term_string'
          }
        }
      
      case 'Organization':
        return {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Burlart',
          url: 'https://timera.ai',
          logo: 'https://timera.ai/logo.png',
          description: 'Azərbaycanda ilk AI video və şəkil yaratma platforması',
          sameAs: [
            'https://twitter.com/timeraai',
            'https://facebook.com/timeraai',
            'https://instagram.com/timeraai'
          ],
          contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'customer support',
            email: 'support@timera.ai'
          }
        }
      
      case 'SoftwareApplication':
        return {
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'Burlart',
          applicationCategory: 'MultimediaApplication',
          offers: {
            '@type': 'Offer',
            price: '19',
            priceCurrency: 'AZN'
          },
          operatingSystem: 'Web',
          description: 'AI video və şəkil yaratma platforması',
          screenshot: 'https://timera.ai/screenshot.jpg',
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.8',
            ratingCount: '1250'
          }
        }
      
      case 'Product':
        return data || {}
      
      case 'BreadcrumbList':
        return data || {}
      
      default:
        return {}
    }
  }

  const structuredData = getStructuredData()

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  )
}
