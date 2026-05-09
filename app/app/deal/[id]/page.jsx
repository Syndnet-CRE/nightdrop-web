'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useDeals } from '@/components/providers/deals-provider'
import { DealDetail } from '@/components/dashboard/deal-detail'

export default function DealDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { deals, loading } = useDeals()
  const [deal, setDeal] = useState(null)

  useEffect(() => {
    if (!loading && deals.length > 0) {
      const found = deals.find((d) => String(d.id) === String(id))
      if (found) {
        setDeal(found)
      }
    }
  }, [id, deals, loading])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-64">
        <div className="text-gray-500 dark:text-gray-400">Loading deal...</div>
      </div>
    )
  }

  if (!deal) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-64 gap-4">
        <div className="text-gray-500 dark:text-gray-400">Deal not found.</div>
        <button
          onClick={() => router.push('/app')}
          className="text-green-600 hover:underline text-sm"
        >
          Back to dashboard
        </button>
      </div>
    )
  }

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <button
          onClick={() => router.back()}
          className="mb-4 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 flex items-center gap-1"
        >
          ← Back
        </button>
        <DealDetail deal={deal} />
      </div>
    </div>
  )
}
