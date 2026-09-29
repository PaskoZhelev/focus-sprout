import { isSoundEnabled } from './sound'

/** A chime that can't start within this window is dropped rather than played late. */
const MAX_DELAY_MS = 1000

let context: AudioContext | null = null

/**
 * Returns the shared AudioContext, asking it to resume if the browser
 * suspended it. Autoplay policies only allow the resume during a user gesture,
 * which is why `primeAudio` is called from click handlers.
 */
function getContext(): AudioContext | null {
  try {
    context ??= new AudioContext()
  } catch {
    return null // Web Audio unavailable.
  }
  if (context.state !== 'running') context.resume().catch(() => {})
  return context
}

/**
 * Call from a user gesture (e.g. the Start button) so the context is already
 * running when the chime fires later without one, e.g. after a reload.
 */
export function primeAudio(): void {
  if (isSoundEnabled()) getContext()
}

/** Two soft notes, synthesised so there is no audio file to ship. */
export function playChime(): void {
  if (!isSoundEnabled()) return
  const ctx = getContext()
  if (!ctx) return

  if (ctx.state === 'running') {
    schedule(ctx)
    return
  }
  // Suspended: play once resume succeeds. Without a gesture the promise may
  // only settle on the user's next click, so skip a chime that would be stale.
  const requestedAt = performance.now()
  ctx.resume().then(
    () => {
      if (performance.now() - requestedAt <= MAX_DELAY_MS) schedule(ctx)
    },
    () => {},
  )
}

function schedule(ctx: AudioContext): void {
  try {
    const start = ctx.currentTime
    for (const [i, frequency] of [659.25, 987.77].entries()) {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const t = start + i * 0.18
      osc.type = 'sine'
      osc.frequency.value = frequency
      gain.gain.setValueAtTime(0.0001, t)
      gain.gain.exponentialRampToValueAtTime(0.25, t + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.9)
      osc.connect(gain).connect(ctx.destination)
      osc.start(t)
      osc.stop(t + 1)
    }
  } catch {
    // Audio graph failed; the chime is a nicety.
  }
}
