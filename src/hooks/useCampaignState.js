import { useState, useEffect } from 'react'
import { doc, onSnapshot, updateDoc, setDoc, arrayUnion, arrayRemove } from 'firebase/firestore'
import { db } from '../firebase'

export const DEFAULT_STATE = {
  month: 1,
  fundingTrack: 0,
  outbreakCount: 0,
  fundedEvents: [],
  cities: {},
  deckAdded: [],
  deckRemoved: [],
}

function stateRef() {
  return doc(db, 'campaign', 'state')
}

export function useCampaignState() {
  const [state, setState] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const ref = stateRef()
    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => {
        if (snapshot.exists()) {
          setState(snapshot.data())
        } else {
          setDoc(ref, DEFAULT_STATE)
          setState(DEFAULT_STATE)
        }
        setLoading(false)
      },
      (err) => {
        setError(err)
        setLoading(false)
      }
    )
    return unsubscribe
  }, [])

  async function updateField(field, value) {
    await updateDoc(stateRef(), { [field]: value })
  }

  async function addCity(name) {
    const trimmed = name.trim()
    if (!trimmed) return
    await updateDoc(stateRef(), { [`cities.${trimmed}`]: [] })
  }

  async function removeCity(name) {
    const cities = { ...state.cities }
    delete cities[name]
    await updateDoc(stateRef(), { cities })
  }

  async function addSticker(city, sticker) {
    const trimmed = sticker.trim()
    if (!trimmed) return
    await updateDoc(stateRef(), { [`cities.${city}`]: arrayUnion(trimmed) })
  }

  async function removeSticker(city, sticker) {
    await updateDoc(stateRef(), { [`cities.${city}`]: arrayRemove(sticker) })
  }

  async function addFundedEvent(name) {
    const trimmed = name.trim()
    if (!trimmed) return
    await updateDoc(stateRef(), { fundedEvents: arrayUnion(trimmed) })
  }

  async function removeFundedEvent(name) {
    await updateDoc(stateRef(), { fundedEvents: arrayRemove(name) })
  }

  async function addDeckCard(card, type) {
    const trimmed = card.trim()
    if (!trimmed) return
    const field = type === 'added' ? 'deckAdded' : 'deckRemoved'
    await updateDoc(stateRef(), { [field]: arrayUnion(trimmed) })
  }

  async function removeDeckCard(card, type) {
    const field = type === 'added' ? 'deckAdded' : 'deckRemoved'
    await updateDoc(stateRef(), { [field]: arrayRemove(card) })
  }

  return {
    state, loading, error,
    updateField,
    addCity, removeCity,
    addSticker, removeSticker,
    addFundedEvent, removeFundedEvent,
    addDeckCard, removeDeckCard,
  }
}
