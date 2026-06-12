import { request } from './client'

export const authAPI = {
  register(email, username, password) {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, username, password }),
    })
  },
  login(username, password) {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })
  },
  refresh(refreshToken) {
    return request('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    })
  },
  me() {
    return request('/auth/me')
  },
}
