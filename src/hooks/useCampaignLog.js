import { useState, useEffect } from 'react'
import { collection, query, orderBy, doc, onSnapshot, addDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'

export function useCampaignLog() {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const q = query(collection(db, 'sessions'), orderBy('createdAt', 'desc'))
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setSessions(snapshot.docs.map(d => ({ id: d.id, ...d.data() })))
        setLoading(false)
      },
      (err) => {
        setError(err)
        setLoading(false)
      }
    )
    return unsubscribe
  }, [])

  const wins = sessions.filter(s => s.result === 'win').length
  const losses = sessions.filter(s => s.result === 'loss').length

  async function addSession({ month, datePlayed, result, notes }) {
    await addDoc(collection(db, 'sessions'), {
      month,
      datePlayed,
      result,
      notes,
      createdAt: serverTimestamp(),
    })
  }

  async function updateSession(id, fields) {
    await updateDoc(doc(db, 'sessions', id), fields)
  }

  async function deleteSession(id) {
    await deleteDoc(doc(db, 'sessions', id))
  }

  return { sessions, loading, error, wins, losses, addSession, updateSession, deleteSession }
}
