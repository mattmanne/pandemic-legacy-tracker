import { render, screen, fireEvent } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import CharactersPage from './CharactersPage'

const mockUpdateCharacter = vi.fn()
const mockAddUpgrade = vi.fn()
const mockRemoveUpgrade = vi.fn()
const mockAddScar = vi.fn()
const mockRemoveScar = vi.fn()
const mockSetRelationship = vi.fn()

const MOCK_CHARS = {
  carlos: {
    playerName: 'Carlos', characterName: 'Agent Smith', role: 'Operative',
    upgrades: ['Lockpick'], scars: [], relationships: { jen: 'Trusted' },
  },
  jen: {
    playerName: 'Jen', characterName: '', role: '',
    upgrades: [], scars: ['Limp'], relationships: {},
  },
  michelle: {
    playerName: 'Michelle', characterName: 'Agent M', role: 'Medic',
    upgrades: [], scars: [], relationships: {},
  },
  matt: {
    playerName: 'Matt', characterName: '', role: '',
    upgrades: [], scars: [], relationships: {},
  },
}

const mockUseCharacters = vi.fn()

vi.mock('../hooks/useCharacters', () => ({
  useCharacters: (...args) => mockUseCharacters(...args),
  PLAYERS: [
    { id: 'carlos', name: 'Carlos' },
    { id: 'jen', name: 'Jen' },
    { id: 'michelle', name: 'Michelle' },
    { id: 'matt', name: 'Matt' },
  ],
}))

const DEFAULT_HOOK = {
  characters: MOCK_CHARS,
  loading: false,
  error: null,
  updateCharacter: mockUpdateCharacter,
  addUpgrade: mockAddUpgrade,
  removeUpgrade: mockRemoveUpgrade,
  addScar: mockAddScar,
  removeScar: mockRemoveScar,
  setRelationship: mockSetRelationship,
}

describe('CharactersPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseCharacters.mockReturnValue(DEFAULT_HOOK)
  })

  it('shows loading indicator when loading', () => {
    mockUseCharacters.mockReturnValue({
      characters: null, loading: true, error: null,
      updateCharacter: vi.fn(), addUpgrade: vi.fn(), removeUpgrade: vi.fn(),
      addScar: vi.fn(), removeScar: vi.fn(), setRelationship: vi.fn(),
    })
    render(<CharactersPage />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('shows all 4 player names as headings', () => {
    render(<CharactersPage />)
    expect(screen.getByRole('heading', { name: 'Carlos' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Jen' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Michelle' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Matt' })).toBeInTheDocument()
  })

  it('shows character names as input values', () => {
    render(<CharactersPage />)
    expect(screen.getByDisplayValue('Agent Smith')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Agent M')).toBeInTheDocument()
  })

  it('shows existing upgrades as tags', () => {
    render(<CharactersPage />)
    expect(screen.getByText('Lockpick')).toBeInTheDocument()
  })

  it('shows existing scars as tags', () => {
    render(<CharactersPage />)
    expect(screen.getByText('Limp')).toBeInTheDocument()
  })

  it('calls updateCharacter with characterName on input blur', () => {
    render(<CharactersPage />)
    const input = screen.getByDisplayValue('Agent Smith')
    fireEvent.change(input, { target: { value: 'Agent Z' } })
    fireEvent.blur(input)
    expect(mockUpdateCharacter).toHaveBeenCalledWith('carlos', 'characterName', 'Agent Z')
  })

  it('does not call updateCharacter on blur if value unchanged', () => {
    render(<CharactersPage />)
    const input = screen.getByDisplayValue('Agent Smith')
    fireEvent.blur(input)
    expect(mockUpdateCharacter).not.toHaveBeenCalled()
  })

  it('calls addUpgrade when upgrade is submitted', () => {
    render(<CharactersPage />)
    const inputs = screen.getAllByPlaceholderText('Add upgrade')
    fireEvent.change(inputs[0], { target: { value: 'Stealthy' } })
    fireEvent.submit(inputs[0].closest('form'))
    expect(mockAddUpgrade).toHaveBeenCalledWith('carlos', 'Stealthy')
  })

  it('clears upgrade input after submit', () => {
    render(<CharactersPage />)
    const inputs = screen.getAllByPlaceholderText('Add upgrade')
    fireEvent.change(inputs[0], { target: { value: 'Stealthy' } })
    fireEvent.submit(inputs[0].closest('form'))
    expect(inputs[0]).toHaveValue('')
  })

  it('calls removeUpgrade when tag remove is clicked', () => {
    render(<CharactersPage />)
    fireEvent.click(screen.getByLabelText('Remove Lockpick'))
    expect(mockRemoveUpgrade).toHaveBeenCalledWith('carlos', 'Lockpick')
  })

  it('calls addScar when scar is submitted', () => {
    render(<CharactersPage />)
    const inputs = screen.getAllByPlaceholderText('Add scar')
    fireEvent.change(inputs[0], { target: { value: 'Scar tissue' } })
    fireEvent.submit(inputs[0].closest('form'))
    expect(mockAddScar).toHaveBeenCalledWith('carlos', 'Scar tissue')
  })

  it('calls removeScar when tag remove is clicked', () => {
    render(<CharactersPage />)
    fireEvent.click(screen.getByLabelText('Remove Limp'))
    expect(mockRemoveScar).toHaveBeenCalledWith('jen', 'Limp')
  })

  it('shows relationships section heading', () => {
    render(<CharactersPage />)
    expect(screen.getAllByText('Relationships').length).toBeGreaterThan(0)
  })

  it('calls setRelationship on relationship input blur', () => {
    render(<CharactersPage />)
    const rel = screen.getByDisplayValue('Trusted')
    fireEvent.change(rel, { target: { value: 'Rivals' } })
    fireEvent.blur(rel)
    expect(mockSetRelationship).toHaveBeenCalledWith('carlos', 'jen', 'Rivals')
  })
})
