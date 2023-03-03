import { inBrowser } from '@varlet/shared'
import {
  isRef,
  onActivated,
  onDeactivated,
  onMounted,
  onUnmounted,
  unref,
  watch,
  type Ref,
  type WatchStopHandle,
} from 'vue'

export type UseEventListenerTarget = EventTarget | Ref<EventTarget | undefined | null>

export interface UseEventListenerOptions {
  capture?: boolean
  passive?: boolean
}

export function useEventListener<T extends keyof DocumentEventMap>(
  target: UseEventListenerTarget,
  type: T,
  listener: (event: DocumentEventMap[T]) => void,
  options?: UseEventListenerOptions
): () => void

export function useEventListener(
  target: UseEventListenerTarget,
  type: string,
  listener: EventListener,
  options?: UseEventListenerOptions
): () => void

export function useEventListener(
  target: UseEventListenerTarget,
  type: string,
  listener: EventListener,
  options: UseEventListenerOptions = {}
) {
  if (!inBrowser()) {
    return
  }

  const { passive = false, capture = false } = options
  let listening = false
  let cleaned = false

  const add = (target?: UseEventListenerTarget | null) => {
    if (listening || cleaned) {
      return
    }

    const element = unref(target)

    if (element) {
      element.addEventListener(type, listener, {
        passive,
        capture,
      })

      listening = true
    }
  }

  const remove = (target?: UseEventListenerTarget | null) => {
    if (!listening || cleaned) {
      return
    }

    const element = unref(target)

    if (element) {
      element.removeEventListener(type, listener, {
        capture,
      })

      listening = false
    }
  }

  let watchStopHandle: WatchStopHandle

  if (isRef(target)) {
    watchStopHandle = watch(
      () => target.value,
      (newValue, oldValue) => {
        remove(oldValue)
        add(newValue)
      }
    )
  }

  const cleanup = () => {
    watchStopHandle?.()
    remove(target)
    cleaned = true
  }

  onMounted(() => {
    add(target)
  })
  onActivated(() => {
    add(target)
  })
  onUnmounted(() => {
    remove(target)
  })
  onDeactivated(() => {
    remove(target)
  })

  return cleanup
}
