import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import {
  Lock, Download, FileJson, FileText, Mail, Copy, ChevronDown, Code2, Inbox,
  CheckCircle, Clock, Star, type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { AppHeader } from "@/components/app-header";
import { DEMO_CLAIMS, slaTone, formatSla } from "@/lib/demo-data";
import { useTenant } from "@/components/tenant-provider";
import { AirlinePill, StatusPill } from "./staff.dashboard";

export const Route = createFileRoute("/airline")({
  head: () => ({ meta: [{ title: "Airline dashboard · Eagle Claims" }] }),
  component: AirlinePage,
});

const PER_DAY = [
  { d: "May 9",  damaged: 4, lost: 1 }, { d: "10", damaged: 6, lost: 2 },
  { d: "11", damaged: 3, lost: 0 }, { d: "12", damaged: 5, lost: 1 },
  { d: "13", damaged: 7, lost: 2 }, { d: "14", damaged: 4, lost: 3 },
  { d: "15", damaged: 6, lost: 1 }, { d: "16", damaged: 8, lost: 2 },
  { d: "17", damaged: 5, lost: 1 }, { d: "18", damaged: 9, lost: 2 },
  { d: "19", damaged: 7, lost: 3 }, { d: "20", damaged: 6, lost: 2 },
  { d: "21", damaged: 8, lost: 1 }, { d: "22", damaged: 5, lost: 4 },
];

const BY_TYPE = [
  { t: "Damaged suitcase",  v: 112 },
  { t: "Damaged contents",  v: 58 },
  { t: "Lost suitcase",     v: 41 },
  { t: "Lost contents",     v: 22 },
  { t: "Both damaged",      v: 9 },
  { t: "Both lost",         v: 5 },
];

function AirlinePage() {
  const [openApi, setOpenApi] = useState(false);
  const { tenant, tenantInfo, setTenant } = useTenant();

  // Default to easyJet view on first load
  useEffect(() => {
    if (tenant === "eagle") setTenant("easyjet");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const copyApi = () => {
    navigator.clipboard.writeText(`GET https://api.eagleclaims.io/v1/claims\nAuthorization: Bearer <token>`);
    toast.info("API snippet copied");
  };

  const displayName = tenant === "eagle" ? "easyJet" : tenantInfo.name;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              {displayName} · Powered by Eagle Claims
            </div>
            <h1 className="font-display text-2xl font-semibold tracking-tight">Airline operations</h1>
            <p className="text-sm text-muted-foreground">Live view of your claims activity, powered by Eagle.</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
            <Lock className="h-3.5 w-3.5" />
            Read only
          </span>
        </div>

        {/* KPIs */}
        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { l: "Total claims",   v: "247",   sub: "All time",          accent: "border-l-teal-500" },
            { l: "Open claims",    v: "38",    sub: "Awaiting action",   accent: "border-l-amber-500" },
            { l: "Avg resolution", v: "3.2 d", sub: "Last 30 days",      accent: "border-l-blue-500" },
            { l: "SLA compliance", v: "94.2%", sub: "Below 95% target",  accent: "border-l-amber-500", warn: true },
          ].map((k) => (
            <div key={k.l} className={["rounded-2xl border border-border border-l-4 bg-surface-raised p-4 shadow-[var(--shadow-raised)]", k.accent].join(" ")}>
              <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{k.l}</div>
              <div className={["mt-1.5 font-display text-2xl font-semibold tracking-tight", k.warn && "text-amber-600 dark:text-amber-300"].filter(Boolean).join(" ")}>
                {k.v}
              </div>
              <div className="text-[11px] text-muted-foreground">{k.sub}</div>
            </div>
          ))}
        </section>

        {/* Charts */}
        <section className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-2xl border border-border bg-surface-raised p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-base font-semibold">Claims per day · 14 days</h2>
              <div className="text-[11px] text-muted-foreground">Damaged vs Lost</div>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={PER_DAY}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="d" stroke="var(--color-muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
                <Tooltip contentStyle={{ background: "var(--color-surface-raised)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                <Bar dataKey="damaged" stackId="a" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="lost"    stackId="a" fill="var(--color-accent)"  radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-2xl border border-border bg-surface-raised p-5">
            <h2 className="mb-3 font-display text-base font-semibold">By claim type</h2>
            <div className="space-y-2.5">
              {BY_TYPE.map((b) => {
                const pct = (b.v / 120) * 100;
                return (
                  <div key={b.t}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{b.t}</span>
                      <span className="font-semibold">{b.v}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <motion.div
                        initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6 }}
                        className="h-full gradient-primary"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* SLA Gauges */}
        <section className="grid gap-4 sm:grid-cols-3">
          {([
            { l: "Acknowledgement", v: 98, tone: "ok", icon: CheckCircle, iconClass: "text-emerald-500" },
            { l: "First response",  v: 91, tone: "warn", icon: Clock, iconClass: "text-amber-500" },
            { l: "First contact resolution", v: 94, tone: "warn", icon: Star, iconClass: "text-blue-500" },
          ] as const).map((g) => <Gauge key={g.l} {...g} />)}
        </section>

        {/* Claims table */}
        <section className="rounded-2xl border border-border bg-surface-raised">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h2 className="font-display text-base font-semibold">Your claims</h2>
            <span className="text-[11px] text-muted-foreground">Showing {DEMO_CLAIMS.length} of 247</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted text-[10px] uppercase tracking-widest text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left">Ref</th>
                  <th className="px-4 py-3 text-left">Airline</th>
                  <th className="px-4 py-3 text-left">Passenger</th>
                  <th className="px-4 py-3 text-left">Type</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">SLA</th>
                </tr>
              </thead>
              <tbody>
                {DEMO_CLAIMS.length === 0 ? (
                  <tr><td colSpan={6}>
                    <div className="flex flex-col items-center gap-2 py-12 text-center">
                      <Inbox className="h-8 w-8 text-muted-foreground" />
                      <div className="text-sm font-semibold">No claims found</div>
                      <div className="text-xs text-muted-foreground">Try adjusting filters</div>
                    </div>
                  </td></tr>
                ) : DEMO_CLAIMS.map((c) => {
                  const sla = slaTone(c.slaHours);
                  return (
                    <tr key={c.ref} className="border-t border-border">
                      <td className="px-4 py-3"><span className="rounded-md bg-primary-light-bg px-2 py-1 font-mono text-[11px] font-semibold text-primary">{c.ref}</span></td>
                      <td className="px-4 py-3"><AirlinePill name={c.airline} /></td>
                      <td className="px-4 py-3 font-medium">{c.passenger}</td>
                      <td className="px-4 py-3 text-muted-foreground">{c.type}</td>
                      <td className="px-4 py-3"><StatusPill status={c.status} /></td>
                      <td className="px-4 py-3">
                        <span className={["inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold", sla.pill, sla.text].join(" ")}>
                          {formatSla(c.slaHours)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap gap-2 border-t border-border bg-muted/40 px-4 py-3">
            {[
              { l: "CSV",   icon: Download },
              { l: "JSON",  icon: FileJson },
              { l: "PDF",   icon: FileText },
              { l: "Email", icon: Mail },
            ].map(({ l, icon: I }) => (
              <button key={l} onClick={() => toast.info(`${l} export queued`)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-raised px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-surface">
                <I className="h-3.5 w-3.5" />
                Export {l}
              </button>
            ))}
          </div>
        </section>

        {/* API */}
        <section className="rounded-2xl border border-border bg-surface-raised">
          <button onClick={() => setOpenApi(!openApi)} className="flex w-full items-center justify-between px-5 py-4 text-left">
            <div className="flex items-center gap-2">
              <Code2 className="h-4 w-4 text-primary" />
              <span className="font-display text-base font-semibold">API reference</span>
              <span className="rounded-full bg-primary-light-bg px-2 py-0.5 text-[10px] font-semibold text-primary">v1</span>
            </div>
            <ChevronDown className={["h-4 w-4 text-muted-foreground transition-transform", openApi && "rotate-180"].filter(Boolean).join(" ")} />
          </button>
          {openApi && (
            <div className="border-t border-border p-5">
              <div className="flex items-center justify-between gap-3">
                <pre className="flex-1 overflow-x-auto rounded-xl bg-[#0F172A] p-4 text-[12px] leading-relaxed text-emerald-300">
{`GET https://api.eagleclaims.io/v1/claims
Authorization: Bearer <token>
Accept: application/json`}
                </pre>
                <button onClick={copyApi} aria-label="Copy"
                  className="grid h-10 w-10 place-items-center rounded-lg border border-border bg-surface-raised text-muted-foreground hover:text-foreground">
                  <Copy className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">Webhooks, OpenAPI spec and SDK clients available on request.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function Gauge({ l, v, tone, icon: Icon, iconClass }: { l: string; v: number; tone: "ok" | "warn"; icon: LucideIcon; iconClass: string }) {
  const color = tone === "ok" ? "text-emerald-500" : "text-amber-500";
  const ring  = tone === "ok" ? "stroke-emerald-500" : "stroke-amber-500";
  const r = 40, c = 2 * Math.PI * r;
  const offset = c - (v / 100) * c;
  return (
    <div className="rounded-2xl border border-border bg-surface-raised p-5 text-center">
      <div className="flex items-center justify-center gap-1.5 text-[14px] font-semibold uppercase tracking-wider text-muted-foreground">
        <Icon className={["h-4 w-4", iconClass].join(" ")} strokeWidth={1.5} />
        {l}
      </div>
      <div className="relative mx-auto mt-3 h-28 w-28">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <circle cx="50" cy="50" r={r} fill="none" stroke="var(--color-muted)" strokeWidth="9" />
          <motion.circle cx="50" cy="50" r={r} fill="none" strokeWidth="9" strokeLinecap="round"
            className={ring} strokeDasharray={c}
            initial={{ strokeDashoffset: c }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          />
        </svg>
        <div className={["absolute inset-0 grid place-items-center font-display text-2xl font-bold tracking-tight", color].join(" ")}>
          {v}%
        </div>
      </div>
    </div>
  );
}
