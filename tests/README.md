# Testing

## Stack
- **Unit / component tests:** Vitest + React Testing Library — live in `src/` alongside source files (`*.test.jsx`)
- **End-to-end tests:** Playwright — live here in `tests/e2e/`

## Running tests

```bash
# Unit tests (run once)
npm test

# Unit tests (watch mode)
npm run test:watch

# E2E tests (requires browsers — install once with: npx playwright install)
npm run test:e2e

# E2E tests with UI
npm run test:e2e:ui
```

## Policy
- Test behavior, not implementation.
- No snapshot tests — too brittle for a project that changes often.
- Each feature ships with tests before the feature is considered done.
