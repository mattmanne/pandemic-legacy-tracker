import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { useCampaignState } from '../hooks/useCampaignState'

function Counter({ label, value, onIncrement, onDecrement, min, max }) {
  return (
    <div className="flex items-center justify-between bg-zinc-900 rounded-xl px-4 py-3">
      <span className="text-sm text-zinc-400">{label}</span>
      <div className="flex items-center gap-4">
        <button
          onClick={onDecrement}
          disabled={value <= min}
          aria-label={`Decrement ${label}`}
          className="w-8 h-8 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-lg font-medium"
        >
          −
        </button>
        <span className="w-6 text-center text-zinc-100 font-semibold tabular-nums">{value}</span>
        <button
          onClick={onIncrement}
          disabled={value >= max}
          aria-label={`Increment ${label}`}
          className="w-8 h-8 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-lg font-medium"
        >
          +
        </button>
      </div>
    </div>
  )
}

function SectionHeader({ title }) {
  return (
    <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3">{title}</h2>
  )
}

function Tag({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-zinc-800 text-zinc-300 text-xs">
      {label}
      <button
        onClick={onRemove}
        aria-label={`Remove ${label}`}
        className="text-zinc-500 hover:text-zinc-200 transition-colors"
      >
        <X size={12} />
      </button>
    </span>
  )
}

function AddInput({ placeholder, onAdd }) {
  const [value, setValue] = useState('')

  function handleAdd() {
    if (!value.trim()) return
    onAdd(value.trim())
    setValue('')
  }

  return (
    <div className="flex gap-2">
      <input
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleAdd()}
        placeholder={placeholder}
        className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
      />
      <button
        onClick={handleAdd}
        aria-label={`Add ${placeholder}`}
        className="px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
      >
        <Plus size={16} />
      </button>
    </div>
  )
}

export default function StatePage() {
  const {
    state, loading, error,
    updateField,
    addCity, removeCity,
    addSticker, removeSticker,
    addFundedEvent, removeFundedEvent,
    addDeckCard, removeDeckCard,
  } = useCampaignState()

  if (loading) return <p className="p-6 text-zinc-500 text-sm">Loading...</p>
  if (error) return <p className="p-6 text-red-400 text-sm">Error loading state.</p>

  return (
    <div className="p-4 space-y-8 max-w-2xl">

      {/* Campaign overview */}
      <section>
        <SectionHeader title="Campaign" />
        <div className="space-y-2">
          <Counter
            label="Month"
            value={state.month}
            min={1} max={12}
            onIncrement={() => updateField('month', state.month + 1)}
            onDecrement={() => updateField('month', state.month - 1)}
          />
          <Counter
            label="Funding Track"
            value={state.fundingTrack}
            min={0} max={99}
            onIncrement={() => updateField('fundingTrack', state.fundingTrack + 1)}
            onDecrement={() => updateField('fundingTrack', state.fundingTrack - 1)}
          />
          <Counter
            label="Outbreaks"
            value={state.outbreakCount}
            min={0} max={8}
            onIncrement={() => updateField('outbreakCount', state.outbreakCount + 1)}
            onDecrement={() => updateField('outbreakCount', state.outbreakCount - 1)}
          />
        </div>
      </section>

      {/* Cities */}
      <section>
        <SectionHeader title="Cities" />
        <div className="space-y-3">
          {Object.entries(state.cities).map(([city, stickers]) => (
            <div key={city} className="bg-zinc-900 rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-200">{city}</span>
                <button
                  onClick={() => removeCity(city)}
                  aria-label={`Remove city ${city}`}
                  className="text-zinc-600 hover:text-zinc-400 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="flex flex-wrap gap-1">
                {stickers.map(s => (
                  <Tag key={s} label={s} onRemove={() => removeSticker(city, s)} />
                ))}
              </div>
              <AddInput
                placeholder="Add sticker..."
                onAdd={sticker => addSticker(city, sticker)}
              />
            </div>
          ))}
          <AddInput placeholder="Add city..." onAdd={addCity} />
        </div>
      </section>

      {/* Funded events */}
      <section>
        <SectionHeader title="Funded Events" />
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {state.fundedEvents.map(e => (
              <Tag key={e} label={e} onRemove={() => removeFundedEvent(e)} />
            ))}
          </div>
          <AddInput placeholder="Add funded event..." onAdd={addFundedEvent} />
        </div>
      </section>

      {/* Deck changes */}
      <section>
        <SectionHeader title="Deck Changes" />
        <div className="space-y-4">
          <div>
            <p className="text-xs text-zinc-600 mb-2">Added to deck</p>
            <div className="flex flex-wrap gap-2 mb-2">
              {state.deckAdded.map(c => (
                <Tag key={c} label={c} onRemove={() => removeDeckCard(c, 'added')} />
              ))}
            </div>
            <AddInput placeholder="Add card..." onAdd={card => addDeckCard(card, 'added')} />
          </div>
          <div>
            <p className="text-xs text-zinc-600 mb-2">Removed from deck</p>
            <div className="flex flex-wrap gap-2 mb-2">
              {state.deckRemoved.map(c => (
                <Tag key={c} label={c} onRemove={() => removeDeckCard(c, 'removed')} />
              ))}
            </div>
            <AddInput placeholder="Remove card..." onAdd={card => addDeckCard(card, 'removed')} />
          </div>
        </div>
      </section>

    </div>
  )
}
