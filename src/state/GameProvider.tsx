import { useEffect, useReducer, type ReactNode } from 'react'
import { loadState, saveState } from '../game/persistence'
import { gameReducer, settle } from '../game/reducer'
import { GameDispatchContext, GameStateContext } from './gameContext'

// Settle on load so a session that ended while the tab was closed still pays out.
const init = () => settle(loadState(), Date.now())

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, undefined, init)

  useEffect(() => {
    saveState(state)
  }, [state])

  return (
    <GameStateContext value={state}>
      <GameDispatchContext value={dispatch}>{children}</GameDispatchContext>
    </GameStateContext>
  )
}
