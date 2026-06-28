import { renderHook, act } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'

const { mockUnsubscribe, mockOnSnapshot, mockUpdateDoc, mockSetDoc } = vi.hoisted(() => ({
  mockUnsubscribe: vi.fn(),
  mockOnSnapshot: vi.fn(),
  mockUpdateDoc: vi.fn(),
  mockSetDoc: vi.fn(),
}))

vi.mock('../firebase', () => ({ db: {} }))
vi.mock('firebase/firestore', () => ({
  doc: vi.fn(() => 'mock-ref'),
  onSnapshot: mockOnSnapshot,
  updateDoc: mockUpdateDoc,
  setDoc: mockSetDoc,
  arrayUnion: (...args) => ({ __arrayUnion: args }),
  arrayRemove: (...args) => ({ __arrayRemove: args }),
}))

import { useCampaignState, DEFAULT_STATE } from './useCampaignState'

const MOCK_STATE = { ...DEFAULT_STATE, month: 3, fundingTrack: 5 }

function makeSnapshot(data) {
  return { exists: () => data !== null, data: () => data }
}

describe('DEFAULT_STATE', () => {
  it('has correct shape and defaults', () => {
    expect(DEFAULT_STATE).toEqual({
      month: 1,
      fundingTrack: 0,
      outbreakCount: 0,
      fundedEvents: [],
      cities: {},
      deckAdded: [],
      deckRemoved: [],
    })
  })
})

describe('useCampaignState', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUpdateDoc.mockResolvedValue(undefined)
    mockSetDoc.mockResolvedValue(undefined)
    mockOnSnapshot.mockImplementation((ref, onSuccess) => {
      onSuccess(makeSnapshot(MOCK_STATE))
      return mockUnsubscribe
    })
  })

  it('returns loading=true before snapshot fires', () => {
    mockOnSnapshot.mockImplementation(() => mockUnsubscribe)
    const { result } = renderHook(() => useCampaignState())
    expect(result.current.loading).toBe(true)
    expect(result.current.state).toBeNull()
  })

  it('returns state and loading=false after snapshot', () => {
    const { result } = renderHook(() => useCampaignState())
    expect(result.current.loading).toBe(false)
    expect(result.current.state).toEqual(MOCK_STATE)
  })

  it('calls setDoc with DEFAULT_STATE when document does not exist', () => {
    mockOnSnapshot.mockImplementation((ref, onSuccess) => {
      onSuccess(makeSnapshot(null))
      return mockUnsubscribe
    })
    renderHook(() => useCampaignState())
    expect(mockSetDoc).toHaveBeenCalledWith('mock-ref', DEFAULT_STATE)
  })

  it('unsubscribes on unmount', () => {
    const { unmount } = renderHook(() => useCampaignState())
    unmount()
    expect(mockUnsubscribe).toHaveBeenCalled()
  })

  it('updateField calls updateDoc', async () => {
    const { result } = renderHook(() => useCampaignState())
    await act(async () => { await result.current.updateField('month', 5) })
    expect(mockUpdateDoc).toHaveBeenCalledWith('mock-ref', { month: 5 })
  })

  it('addCity writes empty sticker array', async () => {
    const { result } = renderHook(() => useCampaignState())
    await act(async () => { await result.current.addCity('Paris') })
    expect(mockUpdateDoc).toHaveBeenCalledWith('mock-ref', { 'cities.Paris': [] })
  })

  it('addCity ignores blank names', async () => {
    const { result } = renderHook(() => useCampaignState())
    await act(async () => { await result.current.addCity('   ') })
    expect(mockUpdateDoc).not.toHaveBeenCalled()
  })

  it('addSticker uses arrayUnion', async () => {
    const { result } = renderHook(() => useCampaignState())
    await act(async () => { await result.current.addSticker('Paris', 'Quarantine') })
    expect(mockUpdateDoc).toHaveBeenCalledWith('mock-ref', {
      'cities.Paris': { __arrayUnion: ['Quarantine'] },
    })
  })

  it('removeSticker uses arrayRemove', async () => {
    const { result } = renderHook(() => useCampaignState())
    await act(async () => { await result.current.removeSticker('Paris', 'Quarantine') })
    expect(mockUpdateDoc).toHaveBeenCalledWith('mock-ref', {
      'cities.Paris': { __arrayRemove: ['Quarantine'] },
    })
  })

  it('addFundedEvent uses arrayUnion', async () => {
    const { result } = renderHook(() => useCampaignState())
    await act(async () => { await result.current.addFundedEvent('Airlift') })
    expect(mockUpdateDoc).toHaveBeenCalledWith('mock-ref', {
      fundedEvents: { __arrayUnion: ['Airlift'] },
    })
  })

  it('removeFundedEvent uses arrayRemove', async () => {
    const { result } = renderHook(() => useCampaignState())
    await act(async () => { await result.current.removeFundedEvent('Airlift') })
    expect(mockUpdateDoc).toHaveBeenCalledWith('mock-ref', {
      fundedEvents: { __arrayRemove: ['Airlift'] },
    })
  })

  it('addDeckCard adds to deckAdded', async () => {
    const { result } = renderHook(() => useCampaignState())
    await act(async () => { await result.current.addDeckCard('Special Orders', 'added') })
    expect(mockUpdateDoc).toHaveBeenCalledWith('mock-ref', {
      deckAdded: { __arrayUnion: ['Special Orders'] },
    })
  })

  it('addDeckCard adds to deckRemoved', async () => {
    const { result } = renderHook(() => useCampaignState())
    await act(async () => { await result.current.addDeckCard('Atlanta', 'removed') })
    expect(mockUpdateDoc).toHaveBeenCalledWith('mock-ref', {
      deckRemoved: { __arrayUnion: ['Atlanta'] },
    })
  })

  it('removeDeckCard removes from deckAdded', async () => {
    const { result } = renderHook(() => useCampaignState())
    await act(async () => { await result.current.removeDeckCard('Special Orders', 'added') })
    expect(mockUpdateDoc).toHaveBeenCalledWith('mock-ref', {
      deckAdded: { __arrayRemove: ['Special Orders'] },
    })
  })
})
