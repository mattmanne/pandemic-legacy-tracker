import { useState, useEffect } from 'react'
import { collection, doc, onSnapshot, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore'
import { db } from '../firebase'

export const PLAYERS = [
  { id: 'carlos', name: 'Carlos' },
  { id: 'jen', name: 'Jen' },
  { id: 'michelle', name: 'Michelle' },
  { id: 'matt', name: 'Matt' },
]

function defaultCharacter(name) {
  return { playerName: name, characterName: '', role: '', upgrades: [], scars: [], relationships: {} }
}

export function useCharacters() {
  const [characters, setCharacters] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const colRef = collection(db, 'characters')
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        const existing = {}
        snapshot.docs.forEach(d => { existing[d.id] = d.data() })

        PLAYERS
          .filter(p => !existing[p.id])
          .forEach(p => setDoc(doc(db, 'characters', p.id), defaultCharacter(p.name)))

        const chars = {}
        PLAYERS.forEach(p => { chars[p.id] = existing[p.id] ?? defaultCharacter(p.name) })
        setCharacters(chars)
        setLoading(false)
      },
      (err) => {
        setError(err)
        setLoading(false)
      }
    )
    return unsubscribe
  }, [])

  function charRef(playerId) {
    return doc(db, 'characters', playerId)
  }

  async function updateCharacter(playerId, field, value) {
    await updateDoc(charRef(playerId), { [field]: value })
  }

  async function addUpgrade(playerId, upgrade) {
    const trimmed = upgrade.trim()
    if (!trimmed) return
    await updateDoc(charRef(playerId), { upgrades: arrayUnion(trimmed) })
  }

  async function removeUpgrade(playerId, upgrade) {
    await updateDoc(charRef(playerId), { upgrades: arrayRemove(upgrade) })
  }

  async function addScar(playerId, scar) {
    const trimmed = scar.trim()
    if (!trimmed) return
    await updateDoc(charRef(playerId), { scars: arrayUnion(trimmed) })
  }

  async function removeScar(playerId, scar) {
    await updateDoc(charRef(playerId), { scars: arrayRemove(scar) })
  }

  async function setRelationship(playerId, targetId, description) {
    await updateDoc(charRef(playerId), { [`relationships.${targetId}`]: description })
  }

  return {
    characters, loading, error,
    updateCharacter,
    addUpgrade, removeUpgrade,
    addScar, removeScar,
    setRelationship,
  }
}
