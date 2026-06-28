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
├── CLAUDE.md
├── README.md
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── playwright.config.js
├── .env.example            # Copy to .env.local and fill in Firebase values
├── docs/
│   ├── decisions.md
│   ├── requirements.md
│   └── game-reference.md
├── src/
│   ├── main.jsx            # React entry point (HashRouter)
│   ├── App.jsx             # App shell, routing, responsive layout
│   ├── App.test.jsx
│   ├── PlayerContext.jsx   # Player identity — stored in localStorage
│   ├── PlayerContext.test.jsx
│   ├── PlayerPicker.jsx    # First-visit modal to choose player
│   ├── PlayerPicker.test.jsx
│   ├── firebase.js         # Firebase init (reads from .env.local)
│   ├── index.css           # Tailwind base + dark theme
│   └── test-setup.js       # localStorage mock + jest-dom
└── tests/
    ├── README.md
    └── e2e/
        └── smoke.spec.js   # Playwright smoke tests
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
**In progress: Phase 2 — Campaign State Tracker. Blocked on Firebase setup.**

### Build phases
- [x] Phase 0 — Scaffold (React + Vite + Firebase + Vitest + Playwright + Tailwind, dark theme, routing shell)
- [x] Phase 1 — App shell & navigation (player picker, responsive layout, bottom nav / sidebar)
- [ ] **Phase 2 — Campaign State Tracker** ← next
- [ ] Phase 3 — Character & Player Tracker
- [ ] Phase 4 — Campaign Log
- [ ] Phase 5 — Rules Reference

### Test suite
- **18 unit tests** passing (Vitest + happy-dom)
- **15 e2e tests** passing (Playwright — mobile Chrome, mobile Safari, tablet)

### Firebase setup — INCOMPLETE
User needs to finish this before Phase 2 real-time sync can work.
Steps completed:
- [x] Firebase project created at console.firebase.google.com (with Google Analytics — fine)
- [ ] Add web app to project (click </> icon on Project Overview page)
- [ ] Enable Firestore database (Build → Firestore Database → Create database → test mode)
- [ ] Copy config values into `.env.local` (copy from `.env.example`)

Resume Firebase setup: user left off needing to find "Project Overview" in the left sidebar to get to the platform icon screen.

### Other
- [x] GitHub repo live — https://github.com/mattmanne/pandemic-legacy-tracker
- [x] Requirements documented — docs/requirements.md
- [ ] GitHub Pages enabled (deferred until app is ready to share)

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
