import { DebugPanel } from './components/DebugPanel'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { SeasonPanel } from './components/SeasonPanel'
import { SeedCatalogue } from './components/SeedCatalogue'
import { TimerPanel } from './components/TimerPanel'
import { YieldUpgrades } from './components/YieldUpgrades'
import { useTimerAlerts } from './hooks/useTimerAlerts'
import { DEBUG_ENABLED } from './lib/debug'
import { useGameState } from './state/gameContext'
import styles from './App.module.css'

export default function App() {
  useTimerAlerts(useGameState().lastEvent)

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <div className={styles.primary}>
          <TimerPanel />
        </div>
        <div className={styles.side}>
          <SeasonPanel />
          <SeedCatalogue />
          <YieldUpgrades />
        </div>
      </main>
      <Footer />
      {DEBUG_ENABLED && <DebugPanel />}
    </div>
  )
}
