import SEO from '../components/SEO'

export default function Templates() {
  return (
    <div className="min-h-screen bg-dark-bg">
      <SEO 
        title="Şablonlar"
        description="Hazır AI şablonları ilə sürətli video və şəkil yaratma"
        url="https://timera.ai/templates"
      />
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Templates</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-dark-card rounded-lg border border-dark-border p-6 hover:border-gray-500 transition-colors cursor-pointer"
            >
              <div className="aspect-video bg-dark-hover rounded-lg mb-4"></div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Template {i}
              </h3>
              <p className="text-sm text-gray-400">
                Description of template {i}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

