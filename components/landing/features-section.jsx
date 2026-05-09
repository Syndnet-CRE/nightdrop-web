'use client'

export function FeaturesSection() {
  const features = [
    {
      title: 'Smart Matching',
      description: 'Properties matched to your buy box with real-time updates and scoring',
      icon: '🎯',
    },
    {
      title: 'Live Data',
      description: 'Access to tax records, owner info, comps, and distress signals',
      icon: '📊',
    },
    {
      title: 'Deal Intelligence',
      description: 'GIS data, site analysis, and market context in one dashboard',
      icon: '🗺️',
    },
    {
      title: 'Deal Tracking',
      description: 'Manage pipeline, log contacts, and collaborate with team members',
      icon: '📋',
    },
  ]

  return (
    <section id="features" className="py-24 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">How It Works</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">Everything you need to find and manage deals</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
