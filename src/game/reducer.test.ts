import { describe, expect, it } from 'vitest'
import { CROPS, YIELD_LEVELS } from './catalog'
import { createInitialState, gameReducer } from './reducer'
import type { GameState } from './types'

const MIN = 60_000

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

    expect(state.garden.coins).toBe(CROPS[0].value)
    expect(state.garden.harvested.radish).toBe(1)
    expect(state.stats.sessions).toBe(1)
    expect(state.timer.phase).toBe('break')
    expect(state.lastEvent).toMatchObject({ kind: 'harvest', cropId: 'radish', amount: 1 })
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

    expect(state.garden.coins).toBe(CROPS[0].value)
    expect(state.stats.sessions).toBe(1)
    // The break the user never saw isn't skipped by a click meant for the focus session.
    expect(state.timer).toMatchObject({ phase: 'break', countdown: { kind: 'running', endsAt: 30 * MIN } })
  })

  it('skips a running break with stop', () => {
    const onBreak = runSession(createInitialState())
    const state = gameReducer(onBreak, { type: 'stop', now: 26 * MIN })

    expect(state.timer.phase).toBe('idle')
    expect(state.garden.coins).toBe(onBreak.garden.coins)
  })

  it('keeps the crop planted after the session and break are over', () => {
    const state = gameReducer(runSession(createInitialState()), { type: 'tick', now: 60 * MIN })

    expect(state.timer.phase).toBe('idle')
    expect(state.garden.planted).toBe('radish')
  })

  it('settles focus and break together when the tab was closed for a long time', () => {
    const started = gameReducer(createInitialState(), { type: 'startFocus', now: 0 })
    const state = gameReducer(started, { type: 'tick', now: 24 * 60 * MIN })

    expect(state.garden.coins).toBe(CROPS[0].value)
    expect(state.timer.phase).toBe('idle')
    expect(state.lastEvent?.kind).toBe('break-over')
  })

  it('preserves remaining time across pause and resume', () => {
    let state = gameReducer(createInitialState(), { type: 'startFocus', now: 0 })
    state = gameReducer(state, { type: 'pause', now: 10 * MIN })
    state = gameReducer(state, { type: 'resume', now: 100 * MIN })

    expect(gameReducer(state, { type: 'tick', now: 114 * MIN }).stats.sessions).toBe(0)
    expect(gameReducer(state, { type: 'tick', now: 115 * MIN }).stats.sessions).toBe(1)
  })

  it('gives a long break after every n-th session', () => {
    let state = createInitialState()
    for (let i = 0; i < 3; i++) {
      state = runSession(state, i * 100 * MIN)
      expect(state.timer).toMatchObject({ phase: 'break', long: false })
      state = gameReducer(state, { type: 'stop', now: i * 100 * MIN + 25 * MIN })
    }

    expect(runSession(state, 1000 * MIN).timer).toMatchObject({ phase: 'break', long: true })
  })
})

describe('crops', () => {
  it('unlocks only the next crop, charges for it and plants it', () => {
    const rich = withCoins(1000)

    expect(gameReducer(rich, { type: 'unlock', cropId: 'potato' })).toBe(rich)

    const state = gameReducer(rich, { type: 'unlock', cropId: 'carrot' })
    expect(state.garden.coins).toBe(1000 - CROPS[1].price)
    expect(state.garden.unlockedCount).toBe(2)
    expect(state.garden.planted).toBe('carrot')
  })

  it('refuses to unlock without enough coins', () => {
    const poor = withCoins(CROPS[1].price - 1)
    expect(gameReducer(poor, { type: 'unlock', cropId: 'carrot' })).toBe(poor)
  })

  it('lets you replant an unlocked crop, but not a locked one', () => {
    const state = gameReducer(withCoins(100), { type: 'unlock', cropId: 'carrot' })

    expect(gameReducer(state, { type: 'plant', cropId: 'radish' }).garden.planted).toBe('radish')
    expect(gameReducer(state, { type: 'plant', cropId: 'potato' })).toBe(state)
  })

  it('locks the bed while a focus session is running', () => {
    const state = gameReducer(withCoins(100), { type: 'startFocus', now: 0 })

    expect(gameReducer(state, { type: 'unlock', cropId: 'carrot' })).toBe(state)
  })
})

describe('yield upgrades', () => {
  it('increases crops per session', () => {
    const upgraded = gameReducer(withCoins(YIELD_LEVELS[1].cost), { type: 'upgradeYield' })
    expect(upgraded.garden.coins).toBe(0)

    const state = runSession(upgraded)
    expect(state.garden.harvested.radish).toBe(2)
    expect(state.garden.coins).toBe(2 * CROPS[0].value)
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

describe('settings', () => {
  it('clamps values into the allowed range', () => {
    const state = gameReducer(createInitialState(), { type: 'updateSettings', settings: { focusMinutes: 1 } })
    expect(state.settings.focusMinutes).toBe(10)
  })
})

describe('debug actions', () => {
  it('finishes a running focus session on demand, starting the break from now', () => {
    const started = gameReducer(createInitialState(), { type: 'startFocus', now: 0 })
    const state = gameReducer(started, { type: 'debug/finish', now: MIN })

    expect(state.garden.coins).toBe(CROPS[0].value)
    expect(state.timer).toMatchObject({ phase: 'break', countdown: { endsAt: MIN + 5 * MIN } })
  })

  it('credits several sessions at once with the current yield', () => {
    const upgraded = gameReducer(withCoins(YIELD_LEVELS[1].cost), { type: 'upgradeYield' })
    const state = gameReducer(upgraded, { type: 'debug/harvest', sessions: 10, now: 0 })

    expect(state.stats.sessions).toBe(10)
    expect(state.garden.harvested.radish).toBe(20)
    expect(state.garden.coins).toBe(20 * CROPS[0].value)
    expect(state.timer.phase).toBe('idle')
  })

  it('resets progress but keeps timer settings', () => {
    const custom = gameReducer(withCoins(500), { type: 'updateSettings', settings: { focusMinutes: 50 } })
    const state = gameReducer(custom, { type: 'debug/reset' })

    expect(state.garden.coins).toBe(0)
    expect(state.settings.focusMinutes).toBe(50)
  })
})
