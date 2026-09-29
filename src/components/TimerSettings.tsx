import { useId } from 'react'
import type { Settings } from '../game/types'
import { useGameDispatch, useGameState } from '../state/gameContext'
import styles from './TimerSettings.module.css'

const FIELDS: { key: keyof Settings; label: string; unit: string; options: number[] }[] = [
  { key: 'focusMinutes', label: 'Focus', unit: 'min', options: [15, 20, 25, 30, 40, 45, 50, 60, 90] },
  { key: 'shortBreakMinutes', label: 'Short break', unit: 'min', options: [3, 5, 10, 15] },
  { key: 'longBreakMinutes', label: 'Long break', unit: 'min', options: [10, 15, 20, 30] },
  { key: 'longBreakEvery', label: 'Long break every', unit: 'sessions', options: [2, 3, 4, 5, 6] },
]

export function TimerSettings() {
  const { settings } = useGameState()
  const dispatch = useGameDispatch()
  const id = useId()

  return (
    <details className={styles.details}>
      <summary className={styles.summary}>Timer lengths</summary>
      <div className={styles.grid}>
        {FIELDS.map(({ key, label, unit, options }) => {
          // Keep a saved value selectable even if it's not one of the presets.
          const values = options.includes(settings[key]) ? options : [...options, settings[key]].sort((a, b) => a - b)
          return (
            <div key={key} className={styles.field}>
              <label htmlFor={`${id}-${key}`}>{label}</label>
              <select
                id={`${id}-${key}`}
                value={settings[key]}
                onChange={(e) => dispatch({ type: 'updateSettings', settings: { [key]: Number(e.target.value) } })}
              >
                {values.map((value) => (
                  <option key={value} value={value}>
                    {value} {unit}
                  </option>
                ))}
              </select>
            </div>
          )
        })}
      </div>
      <p className={styles.hint}>Changes apply from the next countdown.</p>
    </details>
  )
}
