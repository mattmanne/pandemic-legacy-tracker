# Architecture & Design Decisions

Log significant decisions here as they're made. Format: date, decision, reason.

---

## 2026-06-27 — Project initialized
- Game: Pandemic Legacy Season 0
- Spoiler policy: strict none — tool never surfaces unreached content
- Sharing: will be pushed to GitHub; hosting TBD
- Platform and feature scope: TBD (pending group discussion)

## 2026-06-28 — Stack and architecture decided
- **Core use case:** All of the above — campaign log, state tracker, character/player tracker, rules reference
- **Multi-device:** Yes — everyone on their own device, real-time sync required
- **Platform:** Browser app
- **Backend/sync:** Firebase (Firestore, free Spark tier) — chosen for real-time sync, no cost, no server to manage
- **Hosting:** GitHub Pages (frontend) + Firebase (data layer)
- **Frontend framework:** React
- **Testing:** Vitest (unit/logic) + Playwright (end-to-end)
- **UI theme:** Dark
- **Reasoning:** Firebase free tier is sufficient for a small group; React has the best Firebase ecosystem support; GitHub Pages is free for public repos
