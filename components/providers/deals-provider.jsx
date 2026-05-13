'use client'

import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { useAuth } from './auth-provider'

const DealsContext = createContext(null)

const STATUS_DISPLAY = {
  active: 'Active',
  paused: 'Paused',
  pending: 'Pending',
  cancelled: 'Cancelled',
  coverage_failed: 'Coverage Failed',
}

function normalizeBuyBox(b) {
  const geo = [
    ...(b.geo_cities || []),
    ...(b.geo_states || []),
    ...(b.geo_counties || []),
  ]
    .filter(Boolean)
    .join(', ')

  let lastRun = '—'
  if (b.last_run_at) {
    const d = new Date(b.last_run_at)
    lastRun =
      d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
      ' — ' +
      d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' })
  }

  return {
    ...b,
    id: b.id,
    name: b.label,
    status: STATUS_DISPLAY[b.status] || b.status || 'Active',
    geo: geo || '—',
    classes: b.asset_classes || [],
    hold: b.min_hold_yrs ? `${b.min_hold_yrs} yr` : '—',
    created: b.created_at
      ? new Date(b.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : '—',
    deals: b.deals_sent_total || 0,
    lastRun,
  }
}

export function DealsProvider({ children }) {
  const [deals, setDeals] = useState([])
  const [buyBoxes, setBuyBoxes] = useState([])
  const [contacts, setContacts] = useState({})
  const [dealNotes, setDealNotes] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { subscriber } = useAuth()

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ''
  const token = typeof window !== 'undefined' ? localStorage.getItem('nd_token') : null

  const request = useCallback(
    async (endpoint, options = {}) => {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      })

      if (response.status === 401) {
        localStorage.removeItem('nd_token')
        localStorage.removeItem('nightdrop-subscriber')
        window.location.href = '/login'
      }

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`)
      }

      return response.json()
    },
    [API_BASE_URL, token]
  )

  const fetchDeals = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await request('/api/dealfeed/deals')
      setDeals(data.deals || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [request])

  const fetchBuyBoxes = useCallback(async () => {
    try {
      const data = await request('/api/dealfeed/buy-boxes')
      setBuyBoxes((data.buy_boxes || []).map(normalizeBuyBox))
    } catch (err) {
      setError(err.message)
    }
  }, [request])

  const fetchContacts = useCallback(
    async (dealId) => {
      try {
        const data = await request(`/api/dealfeed/deals/${dealId}/contacts`)
        setContacts((prev) => ({ ...prev, [dealId]: data.contacts || [] }))
        return data.contacts || []
      } catch (err) {
        setError(err.message)
      }
    },
    [request]
  )

  const postFeedback = useCallback(
    async (dealId, feedback) => {
      try {
        await request(`/api/dealfeed/deals/${dealId}/feedback`, {
          method: 'POST',
          body: JSON.stringify({ feedback }),
        })
        return true
      } catch (err) {
        setError(err.message)
        return false
      }
    },
    [request]
  )

  const saveNote = useCallback(
    async (dealId, notes) => {
      try {
        await request(`/api/dealfeed/deals/${dealId}/notes`, {
          method: 'PATCH',
          body: JSON.stringify({ notes }),
        })
        setDeals((prev) =>
          prev.map((deal) => (deal.id === dealId ? { ...deal, notes } : deal))
        )
        return true
      } catch (err) {
        setError(err.message)
        return false
      }
    },
    [request]
  )

  const updateStatus = useCallback(
    async (dealId, status) => {
      try {
        await request(`/api/dealfeed/deals/${dealId}/status`, {
          method: 'PATCH',
          body: JSON.stringify({ status }),
        })
        setDeals((prev) =>
          prev.map((deal) => (deal.id === dealId ? { ...deal, status } : deal))
        )
        return true
      } catch (err) {
        setError(err.message)
        return false
      }
    },
    [request]
  )

  const logContact = useCallback(
    async (dealId, contactData) => {
      try {
        const data = await request(`/api/dealfeed/deals/${dealId}/contacts`, {
          method: 'POST',
          body: JSON.stringify(contactData),
        })
        setContacts((prev) => ({
          ...prev,
          [dealId]: [...(prev[dealId] || []), data.contact],
        }))
        return true
      } catch (err) {
        setError(err.message)
        return false
      }
    },
    [request]
  )

  const patchBuyBox = useCallback(
    async (buyBoxId, data) => {
      try {
        const response = await request(`/api/dealfeed/buy-boxes/${buyBoxId}`, {
          method: 'PATCH',
          body: JSON.stringify(data),
        })
        setBuyBoxes((prev) =>
          prev.map((box) => (box.id === buyBoxId ? normalizeBuyBox(response.buy_box) : box))
        )
        return response.buy_box
      } catch (err) {
        setError(err.message)
      }
    },
    [request]
  )

  const deleteBuyBox = useCallback(
    async (buyBoxId) => {
      try {
        await request(`/api/dealfeed/buy-boxes/${buyBoxId}`, { method: 'DELETE' })
        setBuyBoxes((prev) => prev.filter((box) => box.id !== buyBoxId))
        return true
      } catch (err) {
        setError(err.message)
        return false
      }
    },
    [request]
  )

  const fetchDealNotes = useCallback(
    async (dealId) => {
      try {
        const data = await request(`/api/dealfeed/deals/${dealId}/notes`)
        setDealNotes((prev) => ({ ...prev, [dealId]: data.notes || [] }))
      } catch (err) {
        // leave existing state unchanged on error
      }
    },
    [request]
  )

  const createDealNote = useCallback(
    async (dealId, noteText) => {
      try {
        const data = await request(`/api/dealfeed/deals/${dealId}/notes`, {
          method: 'POST',
          body: JSON.stringify({ note_text: noteText }),
        })
        setDealNotes((prev) => ({
          ...prev,
          [dealId]: [data.note, ...(prev[dealId] || [])],
        }))
        return data.note
      } catch (err) {
        setError(err.message)
      }
    },
    [request]
  )

  const refetch = useCallback(async () => {
    await Promise.all([fetchDeals(), fetchBuyBoxes()])
  }, [fetchDeals, fetchBuyBoxes])

  useEffect(() => {
    if (subscriber) {
      refetch()
    }
  }, [subscriber, refetch])

  return (
    <DealsContext.Provider
      value={{
        deals,
        buyBoxes,
        contacts,
        dealNotes,
        loading,
        error,
        refetch,
        postFeedback,
        saveNote,
        updateStatus,
        fetchContacts,
        logContact,
        patchBuyBox,
        deleteBuyBox,
        fetchDealNotes,
        createDealNote,
      }}
    >
      {children}
    </DealsContext.Provider>
  )
}

export function useDeals() {
  const context = useContext(DealsContext)
  if (!context) {
    throw new Error('useDeals must be used within DealsProvider')
  }
  return context
}
