## What I'll build

### 1. Landing page redesign — "Editorial serif" direction

Rebuild `src/routes/index.tsx` to match the selected v2 prototype exactly. Composition, density, hierarchy and motion register all stay faithful to the chosen direction.

**Typography (added to `src/styles.css`):**
- Add Google Font import: `Instrument Serif` (display) — Inter stays as body.
- New token `--font-serif: "Instrument Serif", Georgia, serif;` exposed via `@theme`.

**Header (fixed, replaces current quirky version):**
- Single wordmark only — fixes the duplicated "Eagle Claims · Eagle Claims" bug.
- Backdrop-blur translucent bar with a hairline border tinted in primary.
- Right side: language picker + "Track a claim" ghost link.

**Hero (centered, single column, max-w-2xl):**
- Small uppercase pill: "Official airport partner" in primary tint.
- H1 in Instrument Serif, two lines, italic primary accent on "beautifully simple."
- 16–18 word muted subhead.
- Primary CTA (filled teal, arrow icon) + Secondary CTA (white outlined teal) — both full-width up to `max-w-sm`, stacked.
- Trust row: three minimal icon+label items (3 min, Secure, 8 languages), low-opacity, no pills — quieter than current chips.

**How it works (timeline, replaces current 4-step row):**
- Section heading in serif, 12px primary divider.
- Three steps along a vertical gradient line (primary → fade):
  1. Verify flight
  2. Snap & describe
  3. Instant resolution (final step uses solid primary tile with checkmark)
- Each step: 64×64 rounded tile + serif/sans heading + muted body.

**Footer:** keep current minimal footer (copyright + privacy/sub-processors).

**Motion (Motion for React, reduced-motion guarded):**
- Hero fade-up (existing pattern).
- CTA hover lift 1px + arrow `translate-x-0.5`.
- No other animations — matches the calm register.

**Tokens, not hex:**
- All teal usages go through `var(--color-primary)` / `bg-primary` / `text-primary` / `border-primary/10` — no hardcoded `#1A6B5A` in the JSX. The prototype's literal hex values are translated to existing semantic tokens.

### 2. New `/sitemap` route — full navigation index

Create `src/routes/sitemap.tsx`. Single-purpose internal page listing every route in the app, grouped by audience. Same editorial-serif styling so it doesn't feel like a separate app.

**Groups:**
- **Passenger** — `/` (landing), `/claim/new` (start a claim wizard), `/track` (track lookup), `/track/$claimId` (sample tracking detail, linked with the demo ref `EC-7A4F2B`).
- **Airline / B2B** — `/airline` (airline marketing page).
- **Staff console** — `/staff/login`, `/staff/dashboard` (with note: "Dashboard / Claims / Reports / Settings live inside this single route as tabs").
- **Meta** — `/sitemap` (this page).

Each entry: route path in mono, title, one-line description, and a "Open" link button. Plus a small "Tender demo flow" callout at the top suggesting the recommended click order for the 12 June 2026 demo (Landing → Start a claim → Track → Staff login → Dashboard).

A discreet "Sitemap" link is added to the landing page footer so the demo presenter can reach it in one click, without affecting the passenger experience.

### Files touched

- `src/styles.css` — add Instrument Serif import + `--font-serif` token.
- `src/routes/index.tsx` — full rewrite to v2 direction, token-based colors.
- `src/routes/sitemap.tsx` — new file.
- `src/routes/__root.tsx` — no edits expected; the TanStack plugin auto-registers the new route on next build.

### Out of scope

- No changes to the claim wizard, track, airline, or staff routes.
- No new tenant/brand logic, no new dependencies, no copy changes to other screens.
- Sample tracking ref shown on `/sitemap` is read-only — no data wiring beyond a `<Link>`.
