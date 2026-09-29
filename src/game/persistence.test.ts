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

  it('rejects a planted crop from another season', () => {
    const base = createInitialState()
    const summer = { ...base.garden, seasonsPassed: 1 }
    expect(reviveState({ ...base, garden: { ...summer, planted: 'radish' } })).toBeNull()
    expect(reviveState({ ...base, garden: { ...summer, planted: 'courgette' } })?.garden.seasonsPassed).toBe(1)
    expect(reviveState({ ...base, garden: { ...base.garden, seasonsPassed: -1 } })).toBeNull()
  })

  it('only trusts the final harvest flag once the last crop is unlocked', () => {
    const base = createInitialState()
    const flagged = { ...base.garden, finalCropHarvested: true }
    expect(reviveState({ ...base, garden: flagged })?.garden.finalCropHarvested).toBe(false)
    expect(reviveState({ ...base, garden: { ...flagged, unlockedCount: 8 } })?.garden.finalCropHarvested).toBe(true)
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

  it('keeps valid settings and restores defaults for invalid ones', () => {
    const base = createInitialState()
    const revived = reviveState({
      ...base,
      settings: { focusMinutes: 120, shortBreakMinutes: 0, longBreakMinutes: 'long', longBreakEvery: 1 },
    })
    expect(revived?.settings).toEqual({ focusMinutes: 120, shortBreakMinutes: 5, longBreakMinutes: 15, longBreakEvery: 1 })
  })

  it('keeps season and total stats, zeroing anything malformed', () => {
    const base = createInitialState()
    const total = { sessions: 12, focusedMs: 300 * 60_000, crops: 40 }
    const revived = reviveState({ ...base, stats: { season: { sessions: -1, focusedMs: 'x', crops: 3 }, total } })

    expect(revived?.stats).toEqual({ season: { sessions: 0, focusedMs: 0, crops: 3 }, total })
  })
})
