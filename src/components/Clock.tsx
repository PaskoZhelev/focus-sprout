import type { CSSProperties } from 'react'
import styles from './Clock.module.css'

/** Renders each character in a fixed-width cell so proportional digits don't make the clock wobble. */
const DIGIT_EM = 0.6
const COLON_EM = 0.3
const MMSS_EM = 4 * DIGIT_EM + COLON_EM

export function Clock({ text }: { text: string }) {
  // Shrink to keep the width of "MM:SS" once hours appear.
  const widthEm = Array.from(text).reduce((sum, char) => sum + (char === ':' ? COLON_EM : DIGIT_EM), 0)
  const scale = Math.min(1, MMSS_EM / widthEm)

  return (
    <p className={styles.clock} role="timer" aria-label={text} style={{ '--clock-scale': scale } as CSSProperties}>
      {Array.from(text, (char, i) => (
        <span key={i} className={char === ':' ? styles.colon : styles.digit} aria-hidden="true">
          {char}
        </span>
      ))}
    </p>
  )
}
