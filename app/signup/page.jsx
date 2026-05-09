'use client'

// TODO: Wire up to backend /api/dealfeed/auth/signup endpoint
// For now, this is a waitlist stub that shows coming soon message
// When implemented, should capture email and password, create account, redirect to /onboarding

import Link from 'next/link'

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-50 dark:from-slate-950 dark:to-slate-900">
      <div className="w-full max-w-md p-8 text-center">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Nightdrop</h1>
          <p className="text-gray-600 dark:text-gray-400">Smart deal flow for CRE investors</p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-2">Join the Waitlist</h2>
          <p className="text-blue-700 dark:text-blue-300 mb-4">
            We're launching soon. Be the first to get access to smart deal matching.
          </p>
          <form className="space-y-3">
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full px-4 py-2 border border-blue-300 dark:border-blue-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <button
              type="submit"
              className="w-full px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
            >
              Get Early Access
            </button>
          </form>
        </div>

        <p className="text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link href="/login" className="text-green-600 hover:text-green-700 font-semibold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
