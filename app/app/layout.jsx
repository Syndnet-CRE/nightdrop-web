'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AuthProvider } from '@/components/providers/auth-provider'
import { ToastProvider } from '@/components/providers/toast-provider'
import { DealsProvider } from '@/components/providers/deals-provider'
import { ReadStateProvider } from '@/components/providers/read-state-provider'
import { DealStateProvider } from '@/components/providers/deal-state-provider'

export default function AppLayout({ children }) {
  const router = useRouter()
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('nd_token')
    if (!token) {
      router.push('/login')
    } else {
      setAuthenticated(true)
      setLoading(false)
    }
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    )
  }

  if (!authenticated) {
    return null
  }

  return (
    <AuthProvider>
      <ToastProvider>
        <DealsProvider>
          <ReadStateProvider>
            <DealStateProvider>{children}</DealStateProvider>
          </ReadStateProvider>
        </DealsProvider>
      </ToastProvider>
    </AuthProvider>
  )
}
