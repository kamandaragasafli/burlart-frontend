import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { aiTools } from '../data/tools'

export default function ToolPage() {
  const { toolId } = useParams()
  const navigate = useNavigate()
  const tool = aiTools.find((t) => t.id === toolId)

  if (!tool) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Tool not found</h2>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="container mx-auto px-6 py-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center space-x-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="max-w-4xl mx-auto">
          <div className="bg-dark-card rounded-lg border border-dark-border p-8">
            <h1 className="text-3xl font-bold text-white mb-4">{tool.name}</h1>
            <p className="text-gray-400 mb-6">{tool.description}</p>

            <div className="bg-dark-hover rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-white mb-4">Tool Interface</h2>
              <p className="text-gray-400 mb-4">
                This is where the actual tool interface would be implemented.
                Connect your AI video/image/audio tool API here.
              </p>
              <div className="bg-dark-bg rounded p-4 border border-dark-border">
                <p className="text-sm text-gray-500">
                  Tool ID: {tool.id}
                </p>
                <p className="text-sm text-gray-500">
                  Credit Cost: {tool.creditCost} credits
                </p>
                <p className="text-sm text-gray-500">
                  Category: {tool.category}
                </p>
              </div>
            </div>

            <div className="flex space-x-4">
              <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors">
                Start Processing
              </button>
              <button className="px-6 py-3 bg-dark-hover hover:bg-gray-700 text-white rounded-lg font-medium transition-colors">
                View Documentation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

