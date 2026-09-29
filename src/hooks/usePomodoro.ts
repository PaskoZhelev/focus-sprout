import { useCallback, useEffect } from 'react'
import { MINUTE_MS, remainingMs } from '../game/rules'
import { primeAudio } from '../lib/chime'
import { useGameDispatch, useGameState } from '../state/gameContext'
import { useNow } from './useNow'

export function usePomodoro() {
  const { timer, settings } = useGameState()
  const dispatch = useGameDispatch()

  const running = timer.phase !== 'idle' && timer.countdown.kind === 'running'
  const now = useNow(running ? 250 : null)

  const totalMs = timer.phase === 'idle' ? settings.focusMinutes * MINUTE_MS : timer.durationMs
  const leftMs = timer.phase === 'idle' ? totalMs : remainingMs(timer.countdown, now)

  useEffect(() => {
    if (running && leftMs <= 0) dispatch({ type: 'tick', now })
  }, [running, leftMs, now, dispatch])

  return {
    phase: timer.phase,
    isLongBreak: timer.phase === 'break' && timer.long,
    running,
    paused: timer.phase !== 'idle' && timer.countdown.kind === 'paused',
    remainingMs: leftMs,
    totalMs,
    // Start and resume are user gestures: use them to unlock audio for the chime at the end.
    start: useCallback(() => {
      primeAudio()
      dispatch({ type: 'startFocus', now: Date.now() })
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
