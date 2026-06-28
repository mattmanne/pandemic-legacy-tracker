import { Routes, Route, NavLink } from 'react-router-dom'
import { BookOpen, MapPin, Users, ScrollText } from 'lucide-react'

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

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-100">
      <header className="px-4 py-3 border-b border-zinc-800">
        <h1 className="text-base font-semibold tracking-wide">Pandemic Legacy</h1>
      </header>

      <main className="flex-1 overflow-y-auto pb-16">
        <Routes>
          <Route path="/" element={<Placeholder title="Campaign Log" />} />
          <Route path="/state" element={<Placeholder title="Campaign State" />} />
          <Route path="/characters" element={<Placeholder title="Characters" />} />
          <Route path="/rules" element={<Placeholder title="Rules" />} />
        </Routes>
      </main>

      <nav
        className="fixed bottom-0 left-0 right-0 flex border-t border-zinc-800 bg-zinc-950"
        role="navigation"
        aria-label="Main navigation"
      >
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-1 py-2 text-xs transition-colors ${
                isActive ? 'text-red-400' : 'text-zinc-500 hover:text-zinc-300'
              }`
            }
          >
            <Icon size={20} strokeWidth={1.5} />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
