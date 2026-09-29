import { DebugPanel } from './components/DebugPanel'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { SeedCatalogue } from './components/SeedCatalogue'
import { TimerPanel } from './components/TimerPanel'
import { YieldUpgrades } from './components/YieldUpgrades'
import { useChime } from './hooks/useChime'
import { DEBUG_ENABLED } from './lib/debug'
import { useGameState } from './state/gameContext'
import styles from './App.module.css'

export default function App() {
  useChime(useGameState().lastEvent)

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <div className={styles.primary}>
          <TimerPanel />
        </div>
        <div className={styles.side}>
          <SeedCatalogue />
          <YieldUpgrades />
        </div>
      </main>
      <Footer />
      {DEBUG_ENABLED && <DebugPanel />}
    </div>
  )
}
