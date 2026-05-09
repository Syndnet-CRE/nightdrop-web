'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function InviteClaimPage({ params }) {
  const router = useRouter()
  const [token, setToken] = useState('')
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [step, setStep] = useState('validate') // validate, claim, success
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (params?.token) {
      setToken(params.token)
      validateInvite(params.token)
    }
  }, [params?.token])

  const validateInvite = async (inviteToken) => {
    setLoading(true)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || ''}/api/dealfeed/auth/invite/${inviteToken}`
      )
      if (response.ok) {
        const data = await response.json()
        setEmail(data.email || '')
        setStep('claim')
      } else if (response.status === 404) {
        setError('Invite not found or has expired')
        setStep('error')
      } else {
        setError('Error validating invite')
        setStep('error')
      }
    } catch (err) {
      setError('Error: ' + err.message)
      setStep('error')
    } finally {
      setLoading(false)
    }
  }

  const handleClaim = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || ''}/api/dealfeed/auth/invite/${token}/claim`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            full_name: fullName,
            password: password,
          }),
        }
      )

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('nd_token', data.token)
        localStorage.setItem('nightdrop-subscriber', JSON.stringify(data.subscriber))
        setStep('success')
        setTimeout(() => {
          router.push('/app')
        }, 2000)
      } else {
        setError('Failed to activate account')
      }
    } catch (err) {
      setError('Error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="text-4xl">⚡</span>
            <span className="text-3xl font-bold text-gray-900 dark:text-white">Nightdrop</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Activate Your Account</p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl p-8 border border-gray-200 dark:border-gray-700">
          {loading && step === 'validate' && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin mb-4">
                <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full" />
              </div>
              <p className="text-gray-600 dark:text-gray-400">Validating invite...</p>
            </div>
          )}

          {step === 'claim' && (
            <form onSubmit={handleClaim} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors font-medium"
              >
                {loading ? 'Activating...' : 'Activate Account'}
              </button>
            </form>
          )}

          {step === 'success' && (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✓</span>
              </div>
              <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">Account Activated!</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Redirecting you to the dashboard...</p>
            </div>
          )}

          {step === 'error' && (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✕</span>
              </div>
              <p className="text-lg font-medium text-red-600 dark:text-red-400 mb-2">Oops!</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{error || 'Something went wrong'}</p>
              <Link href="/login" className="text-green-600 hover:text-green-700 font-medium">
                Back to login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
