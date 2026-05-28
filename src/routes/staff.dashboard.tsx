import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  LayoutDashboard, Briefcase, BarChart3, Settings, LogOut, Search, X,
  Inbox, ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import {
  DEMO_CLAIMS, STATUS_TONE, TRANSITIONS, slaTone, formatSla, AIRLINE_META,
  type DemoClaim, type StaffStatus, type AirlineName,
} from "@/lib/demo-data";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Route = createFileRoute("/staff/dashboard")({
  head: () => ({ meta: [{ title: "Staff console · Eagle Claims" }] }),
  component: StaffDashboard,
});

const NAV = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "claims",    label: "Claims",    icon: Briefcase },
  { key: "reports",   label: "Reports",   icon: BarChart3 },
  { key: "settings",  label: "Settings",  icon: Settings },
];

const KPIS = [
  { label: "Total claims",     value: "247",     accent: "border-l-teal-500",  sub: "All time"           },
  { label: "Open claims",      value: "38",      accent: "border-l-amber-500", sub: "Awaiting action"    },
  { label: "Avg resolution",   value: "3.2 days",accent: "border-l-blue-500",  sub: "Last 30 days"       },
  { label: "Cost exposure",    value: "£18,400", accent: "border-l-rose-500",  sub: "Open + approved"    },
];

function StaffDashboard() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<DemoClaim | null>(null);
  const [active, setActive] = useState("dashboard");

  useEffect(() => {
    if (typeof window !== "undefined" && !sessionStorage.getItem("eagle.staff")) {
      navigate({ to: "/staff/login" });
    }
  }, [navigate]);

  const rows = useMemo(
    () => DEMO_CLAIMS.filter((c) =>
      [c.ref, c.passenger, c.airline, c.type, c.status].some((v) =>
        v.toLowerCase().includes(search.toLowerCase()),
      ),
    ),
    [search],
  );

  const logout = () => {
    sessionStorage.removeItem("eagle.staff");
    navigate({ to: "/staff/login" });
  };

  return (
    <div className="flex min-h-screen bg-[#F7F8FA] dark:bg-[#0F0F0F]">
      {/* Sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col bg-[#111827] text-white md:flex">
        <div className="border-b border-white/10 px-5 py-5">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg gradient-primary text-primary-foreground font-bold">E</div>
            <div>
              <div className="text-sm font-semibold">Eagle Claims</div>
              <div className="text-[10px] uppercase tracking-widest text-white/50">Staff Console</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {NAV.map((n) => {
            const I = n.icon;
            const on = active === n.key;
            return (
              <button
                key={n.key}
                onClick={() => setActive(n.key)}
                className={[
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  on ? "bg-white/10 text-white" : "text-white/65 hover:bg-white/5 hover:text-white",
                ].join(" ")}
              >
                <I className="h-4 w-4" />
                {n.label}
              </button>
            );
          })}
        </nav>
        <div className="border-t border-white/10 p-3">
          <button onClick={logout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/65 hover:bg-white/5 hover:text-white">
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 overflow-x-hidden">
        <header className="border-b border-border bg-surface-raised px-6 py-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="font-display text-lg font-semibold tracking-tight">Operations dashboard</h1>
              <p className="text-xs text-muted-foreground">Real-time view across all tenants</p>
            </div>
            <Link to="/" className="text-xs font-medium text-muted-foreground hover:text-foreground">Exit console</Link>
          </div>
        </header>

        <main className="space-y-6 p-6">
          {/* KPIs */}
          <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {KPIS.map((k) => (
              <div key={k.label} className={["rounded-2xl border border-border border-l-4 bg-surface-raised p-4 shadow-[var(--shadow-raised)]", k.accent].join(" ")}>
                <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{k.label}</div>
                <div className="mt-1.5 font-display text-2xl font-semibold tracking-tight">{k.value}</div>
                <div className="text-[11px] text-muted-foreground">{k.sub}</div>
              </div>
            ))}
          </section>

          {/* Table */}
          <section className="rounded-2xl border border-border bg-surface-raised">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
              <h2 className="font-display text-base font-semibold">All claims</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  placeholder="Search claims…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-10 w-64 rounded-full border border-input bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted text-[10px] uppercase tracking-widest text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 text-left">Ref</th>
                    <th className="px-4 py-3 text-left">Airline</th>
                    <th className="px-4 py-3 text-left">Passenger</th>
                    <th className="px-4 py-3 text-left">Claim type</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">SLA</th>
                    <th className="px-4 py-3 text-left">Handler</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 ? (
                    <tr>
                      <td colSpan={7}>
                        <EmptyState />
                      </td>
                    </tr>
                  ) : rows.map((c) => {
                    const sla = slaTone(c.slaHours);
                    return (
                      <tr key={c.ref}
                        onClick={() => setSelected(c)}
                        className="cursor-pointer border-t border-border transition-colors hover:bg-muted/60">
                        <td className="px-4 py-3"><span className="rounded-md bg-primary-light-bg px-2 py-1 font-mono text-[11px] font-semibold text-primary">{c.ref}</span></td>
                        <td className="px-4 py-3"><AirlinePill name={c.airline} /></td>
                        <td className="px-4 py-3 font-medium">{c.passenger}</td>
                        <td className="px-4 py-3 text-muted-foreground">{c.type}</td>
                        <td className="px-4 py-3"><StatusPill status={c.status} /></td>
                        <td className="px-4 py-3">
                          <span className={["inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold", sla.pill, sla.text].join(" ")}>
                            {c.slaHours < 8 && <span className={["relative flex h-1.5 w-1.5"].join(" ")}>
                              <span className={["absolute inline-flex h-full w-full animate-[pulse-dot_1.8s_ease-in-out_infinite] rounded-full opacity-60", sla.dot].join(" ")} />
                              <span className={["relative inline-flex h-1.5 w-1.5 rounded-full", sla.dot].join(" ")} />
                            </span>}
                            {formatSla(c.slaHours)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{c.handler}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>

      <AnimatePresence>
        {selected && <DetailPanel claim={selected} onClose={() => setSelected(null)} onUpdate={(s) => setSelected({ ...selected, status: s })} />}
      </AnimatePresence>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 px-4 py-16 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-2xl bg-muted text-muted-foreground">
        <Inbox className="h-7 w-7" />
      </div>
      <div>
        <div className="font-display text-base font-semibold">No claims found</div>
        <div className="text-xs text-muted-foreground">Try adjusting filters</div>
      </div>
    </div>
  );
}

export function AirlinePill({ name }: { name: "easyJet" | "Skybridge" }) {
  const c = name === "easyJet"
    ? "bg-orange-500/15 text-orange-600 dark:text-orange-300"
    : "bg-indigo-500/15 text-indigo-600 dark:text-indigo-300";
  return <span className={["inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold", c].join(" ")}>{name}</span>;
}

export function StatusPill({ status }: { status: StaffStatus }) {
  return <span className={["inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold", STATUS_TONE[status]].join(" ")}>{status}</span>;
}

function DetailPanel({ claim, onClose, onUpdate }: { claim: DemoClaim; onClose: () => void; onUpdate: (s: StaffStatus) => void }) {
  const [tab, setTab] = useState<"details" | "timeline" | "notes" | "photos">("details");
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState<{ at: string; text: string; who: string }[]>([
    { at: "23 May 2026, 09:12", who: "Aoife K.", text: "Reviewing photos. Damage looks consistent with handling crush." },
  ]);
  const allowed = TRANSITIONS[claim.status];

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />
      <motion.aside
        initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 240, damping: 30, duration: 0.3 }}
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col bg-background shadow-2xl"
      >
        <header className="border-b border-border px-5 py-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-mono text-sm font-semibold text-primary">{claim.ref}</div>
              <div className="mt-0.5 text-base font-semibold">{claim.passenger}</div>
              <div className="text-xs text-muted-foreground">{claim.flight} · {claim.route} · {claim.date}</div>
            </div>
            <button onClick={onClose} aria-label="Close" className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-3 flex items-center justify-between gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-raised px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-muted">
                <StatusPill status={claim.status} />
                <ChevronDown className="h-3 w-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {allowed.length === 0 && <div className="px-2 py-1.5 text-xs text-muted-foreground">Terminal state</div>}
                {allowed.map((s) => (
                  <DropdownMenuItem key={s} onClick={() => { onUpdate(s); toast.success(`Status → ${s}`); }}>
                    <StatusPill status={s} />
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="flex gap-1 rounded-full bg-muted p-1 text-xs font-medium">
              {(["details", "timeline", "notes", "photos"] as const).map((k) => (
                <button key={k} onClick={() => setTab(k)}
                  className={["rounded-full px-3 py-1 capitalize transition-colors", tab === k ? "bg-surface-raised text-foreground shadow-sm" : "text-muted-foreground"].join(" ")}>
                  {k}
                </button>
              ))}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-5">
          {tab === "details" && (
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              {[
                ["Airline", claim.airline], ["Type", claim.type], ["Flight", claim.flight],
                ["Route", claim.route], ["Date", claim.date], ["Handler", claim.handler],
                ["Bag tag", "EZY827341"], ["Brand", "Samsonite"],
                ["Colour", "Navy"], ["Size", "Large"],
                ["Estimated value", `£${claim.amount}`], ["PIR", "LGWBA21043"],
              ].map(([l, v]) => (
                <div key={String(l)} className="rounded-xl bg-surface p-3">
                  <dt className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{l}</dt>
                  <dd className="mt-0.5 text-sm font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          )}

          {tab === "timeline" && (
            <ol className="space-y-3">
              {[
                { at: "22 May 2026, 18:42", what: "Submitted by passenger", who: "Sarah Mitchell" },
                { at: "23 May 2026, 09:12", what: "Marked Under Review", who: "Aoife K." },
                { at: "23 May 2026, 11:30", what: "Photos verified", who: "System" },
              ].map((e, i) => (
                <li key={i} className="flex gap-3">
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  <div>
                    <div className="text-sm font-medium">{e.what}</div>
                    <div className="text-[11px] text-muted-foreground">{e.at} · {e.who}</div>
                  </div>
                </li>
              ))}
            </ol>
          )}

          {tab === "notes" && (
            <div className="space-y-3">
              {notes.map((n, i) => (
                <div key={i} className="rounded-xl bg-surface p-3">
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{n.who} · {n.at}</div>
                  <p className="mt-1 text-sm">{n.text}</p>
                </div>
              ))}
              <form onSubmit={(e) => {
                e.preventDefault();
                if (!note.trim()) return;
                setNotes((n) => [...n, { at: "Now", who: "You", text: note.trim() }]);
                setNote("");
                toast.success("Note saved");
              }} className="space-y-2">
                <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3}
                  placeholder="Add an internal note…"
                  className="w-full rounded-xl border border-input bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
                <button className="inline-flex h-10 items-center justify-center rounded-lg gradient-primary px-4 text-xs font-semibold text-primary-foreground">
                  Add note
                </button>
              </form>
            </div>
          )}

          {tab === "photos" && (
            <div className="grid grid-cols-3 gap-2">
              {[1,2,3,4].map((i) => (
                <div key={i} className="grid aspect-square place-items-center rounded-xl bg-muted text-xs text-muted-foreground">
                  Photo {i}
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.aside>
    </>
  );
}
