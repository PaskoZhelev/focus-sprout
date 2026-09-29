import type { CropId } from './catalog'

export type Countdown =
  | { readonly kind: 'running'; readonly endsAt: number }
  | { readonly kind: 'paused'; readonly remainingMs: number }

export type TimerState =
  | { readonly phase: 'idle' }
  | {
      readonly phase: 'focus'
      readonly countdown: Countdown
      readonly durationMs: number
      /** Crop locked in when the session started. */
      readonly cropId: CropId
    }
  | {
      readonly phase: 'break'
      readonly countdown: Countdown
      readonly durationMs: number
      readonly long: boolean
    }

export interface GardenState {
  readonly coins: number
  /** Number of crops unlocked, counted from the start of the catalog. */
  readonly unlockedCount: number
  readonly planted: CropId
  /** Index into YIELD_LEVELS. */
  readonly yieldLevel: number
  readonly harvested: Readonly<Partial<Record<CropId, number>>>
}

export interface Settings {
  readonly focusMinutes: number
  readonly shortBreakMinutes: number
  readonly longBreakMinutes: number
  /** A long break follows every n-th completed focus session. */
  readonly longBreakEvery: number
}

export interface Stats {
  readonly sessions: number
  readonly focusedMs: number
}

export type TimerEvent =
  | {
      readonly kind: 'harvest'
      readonly at: number
      readonly cropId: CropId
      readonly amount: number
      readonly coins: number
    }
  | { readonly kind: 'break-over'; readonly at: number }

export interface GameState {
  readonly garden: GardenState
  readonly timer: TimerState
  readonly settings: Settings
  readonly stats: Stats
  /** Most recent thing the timer did on its own. Drives the notice and chime. */
  readonly lastEvent: TimerEvent | null
}

export type GameAction =
  | { type: 'startFocus'; now: number }
  | { type: 'pause'; now: number }
  | { type: 'resume'; now: number }
  /**
   * Abandons a focus session (no harvest) or skips a break. A countdown that
   * already ran out by `now` is settled instead, so a finished session still pays.
   */
  | { type: 'stop'; now: number }
  | { type: 'tick'; now: number }
  | { type: 'plant'; cropId: CropId }
  | { type: 'unlock'; cropId: CropId }
  | { type: 'upgradeYield' }
  | { type: 'updateSettings'; settings: Partial<Settings> }
  /** Ends the running countdown immediately. */
  | { type: 'debug/finish'; now: number }
  /** Credits whole sessions without running the timer. */
  | { type: 'debug/harvest'; sessions: number; now: number }
  | { type: 'debug/reset' }
