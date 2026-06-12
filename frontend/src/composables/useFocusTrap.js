import { onMounted, onUnmounted, watch } from 'vue'

const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function useFocusTrap(containerRef, active) {
  let previousActiveElement = null

  function trap(e) {
    if (e.key !== 'Tab' || !containerRef.value) return
    const focusable = containerRef.value.querySelectorAll(FOCUSABLE_SELECTOR)
    if (focusable.length === 0) return

    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault()
        last.focus()
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
  }

  watch(active, (isActive) => {
    if (isActive) {
      previousActiveElement = document.activeElement
      setTimeout(() => {
        const focusable = containerRef.value?.querySelectorAll(FOCUSABLE_SELECTOR)
        if (focusable && focusable.length > 0) focusable[0].focus()
      }, 50)
    } else if (previousActiveElement) {
      previousActiveElement.focus()
      previousActiveElement = null
    }
  })

  onMounted(() => {
    document.addEventListener('keydown', trap)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', trap)
    if (previousActiveElement) previousActiveElement.focus()
  })
}
