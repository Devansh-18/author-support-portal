# BookLeaf Publishing — Frontend Client

The Single-Page Application (SPA) client for the **BookLeaf Author Support & Operations Portal**, built with **React 19** and **Vite**.

---

## Features

- **Dual Persona Workspaces**:
  - **Author Studio (`.theme-author`)**: Tactile literary manuscript paper aesthetic with warm parchment tones, editorial serif typography (*Playfair Display* / *Lora*), book catalog volume cards with spine accents, and a comprehensive royalty ledger statement.
  - **Operations Triage Desk (`.theme-admin`)**: High-density, airy triage dashboard with clean slate styling, real-time SLA metrics, streamlined ticket queue tables, and deep ticket triage inspection drawers.
- **Bi-directional URL State Sync**: Search filters, active tabs, and inspected ticket IDs synchronize with URL parameters via `useUrlState`.
- **Smart Near-Real-Time Synchronization**: Periodic background ticket syncing via `useTicketSync` with automatic tab visibility throttling.
- **Instant Evaluator 1-Click Login**: Test account switcher enabling one-click evaluation without typing credentials.
- **Strict Shared Contracts**: API communication conforms to `@author-support/contracts`.

---

## Local Development

From this directory:

```bash
# Start Vite development server (http://localhost:5173)
npm run dev

# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

Or from the monorepo root:

```bash
npm run dev:frontend
```
