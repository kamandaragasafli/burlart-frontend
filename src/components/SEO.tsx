import { Helmet } from 'react-helmet-async'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  image?: string
  url?: string
  type?: string
  structuredData?: object
}

export default function SEO({
  title = 'Burlart - AI Video və Şəkil Yaratma Platforması',
  description = 'Burlart ilə saniyələr ərzində peşəkar AI video və şəkillər yaradın. Pika Labs, Sora, Kling AI, Flux və digər güclü AI modelləri ilə kreativliyinizi həyata keçirin.',
  keywords = 'AI video generator, AI şəkil yaratma, suni intellekt, video yaratma, şəkil generatoru, Pika Labs, Sora AI, Kling AI, Flux AI, Burlart',
  // Default social preview image – served from public folder
  image = '/favicon.jpeg',
  url = 'https://timera.ai',
  type = 'website',
  structuredData,
}: SEOProps) {
  const fullTitle = title.includes('Burlart') ? title : `${title} | Burlart`

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  )
}
