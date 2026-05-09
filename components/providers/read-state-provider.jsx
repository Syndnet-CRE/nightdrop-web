'use client'

import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { useAuth } from './auth-provider'

const ReadStateContext = createContext(null)

export function ReadStateProvider({ children }) {
  const { subscriber } = useAuth()
  const subId = subscriber?.id ?? ''

  const [readIds, setReadIds] = useState(() => {
    if (!subId) return new Set()
    if (typeof window === 'undefined') return new Set()
    const prefix = `dealfeed.read.${subId}:`
    return new Set(
      Object.keys(localStorage)
        .filter((k) => k.startsWith(prefix))
        .map((k) => k.slice(prefix.length))
    )
  })

  const isRead = useCallback((dealId) => readIds.has(String(dealId)), [readIds])

  const markRead = useCallback(
    (dealId) => {
      if (!subId || typeof window === 'undefined') return
      const key = `dealfeed.read.${subId}:${dealId}`
      if (localStorage.getItem(key) === 'true') return
      localStorage.setItem(key, 'true')
      setReadIds((prev) => new Set([...prev, String(dealId)]))
    },
    [subId]
  )

  return (
    <ReadStateContext.Provider value={{ isRead, markRead }}>
      {children}
    </ReadStateContext.Provider>
  )
}

export function useReadState() {
  const context = useContext(ReadStateContext)
  if (!context) {
    throw new Error('useReadState must be used within ReadStateProvider')
  }
  return context
}
