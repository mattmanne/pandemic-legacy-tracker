import { useState } from 'react'
import { useCampaignLog } from '../hooks/useCampaignLog'

const EMPTY_FORM = { month: '', datePlayed: '', result: 'win', notes: '' }

function ResultToggle({ value, onChange }) {
  return (
    <div className="flex gap-2">
      {['win', 'loss'].map(r => (
        <button
          key={r}
          type="button"
          onClick={() => onChange(r)}
          className={`px-3 py-1 rounded text-sm font-medium capitalize transition-colors
            ${value === r
              ? r === 'win' ? 'bg-green-700 text-white' : 'bg-red-800 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
        >
          {r === 'win' ? 'Win' : 'Loss'}
        </button>
      ))}
    </div>
  )
}

function SessionForm({ initial = EMPTY_FORM, onSubmit, onCancel, ariaLabel }) {
  const [form, setForm] = useState(initial)

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.month || !form.datePlayed) return
    onSubmit({ ...form, month: Number(form.month), notes: form.notes.trim() })
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-label={ariaLabel}
      className="bg-gray-800 rounded-lg p-4 space-y-3"
    >
      <div className="flex gap-3">
        <div className="flex flex-col gap-1 w-20">
          <label htmlFor="sf-month" className="text-gray-400 text-xs uppercase tracking-wide">Month</label>
          <input
            id="sf-month"
            type="number"
            min={1}
            max={12}
            value={form.month}
            onChange={e => set('month', e.target.value)}
            aria-label="Month"
            required
            className="bg-gray-700 text-white text-sm rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
          />
        </div>
        <div className="flex flex-col gap-1 flex-1">
          <label htmlFor="sf-date" className="text-gray-400 text-xs uppercase tracking-wide">Date played</label>
          <input
            id="sf-date"
            type="date"
            value={form.datePlayed}
            onChange={e => set('datePlayed', e.target.value)}
            aria-label="Date played"
            required
            className="bg-gray-700 text-white text-sm rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
          />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-gray-400 text-xs uppercase tracking-wide">Result</span>
        <ResultToggle value={form.result} onChange={v => set('result', v)} />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="sf-notes" className="text-gray-400 text-xs uppercase tracking-wide">Notes</label>
        <textarea
          id="sf-notes"
          value={form.notes}
          onChange={e => set('notes', e.target.value)}
          aria-label="Notes"
          placeholder="Optional notes…"
          rows={2}
          className="bg-gray-700 text-white text-sm rounded px-2 py-1 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
        />
      </div>
      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1 text-sm text-gray-400 hover:text-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-3 py-1 bg-blue-700 hover:bg-blue-600 text-white text-sm rounded transition-colors"
        >
          Save
        </button>
      </div>
    </form>
  )
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function SessionCard({ session, onEdit, onDelete }) {
  return (
    <div className="bg-gray-800 rounded-lg p-4 space-y-2">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-white text-sm font-medium">Month {session.month}</span>
          <span className="text-gray-500 text-xs">{formatDate(session.datePlayed)}</span>
          <span className={`text-xs font-medium px-2 py-0.5 rounded ${
            session.result === 'win' ? 'bg-green-900 text-green-300' : 'bg-red-950 text-red-400'
          }`}>
            {session.result === 'win' ? 'Win' : 'Loss'}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            aria-label="Edit session"
            className="text-gray-400 hover:text-gray-200 text-xs px-2 py-1 rounded hover:bg-gray-700 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            aria-label="Delete session"
            className="text-gray-400 hover:text-red-400 text-xs px-2 py-1 rounded hover:bg-gray-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
      {session.notes && (
        <p className="text-gray-400 text-sm">{session.notes}</p>
      )}
    </div>
  )
}

export default function CampaignLogPage() {
  const { sessions, loading, error, wins, losses, addSession, updateSession, deleteSession } = useCampaignLog()
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState(null)

  async function handleAdd(fields) {
    await addSession(fields)
    setAdding(false)
  }

  async function handleUpdate(id, fields) {
    await updateSession(id, fields)
    setEditingId(null)
  }

  return (
    <div className="p-4 space-y-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <span className="text-gray-400 text-sm font-medium">{wins}W / {losses}L</span>
        {!adding && (
          <button
            onClick={() => setAdding(true)}
            className="px-3 py-1 bg-blue-700 hover:bg-blue-600 text-white text-sm rounded transition-colors"
          >
            Add Session
          </button>
        )}
      </div>

      {adding && (
        <SessionForm
          ariaLabel="Add session"
          onSubmit={handleAdd}
          onCancel={() => setAdding(false)}
        />
      )}

      {loading && <p className="text-gray-400 text-sm">Loading...</p>}
      {error && <p className="text-red-400 text-sm">Error loading campaign log.</p>}

      {!loading && !error && sessions.length === 0 && !adding && (
        <p className="text-gray-500 text-sm text-center py-8">No sessions logged yet.</p>
      )}

      <div className="space-y-3">
        {sessions.map(session => (
          editingId === session.id ? (
            <SessionForm
              key={session.id}
              ariaLabel="Edit session"
              initial={{ month: session.month, datePlayed: session.datePlayed, result: session.result, notes: session.notes ?? '' }}
              onSubmit={fields => handleUpdate(session.id, fields)}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <SessionCard
              key={session.id}
              session={session}
              onEdit={() => setEditingId(session.id)}
              onDelete={() => deleteSession(session.id)}
            />
          )
        ))}
      </div>
    </div>
  )
}
