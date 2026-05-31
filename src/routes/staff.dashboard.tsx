import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  LayoutDashboard, FileText, BarChart3, Settings2, LogOut, Search, X,
  Inbox, ChevronDown, AlertCircle, Clock, PoundSterling, TrendingUp, TrendingDown,
  Plane, Luggage, MessageSquare, UserPlus, AlertTriangle, ExternalLink, Globe,
  ChevronUp, ChevronsUpDown, Download, Plus, ChevronLeft, ChevronRight, ArrowRight,
  User, Bell, Plug, Users, CreditCard, Trash2, type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, Tooltip,
} from "recharts";
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

type ViewKey = "dashboard" | "claims" | "reports" | "settings";

const NAV: { key: ViewKey; label: string; icon: LucideIcon }[] = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "claims",    label: "Claims",    icon: FileText },
  { key: "reports",   label: "Reports",   icon: BarChart3 },
  { key: "settings",  label: "Settings",  icon: Settings2 },
];

const AIRLINE_FILTERS: ("All" | AirlineName)[] = ["All", "easyJet", "Air Peace", "Malaysia Airlines", "Thai Airways", "Oman Air"];

// ───────────────────────── Extended Claims Dataset (20 rows) ─────────────────────────
const FULL_CLAIMS: DemoClaim[] = [
  { ref: "EC-268527-4821", airline: "easyJet",           passenger: "Sarah Mitchell",     type: "Damaged suitcase",   status: "Under Review",        slaHours:  4,  handler: "Aoife K.",  amount: 240, flight: "U2 8472", route: "LGW → PMI", date: "22 May 2026" },
  { ref: "EC-268527-4799", airline: "easyJet",           passenger: "James O'Connor",     type: "Lost contents",      status: "Awaiting Info",       slaHours: 18,  handler: "Nuala D.",  amount: 410, flight: "U2 8391", route: "LGW → AMS", date: "22 May 2026" },
  { ref: "EC-268526-4612", airline: "Air Peace",         passenger: "Adaeze Okafor",      type: "Damaged contents",   status: "Approved Repair",     slaHours: 36,  handler: "Marek W.",  amount: 185, flight: "P4 822",  route: "LOS → ABV", date: "21 May 2026" },
  { ref: "EC-268526-4598", airline: "easyJet",           passenger: "Tomás Pérez",        type: "Damaged suitcase",   status: "Submitted",           slaHours: 23,  handler: "—",         amount:   0, flight: "U2 7823", route: "MAD → MAN", date: "21 May 2026" },
  { ref: "EC-268525-4410", airline: "Malaysia Airlines", passenger: "Nurul Hisham",       type: "Lost suitcase",      status: "Approved Replacement",slaHours: 48,  handler: "Aoife K.",  amount: 620, flight: "MH 2",    route: "KUL → LHR", date: "20 May 2026" },
  { ref: "EC-268524-4322", airline: "Thai Airways",      passenger: "Suthida Kraisri",    type: "Damaged contents",   status: "Completed",           slaHours: 96,  handler: "Nuala D.",  amount:  95, flight: "TG 910",  route: "BKK → LHR", date: "19 May 2026" },
  { ref: "EC-268524-4288", airline: "Oman Air",          passenger: "Yousef Al-Balushi",  type: "Damaged suitcase",   status: "Rejected",            slaHours: 48,  handler: "Marek W.",  amount:   0, flight: "WY 101",  route: "MCT → LHR", date: "19 May 2026" },
  { ref: "EC-268523-4150", airline: "easyJet",           passenger: "Andrei Popescu",     type: "Lost contents",      status: "Under Review",        slaHours:  7,  handler: "Aoife K.",  amount: 320, flight: "U2 6691", route: "OTP → LGW", date: "18 May 2026" },
  { ref: "EC-268522-4033", airline: "Air Peace",         passenger: "Chidi Okonkwo",      type: "Both damaged",       status: "Submitted",           slaHours: 12,  handler: "—",         amount: 380, flight: "P4 1105", route: "LOS → LHR", date: "17 May 2026" },
  { ref: "EC-268521-3921", airline: "easyJet",           passenger: "Priya Sharma",       type: "Damaged suitcase",   status: "Under Review",        slaHours:  2,  handler: "Nuala D.",  amount: 210, flight: "U2 9912", route: "LGW → DEL", date: "16 May 2026" },
  { ref: "EC-268520-3844", airline: "Malaysia Airlines", passenger: "Ahmad Zulkifli",     type: "Damaged contents",   status: "Awaiting Info",       slaHours: 72,  handler: "Aoife K.",  amount: 165, flight: "MH 4",    route: "KUL → LHR", date: "15 May 2026" },
  { ref: "EC-268519-3762", airline: "Thai Airways",      passenger: "Preecha Wongkam",    type: "Lost suitcase",      status: "Approved Replacement",slaHours:120,  handler: "Marek W.",  amount: 580, flight: "TG 912",  route: "BKK → MAN", date: "14 May 2026" },
  { ref: "EC-268518-3681", airline: "Oman Air",          passenger: "Fatima Al-Rashidi",  type: "Damaged suitcase",   status: "Completed",           slaHours: 72,  handler: "Nuala D.",  amount: 220, flight: "WY 103",  route: "MCT → MAN", date: "13 May 2026" },
  { ref: "EC-268517-3599", airline: "easyJet",           passenger: "Marco Bianchi",      type: "Both lost",          status: "Rejected",            slaHours: 96,  handler: "Marek W.",  amount:   0, flight: "U2 2241", route: "FCO → LGW", date: "12 May 2026" },
  { ref: "EC-268516-3518", airline: "Air Peace",         passenger: "Ngozi Eze",          type: "Damaged contents",   status: "Completed",           slaHours:144,  handler: "Aoife K.",  amount: 140, flight: "P4 807",  route: "ABV → LOS", date: "11 May 2026" },
  { ref: "EC-268515-3437", airline: "easyJet",           passenger: "Lena Müller",        type: "Damaged suitcase",   status: "Under Review",        slaHours:  9,  handler: "Nuala D.",  amount: 260, flight: "U2 4451", route: "TXL → LGW", date: "10 May 2026" },
  { ref: "EC-268514-3355", airline: "Malaysia Airlines", passenger: "Siti Rahimah",       type: "Lost contents",      status: "Approved Repair",     slaHours:168,  handler: "Marek W.",  amount: 340, flight: "MH 6",    route: "KUL → LHR", date: "9 May 2026"  },
  { ref: "EC-268513-3274", airline: "Thai Airways",      passenger: "Kanya Srisai",       type: "Both damaged",       status: "Awaiting Info",       slaHours:192,  handler: "Aoife K.",  amount: 290, flight: "TG 914",  route: "BKK → CDG", date: "8 May 2026"  },
  { ref: "EC-268512-3192", airline: "Oman Air",          passenger: "Mohammed Al-Siyabi", type: "Damaged suitcase",   status: "Completed",           slaHours:120,  handler: "Nuala D.",  amount: 195, flight: "WY 105",  route: "MCT → LHR", date: "7 May 2026"  },
  { ref: "EC-268511-3111", airline: "easyJet",           passenger: "Ana Sousa",          type: "Damaged contents",   status: "Submitted",           slaHours:  6,  handler: "—",         amount: 150, flight: "U2 1821", route: "LIS → LGW", date: "6 May 2026"  },
];

type Kpi = {
  label: string; value: string; accent: string; icon: LucideIcon;
  iconClass: string; trend: string; trendIcon: LucideIcon; trendClass: string;
};

const KPIS: Kpi[] = [
  { label: "Total claims",   value: "247",     accent: "border-l-teal-500",  icon: Inbox,         iconClass: "text-teal-600 bg-teal-500/10",     trend: "+12 this week",      trendIcon: TrendingUp,   trendClass: "text-emerald-600" },
  { label: "Open claims",    value: "38",      accent: "border-l-amber-500", icon: AlertCircle,   iconClass: "text-amber-600 bg-amber-500/10",   trend: "↑ 3 from yesterday", trendIcon: TrendingUp,   trendClass: "text-amber-600" },
  { label: "Avg resolution", value: "3.2 days",accent: "border-l-blue-500",  icon: Clock,         iconClass: "text-blue-600 bg-blue-500/10",     trend: "↓ 0.4d vs last month",trendIcon: TrendingDown, trendClass: "text-emerald-600" },
  { label: "Cost exposure",  value: "£18,400", accent: "border-l-rose-500",  icon: PoundSterling, iconClass: "text-rose-600 bg-rose-500/10",     trend: "+£2,100 this week",  trendIcon: TrendingUp,   trendClass: "text-rose-600" },
];

type SortKey = "ref" | "passenger" | "status" | "slaHours";
type SortDir = "asc" | "desc";

function StaffDashboard() {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<ViewKey>("dashboard");

  useEffect(() => {
    if (typeof window !== "undefined" && !sessionStorage.getItem("eagle.staff")) {
      navigate({ to: "/staff/login" });
    }
  }, [navigate]);

  const logout = () => {
    sessionStorage.removeItem("eagle.staff");
    navigate({ to: "/staff/login" });
  };

  return (
    <div className="flex min-h-screen bg-[#F7F8FA] dark:bg-[#0F0F0F]">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col bg-[#0f172a] text-white md:flex">
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
            const on = activeView === n.key;
            return (
              <button
                key={n.key}
                onClick={() => setActiveView(n.key)}
                className={[
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150",
                  on ? "bg-[#1e293b] text-white" : "text-slate-400 hover:bg-white/5 hover:text-white",
                ].join(" ")}
              >
                <I className="h-5 w-5" strokeWidth={1.5} />
                {n.label}
              </button>
            );
          })}

          <div className="my-3 border-t border-white/10" />
          <div className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-widest text-white/40">Quick links</div>
          <Link to="/airline" className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-white/5 hover:text-white">
            <ExternalLink className="h-5 w-5" strokeWidth={1.5} />
            Airline Dashboard
          </Link>
          <Link to="/" className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-white/5 hover:text-white">
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
          <button onClick={logout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-400 hover:bg-white/5 hover:text-white">
            <LogOut className="h-5 w-5" strokeWidth={1.5} />
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
          >
            {activeView === "dashboard" && <DashboardView />}
            {activeView === "claims"    && <ClaimsView />}
            {activeView === "reports"   && <ReportsView />}
            {activeView === "settings"  && <SettingsView />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ═══════════════════════════ DASHBOARD VIEW ═══════════════════════════
function DashboardView() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<DemoClaim | null>(null);
  const [airlineFilter, setAirlineFilter] = useState<"All" | AirlineName>("All");
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const rows = useMemo(() => {
    let r = DEMO_CLAIMS.filter((c) =>
      [c.ref, c.passenger, c.airline, c.type, c.status].some((v) =>
        v.toLowerCase().includes(search.toLowerCase()),
      ),
    );
    if (airlineFilter !== "All") {
      const targetIata = AIRLINE_META[airlineFilter].iata;
      r = r.filter((c) => AIRLINE_META[c.airline].iata === targetIata);
    }
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

  return (
    <>
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
        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {KPIS.map((k) => {
            const I = k.icon; const T = k.trendIcon;
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

        <section className="rounded-2xl border border-border bg-surface-raised">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
            <h2 className="font-display text-base font-semibold">All claims</h2>
            <div className="flex items-center gap-3">
              <span className="hidden text-[11px] text-muted-foreground sm:inline">Showing {rows.length} of 247 claims</span>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.5} />
                <input placeholder="Search claims…" value={search} onChange={(e) => setSearch(e.target.value)}
                  className="h-10 w-64 rounded-full border border-input bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 border-b border-border px-4 py-2.5">
            {AIRLINE_FILTERS.map((f) => {
              const on = airlineFilter === f;
              const meta = f !== "All" ? AIRLINE_META[f] : null;
              return (
                <button key={f} onClick={() => setAirlineFilter(f)}
                  className={["inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold transition-colors",
                    on ? "border-transparent text-white" : "border-border bg-surface text-muted-foreground hover:text-foreground"].join(" ")}
                  style={on && meta ? { background: meta.color } : on ? { background: "var(--color-primary)" } : undefined}>
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
                  <SortableTh label="Ref" k="ref" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                  <th className="px-4 py-3 text-left">Airline</th>
                  <SortableTh label="Passenger" k="passenger" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                  <th className="px-4 py-3 text-left">Claim type</th>
                  <SortableTh label="Status" k="status" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                  <SortableTh label="SLA" k="slaHours" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                  <th className="px-4 py-3 text-left">Handler</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr><td colSpan={7}><EmptyState /></td></tr>
                ) : rows.map((c) => <ClaimRow key={c.ref} c={c} onClick={() => setSelected(c)} />)}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <AnimatePresence>
        {selected && <DetailPanel claim={selected} onClose={() => setSelected(null)} onUpdate={(s) => setSelected({ ...selected, status: s })} />}
      </AnimatePresence>
    </>
  );
}

// ═══════════════════════════ CLAIMS VIEW ═══════════════════════════
function ClaimsView() {
  const [search, setSearch] = useState("");
  const [airlineFilter, setAirlineFilter] = useState<"All" | AirlineName>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All statuses");
  const [typeFilter, setTypeFilter] = useState<string>("All types");
  const [dateRange, setDateRange] = useState<string>("Last 30 days");
  const [sortBy, setSortBy] = useState<string>("Newest first");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [selected, setSelected] = useState<DemoClaim | null>(null);

  const rows = useMemo(() => {
    let r = FULL_CLAIMS.filter((c) => {
      const s = search.toLowerCase();
      if (s && ![c.ref, c.passenger, c.airline, c.route].some((v) => v.toLowerCase().includes(s))) return false;
      if (airlineFilter !== "All" && AIRLINE_META[c.airline].iata !== AIRLINE_META[airlineFilter].iata) return false;
      if (statusFilter !== "All statuses" && c.status !== statusFilter) return false;
      if (typeFilter !== "All types" && c.type !== typeFilter) return false;
      return true;
    });
    return r;
  }, [search, airlineFilter, statusFilter, typeFilter]);

  const totalPages = Math.max(1, Math.ceil(rows.length / perPage));
  const pagedRows = rows.slice((page - 1) * perPage, page * perPage);

  const clearFilters = () => {
    setSearch(""); setAirlineFilter("All"); setStatusFilter("All statuses");
    setTypeFilter("All types"); setDateRange("Last 30 days");
  };

  return (
    <>
      <header className="border-b border-border bg-surface-raised px-6 py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-semibold tracking-tight">Claims</h1>
            <p className="text-xs text-muted-foreground">All claims across your tenants</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => toast.success("Export started")} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-surface-raised px-3 text-xs font-semibold hover:bg-muted">
              <Download className="h-3.5 w-3.5" strokeWidth={1.5} /> Export
            </button>
            <button disabled title="Claims are submitted by passengers"
              className="inline-flex h-9 cursor-not-allowed items-center gap-1.5 rounded-lg bg-[#FF6600] px-3 text-xs font-semibold text-white opacity-60">
              <Plus className="h-3.5 w-3.5" strokeWidth={1.5} /> New claim
            </button>
          </div>
        </div>
      </header>

      <main className="space-y-4 p-6">
        {/* Filter row */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-surface-raised p-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.5} />
              <input placeholder="Search by ref, passenger, route…" value={search} onChange={(e) => setSearch(e.target.value)}
                className="h-9 w-[280px] rounded-lg border border-input bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <Select value={statusFilter} onChange={setStatusFilter}
              options={["All statuses","Submitted","Under Review","Awaiting Info","Approved Repair","Approved Replacement","Completed","Rejected"]} />
            <Select value={typeFilter} onChange={setTypeFilter}
              options={["All types","Damaged suitcase","Damaged contents","Both damaged","Lost suitcase","Lost contents","Both lost"]} />
            <Select value={dateRange} onChange={setDateRange}
              options={["Last 7 days","Last 30 days","Last 90 days","Custom range"]} />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-muted-foreground">Showing {rows.length} of 247 claims</span>
            <Select value={sortBy} onChange={setSortBy} options={["Newest first","Oldest first","SLA urgent first","Amount high to low"]} />
          </div>
        </div>

        {/* Airline pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {AIRLINE_FILTERS.map((f) => {
            const on = airlineFilter === f;
            const meta = f !== "All" ? AIRLINE_META[f] : null;
            return (
              <button key={f} onClick={() => { setAirlineFilter(f); setPage(1); }}
                className={["inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold transition-colors duration-150",
                  on ? "border-transparent text-white" : "border-border bg-surface text-muted-foreground hover:text-foreground"].join(" ")}
                style={on && meta ? { background: meta.color } : on ? { background: "var(--color-primary)" } : undefined}>
                {f}
                {meta && <span className="font-mono text-[9px] opacity-80">{meta.iata}</span>}
              </button>
            );
          })}
        </div>

        {/* Table */}
        <section className="overflow-hidden rounded-2xl border border-border bg-surface-raised">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted text-[10px] uppercase tracking-widest text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left">Ref</th>
                  <th className="px-4 py-3 text-left">Airline</th>
                  <th className="px-4 py-3 text-left">Passenger</th>
                  <th className="px-4 py-3 text-left">Flight</th>
                  <th className="px-4 py-3 text-left">Route</th>
                  <th className="px-4 py-3 text-left">Claim type</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">SLA</th>
                  <th className="px-4 py-3 text-left">Handler</th>
                  <th className="px-4 py-3 text-left">Date filed</th>
                </tr>
              </thead>
              <tbody>
                {pagedRows.length === 0 ? (
                  <tr><td colSpan={10}>
                    <div className="flex flex-col items-center gap-3 px-4 py-16 text-center">
                      <div className="grid h-16 w-16 place-items-center rounded-2xl bg-muted text-muted-foreground">
                        <Inbox className="h-7 w-7" strokeWidth={1.5} />
                      </div>
                      <div className="font-display text-base font-semibold">No claims match your filters</div>
                      <button onClick={clearFilters} className="inline-flex h-9 items-center rounded-lg bg-[#FF6600] px-4 text-xs font-semibold text-white hover:opacity-90">Clear filters</button>
                    </div>
                  </td></tr>
                ) : pagedRows.map((c) => {
                  const sla = slaTone(c.slaHours);
                  return (
                    <tr key={c.ref} onClick={() => setSelected(c)}
                      className="cursor-pointer border-t border-border transition-colors duration-150 hover:bg-slate-50 dark:hover:bg-muted/60">
                      <td className="px-4 py-3"><span className="rounded-md bg-primary-light-bg px-2 py-1 font-mono text-[11px] font-semibold text-primary">{c.ref}</span></td>
                      <td className="px-4 py-3"><AirlinePill name={c.airline} /></td>
                      <td className="px-4 py-3 font-medium">{c.passenger}</td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{c.flight}</td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{c.route}</td>
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
                      <td className="px-4 py-3 text-xs text-muted-foreground">{c.date}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between gap-3 border-t border-border px-4 py-3">
            <div className="flex items-center gap-1">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className="inline-flex h-8 items-center gap-1 rounded-lg border border-border px-2.5 text-xs font-medium hover:bg-muted disabled:opacity-40">
                <ChevronLeft className="h-3.5 w-3.5" strokeWidth={1.5} /> Previous
              </button>
              {[1, 2, 3].map((n) => (
                <button key={n} onClick={() => setPage(n)}
                  className={["h-8 w-8 rounded-lg text-xs font-medium", page === n ? "bg-[#FF6600] text-white" : "hover:bg-muted"].join(" ")}>
                  {n}
                </button>
              ))}
              <span className="px-1 text-xs text-muted-foreground">…</span>
              <button onClick={() => setPage(13)} className={["h-8 w-8 rounded-lg text-xs font-medium", page === 13 ? "bg-[#FF6600] text-white" : "hover:bg-muted"].join(" ")}>13</button>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="inline-flex h-8 items-center gap-1 rounded-lg border border-border px-2.5 text-xs font-medium hover:bg-muted">
                Next <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.5} />
              </button>
            </div>
            <Select value={`${perPage} per page`} onChange={(v) => setPerPage(parseInt(v))}
              options={["10 per page","20 per page","50 per page","100 per page"]} />
          </div>
        </section>
      </main>

      <AnimatePresence>
        {selected && <DetailPanel claim={selected} onClose={() => setSelected(null)} onUpdate={(s) => setSelected({ ...selected, status: s })} />}
      </AnimatePresence>
    </>
  );
}

// ═══════════════════════════ REPORTS VIEW ═══════════════════════════
const REPORT_DAILY = [
  { d: "1",  damaged: 4, lost: 2 }, { d: "2", damaged: 5, lost: 1 }, { d: "3", damaged: 3, lost: 3 },
  { d: "4",  damaged: 6, lost: 2 }, { d: "5", damaged: 4, lost: 2 }, { d: "6", damaged: 5, lost: 3 },
  { d: "7",  damaged: 7, lost: 2 }, { d: "8", damaged: 5, lost: 4 }, { d: "9", damaged: 6, lost: 3 },
  { d: "10", damaged: 4, lost: 2 }, { d: "11", damaged: 5, lost: 2 }, { d: "12", damaged: 7, lost: 3 },
  { d: "13", damaged: 6, lost: 2 }, { d: "14", damaged: 5, lost: 4 }, { d: "15", damaged: 7, lost: 3 },
  { d: "16", damaged: 8, lost: 2 }, { d: "17", damaged: 6, lost: 3 }, { d: "18", damaged: 9, lost: 3 },
  { d: "19", damaged: 8, lost: 4 }, { d: "20", damaged: 7, lost: 3 }, { d: "21", damaged: 6, lost: 2 },
  { d: "22", damaged: 7, lost: 3 },
];

const BY_AIRLINE = [
  { airline: "easyJet",           claims: 142, iata: "EZY", color: "#FF6600" },
  { airline: "Air Peace",         claims:  38, iata: "P4",  color: "#006400" },
  { airline: "Malaysia Airlines", claims:  29, iata: "MH",  color: "#C8102E" },
  { airline: "Thai Airways",      claims:  24, iata: "TG",  color: "#6B0F8C" },
  { airline: "Oman Air",          claims:  14, iata: "WY",  color: "#8B0000" },
];

const BY_TYPE = [
  { name: "Damaged suitcase", value: 45, color: "#FF6600" },
  { name: "Damaged contents", value: 23, color: "#F59E0B" },
  { name: "Lost suitcase",    value: 17, color: "#3B82F6" },
  { name: "Lost contents",    value:  9, color: "#14B8A6" },
  { name: "Both damaged",     value:  4, color: "#EF4444" },
  { name: "Both lost",        value:  2, color: "#94A3B8" },
];

const SLA_TABLE = [
  { airline: "easyJet",           iata: "EZY", claims: 142, avg: "2.8d", ack: "98%", first: "91%", fcr: "89%", trend: "up" as const },
  { airline: "Air Peace",         iata: "P4",  claims:  38, avg: "4.1d", ack: "95%", first: "87%", fcr: "84%", trend: "flat" as const },
  { airline: "Malaysia Airlines", iata: "MH",  claims:  29, avg: "3.8d", ack: "97%", first: "89%", fcr: "88%", trend: "up" as const },
  { airline: "Thai Airways",      iata: "TG",  claims:  24, avg: "3.5d", ack: "96%", first: "90%", fcr: "87%", trend: "down" as const },
  { airline: "Oman Air",          iata: "WY",  claims:  14, avg: "4.4d", ack: "94%", first: "85%", fcr: "82%", trend: "flat" as const },
];

const SPARK = [3, 5, 4, 6, 7, 5, 8];

function ReportsView() {
  return (
    <>
      <header className="border-b border-border bg-surface-raised px-6 py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-semibold tracking-tight">Reports</h1>
            <p className="text-xs text-muted-foreground">Performance analytics across all tenants</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value="1 May – 31 May 2026" onChange={() => {}} options={["1 May – 31 May 2026","1 Apr – 30 Apr 2026","1 Mar – 31 Mar 2026","Custom range"]} />
            <button onClick={() => toast.success("PDF export started")} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-surface-raised px-3 text-xs font-semibold hover:bg-muted">
              <Download className="h-3.5 w-3.5" strokeWidth={1.5} /> Export PDF
            </button>
          </div>
        </div>
      </header>

      <main className="space-y-6 p-6">
        {/* Summary metrics */}
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Claims filed"        value="247"     change="↑ 18% vs last month" tone="up" sparkColor="#FF6600" />
          <MetricCard label="Avg resolution time" value="3.2 days" change="↓ 0.4d improvement"  tone="up" sparkColor="#10B981" />
          <MetricCard label="SLA compliance"      value="94.2%"   change="Below 95% target"    tone="warn" gauge={94.2} />
          <MetricCard label="Cost exposure"       value="£18,400" change="↑ £2,100 vs last month" tone="down" sparkColor="#EF4444" />
        </section>

        {/* Daily bar chart */}
        <section className="rounded-2xl border border-border bg-surface-raised p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-display text-base font-semibold">Claims filed</h2>
              <p className="text-xs text-muted-foreground">Daily · May 2026</p>
            </div>
            <div className="flex rounded-lg border border-border bg-surface p-0.5 text-xs font-medium">
              {["Day","Week","Month"].map((t,i) => (
                <button key={t} className={["rounded px-3 py-1", i === 0 ? "bg-surface-raised shadow-sm" : "text-muted-foreground"].join(" ")}>{t}</button>
              ))}
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={REPORT_DAILY} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <XAxis dataKey="d" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Bar dataKey="damaged" stackId="a" fill="#FF6600" radius={[0,0,0,0]} />
                <Bar dataKey="lost"    stackId="a" fill="#F59E0B" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex items-center gap-4 text-xs">
            <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: "#FF6600" }} /> Damaged</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: "#F59E0B" }} /> Lost</span>
          </div>
        </section>

        {/* Two column */}
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-5">
          <div className="rounded-2xl border border-border bg-surface-raised p-5 lg:col-span-3">
            <h2 className="mb-4 font-display text-base font-semibold">By airline</h2>
            <div className="space-y-3">
              {BY_AIRLINE.map((a) => {
                const pct = (a.claims / 142) * 100;
                return (
                  <div key={a.airline} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium">{a.airline} <span className="ml-1 font-mono text-[10px] text-muted-foreground">{a.iata}</span></span>
                      <span className="font-mono font-semibold">{a.claims}</span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.7, ease: "easeOut" }}
                        className="h-full rounded-full" style={{ background: a.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface-raised p-5 lg:col-span-2">
            <h2 className="mb-4 font-display text-base font-semibold">By claim type</h2>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={BY_TYPE} dataKey="value" nameKey="name" innerRadius={45} outerRadius={70} paddingAngle={2}>
                    {BY_TYPE.map((s) => <Cell key={s.name} fill={s.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-3 space-y-1.5">
              {BY_TYPE.map((t) => (
                <li key={t.name} className="flex items-center justify-between text-[11px]">
                  <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm" style={{ background: t.color }} />{t.name}</span>
                  <span className="font-mono font-semibold">{t.value}%</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* SLA table */}
        <section className="rounded-2xl border border-border bg-surface-raised p-5">
          <h2 className="mb-4 font-display text-base font-semibold">SLA performance by airline</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-[10px] uppercase tracking-widest text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="px-3 py-2 text-left">Airline</th>
                  <th className="px-3 py-2 text-right">Claims</th>
                  <th className="px-3 py-2 text-right">Avg resolution</th>
                  <th className="px-3 py-2 text-right">Ack SLA</th>
                  <th className="px-3 py-2 text-right">First response</th>
                  <th className="px-3 py-2 text-right">FCR</th>
                  <th className="px-3 py-2 text-right">Trend</th>
                </tr>
              </thead>
              <tbody>
                {SLA_TABLE.map((r) => (
                  <tr key={r.airline} className="border-b border-border transition-colors duration-150 hover:bg-slate-50 dark:hover:bg-muted/60">
                    <td className="px-3 py-2.5 font-medium">{r.airline} <span className="ml-1 font-mono text-[10px] text-muted-foreground">{r.iata}</span></td>
                    <td className="px-3 py-2.5 text-right font-mono">{r.claims}</td>
                    <td className="px-3 py-2.5 text-right font-mono">{r.avg}</td>
                    <td className="px-3 py-2.5 text-right font-mono">{r.ack}</td>
                    <td className="px-3 py-2.5 text-right font-mono">{r.first}</td>
                    <td className="px-3 py-2.5 text-right font-mono">{r.fcr}</td>
                    <td className="px-3 py-2.5 text-right">
                      {r.trend === "up"   && <TrendingUp   className="ml-auto h-4 w-4 text-emerald-600" strokeWidth={1.5} />}
                      {r.trend === "down" && <TrendingDown className="ml-auto h-4 w-4 text-rose-600"    strokeWidth={1.5} />}
                      {r.trend === "flat" && <ArrowRight   className="ml-auto h-4 w-4 text-muted-foreground" strokeWidth={1.5} />}
                    </td>
                  </tr>
                ))}
                <tr className="bg-muted/50 font-semibold">
                  <td className="px-3 py-2.5">TOTAL</td>
                  <td className="px-3 py-2.5 text-right font-mono">247</td>
                  <td className="px-3 py-2.5 text-right font-mono">3.2d</td>
                  <td className="px-3 py-2.5 text-right font-mono">97%</td>
                  <td className="px-3 py-2.5 text-right font-mono">90%</td>
                  <td className="px-3 py-2.5 text-right font-mono">87%</td>
                  <td className="px-3 py-2.5 text-right"><TrendingUp className="ml-auto h-4 w-4 text-emerald-600" strokeWidth={1.5} /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Handler performance */}
        <section>
          <h2 className="mb-3 font-display text-base font-semibold">Handler performance this month</h2>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {[
              { name: "Aoife K.", claims: 98, avg: "2.9d", sla: "96%", badge: "On track", tone: "bg-emerald-100 text-emerald-800" },
              { name: "Nuala D.", claims: 89, avg: "3.1d", sla: "94%", badge: "Needs attention", tone: "bg-amber-100 text-amber-800" },
              { name: "Marek W.", claims: 60, avg: "3.8d", sla: "91%", badge: "Behind", tone: "bg-red-100 text-red-800" },
            ].map((h) => (
              <div key={h.name} className="rounded-2xl border border-border bg-surface-raised p-4 shadow-[var(--shadow-raised)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                      {h.name.split(" ").map((p) => p[0]).join("")}
                    </div>
                    <div className="font-semibold">{h.name}</div>
                  </div>
                  <span className={["rounded-full px-2.5 py-0.5 text-[10px] font-medium", h.tone].join(" ")}>{h.badge}</span>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <Stat label="Claims" value={String(h.claims)} />
                  <Stat label="Avg"    value={h.avg} />
                  <Stat label="SLA"    value={h.sla} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-display text-lg font-semibold">{value}</div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
    </div>
  );
}

function MetricCard({ label, value, change, tone, sparkColor, gauge }: {
  label: string; value: string; change: string; tone: "up"|"down"|"warn"; sparkColor?: string; gauge?: number;
}) {
  const toneCls = tone === "up" ? "text-emerald-600" : tone === "down" ? "text-rose-600" : "text-amber-600";
  return (
    <div className="rounded-2xl border border-border bg-surface-raised p-4 shadow-[var(--shadow-raised)]">
      <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-1.5 font-display text-2xl font-semibold tracking-tight">{value}</div>
      <div className={["mt-1 text-[11px] font-medium", toneCls].join(" ")}>{change}</div>
      <div className="mt-3 h-8">
        {gauge !== undefined ? (
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <motion.div initial={{ width: 0 }} animate={{ width: `${gauge}%` }} transition={{ duration: 0.8 }}
              className="h-full rounded-full bg-amber-500" />
          </div>
        ) : (
          <div className="flex h-full items-end gap-0.5">
            {SPARK.map((v, i) => (
              <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${(v / 8) * 100}%` }}
                transition={{ delay: i * 0.04, duration: 0.4 }}
                className="flex-1 rounded-t" style={{ background: sparkColor }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════ SETTINGS VIEW ═══════════════════════════
const SETTINGS_NAV = [
  { key: "account",       label: "Account",       icon: User },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "integrations",  label: "Integrations",  icon: Plug },
  { key: "team",          label: "Team",          icon: Users },
  { key: "billing",       label: "Billing",       icon: CreditCard },
];

function SettingsView() {
  const [section, setSection] = useState("account");
  return (
    <>
      <header className="border-b border-border bg-surface-raised px-6 py-4">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Settings</h1>
          <p className="text-xs text-muted-foreground">Manage your account and workspace preferences</p>
        </div>
      </header>
      <main className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-[220px_1fr]">
        {/* Left nav */}
        <aside className="space-y-1 rounded-2xl border border-border bg-surface-raised p-2 h-fit">
          {SETTINGS_NAV.map((s) => {
            const I = s.icon; const on = section === s.key;
            return (
              <button key={s.key} onClick={() => setSection(s.key)}
                className={["flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150",
                  on ? "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300" : "text-muted-foreground hover:bg-muted hover:text-foreground"].join(" ")}>
                <I className="h-4 w-4" strokeWidth={1.5} />
                {s.label}
              </button>
            );
          })}
        </aside>

        <div className="space-y-6">
          {section === "account" && <AccountSection />}
          {section !== "account" && (
            <div className="rounded-2xl border border-border bg-surface-raised p-12 text-center">
              <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-muted text-muted-foreground">
                {(() => { const I = SETTINGS_NAV.find((n) => n.key === section)!.icon; return <I className="h-6 w-6" strokeWidth={1.5} />; })()}
              </div>
              <div className="font-display text-base font-semibold">{SETTINGS_NAV.find((n) => n.key === section)!.label}</div>
              <p className="mt-1 text-sm text-muted-foreground">Configuration available in your full Eagle Claims tier.</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

function AccountSection() {
  const [dirty, setDirty] = useState(false);
  const [prefs, setPrefs] = useState({
    emailNew: true, desktop: false, digest: true, slaBreach: true,
    defaultView: "Dashboard", density: "Comfortable", dateFormat: "DD MMM YYYY",
  });
  const togglePref = (k: keyof typeof prefs, v: boolean | string) => { setPrefs((p) => ({ ...p, [k]: v })); setDirty(true); };

  return (
    <>
      {/* Profile */}
      <section className="rounded-2xl border border-border bg-surface-raised p-6">
        <h2 className="mb-4 font-display text-base font-semibold">Profile</h2>
        <div className="flex items-center gap-4">
          <div className="grid h-11 w-11 place-items-center rounded-full bg-[#FF6600] text-sm font-bold text-white">AK</div>
          <div className="flex-1">
            <div className="font-semibold">Aoife Keane</div>
            <div className="text-xs text-muted-foreground">Senior Claims Handler</div>
          </div>
          <button className="text-xs font-semibold text-blue-600 hover:underline">Edit profile</button>
        </div>
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <ReadField label="Email" value="aoife.keane@eagleclaims.com" />
          <ReadField label="Phone" value="+44 7700 900142" />
          <ReadField label="Timezone" value="Europe/London (GMT+1)" />
          <ReadField label="Language" value="English (UK)" />
        </div>
        <button disabled={!dirty} onClick={() => { toast.success("Profile saved"); setDirty(false); }}
          className="mt-5 inline-flex h-9 items-center rounded-lg bg-[#FF6600] px-4 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-50">
          Save changes
        </button>
      </section>

      {/* Security */}
      <section className="rounded-2xl border border-border bg-surface-raised p-6">
        <h2 className="mb-4 font-display text-base font-semibold">Security</h2>
        <div className="divide-y divide-border">
          <Row3 label="Password" value="•••••••••••" action={<OutlineBtn>Change password</OutlineBtn>} />
          <Row3 label="Two-factor authentication" value={<span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-medium text-amber-800">Not enabled</span>}
            action={<OutlineBtn>Enable 2FA</OutlineBtn>} />
          <Row3 label="Active sessions" value="1 active session" action={<button className="text-xs font-semibold text-blue-600 hover:underline">View all</button>} />
        </div>
      </section>

      {/* Preferences */}
      <section className="rounded-2xl border border-border bg-surface-raised p-6">
        <h2 className="mb-4 font-display text-base font-semibold">Preferences</h2>
        <div className="divide-y divide-border">
          <Toggle label="Email notifications for new claims" on={prefs.emailNew}  onChange={(v) => togglePref("emailNew", v)} />
          <Toggle label="Desktop notifications"              on={prefs.desktop}   onChange={(v) => togglePref("desktop", v)} />
          <Toggle label="Daily digest summary"               on={prefs.digest}    onChange={(v) => togglePref("digest", v)} />
          <Toggle label="SLA breach alerts"                  on={prefs.slaBreach} onChange={(v) => togglePref("slaBreach", v)} />
          <SelectRow label="Default view"   value={prefs.defaultView} options={["Dashboard","Claims","Reports"]}                     onChange={(v) => togglePref("defaultView", v)} />
          <SelectRow label="Table density"  value={prefs.density}     options={["Comfortable","Compact","Spacious"]}                 onChange={(v) => togglePref("density", v)} />
          <SelectRow label="Date format"    value={prefs.dateFormat}  options={["DD MMM YYYY","MM/DD/YYYY","YYYY-MM-DD"]}            onChange={(v) => togglePref("dateFormat", v)} />
        </div>
        <button onClick={() => { toast.success("Preferences saved"); setDirty(false); }}
          className="mt-5 inline-flex h-9 items-center rounded-lg bg-[#FF6600] px-4 text-xs font-semibold text-white hover:opacity-90">
          Save preferences
        </button>
      </section>

      {/* Danger zone */}
      <section className="rounded-2xl border-2 border-red-300 bg-red-50/50 p-6 dark:border-red-900/40 dark:bg-red-500/5">
        <h2 className="mb-1 font-display text-base font-semibold text-red-700 dark:text-red-300">Danger zone</h2>
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="font-semibold">Delete account</div>
            <p className="text-xs text-muted-foreground">This will permanently delete your account and all associated data.</p>
          </div>
          <button onClick={() => toast.error("Confirm in production app")}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-red-600 px-3 text-xs font-semibold text-white hover:bg-red-700">
            <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} /> Delete account
          </button>
        </div>
      </section>
    </>
  );
}

function ReadField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-1 rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm">{value}</div>
    </div>
  );
}
function OutlineBtn({ children }: { children: React.ReactNode }) {
  return <button className="inline-flex h-8 items-center rounded-lg border border-border bg-surface-raised px-3 text-xs font-semibold hover:bg-muted">{children}</button>;
}
function Row3({ label, value, action }: { label: string; value: React.ReactNode; action: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 py-3.5">
      <div>
        <div className="text-sm font-medium">{label}</div>
        <div className="mt-0.5 text-xs text-muted-foreground">{value}</div>
      </div>
      {action}
    </div>
  );
}
function Toggle({ label, on, onChange }: { label: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="text-sm font-medium">{label}</div>
      <button onClick={() => onChange(!on)}
        className={["relative h-6 w-11 rounded-full transition-colors", on ? "bg-[#FF6600]" : "bg-muted"].join(" ")}>
        <span className={["absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform", on ? "translate-x-5" : "translate-x-0.5"].join(" ")} />
      </button>
    </div>
  );
}
function SelectRow({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center justify-between gap-3 py-3">
      <div className="text-sm font-medium">{label}</div>
      <Select value={value} options={options} onChange={onChange} />
    </div>
  );
}

// ═══════════════════════════ SHARED COMPONENTS ═══════════════════════════
function Select({ value, options, onChange }: { value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-surface-raised px-3 text-xs font-medium hover:bg-muted">
        {value}
        <ChevronDown className="h-3.5 w-3.5" strokeWidth={1.5} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {options.map((o) => (
          <DropdownMenuItem key={o} onClick={() => onChange(o)}>{o}</DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ClaimRow({ c, onClick }: { c: DemoClaim; onClick: () => void }) {
  const sla = slaTone(c.slaHours);
  return (
    <tr onClick={onClick} className="cursor-pointer border-t border-border transition-colors duration-150 hover:bg-slate-50 dark:hover:bg-muted/60">
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
}

function SortableTh({ label, k, sortKey, sortDir, onSort }: { label: string; k: SortKey; sortKey: SortKey | null; sortDir: SortDir; onSort: (k: SortKey) => void }) {
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
    <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold text-white"
      style={{ background: meta.color }}>
      {name}
      <span className="font-mono text-[9px] opacity-80">{meta.iata}</span>
    </span>
  );
}

export function StatusPill({ status }: { status: StaffStatus }) {
  const map: Record<StaffStatus, string> = {
    "Submitted":              "bg-slate-100 text-slate-700",
    "Under Review":           "bg-amber-100 text-amber-800",
    "Awaiting Info":          "bg-blue-100 text-blue-800",
    "Awaiting Airline":       "bg-indigo-100 text-indigo-800",
    "Approved Repair":        "bg-green-100 text-green-800",
    "Approved Replacement":   "bg-emerald-100 text-emerald-800",
    "Completed":              "bg-green-100 text-green-800",
    "Rejected":               "bg-red-100 text-red-800",
  };
  return <span className={["inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", map[status] || STATUS_TONE[status]].join(" ")}>{status}</span>;
}

function DetailPanel({ claim, onClose, onUpdate }: { claim: DemoClaim; onClose: () => void; onUpdate: (s: StaffStatus) => void }) {
  const [tab, setTab] = useState<"details" | "timeline" | "notes" | "photos">("details");
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState<{ at: string; text: string; who: string }[]>([
    { at: "23 May 2026, 09:12", who: "Aoife K.", text: "Reviewing photos. Damage looks consistent with handling crush." },
  ]);
  const allowed = TRANSITIONS[claim.status];

  const flightFields: [string, string][] = [
    ["Airline", claim.airline], ["Flight", claim.flight], ["Route", claim.route],
    ["Date", claim.date], ["Booking ref", "U2-HK9X4P"],
  ];
  const bagFields: [string, string][] = [
    ["Type", "Suitcase"], ["Brand", "Samsonite"], ["Colour", "Navy"], ["Size", "Large"],
    ["Bag tag", "EZY827341"], ["Estimated value", `£${claim.amount ?? 0}`], ["PIR number", "LGWBA21043"],
  ];

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />
      <motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 240, damping: 30, duration: 0.3 }}
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col bg-background shadow-2xl">
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
              {(["details","timeline","notes","photos"] as const).map((k) => (
                <button key={k} onClick={() => setTab(k)}
                  className={["rounded-full px-3 py-1 capitalize transition-colors", tab === k ? "bg-surface-raised text-foreground shadow-sm" : "text-muted-foreground"].join(" ")}>
                  {k}
                </button>
              ))}
            </div>
          </div>
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
                { at: "23 May 2026, 09:12", what: "Marked Under Review",     who: "Aoife K." },
                { at: "23 May 2026, 11:30", what: "Photos verified",         who: "System" },
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
                <button className="inline-flex h-10 items-center justify-center rounded-lg gradient-primary px-4 text-xs font-semibold text-primary-foreground">Add note</button>
              </form>
            </div>
          )}
          {tab === "photos" && (
            <div className="grid grid-cols-3 gap-2">
              {[1,2,3,4].map((i) => (
                <div key={i} className="grid aspect-square place-items-center rounded-xl bg-muted text-xs text-muted-foreground">Photo {i}</div>
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
    <button type="button" onClick={() => toast.success("Action recorded")}
      className={["inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-semibold transition-colors", cls].join(" ")}>
      <Icon className="h-3.5 w-3.5" strokeWidth={1.5} />
      {label}
    </button>
  );
}
