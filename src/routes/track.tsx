import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Search, Plane, Calendar, Bell, Lock, CheckCircle2, MessageSquare } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AppHeader } from "@/components/app-header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AIRLINE_META } from "@/lib/demo-data";

export const Route = createFileRoute("/track")({
  head: () => ({
    meta: [
      { title: "Track a claim · Eagle Claims Portal" },
      { name: "description", content: "Track the status of your existing baggage claim." },
    ],
  }),
  component: TrackPage,
});

const DEMO_REF = "EC-260527-4821";

function TrackPage() {
  const [ref, setRef] = useState("");
  const [showResult, setShowResult] = useState(false);

  function handleLookup() {
    setShowResult(true);
  }

  function handleDemoLink() {
    setRef(DEMO_REF);
    setShowResult(true);
  }

  const reference = ref.trim() ? ref.trim().toUpperCase() : DEMO_REF;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-3xl px-4 py-6">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
          Back
        </Link>
        <div className="mt-4 space-y-1.5">
          <h1 className="font-display text-[26px] font-semibold tracking-tight">Track your claim</h1>
          <p className="text-sm text-muted-foreground">
            Enter the reference we emailed when you filed your claim.
          </p>
        </div>

        <form onSubmit={submit} className="mt-6 space-y-3 rounded-2xl border border-border bg-surface-raised p-4">
          <div>
            <Label htmlFor="ref">Claim reference</Label>
            <Input id="ref" placeholder="EC-260527-4821" value={ref}
              onChange={(e) => setRef(e.target.value.toUpperCase())}
              className="mt-1.5 h-12 font-mono uppercase tracking-wider" autoComplete="off" />
          </div>
          <button type="submit" className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl gradient-primary text-sm font-semibold text-primary-foreground shadow-[var(--shadow-elegant)]">
            <Search className="h-4 w-4" strokeWidth={1.5} />
            Look up claim
          </button>
          <p className="text-center text-[11px] text-muted-foreground">
            Try the demo: <button type="button" onClick={fillDemo} className="font-mono text-primary hover:underline">{DEMO_REF}</button>
          </p>
        </form>

        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ type: "spring", stiffness: 220, damping: 26 }}
              className="mt-6"
            >
              <ResultCard reference={reference} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function ResultCard({ reference }: { reference: string }) {
  const airline = AIRLINE_META["easyJet"];

  const steps = [
    { key: "submitted", label: "Submitted",    state: "done" as const,   date: "22 May 2026, 18:42" },
    { key: "review",    label: "Under Review", state: "active" as const, sub: "Our team is reviewing your claim. We aim to respond within 48 hours." },
    { key: "decision",  label: "Decision",     state: "locked" as const },
    { key: "completed", label: "Completed",    state: "locked" as const },
  ];

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-border bg-surface-raised p-5 shadow-[var(--shadow-raised)]">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Reference</div>
            <code className="mt-0.5 block font-mono text-lg font-bold text-primary">{reference}</code>
            <div className="mt-2 text-sm font-semibold">Sarah Mitchell</div>
            <div className="text-xs text-muted-foreground">Damaged suitcase · Submitted 22 May 2026</div>
          </div>
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold text-white"
            style={{ background: airline.color }}
          >
            <Plane className="h-3 w-3" strokeWidth={1.5} />
            easyJet · {airline.iata}
          </span>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
          <div className="rounded-xl bg-surface p-2.5">
            <div className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-muted-foreground"><Plane className="h-3 w-3" strokeWidth={1.5} />Flight</div>
            <div className="mt-0.5 font-semibold">U2 8472</div>
          </div>
          <div className="rounded-xl bg-surface p-2.5">
            <div className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-muted-foreground"><Calendar className="h-3 w-3" strokeWidth={1.5} />Date</div>
            <div className="mt-0.5 font-semibold">22 May 2026</div>
          </div>
          <div className="rounded-xl bg-surface p-2.5">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Route</div>
            <div className="mt-0.5 font-semibold">LGW → PMI</div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-surface-raised p-5">
        <h2 className="font-display text-base font-semibold tracking-tight">Status</h2>
        <ol className="mt-4 space-y-4">
          {steps.map((s, i) => {
            const isLast = i === steps.length - 1;
            return (
              <li key={s.key} className="relative flex gap-3">
                {!isLast && (
                  <span
                    className={[
                      "absolute left-[14px] top-7 h-[calc(100%-4px)] w-px",
                      s.state === "done" ? "bg-primary" : "bg-border",
                    ].join(" ")}
                  />
                )}
                <div
                  className={[
                    "relative z-10 grid h-7 w-7 shrink-0 place-items-center rounded-full",
                    s.state === "done" && "gradient-primary text-primary-foreground",
                    s.state === "active" && "border-2 border-primary bg-surface-raised text-primary",
                    s.state === "locked" && "border-2 border-border bg-surface-raised text-muted-foreground",
                  ].filter(Boolean).join(" ")}
                >
                  {s.state === "done" ? <CheckCircle2 className="h-4 w-4" strokeWidth={1.5} /> :
                   s.state === "locked" ? <Lock className="h-3 w-3" strokeWidth={1.5} /> : <span className="text-[10px] font-semibold">{i + 1}</span>}
                  {s.state === "active" && <span className="absolute inset-0 animate-[pulse-dot_2s_ease-in-out_infinite] rounded-full bg-primary/30" />}
                </div>
                <div className="flex-1 pb-1">
                  <div className={["text-sm font-semibold", s.state === "locked" ? "text-muted-foreground" : "text-foreground"].join(" ")}>{s.label}</div>
                  {s.date && <div className="text-[11px] text-muted-foreground">{s.date}</div>}
                  {s.sub && <div className="mt-1 text-xs text-muted-foreground">{s.sub}</div>}
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="rounded-2xl border border-border bg-surface-raised p-5">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground">
            <MessageSquare className="h-4 w-4" strokeWidth={1.5} />
          </div>
          <div className="text-sm font-semibold">Eagle Claims Team</div>
        </div>
        <div className="mt-3 rounded-2xl rounded-tl-md bg-muted p-3 text-sm leading-relaxed">
          Hi Sarah — we've received your claim and assigned it to Aoife. She'll review your photos and reply within 48 hours. Thanks for your patience.
        </div>
        <div className="mt-1.5 pl-1 text-[11px] text-muted-foreground">23 May 2026, 09:15</div>
      </section>

      <div className="flex items-start gap-2 rounded-xl bg-info/10 p-3 text-xs">
        <Bell className="mt-0.5 h-3.5 w-3.5 shrink-0 text-info" strokeWidth={1.5} />
        <span>We'll notify you by email when there's an update on your claim.</span>
      </div>
    </div>
  );
}
