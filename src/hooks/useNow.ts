import { useEffect, useState } from 'react'

/** Current timestamp, refreshed every `intervalMs`. Pass `null` to stop ticking. */
export function useNow(intervalMs: number | null): number {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (intervalMs === null) return
    const update = () => setNow(Date.now())
    update()
    const id = window.setInterval(update, intervalMs)
    // Background tabs throttle timers; catch up as soon as the tab is visible again.
    document.addEventListener('visibilitychange', update)
    return () => {
      window.clearInterval(id)
      document.removeEventListener('visibilitychange', update)
    }
  }, [intervalMs])

  return now
}
