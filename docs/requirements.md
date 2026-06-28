# Requirements — Pandemic Legacy Season 0 Tracker

Last updated: 2026-06-28

---

## Global requirements

- **Dark theme** throughout — no light mode
- **Mobile-first responsive** — optimized for phone and tablet
- **Real-time sync** — all players see updates instantly via Firebase; no manual refresh needed
- **Spoiler policy** — content for future months is never shown; only unlocked content is visible
- **Fully collaborative** — any of the 4 players can edit any part of the app; no roles or permissions
- **Single campaign** — one shared game state for the group (no multi-campaign support needed)
- **No accounts/login** — players access via a shared URL; identity is selected on first visit (Carlos, Jen, Michelle, Matt)

---

## Feature 1: Campaign Log

Record what happened each session.

### Requirements
- F1.1 — A player can log a completed session: month number, date played, win or loss, and optional notes
- F1.2 — All logged sessions are displayed in reverse chronological order
- F1.3 — A player can edit or delete any session log entry
- F1.4 — Win/loss record is shown as a summary (e.g. "3W / 1L")

---

## Feature 2: Campaign State Tracker

Track the current state of the campaign between sessions.

### Requirements
- F2.1 — Track the current month number (1–12)
- F2.2 — Track the funding track value (numeric)
- F2.3 — Track the outbreak count for the current game
- F2.4 — Track which cities have stickers placed (city name + sticker type); sticker types are added by players as unlocked
- F2.5 — Track which funded events are currently active
- F2.6 — Track which cards have been added to or removed from the player deck
- F2.7 — All state fields are editable by any player
- F2.8 — Changes sync in real time across all devices

---

## Feature 3: Character & Player Tracker

Track each player's character across the campaign.

### Requirements
- F3.1 — Four player slots: Carlos, Jen, Michelle, Matt
- F3.2 — Each player has a character name (set by the player; editable)
- F3.3 — Each character has a role/class (set by the player; editable)
- F3.4 — Track upgrades/abilities unlocked for each character
- F3.5 — Track scars assigned to each character
- F3.6 — Track relationships between characters (Season 0 mechanic; pairs and relationship status)
- F3.7 — Each player's section is visible to all; editable by any player

---

## Feature 4: Rules Reference

A living reference of mechanics the group has unlocked.

### Requirements
- F4.1 — Display a list of unlocked rules/mechanics, organized by category
- F4.2 — Any player can add a new rule entry (name + description)
- F4.3 — Any player can edit or delete a rule entry
- F4.4 — No content is pre-populated — the group adds rules as they unlock them (strict spoiler policy)
- F4.5 — Rules are searchable by keyword

---

## Feature 5: Navigation & Shell

The app shell that holds all four features together.

### Requirements
- F5.1 — Bottom navigation bar on mobile (phone); sidebar or top nav on tablet
- F5.2 — Four nav destinations: Campaign Log, State, Characters, Rules
- F5.3 — Player identity is selected once on first visit and stored locally (no account needed); can be changed in settings
- F5.4 — Active player identity is shown in the header
- F5.5 — App loads and is usable within 3 seconds on a typical mobile connection

---

## Out of scope (for now)
- Multiple campaigns
- User accounts / authentication
- Push notifications
- Offline mode
- Export / print
- Light mode

---

## Open items (need game content to finalize)
- Character names and roles — Matt will add when available
- Specific city names for the Season 0 map
- Sticker types — added as the group unlocks them
- Funded event names — added as unlocked
- Relationship mechanic details — needs Season 0 rules clarification
