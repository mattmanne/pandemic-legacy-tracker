import { renderHook, act } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'

const { mockUnsubscribe, mockOnSnapshot, mockAddDoc, mockUpdateDoc, mockDeleteDoc } =
  vi.hoisted(() => ({
    mockUnsubscribe: vi.fn(),
    mockOnSnapshot: vi.fn(),
    mockAddDoc: vi.fn(),
    mockUpdateDoc: vi.fn(),
    mockDeleteDoc: vi.fn(),
  }))

vi.mock('../firebase', () => ({ db: {} }))
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(() => 'col-ref'),
  query: vi.fn(ref => ref),
  orderBy: vi.fn(() => 'order-stub'),
  doc: vi.fn((_db, _col, id) => `ref-${id}`),
  onSnapshot: mockOnSnapshot,
  addDoc: mockAddDoc,
  updateDoc: mockUpdateDoc,
  deleteDoc: mockDeleteDoc,
  serverTimestamp: vi.fn(() => ({ __serverTimestamp: true })),
}))

import { useCampaignLog } from './useCampaignLog'

const MOCK_DOCS = [
  { id: 's1', data: () => ({ month: 2, datePlayed: '2026-02-20', result: 'loss', notes: 'Close one', createdAt: null }) },
  { id: 's2', data: () => ({ month: 1, datePlayed: '2026-01-15', result: 'win', notes: 'Easy win', createdAt: null }) },
]

function makeSnapshot(docs) {
  return { docs }
}

describe('useCampaignLog', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockAddDoc.mockResolvedValue({ id: 'new-id' })
    mockUpdateDoc.mockResolvedValue(undefined)
    mockDeleteDoc.mockResolvedValue(undefined)
    mockOnSnapshot.mockImplementation((_ref, onSuccess) => {
      onSuccess(makeSnapshot(MOCK_DOCS))
      return mockUnsubscribe
    })
  })

  it('returns loading=true before snapshot', () => {
    mockOnSnapshot.mockImplementation(() => mockUnsubscribe)
    const { result } = renderHook(() => useCampaignLog())
    expect(result.current.loading).toBe(true)
  })

  it('returns sessions array after snapshot', () => {
    const { result } = renderHook(() => useCampaignLog())
    expect(result.current.loading).toBe(false)
    expect(result.current.sessions).toHaveLength(2)
    expect(result.current.sessions[0].id).toBe('s1')
    expect(result.current.sessions[1].id).toBe('s2')
  })

  it('unsubscribes on unmount', () => {
    const { unmount } = renderHook(() => useCampaignLog())
    unmount()
    expect(mockUnsubscribe).toHaveBeenCalled()
  })

  it('computes wins and losses', () => {
    const { result } = renderHook(() => useCampaignLog())
    expect(result.current.wins).toBe(1)
    expect(result.current.losses).toBe(1)
  })

  it('returns wins=0 losses=0 when no sessions', () => {
    mockOnSnapshot.mockImplementation((_ref, onSuccess) => {
      onSuccess(makeSnapshot([]))
      return mockUnsubscribe
    })
    const { result } = renderHook(() => useCampaignLog())
    expect(result.current.wins).toBe(0)
    expect(result.current.losses).toBe(0)
  })

  it('addSession calls addDoc with correct shape', async () => {
    const { result } = renderHook(() => useCampaignLog())
    await act(async () => {
      await result.current.addSession({ month: 3, datePlayed: '2026-03-10', result: 'win', notes: 'Notes' })
    })
    expect(mockAddDoc).toHaveBeenCalledWith('col-ref', {
      month: 3,
      datePlayed: '2026-03-10',
      result: 'win',
      notes: 'Notes',
      createdAt: { __serverTimestamp: true },
    })
  })

  it('updateSession calls updateDoc', async () => {
    const { result } = renderHook(() => useCampaignLog())
    await act(async () => {
      await result.current.updateSession('s1', { notes: 'Updated' })
    })
    expect(mockUpdateDoc).toHaveBeenCalledWith('ref-s1', { notes: 'Updated' })
  })

  it('deleteSession calls deleteDoc', async () => {
    const { result } = renderHook(() => useCampaignLog())
    await act(async () => {
      await result.current.deleteSession('s2')
    })
    expect(mockDeleteDoc).toHaveBeenCalledWith('ref-s2')
  })
})
