import { useId } from 'react'
import styles from './ChoiceGroup.module.css'

interface ChoiceGroupProps<T extends string> {
  legend: string
  options: readonly { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
}

/** A row of radio buttons styled as text links, for small preferences. */
export function ChoiceGroup<T extends string>({ legend, options, value, onChange }: ChoiceGroupProps<T>) {
  const name = useId()

  return (
    <fieldset className={styles.group}>
      <legend className="label">{legend}</legend>
      {options.map((option) => (
        <label key={option.value} className={styles.option}>
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
          />
          <span>{option.label}</span>
        </label>
      ))}
    </fieldset>
  )
}
