# Spec for Claude Code: Partner Management Screen Redesign
### Wonderline LOD (Loyalty on Demand) Project · MUI Console

---

## 0. Project Context (background for Claude Code — not an action item)

Wonderline sells a loyalty platform called LOD (Loyalty on Demand). Its flagship client is Shell, with ~9M active customers. The product is ~20 years old, built as a bespoke Java system, and is now being productized for the wider market. The MUI (Management User Interface) is a web admin console used by **the client's own staff** (Shell's teams) — not by Wonderline, and not by end consumers.

The core pain point across the whole product (from the research dossier): **non-technical marketers need to self-serve a complex system without IT support**. The UI "looks 20 years old," the brand red is used indiscriminately everywhere (CTA = selected state = error, all one color), and the navigation is a ~50-item jargon-heavy list.

This document covers the **Partner Management** screen — a separate module within the same project (not the same scope as the main trial wizard: Target→Trigger→Validity→Benefit→Offer Details — but the same system, the same user persona, and the same design principles).

**Reference materials provided alongside this prompt:**
- `Screen_1.jpg` — the current live Partner Management screen (what we're redesigning)
- `Ref/01.png` — example of sparing, functional use of an accent color
- `Ref/02.png` — example of a clean grid with thin separator borders, no visual clutter (structure like `public | logic`)
- `Ref/03.png` — example of card/layout composition and spacing

---

## 1. User and Scenarios

**Persona:** a non-technical Marketing/Ops Manager on the client side (Shell or another brand on LOD). The same user type as in the main wizard flow — not a separate role.

**Usage scenarios (both equally important, design for both):**
1. **Finding a known partner** — quickly locate a specific record via search/filters.
2. **Browsing and creating a new partner** — scan the list, assess the state of the partner network, add a new record.

**Device:** desktop only, internal enterprise tool. Minimum supported width — **1280px**. Mobile/tablet adaptation is out of scope.

---

## 2. Design Principles (inherited from the research — apply here too)

These are the same principles that shaped the design direction for the whole Wonderline project, and they apply to this screen as well:

- **Calm by default** — color carries meaning, not decoration. Brand red is reserved **only** for the primary CTA and genuine errors/critical statuses. It must **not** be used decoratively for a partner-type tag ("INTERNAL") or a stat icon — that's the exact problem ("selected/label read as an error") already flagged as the top pain point elsewhere in this product.
- **Show the consequence, live** — if there are counters (397/371/26/37), they must be functional, not decorative.
- **Progressive disclosure** — filters and secondary information stay hidden until needed; they shouldn't permanently occupy screen space.
- **Enterprise-credible, not sterile** — thin separator borders instead of heavy shadows (Ref 02), generous whitespace between sections (Ref 03).
- **Every clickable thing looks clickable** — no element with an undefined state. Explicit hover / focus / active / disabled states on every interactive element.

---

## 3. Design Decisions (decision log)

Below are the decisions made for items that required judgment, with brief reasoning. Claude Code should implement exactly this unless a future delta prompt says otherwise.

| # | Decision | Reasoning |
|---|---|---|
| Filter reset | Active filters render as **chips** below the filter bar, each with its own "✕", plus a "Clear all" button | The clearest pattern for multiple simultaneous active filters; matches the user's stated preference |
| Partner statuses | `Active` (green) · `Inactive` (neutral gray) · `Pending Review` (amber) · `Suspended` (red — the one legitimate use of red here) | Standard set for a B2B partner/vendor directory; distinguishes "manually turned off" from "needs attention" — something the current binary Active-only state can't do |
| Card field priority | Primary: partner name, type (Internal/External), status. Secondary (collapsed by default, visible in the side panel): BMO/Web/Gift configuration | These are configuration metadata, not identifying info — not needed for scanning the list at a glance, only relevant once details are opened |
| Bulk actions | `Activate` · `Deactivate` · `Export CSV` · `Delete` (with confirmation) via checkboxes on cards + a floating action bar at the bottom | Standard set for this kind of directory screen (mirrors "Bulk Revoke" on the Campaign Config screen) |
| Card click | Opens a **side panel (drawer)** on the right; the list stays in place | Direct user requirement — don't lose list context |
| Logo fallback | A colored avatar with the partner's initials (color deterministically generated from the name) when no image is uploaded | Removes the inconsistency between "real logo" and "gray building icon placeholder" seen on the current screen |
| Empty states | (a) Nothing at all → CTA "Add your first partner"; (b) zero results after filter/search → message + "Clear filters" button | Both need to exist by default — without them Claude Code will improvise |
| Creation errors | Inline field validation (on blur, not on keystroke) + a top-level toast/banner for conflicts (e.g. duplicate Partner Code) | Matches the "blur-based inline validation" pattern from the research — avoids a "wall of red" |
| Left navigation | **In scope.** Apply the same grouped, plain-language nav concept mentioned as a "next step" in the research, using the same visual style as the rest of the screen | User confirmed this is in scope for this spec |
| Stack | React (functional components + hooks) + Tailwind CSS, fully mocked data (no backend), runs locally (`npm run dev`) | Lowest-effort path to a fully clickable prototype; matches the "whatever's simplest" requirement |

---

## 4. Full List of Screens/States to Build

The prototype is only considered complete when **every** item below is clickable and actually works against mock data (not a static picture):

### 4.1 Main list
- [ ] Default state showing the partner list (card grid)
- [ ] Stat bar at the top — **every card is clickable** and applies the matching filter (Total → clears type filter, External/Internal/Active → applies that filter)
- [ ] Working search (live filtering by both ID and name simultaneously)
- [ ] Expand/collapse the filter block
- [ ] Active filters as chips + individual removal + "Clear all"
- [ ] Sorting (at minimum: by name, creation date, status)
- [ ] Hover state on a partner card
- [ ] Checkbox selection mode (for bulk actions) + floating action bar at the bottom with the active bulk actions
- [ ] Empty state — zero partners at all
- [ ] Empty state — zero results for the current filter/search
- [ ] Loading state (skeleton cards)
- [ ] "⋮" dropdown menu on a card (Edit / Duplicate / Deactivate / Delete) with hover states on each item

### 4.2 Side panel (partner details)
- [ ] Opens on the right when a card is clicked; the list stays visible behind/beside it
- [ ] Full partner info: logo, name, code, type, status, BMO/Web/Gift configuration
- [ ] Action buttons inside the panel (Edit, Deactivate/Activate, Delete) with hover/active states
- [ ] Close states (click outside, ✕ button, Esc)

### 4.3 Create partner
- [ ] Creation form (modal or side panel — pick whichever is consistent with the partner details panel)
- [ ] All fields with inline (blur-based) validation
- [ ] Error state — duplicate Partner Code (banner + field highlight)
- [ ] Successful creation state (toast/confirmation + the new record appears in the list without a reload)
- [ ] "In progress" state (disabled submit until required fields are filled)

### 4.4 Bulk actions
- [ ] Selecting multiple cards
- [ ] Floating action bar with an "N selected" counter + Activate/Deactivate/Export/Delete buttons
- [ ] Confirmation modal for Delete (destructive action)
- [ ] Toast after a bulk action completes

### 4.5 Navigation
- [ ] Left navigation reworked: grouped sections with human-readable names instead of a flat jargon list, using the same separator/visual style as the rest of the content

---

## 5. Design Tokens (baseline, pending final rebrand)

The colors from the research are flagged as "verify vs rebrand" — implement them as CSS variables (`:root`) so they can be swapped easily once the rebrand lands:

```css
--surface: #FFFFFF;
--ink: #141417;
--ink-soft: #3A3A40;
--border: #E4E4E7; /* thin separator, Ref 02 style */
--accent: /* brand red — CTA/primary action ONLY */;
--status-active: #1E9E62;
--status-inactive: #8A8A93;
--status-pending: #B8860B;
--status-suspended: /* same as --accent, the one legitimate use of red as a status */;
```

Typography: clean enterprise sans (Inter or IBM Plex Sans), tabular figures (`font-variant-numeric: tabular-nums`) for any numeric columns/counters.

Layout: thin separator borders instead of box-shadow (Ref 02), generous spacing between sections (Ref 03), accent color used on only 1-2 elements on screen at once (Ref 01).

---

## 6. Technical Implementation Requirements

- **Stack:** React + Tailwind CSS, no TypeScript required (Claude Code can decide if it speeds up generation — the main requirement is that `npm install && npm run dev` brings up a working local prototype).
- **Data:** fully mocked, in a separate file (e.g. `mockData.js`) with ~15-20 partner records covering every status and both partner types, including at least one partner with no logo (to exercise the fallback avatar).
- **State:** React state (useState/useReducer) — no real backend, no localStorage/API calls.
- **Components:** custom Tailwind components in the spirit of the reference images (not a heavy UI library) — simple, reusable, with every state (default/hover/active/disabled/loading) explicitly defined.
- **Icons:** Lucide or Phosphor.

---

## 7. Definition of Done

The prototype is complete when:
1. Every item in Section 4 is clickable and functionally works against mock data (not just drawn).
2. No UI element carries color without functional meaning — red appears only on the primary CTA and the Suspended status.
3. Empty, error, and loading states are implemented, not just the happy path.
4. The side panel never breaks the list's context (the list stays visible/reachable).
5. The prototype runs locally with a single command and is fully navigable by mouse alone, with no dev console needed.

---

*Document prepared from: Wonderline_Research_Dossier, 01_next_call, 02_pain_points, 03_condensed_research, and the decisions agreed with the project's designer in conversation.*
