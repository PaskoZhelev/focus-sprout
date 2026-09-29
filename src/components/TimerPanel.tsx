import { countCrop, getCrop } from '../game/catalog'
import { harvestValue, yieldPerSession } from '../game/rules'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useFavicon } from '../hooks/useFavicon'
import { usePomodoro } from '../hooks/usePomodoro'
import { useUnseen } from '../hooks/useUnseen'
import { formatClock } from '../lib/format'
import { useGameState } from '../state/gameContext'
import { Clock } from './Clock'
import { HarvestNotice } from './HarvestNotice'
import { Coins } from './icons/Coins'
import { CropIcon } from './icons/CropIcon'
import { SessionStats } from './SessionStats'
import styles from './TimerPanel.module.css'

export function TimerPanel() {
  const { garden, timer, stats, lastEvent } = useGameState()
  const pomodoro = usePomodoro()
  const { phase, running, paused } = pomodoro

  const cropId = timer.phase === 'focus' ? timer.cropId : garden.planted
  const crop = getCrop(cropId)
  const perSession = yieldPerSession(garden)
  const clock = formatClock(pomodoro.remainingMs)
  const progress = 1 - pomodoro.remainingMs / pomodoro.totalMs

  const breakName = pomodoro.isLongBreak ? 'Long break' : 'Short break'
  const phaseName = {
    idle: 'Ready',
    focus: 'Focus',
    breakReady: 'Session complete',
    break: breakName,
  }[phase]
  const phaseLabel = paused ? `${phaseName}, paused` : phaseName

  // Flag anything that happened while the user was looking elsewhere, until they come back.
  const unseen = useUnseen(lastEvent)
  const titles = {
    idle: unseen && lastEvent?.kind === 'break-over' ? "Break's over" : '',
    focus: `${clock} focus`,
    breakReady: '✓ Session done',
    break: `${clock} break`,
  }
  useDocumentTitle(titles[phase] ? `${titles[phase]} · Focus Sprout` : 'Focus Sprout')
  useFavicon(phase === 'breakReady' || unseen)

  const giveUp = () => {
    if (window.confirm(`Give up this session? You won't harvest any ${crop.many}.`)) {
      pomodoro.stop()
    }
  }

  return (
    <section className={styles.panel} aria-labelledby="timer-heading">
      <h2 id="timer-heading" className="label">
        In the ground
      </h2>
      <div className={styles.planted}>
        <CropIcon id={cropId} className={styles.icon} />
        <div>
          <p className={styles.crop}>
            {crop.name} <i className={styles.latin}>{crop.latin}</i>
          </p>
          <p className={styles.yield}>
            {countCrop(crop, perSession)} per session, worth <Coins amount={harvestValue(garden, cropId)} />
          </p>
        </div>
      </div>

      <div className={styles.clockBlock} data-phase={phase}>
        <p className={styles.phase}>
          <span>{phaseLabel}</span>
          {(phase === 'idle' || phase === 'focus') && <span>Session no. {stats.total.sessions + 1}</span>}
          {phase === 'breakReady' && <span>{breakName} next</span>}
        </p>
        <Clock text={clock} />
        <div
          className={styles.track}
          role="progressbar"
          aria-label="Session progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
        >
          <div className={styles.fill} style={{ transform: `scaleX(${progress})` }} />
        </div>
      </div>

      <div className={styles.controls}>
        {phase === 'idle' && (
          <button type="button" className="button primary" onClick={pomodoro.start}>
            Start focus
          </button>
        )}
        {phase !== 'idle' && running && (
          <button type="button" className="button primary" onClick={pomodoro.pause}>
            Pause
          </button>
        )}
        {paused && (
          <button type="button" className="button primary" onClick={pomodoro.resume}>
            Resume
          </button>
        )}
        {phase === 'breakReady' && (
          <>
            <button type="button" className="button primary" onClick={pomodoro.startBreak}>
              Start break
            </button>
            <button type="button" className="button" onClick={pomodoro.stop}>
              Skip break
            </button>
          </>
        )}
        {phase === 'focus' && (
          <button type="button" className="button" onClick={giveUp}>
            Give up
          </button>
        )}
        {phase === 'break' && (
          <button type="button" className="button" onClick={pomodoro.stop}>
            Skip break
          </button>
        )}
      </div>

      <HarvestNotice />
      <SessionStats />
    </section>
  )
}
