import { describe, expect, it } from 'vitest'
import { SEASONS, YIELD_LEVELS } from './catalog'
import { createInitialState, gameReducer } from './reducer'
import type { GameState } from './types'

const MIN = 60_000
const CROPS = SEASONS[0]!.crops

function withCoins(coins: number, state = createInitialState()): GameState {
  return { ...state, garden: { ...state.garden, coins } }
}

function runSession(state: GameState, start = 0): GameState {
  const started = gameReducer(state, { type: 'startFocus', now: start })
  return gameReducer(started, { type: 'tick', now: start + state.settings.focusMinutes * MIN })
}

describe('focus sessions', () => {
  it('harvests the planted crop once the focus countdown ends', () => {
    const state = runSession(createInitialState())

    expect(state.garden.coins).toBe(CROPS[0]!.value)
    expect(state.garden.harvested.radish).toBe(1)
    expect(state.stats.total.sessions).toBe(1)
    expect(state.timer).toEqual({ phase: 'breakReady', long: false })
    expect(state.lastEvent).toMatchObject({ kind: 'harvest', cropId: 'radish', amount: 1 })
  })

  it('waits for the user to start the break, timing it from then', () => {
    const done = runSession(createInitialState())
    expect(gameReducer(done, { type: 'tick', now: 90 * MIN })).toBe(done)

    const state = gameReducer(done, { type: 'startBreak', now: 90 * MIN })
    expect(state.timer).toMatchObject({ phase: 'break', long: false, countdown: { kind: 'running', endsAt: 95 * MIN } })
  })

  it('only starts a break after a finished session', () => {
    const idle = createInitialState()
    expect(gameReducer(idle, { type: 'startBreak', now: 0 })).toBe(idle)
  })

  it('can skip the break before it starts, or go straight into the next session', () => {
    const done = runSession(createInitialState())

    expect(gameReducer(done, { type: 'stop', now: 26 * MIN }).timer.phase).toBe('idle')
    expect(gameReducer(done, { type: 'startFocus', now: 26 * MIN }).timer).toMatchObject({ phase: 'focus' })
  })

  it('does not pay out twice for the same session', () => {
    const done = runSession(createInitialState())
    const again = gameReducer(done, { type: 'tick', now: 25 * MIN })

    expect(again).toBe(done)
  })

  it('pays nothing for an early tick or an abandoned session', () => {
    const started = gameReducer(createInitialState(), { type: 'startFocus', now: 0 })
    const early = gameReducer(started, { type: 'tick', now: 10 * MIN })
    expect(early).toBe(started)

    const stopped = gameReducer(early, { type: 'stop', now: 10 * MIN })
    expect(stopped.timer.phase).toBe('idle')
    expect(stopped.garden.coins).toBe(0)
  })

  it('still pays out a session that ended before a late stop arrived', () => {
    // e.g. the "Give up?" dialog blocked the tick until after the countdown ended.
    const started = gameReducer(createInitialState(), { type: 'startFocus', now: 0 })
    const state = gameReducer(started, { type: 'stop', now: 25 * MIN + 3000 })

    expect(state.garden.coins).toBe(CROPS[0]!.value)
    expect(state.stats.total.sessions).toBe(1)
    // The break offer isn't dismissed by a click meant for the focus session.
    expect(state.timer.phase).toBe('breakReady')
  })

  it('skips a running break with stop', () => {
    const onBreak = gameReducer(runSession(createInitialState()), { type: 'startBreak', now: 25 * MIN })
    const state = gameReducer(onBreak, { type: 'stop', now: 26 * MIN })

    expect(state.timer.phase).toBe('idle')
    expect(state.garden.coins).toBe(onBreak.garden.coins)
  })

  it('keeps the crop planted after the session and break are over', () => {
    const onBreak = gameReducer(runSession(createInitialState()), { type: 'startBreak', now: 25 * MIN })
    const state = gameReducer(onBreak, { type: 'tick', now: 60 * MIN })

    expect(state.timer.phase).toBe('idle')
    expect(state.garden.planted).toBe('radish')
  })

  it('pays out a session that ended while the tab was closed, and offers the break', () => {
    const started = gameReducer(createInitialState(), { type: 'startFocus', now: 0 })
    const state = gameReducer(started, { type: 'tick', now: 24 * 60 * MIN })

    expect(state.garden.coins).toBe(CROPS[0]!.value)
    expect(state.timer.phase).toBe('breakReady')
    expect(state.lastEvent?.kind).toBe('harvest')
  })

  it('ends a break that ran out while the tab was closed', () => {
    const onBreak = gameReducer(runSession(createInitialState()), { type: 'startBreak', now: 25 * MIN })
    const state = gameReducer(onBreak, { type: 'tick', now: 24 * 60 * MIN })

    expect(state.timer.phase).toBe('idle')
    expect(state.lastEvent?.kind).toBe('break-over')
  })

  it('preserves remaining time across pause and resume', () => {
    let state = gameReducer(createInitialState(), { type: 'startFocus', now: 0 })
    state = gameReducer(state, { type: 'pause', now: 10 * MIN })
    state = gameReducer(state, { type: 'resume', now: 100 * MIN })

    expect(gameReducer(state, { type: 'tick', now: 114 * MIN }).stats.total.sessions).toBe(0)
    expect(gameReducer(state, { type: 'tick', now: 115 * MIN }).stats.total.sessions).toBe(1)
  })

  it('gives a long break after every n-th session', () => {
    let state = createInitialState()
    for (let i = 0; i < 3; i++) {
      state = runSession(state, i * 100 * MIN)
      expect(state.timer).toMatchObject({ phase: 'breakReady', long: false })
      state = gameReducer(state, { type: 'stop', now: i * 100 * MIN + 25 * MIN })
    }

    expect(runSession(state, 1000 * MIN).timer).toMatchObject({ phase: 'breakReady', long: true })
  })
})

describe('crops', () => {
  it('unlocks only the next crop, charges for it and plants it', () => {
    const rich = withCoins(1000)

    expect(gameReducer(rich, { type: 'unlock', cropId: 'springOnion' })).toBe(rich)

    const state = gameReducer(rich, { type: 'unlock', cropId: 'lettuce' })
    expect(state.garden.coins).toBe(1000 - CROPS[1]!.price)
    expect(state.garden.unlockedCount).toBe(2)
    expect(state.garden.planted).toBe('lettuce')
  })

  it('refuses to unlock without enough coins', () => {
    const poor = withCoins(CROPS[1]!.price - 1)
    expect(gameReducer(poor, { type: 'unlock', cropId: 'lettuce' })).toBe(poor)
  })

  it('lets you replant an unlocked crop, but not a locked one', () => {
    const state = gameReducer(withCoins(100), { type: 'unlock', cropId: 'lettuce' })

    expect(gameReducer(state, { type: 'plant', cropId: 'radish' }).garden.planted).toBe('radish')
    expect(gameReducer(state, { type: 'plant', cropId: 'springOnion' })).toBe(state)
  })

  it('locks the bed while a focus session is running', () => {
    const state = gameReducer(withCoins(100), { type: 'startFocus', now: 0 })

    expect(gameReducer(state, { type: 'unlock', cropId: 'lettuce' })).toBe(state)
  })
})

describe('yield upgrades', () => {
  it('increases crops per session', () => {
    const upgraded = gameReducer(withCoins(YIELD_LEVELS[1].cost), { type: 'upgradeYield' })
    expect(upgraded.garden.coins).toBe(0)

    const state = runSession(upgraded)
    expect(state.garden.harvested.radish).toBe(2)
    expect(state.garden.coins).toBe(2 * CROPS[0]!.value)
  })

  it('stops at the last level', () => {
    const maxed = withCoins(1e9)
    const top = { ...maxed, garden: { ...maxed.garden, yieldLevel: YIELD_LEVELS.length - 1 } }
    expect(gameReducer(top, { type: 'upgradeYield' })).toBe(top)
  })

  it('cannot be bought during focus, so a harvest matches the setup at start', () => {
    const focusing = gameReducer(withCoins(YIELD_LEVELS[1].cost), { type: 'startFocus', now: 0 })
    expect(gameReducer(focusing, { type: 'upgradeYield' })).toBe(focusing)
  })

  it('can be bought during a break', () => {
    const onBreak = runSession(withCoins(YIELD_LEVELS[1].cost))
    expect(gameReducer(onBreak, { type: 'upgradeYield' }).garden.yieldLevel).toBe(1)
  })
})

describe('seasons', () => {
  const FINAL = CROPS[CROPS.length - 1]!

  /** Unlocks the whole catalogue (tools untouched) and plants the last crop. */
  function unlockAll(state = createInitialState()): GameState {
    const crops = SEASONS[state.garden.seasonsPassed % SEASONS.length]!.crops
    return { ...state, garden: { ...state.garden, unlockedCount: crops.length, planted: crops[crops.length - 1]!.id } }
  }

  function finishSeason(state = createInitialState()): GameState {
    return gameReducer(unlockAll(state), { type: 'debug/harvest', sessions: 1, now: 0 })
  }

  it('starts in spring of year one', () => {
    const { garden } = createInitialState()
    expect(garden.seasonsPassed).toBe(0)
    expect(garden.planted).toBe('radish')
    expect(garden.finalCropHarvested).toBe(false)
  })

  it('opens once the last crop has been harvested, without needing every tool', () => {
    const unlocked = unlockAll(withCoins(1e6))
    expect(gameReducer(unlocked, { type: 'newSeason' })).toBe(unlocked)

    const done = runSession(unlocked)
    expect(done.garden.yieldLevel).toBe(0)
    expect(done.garden.finalCropHarvested).toBe(true)
    expect(gameReducer(done, { type: 'newSeason' }).garden.seasonsPassed).toBe(1)
  })

  it('does not open when every tool is owned but the last crop has not been harvested', () => {
    const owned = gameReducer(withCoins(1e6), { type: 'debug/ownAll' })
    const replanted = runSession(gameReducer(owned, { type: 'plant', cropId: 'radish' }))

    expect(replanted.garden.finalCropHarvested).toBe(false)
    expect(gameReducer(replanted, { type: 'newSeason' })).toBe(replanted)
  })

  it('resets coins, crops, yield and the final harvest, but keeps harvest records and stats', () => {
    const played = finishSeason(runSession(createInitialState()))
    const state = gameReducer(withCoins(777, played), { type: 'newSeason' })

    expect(state.garden).toEqual({
      coins: 0,
      seasonsPassed: 1,
      unlockedCount: 1,
      planted: SEASONS[1]!.crops[0]!.id,
      yieldLevel: 0,
      finalCropHarvested: false,
      harvested: { radish: 1, [FINAL.id]: 1 },
    })
    expect(state.stats.total.sessions).toBe(2)
    expect(state.stats.season).toEqual({ sessions: 0, focusedMs: 0, crops: 0 })
  })

  it('counts sessions, time and crops for the season and in total', () => {
    const MIN_FOCUS = 25 * MIN
    const spring = finishSeason(runSession(createInitialState()))
    expect(spring.stats.season).toEqual(spring.stats.total)

    const summer = runSession(gameReducer(spring, { type: 'newSeason' }))
    expect(summer.stats.season).toEqual({ sessions: 1, focusedMs: MIN_FOCUS, crops: 1 })
    expect(summer.stats.total.sessions).toBe(spring.stats.total.sessions + 1)
    expect(summer.stats.total.focusedMs).toBe(spring.stats.total.focusedMs + MIN_FOCUS)
    expect(summer.stats.total.crops).toBe(spring.stats.total.crops + 1)
  })

  it('unlocks the new season at the same prices', () => {
    const summer = gameReducer(finishSeason(), { type: 'newSeason' })
    const next = SEASONS[1]!.crops[1]!

    expect(next.price).toBe(CROPS[1]!.price)
    expect(gameReducer(summer, { type: 'plant', cropId: 'radish' })).toBe(summer)
    expect(gameReducer(withCoins(next.price, summer), { type: 'unlock', cropId: next.id }).garden.planted).toBe(next.id)
  })

  it('wraps round to spring after winter, and needs a fresh final harvest in the new year', () => {
    let state = createInitialState()
    for (let i = 0; i < SEASONS.length; i++) state = gameReducer(finishSeason(state), { type: 'newSeason' })

    expect(state.garden.seasonsPassed).toBe(4)
    expect(state.garden.planted).toBe('radish')
    expect(state.garden.harvested[FINAL.id]).toBe(1)

    const unlocked = unlockAll(state)
    expect(gameReducer(unlocked, { type: 'newSeason' })).toBe(unlocked)
  })

  it('cannot start during focus', () => {
    const focusing = gameReducer(finishSeason(), { type: 'startFocus', now: 0 })
    expect(gameReducer(focusing, { type: 'newSeason' })).toBe(focusing)
  })

  it('can start during a break', () => {
    const onBreak = runSession(unlockAll())
    expect(gameReducer(onBreak, { type: 'newSeason' }).garden.seasonsPassed).toBe(1)
  })
})

describe('settings', () => {
  it('accepts any whole number above zero, however large', () => {
    const state = gameReducer(createInitialState(), {
      type: 'updateSettings',
      settings: { focusMinutes: 1, shortBreakMinutes: 240, longBreakEvery: 1 },
    })
    expect(state.settings).toEqual({ focusMinutes: 1, shortBreakMinutes: 240, longBreakMinutes: 15, longBreakEvery: 1 })
  })

  it('rounds fractions and ignores zero, negative and non-finite values', () => {
    const start = createInitialState()
    const rounded = gameReducer(start, { type: 'updateSettings', settings: { focusMinutes: 7.6 } })
    expect(rounded.settings.focusMinutes).toBe(8)

    for (const bad of [0, -5, 0.4, Number.NaN, Number.POSITIVE_INFINITY]) {
      const state = gameReducer(start, { type: 'updateSettings', settings: { focusMinutes: bad } })
      expect(state.settings.focusMinutes).toBe(25)
    }
  })
})

describe('debug actions', () => {
  it('finishes a running focus session on demand', () => {
    const started = gameReducer(createInitialState(), { type: 'startFocus', now: 0 })
    const state = gameReducer(started, { type: 'debug/finish', now: MIN })

    expect(state.garden.coins).toBe(CROPS[0]!.value)
    expect(state.timer.phase).toBe('breakReady')
  })

  it('credits several sessions at once with the current yield', () => {
    const upgraded = gameReducer(withCoins(YIELD_LEVELS[1].cost), { type: 'upgradeYield' })
    const state = gameReducer(upgraded, { type: 'debug/harvest', sessions: 10, now: 0 })

    expect(state.stats.total.sessions).toBe(10)
    expect(state.stats.season.crops).toBe(20)
    expect(state.garden.harvested.radish).toBe(20)
    expect(state.garden.coins).toBe(20 * CROPS[0]!.value)
    expect(state.timer.phase).toBe('idle')
  })

  it('resets progress but keeps timer settings', () => {
    const custom = gameReducer(withCoins(500), { type: 'updateSettings', settings: { focusMinutes: 50 } })
    const state = gameReducer(custom, { type: 'debug/reset' })

    expect(state.garden.coins).toBe(0)
    expect(state.settings.focusMinutes).toBe(50)
  })
})
