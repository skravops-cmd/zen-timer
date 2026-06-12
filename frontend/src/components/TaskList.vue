<template>
  <div class="mt-10">
    <h3 class="text-sm font-medium opacity-60 mb-3">Tasks</h3>

    <div class="flex gap-2 mb-4">
      <input v-model="newTaskTitle" @keyup.enter="addTask"
        placeholder="Add a task..."
        class="flex-1 px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-sm focus:outline-none focus:border-accent transition-colors"
        :class="{ 'bg-white border-gray-300': timerStore.settings.lightTheme }"
      />
      <button @click="addTask"
        class="px-4 py-2.5 rounded-lg bg-accent text-white text-sm font-medium hover:opacity-90 transition-opacity">
        Add
      </button>
    </div>

    <ul class="space-y-1">
      <li v-for="(task, idx) in tasksStore.tasks" :key="task.id"
        draggable="true"
        @dragstart="onDragStart($event, idx)"
        @dragover.prevent="onDragOver($event, idx)"
        @drop="onDrop($event, idx)"
        class="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group"
        :class="task.completed
          ? 'opacity-50'
          : timerStore.settings.lightTheme
            ? 'hover:bg-gray-100'
            : 'hover:bg-gray-800/50'"
      >
        <span class="drag-handle text-gray-600 text-sm cursor-grab">⠿</span>

        <input type="checkbox" :checked="task.completed"
          @change="tasksStore.toggleComplete(task)"
          class="w-4 h-4 rounded accent-accent cursor-pointer"
        />

        <span v-if="editingId !== task.id" @dblclick="startEdit(task)"
          class="flex-1 text-sm truncate"
          :class="{ 'line-through': task.completed }"
        >{{ task.title }}</span>

        <input v-else v-model="editTitle" @keyup.enter="saveEdit(task)" @blur="saveEdit(task)"
          @keyup.escape="cancelEdit"
          ref="editInput"
          class="flex-1 px-2 py-1 rounded bg-gray-700 border border-accent text-sm focus:outline-none"
          :class="{ 'bg-gray-100 border-gray-400': timerStore.settings.lightTheme }"
        />

        <span class="text-xs text-gray-500 tabular-nums">
          {{ task.completed_pomodoros }}/{{ task.estimated_pomodoros }}
        </span>

        <button v-if="!task.completed" @click="tasksStore.incrementPomodoro(task)"
          class="text-xs px-1.5 py-0.5 rounded bg-gray-700 text-gray-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
          :class="{ 'bg-gray-200': timerStore.settings.lightTheme }"
          title="+1 pomodoro"
        >+</button>

        <button @click="tasksStore.deleteTask(task)"
          class="text-xs text-gray-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
        >✕</button>
      </li>
    </ul>

    <p v-if="tasksStore.tasks.length === 0" class="text-sm text-gray-600 text-center py-4">
      No tasks yet. Add one above.
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useTasksStore } from '../stores/tasks'
import { useTimerStore } from '../stores/timer'

const tasksStore = useTasksStore()
const timerStore = useTimerStore()

const newTaskTitle = ref('')
const editingId = ref(null)
const editTitle = ref('')
const editInput = ref(null)
const dragIdx = ref(null)

onMounted(() => {
  tasksStore.fetchTasks()
})

function addTask() {
  const title = newTaskTitle.value.trim()
  if (!title) return
  tasksStore.addTask(title)
  newTaskTitle.value = ''
}

function startEdit(task) {
  editingId.value = task.id
  editTitle.value = task.title
  nextTick(() => editInput.value?.focus())
}

function saveEdit(task) {
  if (editingId.value !== task.id) return
  const title = editTitle.value.trim()
  if (title && title !== task.title) {
    tasksStore.editTask(task, { title })
  }
  editingId.value = null
}

function cancelEdit() {
  editingId.value = null
}

function onDragStart(e, idx) {
  dragIdx.value = idx
  e.dataTransfer.effectAllowed = 'move'
}

function onDragOver(e, idx) {
  e.dataTransfer.dropEffect = 'move'
}

function onDrop(e, idx) {
  if (dragIdx.value === null || dragIdx.value === idx) return
  const items = [...tasksStore.tasks]
  const [moved] = items.splice(dragIdx.value, 1)
  items.splice(idx, 0, moved)
  tasksStore.reorderTasks(items)
  dragIdx.value = null
}
</script>
