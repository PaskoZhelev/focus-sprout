import type { Tally } from '../game/types'
import { formatDuration, formatNumber } from '../lib/format'
import { useGameState } from '../state/gameContext'
import styles from './SessionStats.module.css'

export function SessionStats() {
  const { stats } = useGameState()
  const rows: [string, Tally][] = [
    ['This season', stats.season],
    ['All time', stats.total],
  ]

  return (
    <table className={styles.stats}>
      <thead>
        <tr>
          <td />
          <th scope="col" className="label">
            Sessions
          </th>
          <th scope="col" className="label">
            Time focused
          </th>
          <th scope="col" className="label">
            Crops harvested
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map(([label, tally]) => (
          <tr key={label}>
            <th scope="row">{label}</th>
            <td>{formatNumber(tally.sessions)}</td>
            <td>{formatDuration(tally.focusedMs)}</td>
            <td>{formatNumber(tally.crops)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
