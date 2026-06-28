import { createContext, useContext, useState, useEffect } from 'react'

const PLAYERS = ['Carlos', 'Jen', 'Michelle', 'Matt']
const STORAGE_KEY = 'player'

const PlayerContext = createContext(null)

export function PlayerProvider({ children }) {
  const [player, setPlayerState] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return PLAYERS.includes(stored) ? stored : null
  })

  function setPlayer(name) {
    if (!PLAYERS.includes(name)) return
    localStorage.setItem(STORAGE_KEY, name)
    setPlayerState(name)
  }

  return (
    <PlayerContext.Provider value={{ player, setPlayer, PLAYERS }}>
      {children}
    </PlayerContext.Provider>
  )
}

export function usePlayer() {
  return useContext(PlayerContext)
}
