import { request } from './client'

export const statsAPI = {
  get() {
    return request('/stats')
  },
}
