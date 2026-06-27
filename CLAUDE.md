# Pandemic Legacy Tracker — Project Context for Claude

## What this is
A companion tool for a group playing Pandemic Legacy Season 0. Built to be shared with friends. The user (mmanne@hbs.edu) works on this intermittently; this file is the authoritative source for resuming work.

## Decisions made
| Decision | Value | Notes |
|----------|-------|-------|
| Game | Pandemic Legacy Season 0 | Cold War-era prequel; different mechanics from S1/S2/S3 |
| Spoiler policy | Strict: none | Tool must never surface content for months the group hasn't reached |
| Sharing target | Friends / public | Will be pushed to GitHub; hosting TBD |
| Platform | **TBD** | User will decide with group — likely a browser-based web app |
| Core feature scope | **TBD** | User will decide with group |

## Open questions (decide with user + group before building)
1. **Platform** — Browser app (recommended for shareability), downloadable static page, or other?
2. **Core use case** — Campaign state tracker? Character/player tracker? End-of-game log? Rules reference? All of the above?
3. **Hosting** — GitHub Pages (free, easy) is the natural fit for a static web app. Confirm when platform is settled.
4. **Multi-device** — Do all players use one shared device at the table, or each on their own? Affects whether we need sync/backend.
5. **Tech stack** — Once platform is decided, choose framework (plain HTML/JS, React, Vue, etc.) and testing framework (Jest, Vitest, Playwright, etc.)

## Stack (fill in when decided)
- **Frontend:** TBD
- **Backend:** Likely none (client-side only preferred for simplicity)
- **Testing:** TBD — see `tests/README.md`
- **CI:** TBD — GitHub Actions once pushed to GitHub

## Folder structure
```
pandemic-legacy-tracker/
├── CLAUDE.md              # This file — project context for Claude
├── README.md              # User-facing overview
├── .gitignore
├── docs/
│   ├── game-reference.md  # Season 0 mechanics captured as group plays (no spoilers)
│   └── decisions.md       # Architecture/design decisions log
├── src/                   # App source (created when stack is decided)
└── tests/
    └── README.md          # Testing philosophy and approach
```

## Conventions
- **No spoilers:** Never add content, copy, or logic that references future months. The group fills in what they've unlocked as they play.
- **User-facing text:** Simple, concise, precise. No filler words.
- **Commits:** Small, descriptive. One logical change per commit.
- **Documentation:** Keep this file current. If a decision gets made, move it from "open questions" to "decisions made."

## How to resume work
1. Read this file top to bottom.
2. Check `docs/decisions.md` for any architecture choices logged since this file was last updated.
3. Check git log (`git log --oneline -20`) for recent work.
4. Ask the user what they want to tackle next.

## Season 0 notes
- Set in 1962, Cold War era.
- Players are operatives, not doctors.
- Mechanics differ from Season 1 — don't assume Season 1 rules apply.
- As the group plays, capture unlocked mechanics in `docs/game-reference.md`.
