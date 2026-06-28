import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App'

function renderApp(initialRoute = '/') {
  return render(
    <MemoryRouter initialEntries={[initialRoute]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <App />
    </MemoryRouter>
  )
}

describe('App shell', () => {
  it('renders the app title', () => {
    renderApp()
    expect(screen.getByText('Pandemic Legacy')).toBeInTheDocument()
  })

  it('renders all four navigation items', () => {
    renderApp()
    expect(screen.getByText('Log')).toBeInTheDocument()
    expect(screen.getByText('State')).toBeInTheDocument()
    expect(screen.getByText('Characters')).toBeInTheDocument()
    expect(screen.getByText('Rules')).toBeInTheDocument()
  })

  it('shows campaign log placeholder by default', () => {
    renderApp('/')
    expect(screen.getByText('Campaign Log — coming soon')).toBeInTheDocument()
  })

  it('shows state placeholder on /state route', () => {
    renderApp('/state')
    expect(screen.getByText('Campaign State — coming soon')).toBeInTheDocument()
  })

  it('shows characters placeholder on /characters route', () => {
    renderApp('/characters')
    expect(screen.getByText('Characters — coming soon')).toBeInTheDocument()
  })

  it('shows rules placeholder on /rules route', () => {
    renderApp('/rules')
    expect(screen.getByText('Rules — coming soon')).toBeInTheDocument()
  })
})
