import { usePlayer } from './PlayerContext'

export default function PlayerPicker({ onSelect }) {
  const { PLAYERS } = usePlayer()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6">
      <div className="w-full max-w-sm rounded-2xl bg-zinc-900 border border-zinc-800 p-6">
        <h2 className="text-lg font-semibold text-zinc-100 mb-1">Who are you?</h2>
        <p className="text-sm text-zinc-500 mb-6">Select your name to get started.</p>
        <div className="grid grid-cols-2 gap-3">
          {PLAYERS.map(name => (
            <button
              key={name}
              onClick={() => onSelect(name)}
              className="rounded-xl bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 py-4 text-sm font-medium text-zinc-100 transition-colors"
            >
              {name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
