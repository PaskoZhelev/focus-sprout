import { CROPS_PER_SEASON, MAX_YIELD_LEVEL, getCrop, getSeason, type CropId } from './catalog'
import {
  MINUTE_MS,
  canStartNewSeason,
  isFinalCrop,
  isUnlocked,
  nextLockedCrop,
  nextYieldLevel,
  toSettingValue,
  yieldPerSession,
} from './rules'
import type { GameAction, GameState, GardenState, Settings, Tally } from './types'

export const DEFAULT_SETTINGS: Settings = {
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  longBreakEvery: 4,
}

/** Keeps each valid value from `input`, falling back to `fallback` for the rest. */
export function sanitizeSettings(input: Partial<Record<keyof Settings, unknown>>, fallback: Settings): Settings {
  const pick = (key: keyof Settings) => toSettingValue(input[key]) ?? fallback[key]
  return {
    focusMinutes: pick('focusMinutes'),
    shortBreakMinutes: pick('shortBreakMinutes'),
    longBreakMinutes: pick('longBreakMinutes'),
    longBreakEvery: pick('longBreakEvery'),
  }
}

/** A bare plot at the start of the given season: no coins, first crop only, bare soil. */
export function freshGarden(seasonsPassed: number, harvested: GardenState['harvested'] = {}): GardenState {
  return {
    coins: 0,
    seasonsPassed,
    unlockedCount: 1,
    // Safe: every season has CROPS_PER_SEASON crops.
    planted: getSeason(seasonsPassed).crops[0]!.id,
    yieldLevel: 0,
    finalCropHarvested: false,
    harvested,
  }
}

export const EMPTY_TALLY: Tally = { sessions: 0, focusedMs: 0, crops: 0 }

function addToTally(tally: Tally, focusedMs: number, crops: number): Tally {
  return { sessions: tally.sessions + 1, focusedMs: tally.focusedMs + focusedMs, crops: tally.crops + crops }
}

export function createInitialState(): GameState {
  return {
    garden: freshGarden(0),
    timer: { phase: 'idle' },
    settings: DEFAULT_SETTINGS,
    stats: { season: EMPTY_TALLY, total: EMPTY_TALLY },
    lastEvent: null,
  }
}

/**
 * Completes the countdown if it has run out by `now`. A finished focus session
 * stops at breakReady, so at most one countdown is ever settled.
 */
export function settle(state: GameState, now: number): GameState {
  const { timer } = state
  if (timer.phase === 'idle' || timer.phase === 'breakReady' || timer.countdown.kind !== 'running') return state
  if (now < timer.countdown.endsAt) return state

  const finishedAt = timer.countdown.endsAt
  return timer.phase === 'focus' ? completeFocus(state, finishedAt) : completeBreak(state, finishedAt)
}

function breakMs(settings: Settings, long: boolean): number {
  return (long ? settings.longBreakMinutes : settings.shortBreakMinutes) * MINUTE_MS
}

function applyHarvest(state: GameState, cropId: CropId, durationMs: number, at: number): GameState {
  const { garden, stats } = state
  const amount = yieldPerSession(garden)
  const coins = amount * getCrop(cropId).value

  return {
    ...state,
    garden: {
      ...garden,
      coins: garden.coins + coins,
      harvested: { ...garden.harvested, [cropId]: (garden.harvested[cropId] ?? 0) + amount },
      finalCropHarvested: garden.finalCropHarvested || isFinalCrop(garden, cropId),
    },
    stats: { season: addToTally(stats.season, durationMs, amount), total: addToTally(stats.total, durationMs, amount) },
    lastEvent: { kind: 'harvest', at, cropId, amount, coins },
  }
}

function completeFocus(state: GameState, finishedAt: number): GameState {
  const { timer } = state
  if (timer.phase !== 'focus') return state

  const harvested = applyHarvest(state, timer.cropId, timer.durationMs, finishedAt)
  const { settings, stats } = harvested
  const long = stats.total.sessions % settings.longBreakEvery === 0

  return { ...harvested, timer: { phase: 'breakReady', long } }
}

function completeBreak(state: GameState, finishedAt: number): GameState {
  return { ...state, timer: { phase: 'idle' }, lastEvent: { kind: 'break-over', at: finishedAt } }
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'tick':
      return settle(state, action.now)

    case 'startFocus': {
      if (state.timer.phase !== 'idle' && state.timer.phase !== 'breakReady') return state
      const durationMs = state.settings.focusMinutes * MINUTE_MS
      return {
        ...state,
        timer: {
          phase: 'focus',
          cropId: state.garden.planted,
          durationMs,
          countdown: { kind: 'running', endsAt: action.now + durationMs },
        },
      }
    }

    case 'startBreak': {
      const { timer } = state
      if (timer.phase !== 'breakReady') return state
      const durationMs = breakMs(state.settings, timer.long)
      return {
        ...state,
        timer: {
          phase: 'break',
          long: timer.long,
          durationMs,
          countdown: { kind: 'running', endsAt: action.now + durationMs },
        },
      }
    }

    case 'pause': {
      const settled = settle(state, action.now)
      const { timer } = settled
      if (timer.phase === 'idle' || timer.phase === 'breakReady' || timer.countdown.kind !== 'running') {
        return settled
      }
      return {
        ...settled,
        timer: { ...timer, countdown: { kind: 'paused', remainingMs: timer.countdown.endsAt - action.now } },
      }
    }

    case 'resume': {
      const { timer } = state
      if (timer.phase === 'idle' || timer.phase === 'breakReady' || timer.countdown.kind !== 'paused') return state
      return {
        ...state,
        timer: { ...timer, countdown: { kind: 'running', endsAt: action.now + timer.countdown.remainingMs } },
      }
    }

    case 'stop': {
      // The countdown may have ended without a tick (e.g. while a confirm dialog
      // blocked the page). Pay that out and leave the next phase alone: the user
      // meant to stop the phase they were looking at, and it's already over.
      // From breakReady, stop skips the break that hasn't started.
      const settled = settle(state, action.now)
      if (settled.timer.phase !== state.timer.phase) return settled
      return settled.timer.phase === 'idle' ? settled : { ...settled, timer: { phase: 'idle' } }
    }

    case 'plant': {
      const { garden } = state
      if (state.timer.phase === 'focus' || !isUnlocked(garden, action.cropId)) return state
      return { ...state, garden: { ...garden, planted: action.cropId } }
    }

    case 'unlock': {
      const { garden } = state
      const next = nextLockedCrop(garden)
      if (state.timer.phase === 'focus' || next?.id !== action.cropId || garden.coins < next.price) {
        return state
      }
      return {
        ...state,
        garden: {
          ...garden,
          coins: garden.coins - next.price,
          unlockedCount: garden.unlockedCount + 1,
          planted: action.cropId,
        },
      }
    }

    case 'upgradeYield': {
      const { garden } = state
      const next = nextYieldLevel(garden)
      // Locked during focus, like the bed: the harvest must match the setup at start.
      if (state.timer.phase === 'focus' || !next || garden.coins < next.cost) return state
      return {
        ...state,
        garden: { ...garden, coins: garden.coins - next.cost, yieldLevel: garden.yieldLevel + 1 },
      }
    }

    case 'newSeason': {
      const { garden } = state
      if (state.timer.phase === 'focus' || !canStartNewSeason(garden)) return state
      return {
        ...state,
        garden: freshGarden(garden.seasonsPassed + 1, garden.harvested),
        stats: { ...state.stats, season: EMPTY_TALLY },
      }
    }

    case 'updateSettings':
      return { ...state, settings: sanitizeSettings(action.settings, state.settings) }

    case 'debug/finish': {
      const { timer } = state
      if (timer.phase === 'idle' || timer.phase === 'breakReady') return state
      return settle({ ...state, timer: { ...timer, countdown: { kind: 'running', endsAt: action.now } } }, action.now)
    }

    case 'debug/harvest': {
      if (state.timer.phase === 'focus') return state
      let next = state
      for (let i = 0; i < action.sessions; i++) {
        next = applyHarvest(next, next.garden.planted, next.settings.focusMinutes * MINUTE_MS, action.now)
      }
      return next
    }

    case 'debug/ownAll': {
      if (state.timer.phase === 'focus') return state
      return {
        ...state,
        garden: { ...state.garden, unlockedCount: CROPS_PER_SEASON, yieldLevel: MAX_YIELD_LEVEL },
      }
    }

    case 'debug/reset':
      return { ...createInitialState(), settings: state.settings }
  }
}
