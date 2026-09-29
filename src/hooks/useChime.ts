import { useEffect, useRef } from 'react'
import type { TimerEvent } from '../game/types'
import { playChime } from '../lib/chime'

/** Chimes whenever the timer produces a new event, but not for the one already present on load. */
export function useChime(event: TimerEvent | null): void {
  const lastHeard = useRef(event?.at)

  useEffect(() => {
    if (!event || event.at === lastHeard.current) return
    lastHeard.current = event.at
    playChime()
  }, [event])
}
