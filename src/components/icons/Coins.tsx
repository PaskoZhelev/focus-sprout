import { formatNumber } from '../../lib/format'
import styles from './Coins.module.css'

export function CoinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="10" fill="#d4a032" />
      <circle cx="12" cy="12" r="7.3" fill="none" stroke="#a87718" strokeWidth="1.2" />
      <path d="M12 16.5v-5" stroke="#a87718" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M12 12c0-2.2-1.4-3.6-3.6-3.6 0 2.3 1.4 3.6 3.6 3.6z" fill="#a87718" />
      <path d="M12 11.2c0-1.9 1.2-3.2 3.2-3.2 0 2-1.2 3.2-3.2 3.2z" fill="#a87718" />
    </svg>
  )
}

/** A coin amount: icon plus number, read out as "120 coins" by screen readers. */
export function Coins({ amount, className }: { amount: number; className?: string }) {
  return (
    <span className={className ? `${styles.coins} ${className}` : styles.coins}>
      <CoinIcon className={styles.icon} />
      {formatNumber(amount)}
      <span className="visually-hidden"> coins</span>
    </span>
  )
}
