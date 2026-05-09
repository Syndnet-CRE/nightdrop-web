'use client'

// TODO: Wire up to backend /api/dealfeed/auth/forgot-password endpoint
// Should accept email and trigger password reset email

import Link from 'next/link'

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-50 dark:from-slate-950 dark:to-slate-900">
      <div className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Nightdrop</h1>
          <p className="text-gray-600 dark:text-gray-400">Reset your password</p>
        </div>

        <form className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="you@example.com"
            />
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400">
            We'll send you a link to reset your password
          </p>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
          >
            Send Reset Link
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link href="/login" className="text-green-600 hover:text-green-700 font-semibold">
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
