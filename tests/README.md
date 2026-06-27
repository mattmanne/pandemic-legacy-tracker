# Testing

Testing infrastructure will be set up once the tech stack is chosen.

## Planned approach
- **Unit tests:** Core game logic (state transitions, calculations, validation)
- **Integration tests:** Feature flows (adding a scar, completing a month, etc.)
- **No UI snapshot tests:** Too brittle for a project that changes often

## Framework candidates
| Stack choice | Test framework |
|---|---|
| Plain JS | Jest or Vitest |
| React/Vue | Vitest + Testing Library |
| Other | TBD |

## Policy
- Tests live alongside source in `src/` where practical, or here for integration tests.
- No test is better than a wrong test — only test behavior, not implementation.
