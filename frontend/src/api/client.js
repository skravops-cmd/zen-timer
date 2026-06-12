const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1'

class ApiError extends Error {
  constructor(status, data) {
    super(typeof data === 'string' ? data : data?.detail || `Request failed (${status})`)
    this.status = status
    this.data = data
  }
}

let onUnauthorized = null

function setOnUnauthorized(cb) {
  onUnauthorized = cb
}

async function request(path, options = {}) {
  const token = localStorage.getItem('access_token')
  const headers = { ...options.headers }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  })

  if (res.status === 204) return null

  const data = await res.json()

  if (!res.ok) {
    if (res.status === 401 && onUnauthorized) {
      onUnauthorized()
    }
    throw new ApiError(res.status, data)
  }

  return data
}

export { request, ApiError, setOnUnauthorized }
