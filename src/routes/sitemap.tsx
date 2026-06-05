import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/sitemap")({
  head: () => ({
    meta: [
      { title: "Sitemap — Eagle Claims" },
      { name: "description", content: "Every route in the Eagle Claims demo, grouped by audience." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SitemapPage,
});

type Entry = {
  path: string;
  title: string;
  desc: string;
  to: string;
  params?: Record<string, string>;
};

type Group = { label: string; entries: Entry[] };

const GROUPS: Group[] = [
  {
    label: "Passenger",
    entries: [
      { path: "/", title: "Landing", desc: "Calm front door — start or track a claim.", to: "/" },
      {
        path: "/claim/new",
        title: "Start a claim",
        desc: "Five-step wizard: flight, type, details, evidence, review.",
        to: "/claim/new",
      },
      { path: "/track", title: "Track a claim", desc: "Look up an existing claim by reference.", to: "/track" },
      {
        path: "/track/$claimId",
        title: "Tracking detail (demo)",
        desc: "Sample timeline view — demo ref EC-7A4F2B.",
        to: "/track/$claimId",
        params: { claimId: "EC-7A4F2B" },
      },
    ],
  },
  {
    label: "Airline / B2B",
    entries: [
      {
        path: "/airline",
        title: "Airline portal",
        desc: "White-label pitch page for prospective airline partners.",
        to: "/airline",
      },
    ],
  },
  {
    label: "Staff console",
    entries: [
      { path: "/staff/login", title: "Staff login", desc: "Email + password sign-in for claims handlers.", to: "/staff/login" },
      {
        path: "/staff/dashboard",
        title: "Staff dashboard",
        desc: "Dashboard, Claims, Reports and Settings — single SPA-style route.",
        to: "/staff/dashboard",
      },
      {
        path: "/staff/claims/$claimId",
        title: "Claim detail",
        desc: "Single-claim view — timeline, SLA, settlement, passenger & flight cards.",
        to: "/staff/claims/$claimId",
        params: { claimId: "EC-260527-4821" },
      },
      {
        path: "/staff/claims/$claimId/record",
        title: "Full record",
        desc: "Complete claim dossier — chronological activity log with timelines, SLA breakdown and document list.",
        to: "/staff/claims/$claimId/record",
        params: { claimId: "EC-260527-4821" },
      },
    ],
  },
  {
    label: "Meta",
    entries: [
      { path: "/sitemap", title: "Sitemap", desc: "This page.", to: "/sitemap" },
    ],
  },
];

const DEMO_FLOW = [
  { to: "/", label: "Landing" },
  { to: "/claim/new", label: "Start a claim" },
  { to: "/track", label: "Track" },
  { to: "/staff/login", label: "Staff login" },
  { to: "/staff/dashboard", label: "Dashboard" },
] as const;

export function SitemapPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="fixed inset-x-0 top-0 z-50 flex items-center justify-between border-b border-primary/5 bg-background/80 px-6 py-4 backdrop-blur-md">
        <Link to="/" className="flex items-center gap-2.5" aria-label="Eagle Claims home">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-primary" aria-hidden="true">
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-primary-foreground" fill="none">
              <path d="M3 14c4-1 7-3 9-7 2 4 5 6 9 7-3 1-6 3-9 6-3-3-6-5-9-6Z" fill="currentColor" />
            </svg>
          </span>
          <span className="text-lg font-semibold tracking-tight">Eagle Claims</span>
        </Link>
        <Link
          to="/"
          className="inline-flex h-9 items-center rounded-full px-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Back to landing
        </Link>
      </nav>

      <main className="mx-auto max-w-3xl px-6 pb-24 pt-32 sm:pt-40">
        {/* Header */}
        <header className="space-y-4 text-center">
          <div className="inline-flex items-center rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
            Internal · Demo navigation
          </div>
          <h1
            className="text-balance text-4xl leading-[1.05] tracking-tight sm:text-5xl"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Every route, <span className="italic text-primary">one page.</span>
          </h1>
          <p className="mx-auto max-w-md text-[15px] leading-relaxed text-muted-foreground">
            A single index of the Eagle Claims demo — for the 12 June tender walkthrough.
          </p>
        </header>

        {/* Demo flow */}
        <section className="mt-12 rounded-3xl border border-primary/10 bg-surface-raised p-6 shadow-sm">
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
            Recommended demo flow
          </div>
          <ol className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-3 text-sm">
            {DEMO_FLOW.map((s, i) => (
              <li key={s.to} className="flex items-center gap-2">
                <Link
                  to={s.to}
                  className="rounded-full border border-border bg-background px-3 py-1.5 font-medium text-foreground transition-colors hover:border-primary/30 hover:text-primary"
                >
                  <span className="mr-1.5 text-muted-foreground tabular-nums">{i + 1}.</span>
                  {s.label}
                </Link>
                {i < DEMO_FLOW.length - 1 && (
                  <span className="text-muted-foreground/50" aria-hidden="true">
                    →
                  </span>
                )}
              </li>
            ))}
          </ol>
        </section>

        {/* Groups */}
        <div className="mt-16 space-y-14">
          {GROUPS.map((group) => (
            <section key={group.label}>
              <div className="mb-5 flex items-baseline justify-between">
                <h2
                  className="text-2xl tracking-tight"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {group.label}
                </h2>
                <div className="h-px flex-1 ml-6 bg-border" />
              </div>

              <ul className="divide-y divide-border/70 overflow-hidden rounded-2xl border border-border/70 bg-surface-raised">
                {group.entries.map((e) => (
                  <li key={e.path}>
                    <Link
                      to={e.to as string}
                      params={e.params as never}
                      className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-primary/[0.04]"
                    >
                      <code className="hidden w-48 shrink-0 font-mono text-xs text-muted-foreground sm:block">
                        {e.path}
                      </code>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-foreground">{e.title}</div>
                        <div className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{e.desc}</div>
                        <code className="mt-1 block font-mono text-[10px] text-muted-foreground sm:hidden">
                          {e.path}
                        </code>
                      </div>
                      <ArrowUpRight
                        className="h-4 w-4 flex-none text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </main>

      <footer className="border-t border-border/60 px-6 py-8">
        <div className="mx-auto max-w-3xl text-center text-[11px] text-muted-foreground">
          © Eagle Claims · Internal demo index · not indexed
        </div>
      </footer>
    </div>
  );
}
