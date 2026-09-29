import { CROPS } from '../game/catalog'
import { isFocusing } from '../game/rules'
import { formatNumber } from '../lib/format'
import { useGameDispatch, useGameState } from '../state/gameContext'
import { Coins } from './icons/Coins'
import { CropIcon } from './icons/CropIcon'
import ledger from './Ledger.module.css'

export function SeedCatalogue() {
  const state = useGameState()
  const dispatch = useGameDispatch()
  const { garden } = state
  const focusing = isFocusing(state)

  return (
    <section className={ledger.section} aria-labelledby="seeds-heading">
      <header className={ledger.heading}>
        <h2 id="seeds-heading" className="label">
          Seed catalogue
        </h2>
        <p className={ledger.note}>
          {focusing ? 'The bed is busy until this session ends.' : 'One crop at a time. Unlock them in order.'}
        </p>
      </header>

      <table className={ledger.table}>
        <thead>
          <tr>
            <th scope="col" className={ledger.num}>
              No.
            </th>
            <th scope="col">Crop</th>
            <th scope="col" className={ledger.figure}>
              Each
            </th>
            <th scope="col" className={ledger.action}>
              <span className="visually-hidden">Status</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {CROPS.map((crop, index) => {
            const unlocked = index < garden.unlockedCount
            const isNext = index === garden.unlockedCount
            const planted = crop.id === garden.planted
            const harvested = garden.harvested[crop.id] ?? 0

            return (
              <tr key={crop.id} className={planted ? ledger.current : unlocked ? undefined : ledger.muted}>
                <td className={ledger.num}>{String(index + 1).padStart(2, '0')}</td>
                <td>
                  <div className={ledger.item}>
                    <CropIcon id={crop.id} className={ledger.icon} />
                    <div>
                      <span className={ledger.name}>{crop.name}</span>
                      <span className={ledger.sub}>
                        <i>{crop.latin}</i>
                        {harvested > 0 && <> · {formatNumber(harvested)} harvested</>}
                      </span>
                    </div>
                  </div>
                </td>
                <td className={ledger.figure}>
                  <Coins amount={crop.value} />
                </td>
                <td className={ledger.action}>
                  {planted && <span className={ledger.tag}>Growing</span>}
                  {unlocked && !planted && (
                    <button
                      type="button"
                      className="button small"
                      disabled={focusing}
                      onClick={() => dispatch({ type: 'plant', cropId: crop.id })}
                    >
                      Plant
                    </button>
                  )}
                  {isNext && (
                    <button
                      type="button"
                      className="button small primary"
                      disabled={focusing || garden.coins < crop.price}
                      onClick={() => dispatch({ type: 'unlock', cropId: crop.id })}
                    >
                      Unlock <Coins amount={crop.price} />
                    </button>
                  )}
                  {!unlocked && !isNext && <Coins amount={crop.price} className={ledger.price} />}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </section>
  )
}
