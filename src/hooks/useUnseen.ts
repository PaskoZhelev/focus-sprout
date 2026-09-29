import { useEffect, useState, useSyncExternalStore } from 'react'
import type { TimerEvent } from '../game/types'

const PAGE_EVENTS = ['focus', 'blur', 'visibilitychange'] as const

function isLooking(): boolean {
  return document.visibilityState === 'visible' && document.hasFocus()
}

function subscribe(listener: () => void): () => void {
  for (const name of PAGE_EVENTS) window.addEventListener(name, listener)
  return () => {
    for (const name of PAGE_EVENTS) window.removeEventListener(name, listener)
  }
}

/**
 * True while the latest timer event happened after the user last looked at the
 * page (visible and focused). Clears as soon as they come back.
 */
export function useUnseen(event: TimerEvent | null): boolean {
  const looking = useSyncExternalStore(subscribe, isLooking)
  // Last moment the user is known to have been looking at the page.
  const [seenAt, setSeenAt] = useState(() => Date.now())

  useEffect(() => {
    const update = () => setSeenAt(Date.now())
    // On blur, the user was looking right up until now. On focus, they are looking again.
    for (const name of PAGE_EVENTS) window.addEventListener(name, update)
    return () => {
      for (const name of PAGE_EVENTS) window.removeEventListener(name, update)
    }
  }, [])

  return !looking && event !== null && event.at > seenAt
}
