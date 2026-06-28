import { render, screen, fireEvent } from '@testing-library/react'
import { PlayerProvider, usePlayer } from './PlayerContext'

const PLAYERS = ['Carlos', 'Jen', 'Michelle', 'Matt']

function ReadPlayer() {
  const { player } = usePlayer()
  return <div data-testid="player">{player ?? 'none'}</div>
}

function SetPlayer({ name }) {
  const { setPlayer } = usePlayer()
  return <button onClick={() => setPlayer(name)}>Set {name}</button>
}

function renderWithProvider(ui) {
  return render(<PlayerProvider>{ui}</PlayerProvider>)
}

describe('PlayerContext', () => {
  beforeEach(() => localStorage.clear())

  it('player is null when nothing is stored', () => {
    renderWithProvider(<ReadPlayer />)
    expect(screen.getByTestId('player').textContent).toBe('none')
  })

  it('setPlayer updates the player value', () => {
    renderWithProvider(
      <>
        <ReadPlayer />
        <SetPlayer name="Carlos" />
      </>
    )
    fireEvent.click(screen.getByText('Set Carlos'))
    expect(screen.getByTestId('player').textContent).toBe('Carlos')
  })

  it('persists player to localStorage', () => {
    renderWithProvider(<SetPlayer name="Jen" />)
    fireEvent.click(screen.getByText('Set Jen'))
    expect(localStorage.getItem('player')).toBe('Jen')
  })

  it('reads player from localStorage on mount', () => {
    localStorage.setItem('player', 'Michelle')
    renderWithProvider(<ReadPlayer />)
    expect(screen.getByTestId('player').textContent).toBe('Michelle')
  })

  it('only accepts valid player names', () => {
    renderWithProvider(
      <>
        <ReadPlayer />
        <SetPlayer name="Unknown" />
      </>
    )
    fireEvent.click(screen.getByText('Set Unknown'))
    expect(screen.getByTestId('player').textContent).toBe('none')
  })
})
