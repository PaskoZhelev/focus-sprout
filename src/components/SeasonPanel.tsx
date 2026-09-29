import { canStartNewSeason, currentSeason, currentYear, isFocusing, upcomingSeason } from '../game/rules'
import { formatNumber } from '../lib/format'
import { useGameDispatch, useGameState } from '../state/gameContext'
import ledger from './Ledger.module.css'
import styles from './SeasonPanel.module.css'

export function SeasonPanel() {
  const state = useGameState()
  const dispatch = useGameDispatch()
  const { garden } = state

  if (!canStartNewSeason(garden)) return null

  const season = currentSeason(garden)
  const next = upcomingSeason(garden)
  // Safe: every season has crops.
  const finalCrop = season.crops.at(-1)!
  const newYear = next.id === 'spring'
  const focusing = isFocusing(state)

  const start = () => {
    const leftover = garden.coins > 0 ? ` Your ${formatNumber(garden.coins)} coins stay behind.` : ''
    if (window.confirm(`Start ${next.name}? Crops and tools go back to the beginning.${leftover}`)) {
      dispatch({ type: 'newSeason' })
    }
  }

  return (
    <section className={ledger.section} aria-labelledby="season-heading">
      <header className={ledger.heading}>
        <h2 id="season-heading" className="label">
          Ready for {next.name.toLowerCase()}
        </h2>
        <p className={ledger.note}>The first {finalCrop.many} are in.</p>
      </header>
      <p className={styles.body}>
        {newYear ? `Year ${currentYear(garden) + 1} begins` : `${next.name} brings eight new crops`} on a bare plot.
        Coins, crops and tools start over, at the same prices. Your harvest records and all-time stats stay. There's no
        rush: you can keep growing here as long as you like.
      </p>
      <button type="button" className="button primary" disabled={focusing} onClick={start}>
        Start {next.name.toLowerCase()}
      </button>
      {focusing && <p className={`${ledger.note} ${styles.hint}`}>Finish this session first.</p>}
    </section>
  )
}
