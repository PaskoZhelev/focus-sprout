import { harvestValue, nextLockedCrop, nextYieldLevel } from '../game/rules'
import { useGameDispatch, useGameState } from '../state/gameContext'
import styles from './DebugPanel.module.css'

function sessionsUntil(cost: number, coins: number, perSession: number): string {
  const sessions = Math.max(0, Math.ceil((cost - coins) / perSession))
  return sessions === 0 ? 'affordable now' : `${sessions} session${sessions === 1 ? '' : 's'} away`
}

export function DebugPanel() {
  const { garden, timer } = useGameState()
  const dispatch = useGameDispatch()

  const perSession = harvestValue(garden, garden.planted)
  const crop = nextLockedCrop(garden)
  const tool = nextYieldLevel(garden)
  const focusing = timer.phase === 'focus'

  const harvest = (sessions: number) => dispatch({ type: 'debug/harvest', sessions, now: Date.now() })
  const reset = () => {
    if (window.confirm('Wipe all coins, crops and upgrades?')) dispatch({ type: 'debug/reset' })
  }

  return (
    <aside className={styles.panel} aria-label="Debug tools">
      <p className={styles.title}>Debug</p>
      <div className={styles.actions}>
        <button
          type="button"
          className="button small"
          disabled={timer.phase === 'idle'}
          onClick={() => dispatch({ type: 'debug/finish', now: Date.now() })}
        >
          Finish countdown
        </button>
        <button type="button" className="button small" disabled={focusing} onClick={() => harvest(1)}>
          +1 session
        </button>
        <button type="button" className="button small" disabled={focusing} onClick={() => harvest(10)}>
          +10 sessions
        </button>
        <button type="button" className="button small" onClick={reset}>
          Reset progress
        </button>
      </div>
      <p className={styles.readout}>
        {perSession} coins per session.{' '}
        {crop ? `${crop.name}: ${sessionsUntil(crop.price, garden.coins, perSession)}.` : 'All crops unlocked.'}{' '}
        {tool ? `${tool.name}: ${sessionsUntil(tool.cost, garden.coins, perSession)}.` : 'All tools owned.'}
      </p>
    </aside>
  )
}
