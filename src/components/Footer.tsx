import { formatDuration, formatNumber } from '../lib/format'
import { useGameState } from '../state/gameContext'
import { Preferences } from './Preferences'
import styles from './Footer.module.css'

export function Footer() {
  const { stats, garden } = useGameState()
  const totalHarvested = Object.values(garden.harvested).reduce((sum, n) => sum + n, 0)

  return (
    <footer className={styles.footer}>
      <dl className={styles.stats}>
        <div>
          <dt className="label">Sessions</dt>
          <dd>{formatNumber(stats.sessions)}</dd>
        </div>
        <div>
          <dt className="label">Time focused</dt>
          <dd>{formatDuration(stats.focusedMs)}</dd>
        </div>
        <div>
          <dt className="label">Crops harvested</dt>
          <dd>{formatNumber(totalHarvested)}</dd>
        </div>
      </dl>
      <div className={styles.aside}>
        <Preferences />
        <p className={styles.small}>Progress is kept in this browser only.</p>
      </div>
    </footer>
  )
}
