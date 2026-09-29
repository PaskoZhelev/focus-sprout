import { afterEach, describe, expect, it, vi } from 'vitest'
import { loadState, reviveState, saveState } from './persistence'
import { createInitialState, gameReducer } from './reducer'

afterEach(() => {
  vi.unstubAllGlobals()
})

/** Mimics browsers where merely reading `window.localStorage` throws (storage blocked). */
function stubBlockedStorage(): void {
  vi.stubGlobal('window', {
    get localStorage(): Storage {
      throw new DOMException('The operation is insecure.', 'SecurityError')
    },
  })
}

function memoryStorage(): Storage {
  const data = new Map<string, string>()
  return {
    get length() {
      return data.size
    },
    clear: () => data.clear(),
    getItem: (key) => data.get(key) ?? null,
    key: (index) => [...data.keys()][index] ?? null,
    removeItem: (key) => void data.delete(key),
    setItem: (key, value) => void data.set(key, value),
  }
}

describe('persistence', () => {
  it('falls back to a new game and keeps running when storage access throws', () => {
    stubBlockedStorage()

    expect(loadState()).toEqual(createInitialState())
    expect(() => saveState(createInitialState())).not.toThrow()
  })

  it('round-trips a saved game', () => {
    const storage = memoryStorage()
    const state = gameReducer(createInitialState(), { type: 'startFocus', now: 1000 })

    saveState(state, storage)
    expect(loadState(storage)).toEqual(state)
  })

  it('starts fresh when the save is missing or corrupt', () => {
    const storage = memoryStorage()
    expect(loadState(storage)).toEqual(createInitialState())

    storage.setItem('focus-sprout', '{not json')
    expect(loadState(storage)).toEqual(createInitialState())
  })

  it('rejects impossible gardens', () => {
    const base = createInitialState()
    expect(reviveState({ ...base, garden: { ...base.garden, coins: -5 } })).toBeNull()
    expect(reviveState({ ...base, garden: { ...base.garden, planted: 'saffron' } })).toBeNull()
    expect(reviveState({ ...base, garden: { ...base.garden, yieldLevel: 99 } })).toBeNull()
  })

  it('drops unknown crops and repairs a malformed timer', () => {
    const base = createInitialState()
    const revived = reviveState({
      ...base,
      garden: { ...base.garden, harvested: { radish: 3, mandrake: 7 } },
      timer: { phase: 'focus', countdown: { kind: 'running' } },
    })

    expect(revived?.garden.harvested).toEqual({ radish: 3 })
    expect(revived?.timer).toEqual({ phase: 'idle' })
  })
})
