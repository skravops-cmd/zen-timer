import { request } from './client'

export const tasksAPI = {
  create(title, estimatedPomodoros = 1) {
    return request('/tasks', {
      method: 'POST',
      body: JSON.stringify({ title, estimated_pomodoros: estimatedPomodoros }),
    })
  },
  list() {
    return request('/tasks')
  },
  update(id, data) {
    return request(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },
  delete(id) {
    return request(`/tasks/${id}`, {
      method: 'DELETE',
    })
  },
}
