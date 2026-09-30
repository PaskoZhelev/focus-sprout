import { YIELD_LEVELS } from '../game/catalog'
import { isFocusing } from '../game/rules'
import { useGameDispatch, useGameState } from '../state/gameContext'
import { Coins } from './icons/Coins'
import ledger from './Ledger.module.css'

export function YieldUpgrades() {
  const state = useGameState()
  const dispatch = useGameDispatch()
  const { garden } = state
  const focusing = isFocusing(state)

  return (
    <section className={ledger.section} aria-labelledby="tools-heading">
      <header className={ledger.heading}>
        <h2 id="tools-heading" className="label">
          Soil &amp; tools
        </h2>
        <p className={ledger.note}>
          {focusing
            ? 'Tools are in use until this session ends.'
            : 'Each step grows more crops per harvest, whatever is growing.'}
        </p>
      </header>

      <table className={ledger.table}>
        <thead>
          <tr>
            <th scope="col" className={ledger.num}>
              Lvl
            </th>
            <th scope="col">Improvement</th>
            <th scope="col" className={ledger.figure}>
              Yield
            </th>
            <th scope="col" className={ledger.action}>
              <span className="visually-hidden">Status</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {YIELD_LEVELS.map((level, index) => {
            const owned = index <= garden.yieldLevel
            const isNext = index === garden.yieldLevel + 1

            return (
              <tr
                key={level.name}
                className={index === garden.yieldLevel ? ledger.current : owned ? undefined : ledger.muted}
              >
                <td className={ledger.num}>{index + 1}</td>
                <td>
                  <span className={ledger.name}>{level.name}</span>
                </td>
                <td className={ledger.figure}>×{level.yield}</td>
                <td className={ledger.action}>
                  {index === garden.yieldLevel && <span className={ledger.tag}>In use</span>}
                  {index < garden.yieldLevel && <span className={ledger.price}>Owned</span>}
                  {isNext && (
                    <button
                      type="button"
                      className="button small primary"
                      disabled={focusing || garden.coins < level.cost}
                      onClick={() => dispatch({ type: 'upgradeYield' })}
                    >
                      Buy <Coins amount={level.cost} />
                    </button>
                  )}
                  {!owned && !isNext && <Coins amount={level.cost} className={ledger.price} />}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </section>
  )
}
