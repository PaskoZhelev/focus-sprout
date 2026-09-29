import { Preferences } from './Preferences'
import { TimerSettings } from './TimerSettings'
import styles from './Footer.module.css'

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.settings}>
        <TimerSettings />
      </div>
      <div className={styles.aside}>
        <Preferences />
        <p className={styles.small}>Progress is kept in this browser only.</p>
      </div>
    </footer>
  )
}
