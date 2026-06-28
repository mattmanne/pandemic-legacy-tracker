# Pandemic Legacy Tracker — Project Context for Claude

## What this is
A companion tool for a group playing Pandemic Legacy Season 0. Built to be shared with friends. The user (mmanne@hbs.edu) works on this intermittently; this file is the authoritative source for resuming work.

## Decisions made
| Decision | Value | Notes |
|----------|-------|-------|
| Game | Pandemic Legacy Season 0 | Cold War-era prequel; different mechanics from S1/S2/S3 |
| Spoiler policy | Strict: none | Tool must never surface content for months the group hasn't reached |
| Sharing target | Friends / public | Pushed to GitHub; GitHub Pages for hosting |
| Platform | Browser app | React, real-time sync via Firebase |
| Core feature scope | All of the above | Campaign log, state tracker, character tracker, rules reference |
| Multi-device | Yes — everyone on their own device | Real-time sync required |
| Backend/sync | Firebase (Firestore, free tier) | No server to manage; free tier sufficient |
| Hosting | GitHub Pages + Firebase | Frontend on Pages, data on Firebase |
| Frontend | React | Best Firebase ecosystem support |
| Testing | Vitest + Playwright | Unit/logic + end-to-end |
| UI theme | Dark | — |

## Stack
- **Frontend:** React
- **Backend:** Firebase (Firestore)
- **Testing:** Vitest (unit) + Playwright (e2e)
- **CI:** TBD — GitHub Actions once app is scaffolded

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

## Current status (as of 2026-06-28)
**Stack decided. In planning phase — writing requirements before building.**

- [x] GitHub setup complete — https://github.com/mattmanne/pandemic-legacy-tracker
- [x] Stack and architecture decided (see decisions.md)
- [ ] Requirements written (in progress)
- [ ] App scaffolded
- [ ] Features built (requirements-driven, test-first)
- [ ] GitHub Pages enabled once index.html exists

**Important:** Git identity is set at the project level only (`--local`). Do not change it to `--global` — user has separate HBS git account for other projects.

## Group details
- **Players:** Carlos, Jen, Michelle, Matt (4 players)
- **Characters:** TBD — user will add when available
- **Current month:** TBD — user will update as they play
- **Edit permissions:** Fully collaborative — all players can edit anything
- **Devices:** Phone + tablet (mobile-first responsive design)

## Season 0 notes
- Set in 1962, Cold War era.
- Players are operatives, not doctors.
- Mechanics differ from Season 1 — don't assume Season 1 rules apply.
- As the group plays, capture unlocked mechanics in `docs/game-reference.md`.
