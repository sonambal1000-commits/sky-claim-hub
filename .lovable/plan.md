## Goal

Replace the current `src/routes/index.tsx` with a calm, single-purpose landing page that gets a stressed passenger from "I landed" → "tap Start a claim" in under 2 seconds. Mobile-first, scaled up for desktop with more whitespace (never a two-column app-shot hero).

## Scope

- Only edits `src/routes/index.tsx` (page) and adds one minimal header variant inline (don't touch the existing `AppHeader` — it carries tenant/theme controls used elsewhere). The landing page renders its own quiet header per the brief.
- No changes to routing, tenant provider, or design tokens. Brand colour comes from existing `var(--color-primary)`. The brief's `#FF6600` is already the easyJet tenant skin — we keep it themeable, not hardcoded.

## Layout

1. **Header (sticky, quiet, ~56px)**
   - Left: `EagleLogo` + small "Eagle Claims" wordmark.
   - Right: `LanguagePicker` (existing) + ghost text link "Track a claim" → `/track`.
   - No nav, no tenant switcher, no theme toggle on this page.

2. **Hero (centered, full first viewport, max-w ~640px on desktop)**
   - Soft radial glow background using `var(--color-primary)` at low opacity, plus a single light line-icon (Lucide `Plane`, 1.25 stroke, muted) floating above the headline.
   - H1 display, large, tight leading, balanced:
     "Baggage claims," / **"beautifully simple."** (second line in `text-primary`).
   - Sub: muted, ~16 words: "Damaged or missing bag? We'll guide you through it — calm, in about 3 minutes."
   - Primary CTA: full-width on mobile, auto on desktop, ≥56px, brand-filled, `rounded-2xl`, `shadow-elegant`, label "Start a claim" + `ArrowRight` that translates on hover.
   - Secondary: ghost text button directly below — `Search` icon + "Track an existing claim". No border, no fill; underline on hover. Visually subordinate.
   - Trust chips row: three small muted pills — `Clock` "3 min", `ShieldCheck` "Secure", `Globe` "8 languages". Single row, centered, neutral colours only.

3. **How it works (below the fold, calm strip)**
   - Section heading small + muted ("How it works").
   - 4 numbered steps in a single horizontal row on desktop, stacked on mobile. Each: tiny circled numeral, light Lucide icon (`Plane`, `HelpCircle`, `Camera`, `CheckCircle`), short label + one line of copy. No cards, no borders — just rhythm and whitespace. Separator dots between on desktop.

4. **Footer (one line, whisper)**
   - "© Eagle Claims · Powered by Eagle Claims" + tiny links Privacy · Sub-processors. Centered, muted.

## Visual rules

- Brand colour appears only in: the "beautifully simple." word, the primary button, and the soft radial glow. Everything else neutral (`foreground` / `muted-foreground` / `border`).
- Generous vertical rhythm: hero section uses `min-h-[calc(100svh-56px)]` with content centered.
- All colours via tokens (`bg-primary`, `text-primary`, `text-muted-foreground`, `border-border`). No hex.
- Dark mode: works automatically via existing tokens; verify glow opacity reads on dark.

## Motion

- Hero content: single staged fade-up via Motion (`initial opacity:0 y:8` → spring), reduced-motion guarded by `useReducedMotion()`.
- Primary button: hover lifts 1px, arrow translates +2px; tap scales 0.98.
- Nothing else animates.

## Accessibility

- Semantic `<header> <main> <section> <footer>`, one `<h1>`.
- All tap targets ≥44px (CTAs already ≥56px; secondary link gets `py-3 px-4`).
- Visible focus rings via existing `ring` token.
- `aria-label` on icon-only header items; trust chips marked `aria-hidden` decorations with text remaining readable.

## Out of scope

- No new routes, no tenant logic changes, no token edits, no new dependencies (Motion + Lucide already in project).
- Existing routes (`/claim/new`, `/track`, `/staff/*`, `/airline`) untouched.
