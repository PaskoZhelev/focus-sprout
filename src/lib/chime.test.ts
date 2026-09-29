import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

/** Minimal stand-in for AudioContext that records how many notes were scheduled. */
class FakeAudioContext {
  static instances: FakeAudioContext[] = []
  static startState: AudioContextState = 'running'
  static resumeDelayMs = 0

  state: AudioContextState = FakeAudioContext.startState
  currentTime = 0
  destination = {}
  notes = 0
  resumeCalls = 0

  constructor() {
    FakeAudioContext.instances.push(this)
  }

  resume(): Promise<void> {
    this.resumeCalls++
    return new Promise((resolve) =>
      setTimeout(() => {
        this.state = 'running'
        resolve()
      }, FakeAudioContext.resumeDelayMs),
    )
  }

  createOscillator() {
    const param = { value: 0 }
    return {
      type: 'sine',
      frequency: param,
      connect: (node: unknown) => node,
      start: () => void this.notes++,
      stop: () => {},
    }
  }

  createGain() {
    const node = {
      gain: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} },
      connect: (target: unknown) => target,
    }
    return node
  }
}

async function loadChime() {
  vi.resetModules() // Fresh module-level AudioContext for every test.
  return import('./chime')
}

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'Date', 'performance'] })
  FakeAudioContext.instances = []
  FakeAudioContext.startState = 'running'
  FakeAudioContext.resumeDelayMs = 0
  vi.stubGlobal('AudioContext', FakeAudioContext)
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe('playChime', () => {
  it('plays straight away when the context is running', async () => {
    const { playChime } = await loadChime()
    playChime()

    expect(FakeAudioContext.instances[0]?.notes).toBe(2)
  })

  it('resumes a suspended context and then plays', async () => {
    FakeAudioContext.startState = 'suspended'
    const { playChime } = await loadChime()
    playChime()

    const ctx = FakeAudioContext.instances[0]!
    expect(ctx.notes).toBe(0)
    await vi.advanceTimersByTimeAsync(10)
    expect(ctx.notes).toBe(2)
  })

  it('drops the chime if the resume only succeeds much later', async () => {
    FakeAudioContext.startState = 'suspended'
    FakeAudioContext.resumeDelayMs = 60_000 // e.g. waits for the user's next click
    const { playChime } = await loadChime()
    playChime()

    await vi.advanceTimersByTimeAsync(60_000)
    expect(FakeAudioContext.instances[0]?.notes).toBe(0)
  })
})

describe('primeAudio', () => {
  it('creates and resumes the context during a gesture so a later chime can play', async () => {
    FakeAudioContext.startState = 'suspended'
    const { primeAudio, playChime } = await loadChime()
    primeAudio()

    const ctx = FakeAudioContext.instances[0]!
    expect(ctx.resumeCalls).toBe(1)
    await vi.advanceTimersByTimeAsync(10)

    playChime()
    expect(FakeAudioContext.instances).toHaveLength(1)
    expect(ctx.notes).toBe(2)
  })
})
