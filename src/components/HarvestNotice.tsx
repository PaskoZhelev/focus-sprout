import { countCrop, getCrop } from '../game/catalog'
import { useGameState } from '../state/gameContext'
import { Coins } from './icons/Coins'
import styles from './HarvestNotice.module.css'

const timeFormat = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' })

export function HarvestNotice() {
  const { lastEvent } = useGameState()

  return (
    <p className={styles.notice} aria-live="polite">
      {lastEvent?.kind === 'harvest' && (
        <>
          <time dateTime={new Date(lastEvent.at).toISOString()}>{timeFormat.format(lastEvent.at)}</time>
          Pulled {countCrop(getCrop(lastEvent.cropId), lastEvent.amount)}, sold for{' '}
          <Coins amount={lastEvent.coins} />.
        </>
      )}
      {lastEvent?.kind === 'break-over' && (
        <>
          <time dateTime={new Date(lastEvent.at).toISOString()}>{timeFormat.format(lastEvent.at)}</time>
          Break's over. Start the next session when you're ready.
        </>
      )}
    </p>
  )
}
