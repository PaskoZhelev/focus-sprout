import { createContext, useContext, type Dispatch } from 'react'
import type { GameAction, GameState } from '../game/types'

export const GameStateContext = createContext<GameState | null>(null)
export const GameDispatchContext = createContext<Dispatch<GameAction> | null>(null)

export function useGameState(): GameState {
  const state = useContext(GameStateContext)
  if (!state) throw new Error('useGameState must be used inside <GameProvider>')
  return state
}

export function useGameDispatch(): Dispatch<GameAction> {
  const dispatch = useContext(GameDispatchContext)
  if (!dispatch) throw new Error('useGameDispatch must be used inside <GameProvider>')
  return dispatch
}
