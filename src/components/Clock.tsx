import styles from './Clock.module.css'

/** Renders each character in a fixed-width cell so proportional digits don't make the clock wobble. */
export function Clock({ text }: { text: string }) {
  return (
    <p className={styles.clock} role="timer" aria-label={text}>
      {Array.from(text, (char, i) => (
        <span key={i} className={char === ':' ? styles.colon : styles.digit} aria-hidden="true">
          {char}
        </span>
      ))}
    </p>
  )
}
