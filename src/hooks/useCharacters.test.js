import { renderHook, act } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'

const { mockUnsubscribe, mockOnSnapshot, mockUpdateDoc, mockSetDoc, mockDoc, mockCollection } =
  vi.hoisted(() => ({
    mockUnsubscribe: vi.fn(),
    mockOnSnapshot: vi.fn(),
    mockUpdateDoc: vi.fn(),
    mockSetDoc: vi.fn(),
    mockDoc: vi.fn((_db, _col, id) => `ref-${id}`),
    mockCollection: vi.fn(() => 'col-ref'),
  }))

vi.mock('../firebase', () => ({ db: {} }))
vi.mock('firebase/firestore', () => ({
  collection: mockCollection,
  doc: mockDoc,
  onSnapshot: mockOnSnapshot,
  updateDoc: mockUpdateDoc,
  setDoc: mockSetDoc,
  arrayUnion: (...args) => ({ __arrayUnion: args }),
  arrayRemove: (...args) => ({ __arrayRemove: args }),
}))

import { useCharacters, PLAYERS } from './useCharacters'

const MOCK_DOCS = PLAYERS.map(p => ({
  id: p.id,
  data: () => ({
    playerName: p.name,
    characterName: '',
    role: '',
    upgrades: [],
    scars: [],
    relationships: {},
  }),
}))

function makeSnapshot(docs) {
  return { docs }
}

describe('PLAYERS', () => {
  it('has 4 players with correct names', () => {
    expect(PLAYERS.map(p => p.name)).toEqual(['Carlos', 'Jen', 'Michelle', 'Matt'])
  })

  it('has lowercase ids', () => {
    expect(PLAYERS.map(p => p.id)).toEqual(['carlos', 'jen', 'michelle', 'matt'])
  })
})

describe('useCharacters', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUpdateDoc.mockResolvedValue(undefined)
    mockSetDoc.mockResolvedValue(undefined)
    mockOnSnapshot.mockImplementation((_ref, onSuccess) => {
      onSuccess(makeSnapshot(MOCK_DOCS))
      return mockUnsubscribe
    })
  })

  it('returns loading=true before snapshot', () => {
    mockOnSnapshot.mockImplementation(() => mockUnsubscribe)
    const { result } = renderHook(() => useCharacters())
    expect(result.current.loading).toBe(true)
  })

  it('returns characters map after snapshot', () => {
    const { result } = renderHook(() => useCharacters())
    expect(result.current.loading).toBe(false)
    expect(result.current.characters).toHaveProperty('carlos')
    expect(result.current.characters).toHaveProperty('jen')
    expect(result.current.characters).toHaveProperty('michelle')
    expect(result.current.characters).toHaveProperty('matt')
  })

  it('initializes missing player documents', () => {
    mockOnSnapshot.mockImplementation((_ref, onSuccess) => {
      onSuccess(makeSnapshot([]))
      return mockUnsubscribe
    })
    renderHook(() => useCharacters())
    expect(mockSetDoc).toHaveBeenCalledTimes(4)
  })

  it('unsubscribes on unmount', () => {
    const { unmount } = renderHook(() => useCharacters())
    unmount()
    expect(mockUnsubscribe).toHaveBeenCalled()
  })

  it('updateCharacter calls updateDoc', async () => {
    const { result } = renderHook(() => useCharacters())
    await act(async () => {
      await result.current.updateCharacter('carlos', 'characterName', 'Agent X')
    })
    expect(mockUpdateDoc).toHaveBeenCalledWith('ref-carlos', { characterName: 'Agent X' })
  })

  it('addUpgrade uses arrayUnion', async () => {
    const { result } = renderHook(() => useCharacters())
    await act(async () => {
      await result.current.addUpgrade('jen', 'Lockpick')
    })
    expect(mockUpdateDoc).toHaveBeenCalledWith('ref-jen', {
      upgrades: { __arrayUnion: ['Lockpick'] },
    })
  })

  it('removeUpgrade uses arrayRemove', async () => {
    const { result } = renderHook(() => useCharacters())
    await act(async () => {
      await result.current.removeUpgrade('jen', 'Lockpick')
    })
    expect(mockUpdateDoc).toHaveBeenCalledWith('ref-jen', {
      upgrades: { __arrayRemove: ['Lockpick'] },
    })
  })

  it('addScar uses arrayUnion', async () => {
    const { result } = renderHook(() => useCharacters())
    await act(async () => {
      await result.current.addScar('matt', 'Limp')
    })
    expect(mockUpdateDoc).toHaveBeenCalledWith('ref-matt', {
      scars: { __arrayUnion: ['Limp'] },
    })
  })

  it('removeScar uses arrayRemove', async () => {
    const { result } = renderHook(() => useCharacters())
    await act(async () => {
      await result.current.removeScar('matt', 'Limp')
    })
    expect(mockUpdateDoc).toHaveBeenCalledWith('ref-matt', {
      scars: { __arrayRemove: ['Limp'] },
    })
  })

  it('setRelationship updates relationship map', async () => {
    const { result } = renderHook(() => useCharacters())
    await act(async () => {
      await result.current.setRelationship('carlos', 'jen', 'Trusted ally')
    })
    expect(mockUpdateDoc).toHaveBeenCalledWith('ref-carlos', {
      'relationships.jen': 'Trusted ally',
    })
  })

  it('addUpgrade ignores blank values', async () => {
    const { result } = renderHook(() => useCharacters())
    await act(async () => {
      await result.current.addUpgrade('carlos', '   ')
    })
    expect(mockUpdateDoc).not.toHaveBeenCalled()
  })
})
