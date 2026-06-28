import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App'

function renderApp(initialRoute = '/') {
  return render(
    <MemoryRouter initialEntries={[initialRoute]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <App />
    </MemoryRouter>
  )
}

function renderAppWithPlayer(initialRoute = '/') {
  localStorage.setItem('player', 'Matt')
  return renderApp(initialRoute)
}

describe('App shell — player picker', () => {
  beforeEach(() => localStorage.clear())

  it('shows player picker when no player is stored', () => {
    renderApp()
    expect(screen.getByText('Who are you?')).toBeInTheDocument()
  })

  it('shows all four player names in the picker', () => {
    renderApp()
    expect(screen.getByText('Carlos')).toBeInTheDocument()
    expect(screen.getByText('Jen')).toBeInTheDocument()
    expect(screen.getByText('Michelle')).toBeInTheDocument()
    expect(screen.getByText('Matt')).toBeInTheDocument()
  })

  it('dismisses picker and shows app after selecting a player', () => {
    renderApp()
    fireEvent.click(screen.getByText('Carlos'))
    expect(screen.queryByText('Who are you?')).not.toBeInTheDocument()
    expect(screen.getAllByText('Pandemic Legacy').length).toBeGreaterThan(0)
  })

  it('skips picker when player is already stored', () => {
    renderAppWithPlayer()
    expect(screen.queryByText('Who are you?')).not.toBeInTheDocument()
    expect(screen.getAllByText('Pandemic Legacy').length).toBeGreaterThan(0)
  })
})

describe('App shell — navigation', () => {
  beforeEach(() => localStorage.clear())

  it('renders the app title', () => {
    renderAppWithPlayer()
    expect(screen.getAllByRole('heading', { name: 'Pandemic Legacy' }).length).toBeGreaterThan(0)
  })

  it('shows active player name', () => {
    renderAppWithPlayer()
    expect(screen.getAllByText('Matt').length).toBeGreaterThan(0)
  })

  it('shows campaign log placeholder by default', () => {
    renderAppWithPlayer('/')
    expect(screen.getByText('Campaign Log — coming soon')).toBeInTheDocument()
  })

  it('shows state page on /state route', () => {
    renderAppWithPlayer('/state')
    // StatePage renders while connecting to Firebase
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('shows characters page on /characters route', () => {
    renderAppWithPlayer('/characters')
    // CharactersPage renders Loading... while connecting to Firebase
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('shows rules placeholder on /rules route', () => {
    renderAppWithPlayer('/rules')
    expect(screen.getByText('Rules — coming soon')).toBeInTheDocument()
  })
})
