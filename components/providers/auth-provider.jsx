'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [subscriber, setSubscriber] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ''

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('nd_token')
      const cachedSubscriber = localStorage.getItem('nightdrop-subscriber')

      if (cachedSubscriber) {
        try {
          setSubscriber(JSON.parse(cachedSubscriber))
        } catch (e) {
          console.error('Failed to parse cached subscriber')
        }
      }

      if (token) {
        try {
          const response = await fetch(`${API_BASE_URL}/api/dealfeed/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          if (response.ok) {
            const data = await response.json()
            setSubscriber(data.subscriber)
            localStorage.setItem('nightdrop-subscriber', JSON.stringify(data.subscriber))
          } else if (response.status === 401) {
            localStorage.removeItem('nd_token')
            localStorage.removeItem('nightdrop-subscriber')
            setSubscriber(null)
          }
        } catch (err) {
          setError(err.message)
        }
      }

      setLoading(false)
    }

    initAuth()
  }, [API_BASE_URL])

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/dealfeed/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }

      const data = await response.json()
      localStorage.setItem('nd_token', data.token)
      localStorage.setItem('nightdrop-subscriber', JSON.stringify(data.subscriber))
      setSubscriber(data.subscriber)

      return data
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const logout = () => {
    localStorage.removeItem('nd_token')
    localStorage.removeItem('nightdrop-subscriber')
    setSubscriber(null)
  }

  return (
    <AuthContext.Provider value={{ subscriber, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
