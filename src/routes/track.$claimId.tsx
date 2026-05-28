import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Plane, Calendar, Package, Bell, Lock, CheckCircle2 } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { AIRLINE_META } from "@/lib/demo-data";

export const Route = createFileRoute("/track/$claimId")({
  head: () => ({ meta: [{ title: "Claim status · Eagle Claims Portal" }] }),
  component: TrackDetailPage,
});

type Step = { key: string; label: string; state: "done" | "active" | "locked"; date?: string; sub?: string };

function TrackDetailPage() {
  const { claimId } = Route.useParams();
  const reference = claimId.toUpperCase().startsWith("EC-") ? claimId.toUpperCase() : "EC-260527-4821";

  const airline = AIRLINE_META["easyJet"];

  const steps: Step[] = [
    { key: "submitted", label: "Submitted",    state: "done",   date: "22 May 2026, 18:42" },
    { key: "review",    label: "Under Review", state: "active", sub: "Our team is reviewing your claim. We aim to respond within 48 hours." },
    { key: "decision",  label: "Decision",     state: "locked" },
    { key: "completed", label: "Completed",    state: "locked" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-2xl space-y-5 px-4 py-6">
        <Link to="/track" className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to lookup
        </Link>

        {/* Header card */}
        <section className="rounded-2xl border border-border bg-surface-raised p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Reference</div>
              <code className="mt-0.5 block font-mono text-lg font-bold text-primary">{reference}</code>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-2.5 py-1 text-[11px] font-semibold text-amber-600 dark:text-amber-300">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-[pulse-dot_1.8s_ease-in-out_infinite] rounded-full bg-amber-500 opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-500" />
              </span>
              Under Review
            </span>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold text-white"
              style={{ background: airline.color }}
            >
              easyJet
              <span className="font-mono text-[9px] opacity-80">{airline.iata}</span>
            </span>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-2.5 text-sm">
            <div className="flex items-center gap-2 text-foreground">
              <Plane className="h-4 w-4 text-muted-foreground" />
              U2 8472 · LGW → PMI
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              22 May 2026
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <Package className="h-4 w-4 text-muted-foreground" />
              Damaged suitcase
            </div>
          </div>
        </section>

        {/* Vertical timeline */}
        <section className="rounded-2xl border border-border bg-surface-raised p-5">
          <h2 className="font-display text-base font-semibold">Status</h2>
          <ol className="mt-4 space-y-1">
            {steps.map((s, i) => (
              <li key={s.key} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={[
                      "grid h-9 w-9 place-items-center rounded-full text-xs font-semibold",
                      s.state === "done"   && "bg-success text-success-foreground",
                      s.state === "active" && "bg-amber-500/15 text-amber-600 ring-2 ring-amber-500/40 dark:text-amber-300",
                      s.state === "locked" && "bg-secondary text-muted-foreground",
                    ].filter(Boolean).join(" ")}
                  >
                    {s.state === "done"   && <CheckCircle2 className="h-4 w-4" />}
                    {s.state === "active" && (
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-[pulse-dot_1.8s_ease-in-out_infinite] rounded-full bg-amber-500 opacity-60" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
                      </span>
                    )}
                    {s.state === "locked" && <Lock className="h-3.5 w-3.5" />}
                  </div>
                  {i < steps.length - 1 && <div className="my-1 h-10 w-px bg-border" />}
                </div>
                <div className="flex-1 pt-1.5 pb-4">
                  <div className="text-sm font-semibold">{s.label}</div>
                  {s.date && <div className="mt-0.5 text-[11px] text-muted-foreground">{s.date}</div>}
                  {s.sub && <div className="mt-1 text-xs text-foreground/80">{s.sub}</div>}
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* iMessage-style message thread */}
        <section className="rounded-2xl border border-border bg-surface-raised p-5">
          <h2 className="font-display text-base font-semibold">Messages</h2>
          <div className="mt-4 flex items-start gap-2.5">
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary-light-bg text-[10px] font-bold text-primary">
              EC
            </div>
            <div className="max-w-[85%]">
              <div className="text-[11px] font-medium text-muted-foreground">Eagle Claims Team</div>
              <div className="mt-1 rounded-2xl rounded-tl-sm bg-muted px-4 py-3 text-sm leading-relaxed text-foreground">
                Hi Sarah, we've received your claim for the damaged Samsonite suitcase. Our team is currently reviewing the photos you provided. We may reach out if we need any additional information. Thank you for your patience.
              </div>
              <div className="mt-1 text-[10px] text-muted-foreground">23 May 2026, 09:15</div>
            </div>
          </div>
        </section>

        {/* Info box */}
        <div className="flex items-start gap-2 rounded-xl bg-info/10 p-3.5 text-xs text-foreground">
          <Bell className="mt-0.5 h-3.5 w-3.5 shrink-0 text-info" />
          <span>We'll notify you by email when there's an update on your claim.</span>
        </div>
      </main>
    </div>
  );
}
