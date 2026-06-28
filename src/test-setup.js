import '@testing-library/jest-dom'

// Node.js 22+ exposes localStorage as a configurable getter that returns undefined
// unless --localstorage-file is provided. Replace it with a working in-memory mock.
const store = {}
Object.defineProperty(globalThis, 'localStorage', {
  value: {
    getItem: k => Object.hasOwn(store, k) ? store[k] : null,
    setItem: (k, v) => { store[k] = String(v) },
    removeItem: k => { delete store[k] },
    clear: () => { for (const k in store) delete store[k] },
    get length() { return Object.keys(store).length },
    key: i => Object.keys(store)[i] ?? null,
  },
  writable: true,
  configurable: true,
})
