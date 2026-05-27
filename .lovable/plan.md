# Eagle Claims Portal — build plan

A multi-tenant white-label baggage claims system on React 19 + TanStack Start + Tailwind 4 + shadcn/ui, with Lovable Cloud (Supabase) for data, auth, storage. Three surfaces, one tenant theming engine, real backend.

This is a large system. I'll build it in **four phases**, each phase shippable. After every phase you'll have something demo-able.

---

## Phase 0 — Foundation (1 build cycle)

Set up the bones everything else hangs off.

- **Brand & design system**: original Eagle Claims identity — deep teal-indigo primary, warm neutral surfaces, premium type pair (Geist or Space Grotesk display + Inter body). Full semantic token set in `src/styles.css` using `oklch`: `--color-primary`, `--color-primary-dark`, `--color-primary-light-bg`, `--color-surface`, `--color-surface-raised`, `--color-border`, `--color-text-primary`, `--color-text-muted`, `--color-success`, `--color-warning`, `--color-danger`, `--color-info`. Dark mode tokens. Status pill colours for all 8 claim states.
- **Tenant theming engine**: `[data-tenant="eagle|easyjet|skybridge"]` selectors on `<html>` override token values. `TenantProvider` reads tenant from subdomain/route param/localStorage and sets the attribute. Every component consumes `var(--color-*)` — zero hardcoded hex.
- **Motion + interactions**: install `motion` (motion-v's React equivalent). Spring presets for page transitions, panel slides, card hovers.
- **Lovable Cloud**: enable. Schema for `tenants`, `claims`, `claim_items`, `claim_photos`, `claim_notes`, `claim_status_history`, `airlines`, `users`/`user_roles`. RLS scoped by tenant + role. Storage bucket for evidence photos.
- **Auth**: email/password + Google. `user_roles` table (`passenger`, `eagle_staff`, `eagle_admin`, `airline_user`) using the security-definer `has_role` pattern. 2FA (TOTP) for staff.
- **Shared primitives**: status pill, tenant logo, KPI card, SLA countdown, skeleton loaders, empty state, toast system, app shell.

## Phase 1 — Passenger Portal (Surface 1)

The 5-step wizard, mobile-first at 390px.

- Public routes: `/`, `/claim/new` (wizard), `/track`, `/track/$claimId`.
- **Wizard shell**: sticky labelled progress bar, fixed bottom "Next" CTA, motion page transitions between steps, per-step Zod validation.
- **Step 1 — Find flight**: booking ref input with live format validation, auto-populate flight card from `airlines`/mock flight data; "I don't have my booking ref" fallback with manual fields.
- **Step 2 — Claim type**: 6 tappable cards, custom SVG illustrations, animated select state.
- **Step 3 — Item details**: conditional fields (suitcase type, 54-brand searchable combobox, colour, size, baggage tag, locks). Visual SVG suitcase diagram with tappable damage regions. Damage type multi-select chips.
- **Step 4 — Evidence**: 4 named upload slots with illustrated placeholders, native camera (`capture="environment"`), thumbnail preview, delete/replace, "Add more" extras. Uploads to Supabase Storage.
- **Step 5 — Review & submit**: collapsible summary, inline GDPR consent with 4 privacy facts, animated submit, confetti success, claim reference card, 4-step timeline.
- **Track claim**: claim ID + email lookup, status timeline, message thread from staff.
- **Language picker** in nav (English + 7 placeholder locales scaffolded via i18next).

## Phase 2 — Airline Dashboard (Surface 3) — the white-label proof

Authenticated, read-only, tenant-themed.

- Routes under `_authenticated/airline/*`. Route guard checks `airline_user` role + tenant binding.
- 4 KPI cards with sparklines (Recharts), claim trend bar chart (7/14/30d toggle, Damaged vs Lost), claim type horizontal bars, 3 SLA gauges with amber warning animation under 95%.
- Sortable/filterable/paginated claims table, row click → read-only detail drawer (no financials, no internal notes — route-protected, not just visually hidden).
- Export menu: CSV, JSON, PDF, email.
- API reference card (collapsible code block with bearer token example).
- "Read only" lock pill always in header.
- **Demo switcher**: tenant toggle (Eagle / easyJet orange / Skybridge navy) — instant re-brand via `data-tenant` swap, no reload.

## Phase 3 — Eagle Staff Console (Surface 2)

Filament-replacement built in React, Linear-dense.

- Routes under `_authenticated/staff/*`. Fixed dark sidebar (Overview / Claims / Reports / Settings / Admin), keyboard nav (`Cmd+K` command palette).
- Dashboard: KPI cards + sparklines + claims table.
- Claims table: ref badge, airline badge, passenger, type, status, SLA countdown (green >24h / amber 8–24h / red <8h pulsing), assigned handler. Bulk actions.
- **Slide-in detail panel** (no page reload) — tabs: Details / Timeline / Notes / Photos / Financials.
- **Status machine**: 8 states with strict valid-transitions enforced in DB (CHECK + trigger) and UI.
- Notes: append-only, markdown, timestamped, user-attributed (DB-enforced immutability).
- Financials tab: route-protected, only `eagle_staff`/`eagle_admin` roles see it.
- Decision letter composer: multilingual templates, live preview, PDF export.
- Audit trail: immutable `audit_log` table, viewable per claim.
- 2FA enrolment onboarding flow.

---

## Tech notes (read if curious)

- **Stack delta from your brief**: Vue/Inertia → React 19 + TanStack Start. Laravel/Filament → Lovable Cloud server functions + custom React staff console. shadcn-vue → shadcn/ui. motion-v → `motion` for React. All UX, design, theming, status machine, RLS scoping, and white-label proof translate 1:1.
- **State machine** enforced in Postgres via a `status_transitions` lookup table + `BEFORE UPDATE` trigger on `claims`, so invalid transitions are rejected even if a client tries.
- **Tenant scoping**: every domain table has `tenant_id`; RLS uses `has_role()` + `tenant_id = current_tenant()` security-definer helpers.
- **Storage**: signed URLs for photos; passengers can only read photos on their own claim, staff scoped by tenant.
- **i18n**: scaffold 8 locales (EN, ES, FR, DE, IT, PL, HU, NL) with EN copy in all; real translation later.
- **PWA**: manifest + service worker added in Phase 1 so passenger portal installs on mobile.
- **Filament gap**: there is no Filament in React. Phase 3 rebuilds equivalent functionality (resource tables, slide-overs, audit, RBAC, 2FA) using shadcn/ui + TanStack Query + custom slide-over.

## What you'll see after each phase

1. Themeable design system with Eagle + 2 tenant skins switchable live.
2. Passenger wizard end-to-end, real submissions stored in Cloud, photos in Storage, trackable.
3. Airline dashboard with live tenant swap — the £6.4m commercial proof point.
4. Full staff console handling 200+ claims/day with the strict status machine.

## Where I'll start

**Phase 0 + Phase 1 in the first build pass.** That gives you the design system, tenant engine, Cloud schema, auth, and a complete working passenger wizard with real backend — enough to demo the core experience. Then Phase 2, then Phase 3 in subsequent passes.

Approve to start Phase 0 + 1, or tell me to reorder / drop scope first.
