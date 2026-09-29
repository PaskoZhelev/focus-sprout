import { useEffect, useRef } from 'react'
import { countCrop, getCrop } from '../game/catalog'
import type { TimerEvent } from '../game/types'
import { playChime } from '../lib/chime'
import { formatNumber } from '../lib/format'
import { notify } from '../lib/notify'

function describe(event: TimerEvent): { title: string; body: string } {
  if (event.kind === 'harvest') {
    const crops = countCrop(getCrop(event.cropId), event.amount)
    return {
      title: 'Session complete',
      body: `Pulled ${crops}, sold for ${formatNumber(event.coins)} coins. Start your break when you're ready.`,
    }
  }
  return { title: "Break's over", body: "Start the next focus session when you're ready." }
}

/**
 * Chimes whenever the timer produces a new event, but not for the one already
 * present on load. Also shows a system notification if the page isn't focused.
 */
export function useTimerAlerts(event: TimerEvent | null): void {
  const lastHeard = useRef(event?.at)

  useEffect(() => {
    if (!event || event.at === lastHeard.current) return
    lastHeard.current = event.at
    playChime()
    if (!document.hasFocus()) {
      const { title, body } = describe(event)
      notify(title, body)
    }
  }, [event])
}
