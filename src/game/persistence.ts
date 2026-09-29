import { CROPS, MAX_YIELD_LEVEL, isCropId, type CropId } from './catalog'
import { DEFAULT_SETTINGS, createInitialState, sanitizeSettings } from './reducer'
import type { Countdown, GameState, GardenState, Stats, TimerEvent, TimerState } from './types'

const STORAGE_KEY = 'focus-sprout'
const SAVE_VERSION = 1

interface SaveFile {
  version: typeof SAVE_VERSION
  state: GameState
}

// `window.localStorage` itself throws a SecurityError when storage is blocked,
// so it is only read inside the try blocks below, never as a default parameter.

export function loadState(storage?: Storage): GameState {
  try {
    const raw = (storage ?? window.localStorage).getItem(STORAGE_KEY)
    if (raw === null) return createInitialState()
    const parsed: unknown = JSON.parse(raw)
    if (!isRecord(parsed) || parsed.version !== SAVE_VERSION) return createInitialState()
    return reviveState(parsed.state) ?? createInitialState()
  } catch {
    return createInitialState()
  }
}

export function saveState(state: GameState, storage?: Storage): void {
  const file: SaveFile = { version: SAVE_VERSION, state }
  try {
    const target = storage ?? window.localStorage
    target.setItem(STORAGE_KEY, JSON.stringify(file))
  } catch {
    // Storage full or blocked (private mode). Progress lives on in memory.
  }
}

/** Rebuilds state from untrusted JSON, rejecting anything that doesn't fit the schema. */
export function reviveState(data: unknown): GameState | null {
  if (!isRecord(data)) return null
  const garden = reviveGarden(data.garden)
  if (!garden) return null

  const settings = isRecord(data.settings)
    ? sanitizeSettings({
        focusMinutes: numberOr(data.settings.focusMinutes, DEFAULT_SETTINGS.focusMinutes),
        shortBreakMinutes: numberOr(data.settings.shortBreakMinutes, DEFAULT_SETTINGS.shortBreakMinutes),
        longBreakMinutes: numberOr(data.settings.longBreakMinutes, DEFAULT_SETTINGS.longBreakMinutes),
        longBreakEvery: numberOr(data.settings.longBreakEvery, DEFAULT_SETTINGS.longBreakEvery),
      })
    : DEFAULT_SETTINGS

  return {
    garden,
    settings,
    timer: reviveTimer(data.timer, garden) ?? { phase: 'idle' },
    stats: reviveStats(data.stats),
    lastEvent: reviveEvent(data.lastEvent),
  }
}

function reviveGarden(data: unknown): GardenState | null {
  if (!isRecord(data)) return null
  const { coins, unlockedCount, planted, yieldLevel, harvested } = data
  if (!isNonNegative(coins)) return null
  if (!isIntInRange(unlockedCount, 1, CROPS.length)) return null
  if (!isIntInRange(yieldLevel, 0, MAX_YIELD_LEVEL)) return null
  if (!isCropId(planted) || CROPS.findIndex((crop) => crop.id === planted) >= unlockedCount) return null

  const harvestedCounts: Partial<Record<CropId, number>> = {}
  if (isRecord(harvested)) {
    for (const [id, count] of Object.entries(harvested)) {
      if (isCropId(id) && isNonNegative(count)) harvestedCounts[id] = count
    }
  }

  return { coins, unlockedCount, planted, yieldLevel, harvested: harvestedCounts }
}

function reviveTimer(data: unknown, garden: GardenState): TimerState | null {
  if (!isRecord(data)) return null
  if (data.phase === 'idle') return { phase: 'idle' }

  const countdown = reviveCountdown(data.countdown)
  if (!countdown || !isNonNegative(data.durationMs)) return null

  if (data.phase === 'focus') {
    const cropId = isCropId(data.cropId) ? data.cropId : garden.planted
    return { phase: 'focus', countdown, durationMs: data.durationMs, cropId }
  }
  if (data.phase === 'break') {
    return { phase: 'break', countdown, durationMs: data.durationMs, long: data.long === true }
  }
  return null
}

function reviveCountdown(data: unknown): Countdown | null {
  if (!isRecord(data)) return null
  if (data.kind === 'running' && isNonNegative(data.endsAt)) return { kind: 'running', endsAt: data.endsAt }
  if (data.kind === 'paused' && isNonNegative(data.remainingMs)) {
    return { kind: 'paused', remainingMs: data.remainingMs }
  }
  return null
}

function reviveStats(data: unknown): Stats {
  if (!isRecord(data)) return { sessions: 0, focusedMs: 0 }
  return {
    sessions: isNonNegative(data.sessions) ? data.sessions : 0,
    focusedMs: isNonNegative(data.focusedMs) ? data.focusedMs : 0,
  }
}

function reviveEvent(data: unknown): TimerEvent | null {
  if (!isRecord(data) || !isNonNegative(data.at)) return null
  if (data.kind === 'break-over') return { kind: 'break-over', at: data.at }
  if (data.kind === 'harvest' && isCropId(data.cropId) && isNonNegative(data.amount) && isNonNegative(data.coins)) {
    return { kind: 'harvest', at: data.at, cropId: data.cropId, amount: data.amount, coins: data.coins }
  }
  return null
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isNonNegative(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
}

function isIntInRange(value: unknown, min: number, max: number): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= min && value <= max
}

function numberOr(value: unknown, fallback: number): number {
  return typeof value === 'number' ? value : fallback
}
