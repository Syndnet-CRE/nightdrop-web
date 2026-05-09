'use client'

import Link from 'next/link'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
const SIGNUP_URL = `${APP_URL}/signup`

export function PricingSection() {
  const tiers = [
    {
      name: 'Starter',
      price: '$299',
      period: '/month',
      description: 'For individual investors',
      features: ['Up to 3 buy boxes', '500 deal matches/month', 'Basic reporting', 'Email support'],
      cta: 'Get Started',
    },
    {
      name: 'Professional',
      price: '$999',
      period: '/month',
      description: 'For active teams',
      features: ['Unlimited buy boxes', '5000 deal matches/month', 'Advanced analytics', 'Priority support', 'Team collaboration'],
      cta: 'Get Started',
      highlighted: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'For large portfolios',
      features: ['Everything in Professional', 'Custom integrations', 'Dedicated support', 'SLA guarantee'],
      cta: 'Contact Sales',
    },
  ]

  return (
    <section id="pricing" className="py-24 bg-gray-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Transparent Pricing</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">Choose the plan that fits your needs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier, idx) => (
            <div
              key={idx}
              className={`rounded-lg p-8 transition ${
                tier.highlighted
                  ? 'bg-green-600 text-white border-2 border-green-600'
                  : 'bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700'
              }`}
            >
              <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
              <p className={`mb-4 ${tier.highlighted ? 'text-green-100' : 'text-gray-600 dark:text-gray-400'}`}>
                {tier.description}
              </p>
              <div className="mb-6">
                <span className="text-4xl font-bold">{tier.price}</span>
                <span className={tier.highlighted ? 'text-green-100' : 'text-gray-600 dark:text-gray-400'}>
                  {tier.period}
                </span>
              </div>

              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, fidx) => (
                  <li key={fidx} className="flex items-center gap-2">
                    <span className={tier.highlighted ? 'text-green-200' : 'text-green-600'}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={SIGNUP_URL}
                className={`block text-center px-6 py-3 rounded-lg font-semibold transition ${
                  tier.highlighted
                    ? 'bg-white text-green-600 hover:bg-gray-100'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
