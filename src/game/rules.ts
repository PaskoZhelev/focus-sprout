import { CROPS, MAX_YIELD_LEVEL, YIELD_LEVELS, getCrop, type CropDefinition, type CropId } from './catalog'
import type { Countdown, GameState, GardenState, Settings } from './types'

export const MINUTE_MS = 60_000

export const SETTINGS_LIMITS = {
  focusMinutes: { min: 10, max: 90 },
  shortBreakMinutes: { min: 1, max: 30 },
  longBreakMinutes: { min: 5, max: 60 },
  longBreakEvery: { min: 2, max: 8 },
} as const satisfies Record<keyof Settings, { min: number; max: number }>

export function yieldPerSession(garden: GardenState): number {
  return YIELD_LEVELS[garden.yieldLevel]?.yield ?? 1
}

export function nextYieldLevel(garden: GardenState) {
  return garden.yieldLevel < MAX_YIELD_LEVEL ? YIELD_LEVELS[garden.yieldLevel + 1] : undefined
}

export function nextLockedCrop(garden: GardenState): CropDefinition | undefined {
  return CROPS[garden.unlockedCount]
}

export function isUnlocked(garden: GardenState, cropId: CropId): boolean {
  return CROPS.findIndex((crop) => crop.id === cropId) < garden.unlockedCount
}

export function harvestValue(garden: GardenState, cropId: CropId): number {
  return getCrop(cropId).value * yieldPerSession(garden)
}

export function isFocusing(state: GameState): boolean {
  return state.timer.phase === 'focus'
}

export function remainingMs(countdown: Countdown, now: number): number {
  return countdown.kind === 'running' ? Math.max(0, countdown.endsAt - now) : countdown.remainingMs
}

export function clampSetting(key: keyof Settings, value: number): number {
  const { min, max } = SETTINGS_LIMITS[key]
  if (!Number.isFinite(value)) return min
  return Math.min(max, Math.max(min, Math.round(value)))
}
