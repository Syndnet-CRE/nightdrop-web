'use client'

// TODO: Implement onboarding flow
// This is a stub page for future onboarding workflow
// Should guide new users through profile setup, buy box creation, and first deal feed

import Link from 'next/link'

export default function OnboardingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-50 dark:from-slate-950 dark:to-slate-900">
      <div className="w-full max-w-2xl p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Welcome to Nightdrop</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          Set up your profile to get started with smart deal matching
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-8 mb-8">
          <p className="text-blue-900 dark:text-blue-200">Onboarding flow coming soon</p>
        </div>

        <Link href="/app" className="inline-block px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700">
          Go to Dashboard
        </Link>
      </div>
    </div>
  )
}
