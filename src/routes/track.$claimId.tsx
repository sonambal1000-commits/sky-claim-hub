import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Plane, Calendar, Package } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { findClaim, STATUS_LABEL, CLAIM_TYPE_LABEL, type ClaimStatus } from "@/lib/claims-storage";

export const Route = createFileRoute("/track/$claimId")({
  head: () => ({ meta: [{ title: "Claim status · Eagle Claims Portal" }] }),
  component: TrackDetailPage,
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-3xl px-4 py-12 text-center">
        <h1 className="font-display text-xl font-semibold">Claim not found</h1>
        <Link to="/track" className="mt-4 inline-block text-sm text-primary underline-offset-4 hover:underline">
          Try another reference
        </Link>
      </main>
    </div>
  ),
});

const STATUS_FLOW: ClaimStatus[] = [
  "submitted",
  "under_review",
  "awaiting_pax",
  "completed",
];

const STATUS_COLOR: Record<ClaimStatus, string> = {
  submitted: "bg-status-submitted/15 text-status-submitted",
  under_review: "bg-status-review/15 text-status-review",
  awaiting_pax: "bg-status-pax/15 text-status-pax",
  awaiting_airline: "bg-status-airline/15 text-status-airline",
  approved_repair: "bg-status-repair/15 text-status-repair",
  approved_replace: "bg-status-replace/15 text-status-replace",
  completed: "bg-status-completed/15 text-status-completed",
  rejected: "bg-status-rejected/15 text-status-rejected",
};

function TrackDetailPage() {
  const { claimId } = Route.useParams();
  const claim = findClaim(claimId);
  if (!claim) throw notFound();

  const currentIdx = STATUS_FLOW.indexOf(claim.status);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-3xl space-y-5 px-4 py-6">
        <Link
          to="/track"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </Link>

        <section className="rounded-2xl border border-border bg-surface-raised p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Reference
              </div>
              <div className="mt-0.5 font-mono text-lg font-semibold text-primary">
                {claim.reference}
              </div>
            </div>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${STATUS_COLOR[claim.status]}`}
            >
              {STATUS_LABEL[claim.status]}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 text-sm">
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
              {CLAIM_TYPE_LABEL[claim.type]}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-surface-raised p-5">
          <h2 className="font-display text-base font-semibold">Status</h2>
          <ol className="mt-4 space-y-3">
            {STATUS_FLOW.map((s, i) => {
              const done = i < currentIdx;
              const active = i === currentIdx;
              return (
                <li key={s} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={[
                        "grid h-8 w-8 place-items-center rounded-full text-xs font-semibold",
                        done && "bg-success text-success-foreground",
                        active && "gradient-primary text-primary-foreground",
                        !done && !active && "bg-secondary text-muted-foreground",
                      ].filter(Boolean).join(" ")}
                    >
                      {i + 1}
                    </div>
                    {i < STATUS_FLOW.length - 1 && <div className="my-1 h-6 w-px bg-border" />}
                  </div>
                  <div className="pt-1">
                    <div className="text-sm font-semibold">{STATUS_LABEL[s]}</div>
                    {active && (
                      <div className="mt-0.5 flex items-center gap-1.5 text-xs text-primary">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="absolute inline-flex h-full w-full animate-[pulse-dot_1.8s_ease-in-out_infinite] rounded-full bg-primary opacity-60" />
                          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
                        </span>
                        In progress
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        <section className="rounded-2xl border border-border bg-surface-raised p-5">
          <h2 className="font-display text-base font-semibold">Activity</h2>
          <div className="mt-3 space-y-2">
            {claim.timeline.map((t, i) => (
              <div key={i} className="flex items-baseline justify-between gap-3 border-b border-border/60 py-2 last:border-0">
                <span className="text-sm font-medium">{STATUS_LABEL[t.status]}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(t.at).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
