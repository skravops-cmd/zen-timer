import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './auth'
import { tasksAPI } from '../api/tasks'

const LOCAL_KEY = 'zenTimerTasks'

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref([])

  function loadLocal() {
    try {
      const raw = localStorage.getItem(LOCAL_KEY)
      if (raw) tasks.value = JSON.parse(raw)
    } catch { /* ignore */ }
  }

  function saveLocal() {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(tasks.value))
  }

  async function fetchTasks() {
    const auth = useAuthStore()
    if (auth.isAuthenticated) {
      try {
        tasks.value = await tasksAPI.list()
      } catch {
        loadLocal()
      }
    } else {
      loadLocal()
    }
  }

  async function addTask(title, estimatedPomodoros = 1) {
    const auth = useAuthStore()
    if (auth.isAuthenticated) {
      try {
        const task = await tasksAPI.create(title, estimatedPomodoros)
        tasks.value.push(task)
        return
      } catch { /* fall through to local */ }
    }
    const task = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      estimated_pomodoros: estimatedPomodoros,
      completed_pomodoros: 0,
      position: tasks.value.length,
      created_at: new Date().toISOString(),
    }
    tasks.value.push(task)
    saveLocal()
  }

  async function toggleComplete(task) {
    const auth = useAuthStore()
    task.completed = !task.completed
    if (auth.isAuthenticated) {
      try {
        await tasksAPI.update(task.id, { completed: task.completed })
        return
      } catch { /* fall through */ }
    }
    saveLocal()
  }

  async function deleteTask(task) {
    const auth = useAuthStore()
    tasks.value = tasks.value.filter(t => t.id !== task.id)
    if (auth.isAuthenticated) {
      try {
        await tasksAPI.delete(task.id)
        return
      } catch { /* fall through */ }
    }
    saveLocal()
  }

  async function editTask(task, updates) {
    Object.assign(task, updates)
    const auth = useAuthStore()
    if (auth.isAuthenticated) {
      try {
        await tasksAPI.update(task.id, updates)
        return
      } catch { /* fall through */ }
    }
    saveLocal()
  }

  function reorderTasks(newOrder) {
    tasks.value = newOrder
    const auth = useAuthStore()
    if (auth.isAuthenticated) {
      newOrder.forEach((t, i) => {
        tasksAPI.update(t.id, { position: i }).catch(() => {})
      })
    } else {
      saveLocal()
    }
  }

  function incrementPomodoro(task) {
    task.completed_pomodoros++
    editTask(task, { completed_pomodoros: task.completed_pomodoros })
  }

  return {
    tasks,
    fetchTasks,
    addTask,
    toggleComplete,
    deleteTask,
    editTask,
    reorderTasks,
    incrementPomodoro,
  }
})
