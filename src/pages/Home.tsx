import { useNavigate } from 'react-router-dom'
import { Play, Sparkles } from 'lucide-react'
import { useTranslation } from '../store/languageStore'
import SEO from '../components/SEO'
import StructuredData from '../components/StructuredData'

export default function Home() {
  const navigate = useNavigate()
  const t = useTranslation()

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg">
      <SEO 
        title="Burlart - AI Video və Şəkil Yaratma Platforması"
        description="Burlart ilə saniyələr ərzində peşəkar AI video və şəkillər yaradın. Pika Labs, Sora, Kling AI, Flux və digər güclü AI modelləri. Azərbaycanda ilk AI platform."
        keywords="AI video generator, AI şəkil yaratma, suni intellekt, Pika Labs, Sora AI, Kling AI, Flux AI, Burlart, Azerbaijan AI"
        url="https://timera.ai"
      />
      <StructuredData type="WebSite" />
      <StructuredData type="Organization" />
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <Sparkles className="w-16 h-16 text-blue-400 mx-auto mb-4" />
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {t('createAmazingContent')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              {t('accessPowerfulTools')}
            </p>
          </div>

          <div className="flex items-center justify-center space-x-4 mb-16">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2 px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold text-lg transition-colors"
            >
              <Play className="w-5 h-5" />
              <span>{t('getStarted')}</span>
            </button>
            <button
              onClick={() => navigate('/templates')}
              className="px-8 py-4 bg-gray-100 dark:bg-dark-card hover:bg-gray-200 dark:hover:bg-dark-hover text-gray-900 dark:text-white rounded-lg font-semibold text-lg border border-gray-200 dark:border-dark-border transition-colors"
            >
              {t('browseTemplates')}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-gray-100 dark:bg-dark-card p-6 rounded-lg border border-gray-200 dark:border-dark-border">
              <div className="text-3xl mb-4">🎥</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{t('videoTools')}</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('generateVideos')}
              </p>
            </div>
            <div className="bg-gray-100 dark:bg-dark-card p-6 rounded-lg border border-gray-200 dark:border-dark-border">
              <div className="text-3xl mb-4">🖼️</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{t('imageTools')}</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('createImages')}
              </p>
            </div>
            <div className="bg-gray-100 dark:bg-dark-card p-6 rounded-lg border border-gray-200 dark:border-dark-border">
              <div className="text-3xl mb-4">🎵</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{t('audioTools')}</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('generateAudio')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

