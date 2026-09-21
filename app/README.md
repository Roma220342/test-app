# Partner Management — Wonderline LOD Prototype

Clickable React + Tailwind prototype of the redesigned Partner Management
screen. Fully mocked data, no backend.

## Run it

```bash
npm install
npm run dev
```

Open the printed local URL (usually http://localhost:5173). Best viewed at
1280px width or wider (desktop-only tool, per spec).

## What's implemented

Every screen/state from Section 4 of the spec: stat-card filters, search,
sort, collapsible filter panel with removable chips, hover/loading/empty
states, the "⋮" card menu, a right-side detail panel, a shared create/edit
form with blur-based validation and a duplicate-code banner, bulk selection
with a floating action bar (Activate/Deactivate/Export CSV/Delete), a shared
destructive-delete confirmation modal, and a redesigned grouped left nav
(only "Partner Management" is a working page — the rest are static, per the
project decision log).

All data lives in `src/data/mockData.js` and resets on every page reload.
