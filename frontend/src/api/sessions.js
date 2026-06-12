import { request } from './client'

export const sessionsAPI = {
  create(data) {
    return request('/sessions', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
  list(offset = 0, limit = 20) {
    return request(`/sessions?offset=${offset}&limit=${limit}`)
  },
}
