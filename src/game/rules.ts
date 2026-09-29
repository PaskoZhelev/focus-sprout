import {
  CROPS_PER_SEASON,
  MAX_YIELD_LEVEL,
  SEASONS,
  YIELD_LEVELS,
  getCrop,
  getSeason,
  type CropDefinition,
  type CropId,
  type Season,
} from './catalog'
import type { Countdown, GameState, GardenState } from './types'

export const MINUTE_MS = 60_000


export function yieldPerSession(garden: GardenState): number {
  return YIELD_LEVELS[garden.yieldLevel]?.yield ?? 1
}

export function nextYieldLevel(garden: GardenState) {
  return garden.yieldLevel < MAX_YIELD_LEVEL ? YIELD_LEVELS[garden.yieldLevel + 1] : undefined
}

export function currentSeason(garden: GardenState): Season {
  return getSeason(garden.seasonsPassed)
}

export function upcomingSeason(garden: GardenState): Season {
  return getSeason(garden.seasonsPassed + 1)
}

export function currentYear(garden: GardenState): number {
  return Math.floor(garden.seasonsPassed / SEASONS.length) + 1
}

export function nextLockedCrop(garden: GardenState): CropDefinition | undefined {
  return currentSeason(garden).crops[garden.unlockedCount]
}

/** Only crops of the current season can be unlocked or planted. */
export function isUnlocked(garden: GardenState, cropId: CropId): boolean {
  const index = currentSeason(garden).crops.findIndex((crop) => crop.id === cropId)
  return index !== -1 && index < garden.unlockedCount
}

export function isFinalCrop(garden: GardenState, cropId: CropId): boolean {
  return currentSeason(garden).crops[CROPS_PER_SEASON - 1]?.id === cropId
}

/** A season can be closed once its last crop has been harvested at least once. Tools don't matter. */
export function canStartNewSeason(garden: GardenState): boolean {
  return garden.finalCropHarvested
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

/** Timer settings are whole numbers above zero. Returns null for anything else. */
export function toSettingValue(value: unknown): number | null {
  if (typeof value !== 'number') return null
  const rounded = Math.round(value)
  return Number.isSafeInteger(rounded) && rounded > 0 ? rounded : null
}
