import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  LayoutDashboard, FileText, BarChart3, Settings2, LogOut, Search, X,
  Inbox, ChevronDown, AlertCircle, Clock, PoundSterling, TrendingUp, TrendingDown,
  Plane, Luggage, MessageSquare, UserPlus, AlertTriangle, ExternalLink, Globe,
  ChevronUp, ChevronsUpDown, type LucideIcon,
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
  { key: "claims",    label: "Claims",    icon: FileText },
  { key: "reports",   label: "Reports",   icon: BarChart3 },
  { key: "settings",  label: "Settings",  icon: Settings2 },
];

type Kpi = {
  label: string;
  value: string;
  accent: string;
  icon: LucideIcon;
  iconClass: string;
  trend: string;
  trendIcon: LucideIcon;
  trendClass: string;
};

const KPIS: Kpi[] = [
  { label: "Total claims",   value: "247",     accent: "border-l-teal-500",  icon: Inbox,         iconClass: "text-teal-600 bg-teal-500/10",     trend: "+12 this week",      trendIcon: TrendingUp,   trendClass: "text-emerald-600" },
  { label: "Open claims",    value: "38",      accent: "border-l-amber-500", icon: AlertCircle,   iconClass: "text-amber-600 bg-amber-500/10",   trend: "↑ 3 from yesterday", trendIcon: TrendingUp,   trendClass: "text-amber-600" },
  { label: "Avg resolution", value: "3.2 days",accent: "border-l-blue-500",  icon: Clock,         iconClass: "text-blue-600 bg-blue-500/10",     trend: "↓ 0.4d vs last month",trendIcon: TrendingDown, trendClass: "text-emerald-600" },
  { label: "Cost exposure",  value: "£18,400", accent: "border-l-rose-500",  icon: PoundSterling, iconClass: "text-rose-600 bg-rose-500/10",     trend: "+£2,100 this week",  trendIcon: TrendingUp,   trendClass: "text-rose-600" },
];

const AIRLINE_FILTERS: ("All" | AirlineName)[] = ["All", "easyJet", "Air Peace", "Malaysia Airlines", "Thai Airways", "Oman Air"];

type SortKey = "ref" | "passenger" | "status" | "slaHours";
type SortDir = "asc" | "desc";

function StaffDashboard() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<DemoClaim | null>(null);
  const [active, setActive] = useState("dashboard");
  const [airlineFilter, setAirlineFilter] = useState<"All" | AirlineName>("All");
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  useEffect(() => {
    if (typeof window !== "undefined" && !sessionStorage.getItem("eagle.staff")) {
      navigate({ to: "/staff/login" });
    }
  }, [navigate]);

  const rows = useMemo(() => {
    let r = DEMO_CLAIMS.filter((c) =>
      [c.ref, c.passenger, c.airline, c.type, c.status].some((v) =>
        v.toLowerCase().includes(search.toLowerCase()),
      ),
    );
    if (airlineFilter !== "All") r = r.filter((c) => c.airline === airlineFilter);
    if (sortKey) {
      const dir = sortDir === "asc" ? 1 : -1;
      r = [...r].sort((a, b) => {
        const av = a[sortKey] as string | number;
        const bv = b[sortKey] as string | number;
        if (av < bv) return -1 * dir;
        if (av > bv) return 1 * dir;
        return 0;
      });
    }
    return r;
  }, [search, airlineFilter, sortKey, sortDir]);

  const toggleSort = (k: SortKey) => {
    if (sortKey !== k) { setSortKey(k); setSortDir("asc"); return; }
    if (sortDir === "asc") setSortDir("desc");
    else { setSortKey(null); setSortDir("asc"); }
  };

  const logout = () => {
    sessionStorage.removeItem("eagle.staff");
    navigate({ to: "/staff/login" });
  };

  return (
    <div className="flex min-h-screen bg-[#F7F8FA] dark:bg-[#0F0F0F]">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col bg-[#111827] text-white md:flex">
        <div className="border-b border-white/10 px-5 py-5">
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/15 text-primary">
              <Plane className="h-5 w-5" strokeWidth={1.5} />
            </div>
            <div>
              <div className="text-sm font-bold leading-tight">Eagle Claims</div>
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
                <I className="h-5 w-5" strokeWidth={1.5} />
                {n.label}
              </button>
            );
          })}

          <div className="my-3 border-t border-white/10" />
          <div className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-widest text-white/40">Quick links</div>
          <Link
            to="/airline"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-white/65 transition-colors hover:bg-white/5 hover:text-white"
          >
            <ExternalLink className="h-5 w-5" strokeWidth={1.5} />
            Airline Dashboard
          </Link>
          <Link
            to="/"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-white/65 transition-colors hover:bg-white/5 hover:text-white"
          >
            <Globe className="h-5 w-5" strokeWidth={1.5} />
            Passenger Portal
          </Link>
        </nav>
        <div className="border-t border-white/10 p-3">
          <div className="mb-2 flex items-center gap-2.5 rounded-lg px-3 py-2">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground text-[11px] font-bold">AK</div>
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-widest text-white/40">Logged in as</div>
              <div className="truncate text-xs font-semibold">Aoife K.</div>
            </div>
          </div>
          <button onClick={logout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/65 hover:bg-white/5 hover:text-white">
            <LogOut className="h-5 w-5" strokeWidth={1.5} />
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
            {KPIS.map((k) => {
              const I = k.icon;
              const T = k.trendIcon;
              return (
                <div key={k.label} className={["rounded-2xl border border-border border-l-4 bg-surface-raised p-4 shadow-[var(--shadow-raised)]", k.accent].join(" ")}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{k.label}</div>
                    <div className={["grid h-7 w-7 place-items-center rounded-lg", k.iconClass].join(" ")}>
                      <I className="h-4 w-4" strokeWidth={1.5} />
                    </div>
                  </div>
                  <div className="mt-1.5 font-display text-2xl font-semibold tracking-tight">{k.value}</div>
                  <div className={["mt-1 flex items-center gap-1 text-[11px] font-medium", k.trendClass].join(" ")}>
                    <T className="h-3 w-3" strokeWidth={1.5} />
                    {k.trend}
                  </div>
                </div>
              );
            })}
          </section>

          {/* Table */}
          <section className="rounded-2xl border border-border bg-surface-raised">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
              <h2 className="font-display text-base font-semibold">All claims</h2>
              <div className="flex items-center gap-3">
                <span className="hidden text-[11px] text-muted-foreground sm:inline">Showing {rows.length} of 247 claims</span>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.5} />
                  <input
                    placeholder="Search claims…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-10 w-64 rounded-full border border-input bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
            </div>

            {/* Airline filter pills */}
            <div className="flex flex-wrap items-center gap-1.5 border-b border-border px-4 py-2.5">
              {AIRLINE_FILTERS.map((f) => {
                const on = airlineFilter === f;
                const meta = f !== "All" ? AIRLINE_META[f] : null;
                return (
                  <button
                    key={f}
                    onClick={() => setAirlineFilter(f)}
                    className={[
                      "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold transition-colors",
                      on
                        ? "border-transparent text-white"
                        : "border-border bg-surface text-muted-foreground hover:text-foreground",
                    ].join(" ")}
                    style={on && meta ? { background: meta.color } : on ? { background: "var(--color-primary)" } : undefined}
                  >
                    {f}
                    {meta && <span className="font-mono text-[9px] opacity-80">{meta.iata}</span>}
                  </button>
                );
              })}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted text-[10px] uppercase tracking-widest text-muted-foreground">
                  <tr>
                    <SortableTh label="Ref"       k="ref"       sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                    <th className="px-4 py-3 text-left">Airline</th>
                    <SortableTh label="Passenger" k="passenger" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                    <th className="px-4 py-3 text-left">Claim type</th>
                    <SortableTh label="Status"    k="status"    sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                    <SortableTh label="SLA"       k="slaHours"  sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
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
                            {c.slaHours < 8 && <span className="relative flex h-1.5 w-1.5">
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

function SortableTh({
  label, k, sortKey, sortDir, onSort,
}: { label: string; k: SortKey; sortKey: SortKey | null; sortDir: SortDir; onSort: (k: SortKey) => void }) {
  const active = sortKey === k;
  const Icon = !active ? ChevronsUpDown : sortDir === "asc" ? ChevronUp : ChevronDown;
  return (
    <th className="px-4 py-3 text-left">
      <button onClick={() => onSort(k)} className={["inline-flex items-center gap-1 hover:text-foreground", active && "text-primary"].filter(Boolean).join(" ")}>
        {label}
        <Icon className="h-3 w-3" strokeWidth={1.5} />
      </button>
    </th>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 px-4 py-16 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-2xl bg-muted text-muted-foreground">
        <Inbox className="h-7 w-7" strokeWidth={1.5} />
      </div>
      <div>
        <div className="font-display text-base font-semibold">No claims found</div>
        <div className="text-xs text-muted-foreground">Try adjusting filters</div>
      </div>
    </div>
  );
}

export function AirlinePill({ name }: { name: AirlineName }) {
  const meta = AIRLINE_META[name];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold text-white"
      style={{ background: meta.color }}
    >
      {name}
      <span className="font-mono text-[9px] opacity-80">{meta.iata}</span>
    </span>
  );
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

  const flightFields: [string, string][] = [
    ["Airline", claim.airline],
    ["Flight", claim.flight],
    ["Route", claim.route],
    ["Date", claim.date],
    ["Booking ref", "U2-HK9X4P"],
  ];

  const bagFields: [string, string][] = [
    ["Type", "Suitcase"],
    ["Brand", "Samsonite"],
    ["Colour", "Navy"],
    ["Size", "Large"],
    ["Bag tag", "EZY827341"],
    ["Estimated value", `£${claim.amount ?? 0}`],
    ["PIR number", "LGWBA21043"],
  ];

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
              <X className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
          <div className="mt-3 flex items-center justify-between gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-raised px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-muted">
                <StatusPill status={claim.status} />
                <ChevronDown className="h-3 w-3" strokeWidth={1.5} />
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

          {/* Quick actions */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            <QuickAction icon={MessageSquare} label="Request info" tone="default" />
            <QuickAction icon={UserPlus} label="Assign handler" tone="default" />
            <QuickAction icon={AlertTriangle} label="Escalate" tone="warning" />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-5">
          {tab === "details" && (
            <div className="space-y-5">
              <FieldSection icon={Plane} title="Flight" fields={flightFields} />
              <div className="border-t border-border" />
              <FieldSection icon={Luggage} title="Bag" fields={bagFields} />
            </div>
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

function FieldSection({ icon: Icon, title, fields }: { icon: LucideIcon; title: string; fields: [string, string][] }) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" strokeWidth={1.5} />
        <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-foreground">{title}</h3>
      </div>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
        {fields.map(([l, v]) => (
          <div key={l}>
            <dt className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">{l}</dt>
            <dd className="mt-0.5 text-sm font-medium text-foreground">{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function QuickAction({ icon: Icon, label, tone }: { icon: LucideIcon; label: string; tone: "default" | "warning" }) {
  const cls = tone === "warning"
    ? "border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:border-amber-700/50 dark:bg-amber-500/10 dark:text-amber-300"
    : "border-border bg-surface-raised text-foreground hover:bg-muted";
  return (
    <button
      type="button"
      onClick={() => toast.success("Action recorded")}
      className={["inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-semibold transition-colors", cls].join(" ")}
    >
      <Icon className="h-3.5 w-3.5" strokeWidth={1.5} />
      {label}
    </button>
  );
}
