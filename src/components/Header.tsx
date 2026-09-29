import { useGameState } from '../state/gameContext'
import { Coins } from './icons/Coins'
import { SproutMark } from './SproutMark'
import styles from './Header.module.css'

export function Header() {
  const { coins } = useGameState().garden

  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <SproutMark className={styles.mark} />
        <div>
          <h1 className={styles.title}>Focus Sprout</h1>
          <p className={styles.tagline}>A pomodoro timer that pays in produce.</p>
        </div>
      </div>
      <p className={styles.purse}>
        <span className="label">Coins</span>
        <output className={styles.coins} aria-live="polite">
          <Coins amount={coins} />
        </output>
      </p>
    </header>
  )
}
