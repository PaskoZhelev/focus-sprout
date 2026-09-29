import { CROPS, getCrop, type CropId } from './catalog'
import {
  MINUTE_MS,
  clampSetting,
  isUnlocked,
  nextLockedCrop,
  nextYieldLevel,
  yieldPerSession,
} from './rules'
import type { GameAction, GameState, Settings } from './types'

export const DEFAULT_SETTINGS: Settings = {
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  longBreakEvery: 4,
}

export function sanitizeSettings(settings: Settings): Settings {
  return {
    focusMinutes: clampSetting('focusMinutes', settings.focusMinutes),
    shortBreakMinutes: clampSetting('shortBreakMinutes', settings.shortBreakMinutes),
    longBreakMinutes: clampSetting('longBreakMinutes', settings.longBreakMinutes),
    longBreakEvery: clampSetting('longBreakEvery', settings.longBreakEvery),
  }
}

export function createInitialState(): GameState {
  return {
    garden: {
      coins: 0,
      unlockedCount: 1,
      planted: CROPS[0].id,
      yieldLevel: 0,
      harvested: {},
    },
    timer: { phase: 'idle' },
    settings: DEFAULT_SETTINGS,
    stats: { sessions: 0, focusedMs: 0 },
    lastEvent: null,
  }
}

/**
 * Completes every countdown that has run out by `now`. Loops because a
 * finished focus session rolls straight into a break, which may also be over
 * if the tab was closed for a while.
 */
export function settle(state: GameState, now: number): GameState {
  let current = state
  for (;;) {
    const { timer } = current
    if (timer.phase === 'idle' || timer.countdown.kind !== 'running') return current
    if (now < timer.countdown.endsAt) return current

    const finishedAt = timer.countdown.endsAt
    current = timer.phase === 'focus' ? completeFocus(current, finishedAt) : completeBreak(current, finishedAt)
  }
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
    },
    stats: { sessions: stats.sessions + 1, focusedMs: stats.focusedMs + durationMs },
    lastEvent: { kind: 'harvest', at, cropId, amount, coins },
  }
}

function completeFocus(state: GameState, finishedAt: number): GameState {
  const { timer } = state
  if (timer.phase !== 'focus') return state

  const harvested = applyHarvest(state, timer.cropId, timer.durationMs, finishedAt)
  const { settings, stats } = harvested
  const long = stats.sessions % settings.longBreakEvery === 0
  const breakMs = (long ? settings.longBreakMinutes : settings.shortBreakMinutes) * MINUTE_MS

  return {
    ...harvested,
    timer: {
      phase: 'break',
      long,
      durationMs: breakMs,
      countdown: { kind: 'running', endsAt: finishedAt + breakMs },
    },
  }
}

function completeBreak(state: GameState, finishedAt: number): GameState {
  return { ...state, timer: { phase: 'idle' }, lastEvent: { kind: 'break-over', at: finishedAt } }
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'tick':
      return settle(state, action.now)

    case 'startFocus': {
      if (state.timer.phase !== 'idle') return state
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

    case 'pause': {
      const settled = settle(state, action.now)
      const { timer } = settled
      if (timer.phase === 'idle' || timer.countdown.kind !== 'running') return settled
      return {
        ...settled,
        timer: { ...timer, countdown: { kind: 'paused', remainingMs: timer.countdown.endsAt - action.now } },
      }
    }

    case 'resume': {
      const { timer } = state
      if (timer.phase === 'idle' || timer.countdown.kind !== 'paused') return state
      return {
        ...state,
        timer: { ...timer, countdown: { kind: 'running', endsAt: action.now + timer.countdown.remainingMs } },
      }
    }

    case 'stop': {
      // The countdown may have ended without a tick (e.g. while a confirm dialog
      // blocked the page). Pay that out and leave the next phase alone: the user
      // meant to stop the phase they were looking at, and it's already over.
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

    case 'updateSettings':
      return { ...state, settings: sanitizeSettings({ ...state.settings, ...action.settings }) }

    case 'debug/finish': {
      const { timer } = state
      if (timer.phase === 'idle') return state
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

    case 'debug/reset':
      return { ...createInitialState(), settings: state.settings }
  }
}
