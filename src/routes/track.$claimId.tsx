import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Plane, Calendar, Package, MessageSquare } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { findClaim, STATUS_LABEL } from "@/lib/claims-storage";

export const Route = createFileRoute("/track/$claimId")({
  head: () => ({ meta: [{ title: "Claim status · Eagle Claims Portal" }] }),
  component: TrackDetailPage,
});

type Step = { key: string; label: string; state: "done" | "active" | "locked"; date?: string; sub?: string };

function TrackDetailPage() {
  const { claimId } = Route.useParams();
  const stored = findClaim(claimId);

  // Demo: any unknown id shows the canonical demo claim
  const claim = stored ?? {
    id: claimId,
    reference: claimId.startsWith("demo-") ? claimId.replace("demo-", "") : "EC-260527-4821",
    status: "under_review" as const,
    flight: { flightNo: "U2 8472", date: "22 May 2026", from: "London Gatwick (LGW)", to: "Palma de Mallorca (PMI)" },
  };

  const steps: Step[] = [
    { key: "submitted", label: "Submitted", state: "done", date: "22 May 2026, 18:42" },
    { key: "review", label: "Under Review", state: "active", sub: "SLA: response within 24 hours" },
    { key: "decision", label: "Decision", state: "locked" },
    { key: "completed", label: "Completed", state: "locked" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-3xl space-y-5 px-4 py-6">
        <Link to="/track" className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </Link>

        <section className="rounded-2xl border border-border bg-surface-raised p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Reference</div>
              <div className="mt-0.5 font-mono text-lg font-semibold text-primary">{claim.reference}</div>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-warning/15 px-2.5 py-1 text-[11px] font-semibold text-warning">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-[pulse-dot_1.8s_ease-in-out_infinite] rounded-full bg-warning opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-warning" />
              </span>
              Under Review
            </span>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-2.5 text-sm">
            <div className="flex items-center gap-2 text-foreground">
              <Plane className="h-4 w-4 text-muted-foreground" />
              {claim.flight.flightNo} · {claim.flight.from} → {claim.flight.to}
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              {claim.flight.date}
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <Package className="h-4 w-4 text-muted-foreground" />
              Damaged suitcase
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-surface-raised p-5">
          <h2 className="font-display text-base font-semibold">Status</h2>
          <ol className="mt-4 space-y-3">
            {steps.map((s, i) => (
              <li key={s.key} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={[
                      "grid h-9 w-9 place-items-center rounded-full text-xs font-semibold",
                      s.state === "done" && "bg-success text-success-foreground",
                      s.state === "active" && "bg-warning/15 text-warning ring-2 ring-warning/40",
                      s.state === "locked" && "bg-secondary text-muted-foreground",
                    ].filter(Boolean).join(" ")}
                  >
                    {s.state === "active" ? (
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-[pulse-dot_1.8s_ease-in-out_infinite] rounded-full bg-warning opacity-60" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-warning" />
                      </span>
                    ) : (
                      i + 1
                    )}
                  </div>
                  {i < steps.length - 1 && <div className="my-1 h-8 w-px bg-border" />}
                </div>
                <div className="pt-1.5">
                  <div className="text-sm font-semibold">{s.label}</div>
                  {s.date && <div className="text-[11px] text-muted-foreground">{s.date}</div>}
                  {s.sub && <div className="text-[11px] text-warning">{s.sub}</div>}
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="rounded-2xl border border-border bg-surface-raised p-5">
          <h2 className="flex items-center gap-2 font-display text-base font-semibold">
            <MessageSquare className="h-4 w-4 text-primary" /> Messages from the team
          </h2>
          <div className="mt-3 rounded-xl bg-muted p-3">
            <div className="text-[11px] font-medium text-muted-foreground">Eagle Claims · 23 May 2026, 09:12</div>
            <p className="mt-1 text-sm text-foreground">
              We have received your claim and it is currently under review.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
