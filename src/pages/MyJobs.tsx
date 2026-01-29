import { useState, useEffect, useCallback } from 'react'
import { useAuthStore } from '../store/authStore'
import { useTranslation } from '../store/languageStore'
import { videoAPI, imageAPI } from '../services/api'
import SEO from '../components/SEO'
import ModernBackground from '../components/ModernBackground'
import { Download, Loader2, CheckCircle, XCircle, Clock, Video, Image as ImageIcon } from 'lucide-react'

interface Job {
  id: number
  prompt: string
  tool: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  video_url?: string
  image_url?: string
  error_message?: string
  credits_used: number
  created_at: string
  updated_at: string
}

export default function MyJobs() {
  const { user } = useAuthStore()
  const t = useTranslation()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'pending' | 'processing' | 'completed' | 'failed'>('all')

  const loadJobs = useCallback(async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)
      const [videosResponse, imagesResponse] = await Promise.all([
        videoAPI.getVideos().catch((err) => {
          console.error('Failed to load videos:', err)
          setError('Failed to load videos. Please try again.')
          return []
        }),
        imageAPI.getImages().catch((err) => {
          console.error('Failed to load images:', err)
          setError('Failed to load images. Please try again.')
          return []
        }),
      ])

      // Handle different response structures (array or object with results)
      const videos = Array.isArray(videosResponse) ? videosResponse : (videosResponse?.results || videosResponse?.data || [])
      const images = Array.isArray(imagesResponse) ? imagesResponse : (imagesResponse?.results || imagesResponse?.data || [])

      // Combine and format jobs
      const allJobs: Job[] = [
        ...videos.map((v: any) => ({
          id: v.id,
          prompt: v.prompt || '',
          tool: v.tool || 'unknown',
          status: v.status || 'pending',
          video_url: v.video_url || v.url,
          image_url: undefined,
          error_message: v.error_message || v.error,
          credits_used: v.credits_used || v.credits || 0,
          created_at: v.created_at || v.created,
          updated_at: v.updated_at || v.updated || v.created_at || v.created,
        })),
        ...images.map((i: any) => ({
          id: i.id,
          prompt: i.prompt || '',
          tool: i.tool || 'unknown',
          status: i.status || 'pending',
          video_url: undefined,
          image_url: i.image_url || i.url,
          error_message: i.error_message || i.error,
          credits_used: i.credits_used || i.credits || 0,
          created_at: i.created_at || i.created,
          updated_at: i.updated_at || i.updated || i.created_at || i.created,
        })),
      ]
        .filter((job) => job.id) // Filter out invalid jobs
        .sort((a, b) => {
          const dateA = new Date(a.created_at).getTime()
          const dateB = new Date(b.created_at).getTime()
          return dateB - dateA
        })

      setJobs(allJobs)
    } catch (error: any) {
      console.error('Failed to load jobs:', error)
      setError(error?.message || 'Failed to load jobs. Please try again.')
      setJobs([])
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (user) {
      loadJobs()
    } else {
      setJobs([])
      setLoading(false)
    }
  }, [user, loadJobs])

  // Auto-refresh for pending/processing jobs
  useEffect(() => {
    if (!user) return
    
    const hasPendingOrProcessing = jobs.some(job => job.status === 'pending' || job.status === 'processing')
    if (!hasPendingOrProcessing) return

    const interval = setInterval(() => {
      loadJobs()
    }, 5000)
    
    return () => clearInterval(interval)
  }, [user, jobs, loadJobs])

  const filteredJobs = filter === 'all' 
    ? jobs 
    : jobs.filter(job => job.status === filter)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'processing':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return t('pending')
      case 'processing':
        return t('processing')
      case 'completed':
        return t('completed')
      case 'failed':
        return t('failed')
      default:
        return status
    }
  }

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (!user) {
    return (
      <ModernBackground className="flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">{t('pleaseLogin')}</p>
        </div>
      </ModernBackground>
    )
  }

  return (
    <ModernBackground>
      <SEO 
        title="My Jobs - İşlərim"
        description="Yaratdığınız AI video və şəkilləri görüntüləyin və idarə edin."
        url="https://timera.ai/jobs"
      />
      
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('myJobs')}</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('myJobsDescription')}
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center space-x-2 mb-6">
          {(['all', 'pending', 'processing', 'completed', 'failed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
                filter === f
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-dark-card text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-hover'
              }`}
            >
              {f === 'all' ? t('all') : getStatusText(f)}
            </button>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            <button
              onClick={() => loadJobs()}
              className="mt-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Jobs List */}
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">{t('loading') || 'Loading...'}</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">{t('noJobsFound') || 'No jobs found'}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {job.video_url ? (
                        <Video className="w-5 h-5 text-blue-500" />
                      ) : (
                        <ImageIcon className="w-5 h-5 text-purple-500" />
                      )}
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {job.tool}
                      </h3>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(job.status)}
                        <span className={`text-sm font-medium ${
                          job.status === 'completed' ? 'text-green-500' :
                          job.status === 'failed' ? 'text-red-500' :
                          job.status === 'processing' ? 'text-blue-500' :
                          'text-yellow-500'
                        }`}>
                          {getStatusText(job.status)}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">{job.prompt}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <span>{t('creditsUsed').replace('{count}', job.credits_used.toString())}</span>
                      <span>•</span>
                      <span>{new Date(job.created_at).toLocaleString('az-AZ')}</span>
                    </div>
                  </div>
                </div>

                {/* Preview */}
                {job.status === 'completed' && (job.video_url || job.image_url) && (
                  <div className="mb-4">
                    {job.video_url ? (
                      <video
                        src={job.video_url}
                        controls
                        className="w-full rounded-lg max-w-2xl"
                      />
                    ) : (
                      <img
                        src={job.image_url}
                        alt={job.prompt}
                        className="w-full rounded-lg max-w-2xl"
                      />
                    )}
                  </div>
                )}

                {/* Error Message */}
                {job.status === 'failed' && job.error_message && (
                  <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-700 dark:text-red-400">
                      <strong>{t('reason')}</strong> {job.error_message}
                    </p>
                  </div>
                )}

                {/* Download Button */}
                {job.status === 'completed' && (job.video_url || job.image_url) && (
                  <button
                    onClick={() => handleDownload(
                      job.video_url || job.image_url || '',
                      `${job.tool}-${job.id}.${job.video_url ? 'mp4' : 'jpg'}`
                    )}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>{t('download')}</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </ModernBackground>
  )
}

