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
  /** A focus session just paid out. The break waits for the user to start it. */
  | { readonly phase: 'breakReady'; readonly long: boolean }
  | {
      readonly phase: 'break'
      readonly countdown: Countdown
      readonly durationMs: number
      readonly long: boolean
    }

export interface GardenState {
  readonly coins: number
  /**
   * Seasons finished since the game began. The current season is
   * `seasonsPassed % 4`, and the year is `floor(seasonsPassed / 4) + 1`.
   */
  readonly seasonsPassed: number
  /** Number of crops unlocked, counted from the start of this season's catalogue. */
  readonly unlockedCount: number
  readonly planted: CropId
  /** Index into YIELD_LEVELS. */
  readonly yieldLevel: number
  /** Whether this season's last crop has been harvested yet. Opens the way to the next season. */
  readonly finalCropHarvested: boolean
  /** Lifetime counts across every season. Never reset. */
  readonly harvested: Readonly<Partial<Record<CropId, number>>>
}

export interface Settings {
  readonly focusMinutes: number
  readonly shortBreakMinutes: number
  readonly longBreakMinutes: number
  /** A long break follows every n-th completed focus session. */
  readonly longBreakEvery: number
}

export interface Tally {
  readonly sessions: number
  readonly focusedMs: number
  /** Crops harvested, of any kind. */
  readonly crops: number
}

export interface Stats {
  /** Since the current season started. Reset by newSeason. */
  readonly season: Tally
  /** Across every season. Never reset. */
  readonly total: Tally
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
  /** Allowed from idle, or from breakReady to skip the break and go straight on. */
  | { type: 'startFocus'; now: number }
  | { type: 'startBreak'; now: number }
  | { type: 'pause'; now: number }
  | { type: 'resume'; now: number }
  /**
   * Abandons a focus session (no harvest) or skips a break, running or not yet
   * started. A countdown that already ran out by `now` is settled instead, so a
   * finished session still pays.
   */
  | { type: 'stop'; now: number }
  | { type: 'tick'; now: number }
  | { type: 'plant'; cropId: CropId }
  | { type: 'unlock'; cropId: CropId }
  | { type: 'upgradeYield' }
  /** Moves on to the next season once its last crop has been harvested. Resets coins, crops and yield. */
  | { type: 'newSeason' }
  | { type: 'updateSettings'; settings: Partial<Settings> }
  /** Ends the running countdown immediately. */
  | { type: 'debug/finish'; now: number }
  /** Credits whole sessions without running the timer. */
  | { type: 'debug/harvest'; sessions: number; now: number }
  /** Unlocks every crop and tool of the current season for free. */
  | { type: 'debug/ownAll' }
  | { type: 'debug/reset' }
