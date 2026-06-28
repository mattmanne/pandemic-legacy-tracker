import { useState, useEffect } from 'react'
import { useCharacters, PLAYERS } from '../hooks/useCharacters'

function EditableField({ value, placeholder, onSave, label }) {
  const [local, setLocal] = useState(value ?? '')

  useEffect(() => setLocal(value ?? ''), [value])

  return (
    <input
      value={local}
      onChange={e => setLocal(e.target.value)}
      onBlur={() => { if (local !== (value ?? '')) onSave(local) }}
      placeholder={placeholder}
      aria-label={label}
      className="w-full bg-gray-700 text-white text-sm rounded px-2 py-1 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
    />
  )
}

function Tag({ label, onRemove }) {
  return (
    <span className="flex items-center gap-1 bg-gray-700 text-gray-200 text-xs rounded px-2 py-0.5">
      {label}
      <button
        onClick={onRemove}
        aria-label={`Remove ${label}`}
        className="text-gray-400 hover:text-white leading-none"
      >
        ×
      </button>
    </span>
  )
}

function AddForm({ placeholder, onAdd }) {
  const [value, setValue] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!value.trim()) return
    onAdd(value.trim())
    setValue('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-1">
      <input
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-gray-700 text-white text-xs rounded px-2 py-1 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="bg-gray-600 hover:bg-gray-500 text-white text-xs rounded px-2 py-1"
      >
        +
      </button>
    </form>
  )
}

function RelationshipInput({ targetName, value, onSave }) {
  const [local, setLocal] = useState(value ?? '')

  useEffect(() => setLocal(value ?? ''), [value])

  return (
    <div className="flex items-center gap-2">
      <span className="text-gray-400 text-xs w-16 shrink-0">{targetName}</span>
      <input
        value={local}
        onChange={e => setLocal(e.target.value)}
        onBlur={() => { if (local !== (value ?? '')) onSave(local) }}
        placeholder="Relationship…"
        className="flex-1 bg-gray-700 text-white text-xs rounded px-2 py-1 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
    </div>
  )
}

function CharacterCard({ player, character, allPlayers, onUpdate, onAddUpgrade, onRemoveUpgrade, onAddScar, onRemoveScar, onSetRelationship }) {
  const others = allPlayers.filter(p => p.id !== player.id)

  return (
    <div className="bg-gray-800 rounded-lg p-4 space-y-3">
      <h2 className="text-white font-semibold">{player.name}</h2>

      <div className="space-y-2">
        <EditableField
          value={character.characterName}
          placeholder="Character name"
          label={`${player.name} character name`}
          onSave={v => onUpdate('characterName', v)}
        />
        <EditableField
          value={character.role}
          placeholder="Role / class"
          label={`${player.name} role`}
          onSave={v => onUpdate('role', v)}
        />
      </div>

      <div className="space-y-1">
        <p className="text-gray-400 text-xs uppercase tracking-wide">Upgrades</p>
        <div className="flex flex-wrap gap-1">
          {character.upgrades.map(u => (
            <Tag key={u} label={u} onRemove={() => onRemoveUpgrade(u)} />
          ))}
        </div>
        <AddForm placeholder="Add upgrade" onAdd={onAddUpgrade} />
      </div>

      <div className="space-y-1">
        <p className="text-gray-400 text-xs uppercase tracking-wide">Scars</p>
        <div className="flex flex-wrap gap-1">
          {character.scars.map(s => (
            <Tag key={s} label={s} onRemove={() => onRemoveScar(s)} />
          ))}
        </div>
        <AddForm placeholder="Add scar" onAdd={onAddScar} />
      </div>

      <div className="space-y-1">
        <p className="text-gray-400 text-xs uppercase tracking-wide">Relationships</p>
        <div className="space-y-1">
          {others.map(other => (
            <RelationshipInput
              key={other.id}
              targetName={other.name}
              value={character.relationships?.[other.id] ?? ''}
              onSave={desc => onSetRelationship(other.id, desc)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function CharactersPage() {
  const {
    characters, loading, error,
    updateCharacter, addUpgrade, removeUpgrade, addScar, removeScar, setRelationship,
  } = useCharacters()

  if (loading) return <p className="p-4 text-gray-400">Loading...</p>
  if (error) return <p className="p-4 text-red-400">Error loading characters.</p>

  return (
    <div className="p-4 space-y-4 max-w-2xl mx-auto">
      {PLAYERS.map(p => (
        <CharacterCard
          key={p.id}
          player={p}
          character={characters[p.id]}
          allPlayers={PLAYERS}
          onUpdate={(field, value) => updateCharacter(p.id, field, value)}
          onAddUpgrade={u => addUpgrade(p.id, u)}
          onRemoveUpgrade={u => removeUpgrade(p.id, u)}
          onAddScar={s => addScar(p.id, s)}
          onRemoveScar={s => removeScar(p.id, s)}
          onSetRelationship={(targetId, desc) => setRelationship(p.id, targetId, desc)}
        />
      ))}
    </div>
  )
}
