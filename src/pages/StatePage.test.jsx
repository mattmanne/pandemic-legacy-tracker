import { render, screen, fireEvent } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import StatePage from './StatePage'

const mockUpdateField = vi.fn()
const mockAddCity = vi.fn()
const mockRemoveCity = vi.fn()
const mockAddSticker = vi.fn()
const mockRemoveSticker = vi.fn()
const mockAddFundedEvent = vi.fn()
const mockRemoveFundedEvent = vi.fn()
const mockAddDeckCard = vi.fn()
const mockRemoveDeckCard = vi.fn()

const BASE_STATE = {
  month: 3,
  fundingTrack: 5,
  outbreakCount: 2,
  fundedEvents: ['Airlift'],
  cities: { Paris: ['Quarantine'] },
  deckAdded: ['Special Orders'],
  deckRemoved: ['Atlanta'],
}

let mockHookReturn

vi.mock('../hooks/useCampaignState', () => ({
  useCampaignState: () => mockHookReturn,
  DEFAULT_STATE: {
    month: 1, fundingTrack: 0, outbreakCount: 0,
    fundedEvents: [], cities: {}, deckAdded: [], deckRemoved: [],
  },
}))

function renderPage() {
  return render(<StatePage />)
}

describe('StatePage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockHookReturn = {
      state: BASE_STATE,
      loading: false,
      error: null,
      updateField: mockUpdateField,
      addCity: mockAddCity,
      removeCity: mockRemoveCity,
      addSticker: mockAddSticker,
      removeSticker: mockRemoveSticker,
      addFundedEvent: mockAddFundedEvent,
      removeFundedEvent: mockRemoveFundedEvent,
      addDeckCard: mockAddDeckCard,
      removeDeckCard: mockRemoveDeckCard,
    }
  })

  it('shows a loading indicator while loading', () => {
    mockHookReturn = { ...mockHookReturn, state: null, loading: true }
    renderPage()
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('shows current month', () => {
    renderPage()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('shows funding track value', () => {
    renderPage()
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('shows outbreak count', () => {
    renderPage()
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('increment month calls updateField', () => {
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: /increment month/i }))
    expect(mockUpdateField).toHaveBeenCalledWith('month', 4)
  })

  it('decrement month calls updateField', () => {
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: /decrement month/i }))
    expect(mockUpdateField).toHaveBeenCalledWith('month', 2)
  })

  it('month cannot go below 1', () => {
    mockHookReturn = { ...mockHookReturn, state: { ...BASE_STATE, month: 1 } }
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: /decrement month/i }))
    expect(mockUpdateField).not.toHaveBeenCalled()
  })

  it('month cannot go above 12', () => {
    mockHookReturn = { ...mockHookReturn, state: { ...BASE_STATE, month: 12 } }
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: /increment month/i }))
    expect(mockUpdateField).not.toHaveBeenCalled()
  })

  it('increment outbreaks calls updateField', () => {
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: /increment outbreaks/i }))
    expect(mockUpdateField).toHaveBeenCalledWith('outbreakCount', 3)
  })

  it('decrement outbreaks cannot go below 0', () => {
    mockHookReturn = { ...mockHookReturn, state: { ...BASE_STATE, outbreakCount: 0 } }
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: /decrement outbreaks/i }))
    expect(mockUpdateField).not.toHaveBeenCalled()
  })

  it('shows existing funded event', () => {
    renderPage()
    expect(screen.getByText('Airlift')).toBeInTheDocument()
  })

  it('remove funded event calls removeFundedEvent', () => {
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: /remove airlift/i }))
    expect(mockRemoveFundedEvent).toHaveBeenCalledWith('Airlift')
  })

  it('shows existing city', () => {
    renderPage()
    expect(screen.getByText('Paris')).toBeInTheDocument()
  })

  it('shows city sticker', () => {
    renderPage()
    expect(screen.getByText('Quarantine')).toBeInTheDocument()
  })

  it('shows added deck card', () => {
    renderPage()
    expect(screen.getByText('Special Orders')).toBeInTheDocument()
  })

  it('shows removed deck card', () => {
    renderPage()
    expect(screen.getByText('Atlanta')).toBeInTheDocument()
  })
})
