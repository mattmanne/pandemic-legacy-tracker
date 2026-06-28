import { Routes, Route, NavLink } from 'react-router-dom'
import { BookOpen, MapPin, Users, ScrollText, ChevronDown } from 'lucide-react'
import { PlayerProvider, usePlayer } from './PlayerContext'
import PlayerPicker from './PlayerPicker'
import StatePage from './pages/StatePage'

const NAV_ITEMS = [
  { to: '/', label: 'Log', icon: ScrollText },
  { to: '/state', label: 'State', icon: MapPin },
  { to: '/characters', label: 'Characters', icon: Users },
  { to: '/rules', label: 'Rules', icon: BookOpen },
]

function Placeholder({ title }) {
  return (
    <div className="flex items-center justify-center h-48">
      <p className="text-zinc-500 text-sm">{title} — coming soon</p>
    </div>
  )
}

function NavItem({ to, label, icon: Icon }) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) =>
        `flex flex-col items-center gap-1 py-2 text-xs transition-colors
        md:flex-row md:gap-3 md:px-4 md:py-3 md:rounded-lg md:w-full md:text-sm
        ${isActive
          ? 'text-red-400 md:bg-zinc-800 md:text-red-400'
          : 'text-zinc-500 hover:text-zinc-300 md:hover:bg-zinc-800/50'
        }`
      }
    >
      <Icon size={20} strokeWidth={1.5} />
      {label}
    </NavLink>
  )
}

function Shell({ children }) {
  const { player, setPlayer } = usePlayer()

  if (!player) {
    return <PlayerPicker onSelect={setPlayer} />
  }

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-100 md:flex-row">
      {/* Sidebar — tablet+ */}
      <aside className="hidden md:flex md:flex-col md:w-56 md:border-r md:border-zinc-800 md:p-4 md:gap-1 md:shrink-0">
        <div className="mb-6 px-2">
          <h1 className="text-xs text-zinc-500 uppercase tracking-widest">Pandemic Legacy</h1>
        </div>
        {NAV_ITEMS.map(item => <NavItem key={item.to} {...item} />)}
        <div className="mt-auto pt-4 border-t border-zinc-800">
          <button
            onClick={() => setPlayer(null)}
            className="flex items-center gap-2 w-full px-2 py-2 text-sm text-zinc-400 hover:text-zinc-200 rounded-lg hover:bg-zinc-800/50 transition-colors"
          >
            <span className="flex-1 text-left">{player}</span>
            <ChevronDown size={14} />
          </button>
        </div>
      </aside>

      {/* Header — mobile */}
      <header className="flex md:hidden items-center justify-between px-4 py-3 border-b border-zinc-800">
        <h1 className="text-base font-semibold tracking-wide">Pandemic Legacy</h1>
        <button
          onClick={() => setPlayer(null)}
          className="flex items-center gap-1 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          {player}
          <ChevronDown size={14} />
        </button>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
        {children}
      </main>

      {/* Bottom nav — mobile */}
      <nav
        className="fixed bottom-0 left-0 right-0 flex border-t border-zinc-800 bg-zinc-950 md:hidden"
        role="navigation"
        aria-label="Main navigation"
      >
        {NAV_ITEMS.map(item => (
          <NavItem key={item.to} {...item} />
        ))}
      </nav>
    </div>
  )
}

export default function App() {
  return (
    <PlayerProvider>
      <Shell>
        <Routes>
          <Route path="/" element={<Placeholder title="Campaign Log" />} />
          <Route path="/state" element={<StatePage />} />
          <Route path="/characters" element={<Placeholder title="Characters" />} />
          <Route path="/rules" element={<Placeholder title="Rules" />} />
        </Routes>
      </Shell>
    </PlayerProvider>
  )
}
