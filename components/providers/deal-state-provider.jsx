'use client'

import { createContext, useContext, useState, useCallback } from 'react'
import { useAuth } from './auth-provider'

const DealStateContext = createContext(null)

// Valid deal states: 'active', 'dead', 'loi', 'archived'
const VALID_STATES = ['active', 'dead', 'loi', 'archived']

export function DealStateProvider({ children }) {
  const { subscriber } = useAuth()
  const subId = subscriber?.id ?? ''

  const [dealStates, setDealStates] = useState(() => {
    if (!subId || typeof window === 'undefined') return {}
    const prefix = `dealfeed.dealstate.${subId}:`
    const map = {}
    for (const key of Object.keys(localStorage)) {
      if (key.startsWith(prefix)) {
        map[key.slice(prefix.length)] = localStorage.getItem(key)
      }
    }
    return map
  })

  const getDealState = useCallback((dealId) => dealStates[String(dealId)] || 'active', [dealStates])

  const setDealState = useCallback(
    (dealId, state) => {
      if (!subId || !VALID_STATES.includes(state) || typeof window === 'undefined') return
      localStorage.setItem(`dealfeed.dealstate.${subId}:${dealId}`, state)
      setDealStates((prev) => ({ ...prev, [String(dealId)]: state }))
    },
    [subId]
  )

  return (
    <DealStateContext.Provider value={{ getDealState, setDealState }}>
      {children}
    </DealStateContext.Provider>
  )
}

export function useDealState() {
  const context = useContext(DealStateContext)
  if (!context) {
    throw new Error('useDealState must be used within DealStateProvider')
  }
  return context
}
