import { useCallback, useEffect } from 'react'
import { MINUTE_MS, remainingMs } from '../game/rules'
import type { Settings, TimerState } from '../game/types'
import { primeAudio } from '../lib/chime'
import { requestNotificationPermission } from '../lib/notify'
import { useGameDispatch, useGameState } from '../state/gameContext'
import { useNow } from './useNow'

/** setTimeout's largest delay (about 24.8 days). */
const MAX_TIMEOUT_MS = 2 ** 31 - 1

function totalMsFor(timer: TimerState, settings: Settings): number {
  switch (timer.phase) {
    case 'idle':
      return settings.focusMinutes * MINUTE_MS
    case 'breakReady':
      return (timer.long ? settings.longBreakMinutes : settings.shortBreakMinutes) * MINUTE_MS
    default:
      return timer.durationMs
  }
}

export function usePomodoro() {
  const { timer, settings } = useGameState()
  const dispatch = useGameDispatch()

  const countdown = timer.phase === 'focus' || timer.phase === 'break' ? timer.countdown : null
  const running = countdown?.kind === 'running'
  const endsAt = countdown?.kind === 'running' ? countdown.endsAt : null
  const now = useNow(running ? 250 : null)

  const totalMs = totalMsFor(timer, settings)
  const leftMs = countdown ? remainingMs(countdown, now) : totalMs

  useEffect(() => {
    if (running && leftMs <= 0) dispatch({ type: 'tick', now })
  }, [running, leftMs, now, dispatch])

  // Background tabs throttle the ticking interval to as little as once a minute,
  // but a one-off timeout still fires on time, so the end is never announced late.
  useEffect(() => {
    if (endsAt === null) return
    let id: number
    // Longer delays overflow and fire at once, so very long countdowns wait in steps.
    const arm = () => (id = window.setTimeout(fire, Math.min(endsAt - Date.now(), MAX_TIMEOUT_MS)))
    const fire = () => {
      if (endsAt > Date.now()) arm()
      else dispatch({ type: 'tick', now: Date.now() })
    }
    arm()
    return () => window.clearTimeout(id)
  }, [endsAt, dispatch])

  return {
    phase: timer.phase,
    isLongBreak: (timer.phase === 'break' || timer.phase === 'breakReady') && timer.long,
    running,
    paused: countdown?.kind === 'paused',
    remainingMs: leftMs,
    totalMs,
    // Start and resume are user gestures: use them to unlock audio for the chime
    // at the end, and to ask (once) for permission to show notifications.
    start: useCallback(() => {
      primeAudio()
      requestNotificationPermission()
      dispatch({ type: 'startFocus', now: Date.now() })
    }, [dispatch]),
    startBreak: useCallback(() => {
      primeAudio()
      dispatch({ type: 'startBreak', now: Date.now() })
    }, [dispatch]),
    pause: useCallback(() => dispatch({ type: 'pause', now: Date.now() }), [dispatch]),
    resume: useCallback(() => {
      primeAudio()
      dispatch({ type: 'resume', now: Date.now() })
    }, [dispatch]),
    // Read the clock at dispatch time, i.e. after any confirm dialog has closed.
    stop: useCallback(() => dispatch({ type: 'stop', now: Date.now() }), [dispatch]),
  }
}
