import { render, screen, fireEvent } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import CampaignLogPage from './CampaignLogPage'

const mockAddSession = vi.fn()
const mockUpdateSession = vi.fn()
const mockDeleteSession = vi.fn()
const mockUseCampaignLog = vi.fn()

vi.mock('../hooks/useCampaignLog', () => ({
  useCampaignLog: (...args) => mockUseCampaignLog(...args),
}))

const MOCK_SESSIONS = [
  { id: 's1', month: 2, datePlayed: '2026-02-20', result: 'loss', notes: 'Close one' },
  { id: 's2', month: 1, datePlayed: '2026-01-15', result: 'win', notes: '' },
]

const DEFAULT_HOOK = {
  sessions: MOCK_SESSIONS,
  loading: false,
  error: null,
  wins: 1,
  losses: 1,
  addSession: mockAddSession,
  updateSession: mockUpdateSession,
  deleteSession: mockDeleteSession,
}

describe('CampaignLogPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseCampaignLog.mockReturnValue(DEFAULT_HOOK)
  })

  it('shows loading indicator while loading', () => {
    mockUseCampaignLog.mockReturnValue({ ...DEFAULT_HOOK, loading: true, sessions: [], wins: 0, losses: 0 })
    render(<CampaignLogPage />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
    // Add Session button is visible even while loading
    expect(screen.getByRole('button', { name: /add session/i })).toBeInTheDocument()
  })

  it('shows W/L summary', () => {
    render(<CampaignLogPage />)
    expect(screen.getByText('1W / 1L')).toBeInTheDocument()
  })

  it('shows 0W / 0L when no sessions', () => {
    mockUseCampaignLog.mockReturnValue({ ...DEFAULT_HOOK, sessions: [], wins: 0, losses: 0 })
    render(<CampaignLogPage />)
    expect(screen.getByText('0W / 0L')).toBeInTheDocument()
  })

  it('shows empty state when no sessions', () => {
    mockUseCampaignLog.mockReturnValue({ ...DEFAULT_HOOK, sessions: [], wins: 0, losses: 0 })
    render(<CampaignLogPage />)
    expect(screen.getByText('No sessions logged yet.')).toBeInTheDocument()
  })

  it('shows session month numbers', () => {
    render(<CampaignLogPage />)
    expect(screen.getByText('Month 2')).toBeInTheDocument()
    expect(screen.getByText('Month 1')).toBeInTheDocument()
  })

  it('shows win and loss badges', () => {
    render(<CampaignLogPage />)
    expect(screen.getByText('Win')).toBeInTheDocument()
    expect(screen.getByText('Loss')).toBeInTheDocument()
  })

  it('shows session notes', () => {
    render(<CampaignLogPage />)
    expect(screen.getByText('Close one')).toBeInTheDocument()
  })

  it('shows Add Session button', () => {
    render(<CampaignLogPage />)
    expect(screen.getByRole('button', { name: /add session/i })).toBeInTheDocument()
  })

  it('shows add form when Add Session is clicked', () => {
    render(<CampaignLogPage />)
    fireEvent.click(screen.getByRole('button', { name: /add session/i }))
    expect(screen.getByLabelText('Month')).toBeInTheDocument()
    expect(screen.getByLabelText('Date played')).toBeInTheDocument()
  })

  it('submitting add form calls addSession', () => {
    render(<CampaignLogPage />)
    fireEvent.click(screen.getByRole('button', { name: /add session/i }))
    fireEvent.change(screen.getByLabelText('Month'), { target: { value: '3' } })
    fireEvent.change(screen.getByLabelText('Date played'), { target: { value: '2026-03-10' } })
    fireEvent.click(screen.getByRole('button', { name: /^win$/i }))
    fireEvent.submit(screen.getByRole('form', { name: /add session/i }))
    expect(mockAddSession).toHaveBeenCalledWith(expect.objectContaining({
      month: 3,
      datePlayed: '2026-03-10',
      result: 'win',
    }))
  })

  it('shows edit form when Edit is clicked', () => {
    render(<CampaignLogPage />)
    fireEvent.click(screen.getAllByRole('button', { name: /edit/i })[0])
    expect(screen.getByRole('form', { name: /edit session/i })).toBeInTheDocument()
  })

  it('submitting edit form calls updateSession', () => {
    render(<CampaignLogPage />)
    fireEvent.click(screen.getAllByRole('button', { name: /edit/i })[0])
    const notesInput = screen.getByLabelText('Notes')
    fireEvent.change(notesInput, { target: { value: 'Updated notes' } })
    fireEvent.submit(screen.getByRole('form', { name: /edit session/i }))
    expect(mockUpdateSession).toHaveBeenCalledWith('s1', expect.objectContaining({
      notes: 'Updated notes',
    }))
  })

  it('delete button calls deleteSession', () => {
    render(<CampaignLogPage />)
    fireEvent.click(screen.getAllByRole('button', { name: /delete/i })[0])
    expect(mockDeleteSession).toHaveBeenCalledWith('s1')
  })
})
