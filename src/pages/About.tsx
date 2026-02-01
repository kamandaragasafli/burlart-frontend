import { useTranslation } from '../store/languageStore'
import SEO from '../components/SEO'
import { Sparkles, Target, Users, Code, Award, Zap } from 'lucide-react'

export default function About() {
  const t = useTranslation()

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg">
      <SEO 
        title={t('aboutUs') || 'About Us - Burlart'}
        description="Burlart haqqında məlumat. AI ilə video və şəkil yaratma platforması."
        keywords="Burlart, AI, video generation, image generation, about"
        url="https://burlart.az/about"
      />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-950/20 dark:to-purple-950/20 py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-2xl opacity-40 animate-pulse"></div>
                <Sparkles className="w-16 h-16 sm:w-20 sm:h-20 text-blue-400 relative z-10" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 sm:mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400">
                {t('aboutUs') || 'About Us'}
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              {t('aboutDescription') || 'Burlart - AI ilə peşəkar video və şəkil yaratma platforması. Güclü AI modelləri ilə kreativ ideyalarınızı həyata keçirin.'}
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center">
              <div>
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4 sm:mb-6">
                  <Target className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
                  {t('ourMission') || 'Our Mission'}
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                  {t('missionText') || 'Bizim missiyamız hər kəsə AI texnologiyaları ilə yüksək keyfiyyətli video və şəkillər yaratmaq imkanı verməkdir. İstər peşəkar dizayner, istərsə də yeni başlayan olsun, Burlart ilə kreativ ideyalarınızı asanlıqla həyata keçirə bilərsiniz.'}
                </p>
                <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  {t('missionText2') || 'Biz ən son AI modellərini bir platformada birləşdirərək, istifadəçilərimizə ən yaxşı təcrübəni təqdim etməyə çalışırıq.'}
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-2xl p-6 sm:p-8 md:p-10">
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2">
                        {t('fastGeneration') || 'Fast Generation'}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                        {t('fastGenerationText') || 'Saniyələr ərzində yüksək keyfiyyətli kontent yaradın'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <Award className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2">
                        {t('highQuality') || 'High Quality'}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                        {t('highQualityText') || 'Peşəkar səviyyədə nəticələr'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <Code className="w-5 h-5 sm:w-6 sm:h-6 text-pink-600 dark:text-pink-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2">
                        {t('powerfulModels') || 'Powerful Models'}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                        {t('powerfulModelsText') || 'Sora, Veo, Kling AI və digər güclü modellər'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-gray-50 dark:bg-dark-card py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-4 sm:mb-6">
                <Users className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
                {t('team') || 'Team'}
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                {t('teamDescription') || 'Burlart komandası AI texnologiyaları və kreativ dizayn sahəsində təcrübəli mütəxəssislərdən ibarətdir.'}
              </p>
            </div>
            <div className="bg-white dark:bg-dark-bg rounded-2xl p-6 sm:p-8 md:p-10 shadow-lg">
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                {t('teamText') || 'Bizim komandamız AI texnologiyalarının inkişafına və istifadəçilərimizə ən yaxşı təcrübəni təqdim etməyə sadiqdir. Hər bir üzvümüz öz sahəsində mütəxəssisdir və platformamızın daim təkmilləşdirilməsi üçün çalışır.'}
              </p>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                {t('teamText2') || 'Burlart, Trivasoft şirkəti tərəfindən hazırlanmış və inkişaf etdirilmişdir.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Technology Section */}
      <div className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
                {t('technology') || 'Technology'}
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                {t('technologyDescription') || 'Burlart ən son AI texnologiyalarından istifadə edir'}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">
                  Sora
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                  {t('soraDescription') || 'OpenAI-nin güclü video yaratma modeli'}
                </p>
              </div>
              <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">
                  Veo 3.1
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                  {t('veoDescription') || 'Google-ın ən son video yaratma texnologiyası'}
                </p>
              </div>
              <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">
                  Kling AI
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                  {t('klingDescription') || 'Yüksək keyfiyyətli video yaratma'}
                </p>
              </div>
              <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">
                  Flux
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                  {t('fluxDescription') || 'Peşəkar səviyyədə şəkil yaratma'}
                </p>
              </div>
              <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">
                  Pika Labs
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                  {t('pikaDescription') || 'Sürətli və keyfiyyətli video yaratma'}
                </p>
              </div>
              <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">
                  {t('andMore') || 'And More'}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                  {t('andMoreText') || 'Digər güclü AI modelləri'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
              {t('getInTouch') || 'Get in Touch'}
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-blue-100 mb-6 sm:mb-8 max-w-2xl mx-auto">
              {t('getInTouchText') || 'Suallarınız və ya təklifləriniz varsa, bizimlə əlaqə saxlayın.'}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="mailto:info@burlart.az"
                className="px-6 sm:px-8 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors text-sm sm:text-base"
              >
                {t('contactUs') || 'Contact Us'}
              </a>
              <a
                href="https://trivasoft.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 sm:px-8 py-3 bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-800 transition-colors text-sm sm:text-base"
              >
                {t('visitTrivasoft') || 'Visit Trivasoft'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

