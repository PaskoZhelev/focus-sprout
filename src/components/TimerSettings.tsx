import { useId, useState } from 'react'
import { DEFAULT_SETTINGS } from '../game/reducer'
import { toSettingValue } from '../game/rules'
import type { Settings } from '../game/types'
import { useGameDispatch, useGameState } from '../state/gameContext'
import styles from './TimerSettings.module.css'

const FIELDS: { name: keyof Settings; label: string; unit: string }[] = [
  { name: 'focusMinutes', label: 'Focus', unit: 'min' },
  { name: 'shortBreakMinutes', label: 'Short break', unit: 'min' },
  { name: 'longBreakMinutes', label: 'Long break', unit: 'min' },
  { name: 'longBreakEvery', label: 'Long break every', unit: 'sessions' },
]

export function TimerSettings() {
  const { settings } = useGameState()
  const dispatch = useGameDispatch()
  const isDefault = FIELDS.every(({ name }) => settings[name] === DEFAULT_SETTINGS[name])

  return (
    <details className={styles.details}>
      <summary className={styles.summary}>Timer lengths</summary>
      <div className={styles.grid}>
        {FIELDS.map((field) => (
          // Remount when the saved value changes from outside (e.g. reset), so the typed text follows it.
          <SettingField
            key={`${field.name}-${settings[field.name]}`}
            label={field.label}
            unit={field.unit}
            value={settings[field.name]}
            onCommit={(value) => dispatch({ type: 'updateSettings', settings: { [field.name]: value } })}
          />
        ))}
      </div>
      <p className={styles.hint}>
        Changes apply from the next countdown.
        {!isDefault && (
          <button
            type="button"
            className={styles.reset}
            onClick={() => dispatch({ type: 'updateSettings', settings: DEFAULT_SETTINGS })}
          >
            Reset to defaults
          </button>
        )}
      </p>
    </details>
  )
}

interface SettingFieldProps {
  label: string
  unit: string
  value: number
  onCommit: (value: number) => void
}

/** Free text while typing; saved on blur or Enter if it's a whole number above zero, otherwise reverted. */
function SettingField({ label, unit, value, onCommit }: SettingFieldProps) {
  const id = useId()
  const [draft, setDraft] = useState(String(value))

  const commit = () => {
    const next = draft.trim() === '' ? value : (toSettingValue(Number(draft)) ?? value)
    setDraft(String(next))
    if (next !== value) onCommit(next)
  }

  return (
    <div className={styles.field}>
      <label htmlFor={id}>{label}</label>
      <div className={styles.inputRow}>
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min={1}
          step={1}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commit()
            if (e.key === 'Escape') setDraft(String(value))
          }}
        />
        <span className={styles.unit}>{unit}</span>
      </div>
    </div>
  )
}
