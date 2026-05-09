const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ''

async function request(endpoint, options = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('nd_token') : null

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  })

  if (response.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('nd_token')
      localStorage.removeItem('nightdrop-subscriber')
      window.location.href = '/login'
    }
  }

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`)
  }

  return response.json()
}

export const api = {
  get: (endpoint, options = {}) =>
    request(endpoint, { ...options, method: 'GET' }),

  post: (endpoint, body, options = {}) =>
    request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    }),

  patch: (endpoint, body, options = {}) =>
    request(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body),
    }),

  delete: (endpoint, options = {}) =>
    request(endpoint, { ...options, method: 'DELETE' }),
}
