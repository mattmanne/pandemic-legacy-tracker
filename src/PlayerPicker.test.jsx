import { render, screen, fireEvent } from '@testing-library/react'
import { PlayerProvider } from './PlayerContext'
import PlayerPicker from './PlayerPicker'

function renderPicker(onSelect = () => {}) {
  return render(
    <PlayerProvider>
      <PlayerPicker onSelect={onSelect} />
    </PlayerProvider>
  )
}

describe('PlayerPicker', () => {
  it('shows all four player names', () => {
    renderPicker()
    expect(screen.getByText('Carlos')).toBeInTheDocument()
    expect(screen.getByText('Jen')).toBeInTheDocument()
    expect(screen.getByText('Michelle')).toBeInTheDocument()
    expect(screen.getByText('Matt')).toBeInTheDocument()
  })

  it('calls onSelect with the chosen player name', () => {
    const onSelect = vi.fn()
    renderPicker(onSelect)
    fireEvent.click(screen.getByText('Carlos'))
    expect(onSelect).toHaveBeenCalledWith('Carlos')
  })

  it('calls onSelect for each player', () => {
    const players = ['Carlos', 'Jen', 'Michelle', 'Matt']
    players.forEach(name => {
      const onSelect = vi.fn()
      const { unmount } = renderPicker(onSelect)
      fireEvent.click(screen.getByText(name))
      expect(onSelect).toHaveBeenCalledWith(name)
      unmount()
    })
  })
})
