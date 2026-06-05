import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  ArrowLeft, FileText, MessageCircle, Package, Send, CheckCircle2,
  Plane, User, Calendar, MapPin, Hash, Briefcase, Receipt, ChevronRight,
} from "lucide-react";
import { DEMO_CLAIMS, STATUS_TONE, slaTone, formatSla, AIRLINE_META } from "@/lib/demo-data";

export const Route = createFileRoute("/staff/claims/$claimId")({
  head: ({ params }) => ({
    meta: [{ title: `Claim ${params.claimId} · Eagle Claims` }],
  }),
  loader: ({ params }) => {
    const claim = DEMO_CLAIMS.find((c) => c.ref === params.claimId);
    if (!claim) throw notFound();
    return { claim };
  },
  component: ClaimDetailPage,
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center bg-background">
      <div className="text-center">
        <p className="font-serif text-3xl">Claim not found</p>
        <Link to="/staff/dashboard" className="mt-4 inline-block text-sm text-primary underline">
          Back to console
        </Link>
      </div>
    </div>
  ),
  errorComponent: () => (
    <div className="grid min-h-screen place-items-center bg-background">
      <p className="font-serif text-2xl">Something went wrong loading this claim.</p>
    </div>
  ),
});

const ACTIONS = [
  { label: "Reply to passenger", icon: MessageCircle },
  { label: "Assess item", icon: Package },
  { label: "Propose replacement", icon: Send },
  { label: "Issue decision", icon: CheckCircle2 },
];

function ClaimDetailPage() {
  const { claim } = Route.useLoaderData();
  const meta = AIRLINE_META[claim.airline];
  const sla = slaTone(claim.slaHours);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <header className="border-b border-border/60 bg-surface-raised/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-8 py-5">
          <Link
            to="/staff/dashboard"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
            Console
          </Link>
          <nav className="flex items-center gap-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            <span>Claims</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">{claim.ref}</span>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-8 py-12">
        {/* Editorial header */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="border-b border-border/60 pb-10"
        >
          <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            <span
              className="inline-flex h-6 items-center rounded-full px-2.5 text-[10px] font-bold text-white"
              style={{ background: meta.color }}
            >
              {meta.iata} · {claim.airline}
            </span>
            <span className={`inline-flex h-6 items-center rounded-full px-2.5 ${STATUS_TONE[claim.status]}`}>
              {claim.status}
            </span>
            <span className={`inline-flex items-center gap-1.5 ${sla.text}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${sla.dot}`} />
              SLA {formatSla(claim.slaHours)}
            </span>
          </div>

          <h1
            className="mt-6 text-balance text-5xl leading-[1.05] tracking-tight md:text-6xl"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {claim.type}, <span className="italic text-primary">{claim.passenger.split(" ")[0]}'s</span> bag.
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            Filed {claim.date} for flight {claim.flight} — {claim.route}. Reference{" "}
            <span className="font-mono text-foreground">{claim.ref}</span>.
          </p>

          {/* Action row */}
          <div className="mt-8 flex flex-wrap items-center gap-2">
            {ACTIONS.map(({ label, icon: Icon }) => (
              <button
                key={label}
                className="group inline-flex items-center gap-2 rounded-full border border-primary/15 bg-surface-raised px-4 py-2 text-[13px] font-medium text-foreground transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[var(--shadow-soft)]"
              >
                <Icon className="h-3.5 w-3.5 text-primary" strokeWidth={1.5} />
                {label}
              </button>
            ))}
            <Link
              to="/staff/claims/$claimId/record"
              params={{ claimId: claim.ref }}
              className="ml-auto inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-[13px] font-semibold text-primary-foreground shadow-[var(--shadow-elegant)] transition-all hover:-translate-y-0.5 hover:bg-primary-dark"
            >
              <FileText className="h-3.5 w-3.5" strokeWidth={1.75} />
              Open full record
            </Link>
          </div>
        </motion.section>

        {/* Two-column editorial body */}
        <section className="grid gap-12 pt-12 md:grid-cols-[1.4fr_1fr]">
          <div className="space-y-10">
            <Article title="Passenger account">
              <p className="text-[17px] leading-[1.7] text-foreground/85">
                <span className="font-medium text-foreground">{claim.passenger}</span> reported{" "}
                <span className="italic">{claim.type.toLowerCase()}</span> upon arrival.
                Internal handler{" "}
                <span className="font-medium text-foreground">{claim.handler}</span> picked up the
                case and is coordinating directly with the carrier.
              </p>
              <p className="mt-4 text-[15px] leading-[1.7] text-muted-foreground">
                The bag, a medium hard-shell spinner in charcoal, arrived with the right wheel
                detached and a deep impact dent along the lower spine. Photographic evidence and a
                Property Irregularity Report were lodged at the carousel.
              </p>
            </Article>

            <Article title="Decision &amp; cost">
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <Field label="Public justification" value="Needs wheel, handle and dent repair." wide />
                <Field label="Cost to Eagle" value="£950.00" />
                <Field label="Cost to airline" value={`£${(claim.amount ?? 0).toLocaleString()}.00`} />
                <Field label="Private notes" value="Had to order parts from supplier." wide />
              </div>
            </Article>

            <Article title="Replacement proposals">
              <ul className="divide-y divide-border/60">
                {[
                  { model: "Medium Hard-Shell Spinner 67cm", colour: "Charcoal", status: "Confirmed", tone: "bg-emerald-500/15 text-emerald-700" },
                  { model: "Cabin Hard-Shell Spinner 55cm", colour: "Navy", status: "Proposed", tone: "bg-amber-500/15 text-amber-700" },
                ].map((p) => (
                  <li key={p.model} className="flex items-center justify-between gap-4 py-4">
                    <div>
                      <div className="text-[15px] font-medium">{p.model}</div>
                      <div className="text-[12px] text-muted-foreground">Colour · {p.colour}</div>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${p.tone}`}>
                      {p.status}
                    </span>
                  </li>
                ))}
              </ul>
            </Article>
          </div>

          {/* Right column — meta */}
          <aside className="space-y-6">
            <MetaCard title="Passenger" icon={User}>
              <Row k="Name" v={claim.passenger} />
              <Row k="Email" v="sumandhamala8888@gmail.com" />
              <Row k="Phone" v="+447 311 350 553" />
              <Row k="Country" v="United Kingdom" />
            </MetaCard>

            <MetaCard title="Flight" icon={Plane}>
              <Row k="Number" v={claim.flight} />
              <Row k="Date" v={claim.date} />
              <Row k="Route" v={claim.route} />
              <Row k="Booking" v="438749" />
            </MetaCard>

            <MetaCard title="Assignment" icon={Briefcase}>
              <Row k="Handler" v={claim.handler} />
              <Row k="Contractor" v="—" />
            </MetaCard>
          </aside>
        </section>
      </main>

      <footer className="border-t border-border/60 px-8 py-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between text-[11px] text-muted-foreground">
          <span>© Eagle Claims · Staff console</span>
          <Link to="/staff/dashboard" className="hover:text-foreground">
            Back to console
          </Link>
        </div>
      </footer>
    </div>
  );
}

/* ─── editorial primitives ─── */
function Article({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <article>
      <div className="mb-5 flex items-center gap-3">
        <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-serif)" }}>
          {title}
        </h2>
        <div className="h-px flex-1 bg-border/60" />
      </div>
      {children}
    </article>
  );
}

function Field({ label, value, wide }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={wide ? "col-span-2" : ""}>
      <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-1.5 text-[15px] text-foreground">{value}</div>
    </div>
  );
}

function MetaCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof User;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-surface-raised p-5 shadow-[var(--shadow-raised)]">
      <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        <Icon className="h-3.5 w-3.5 text-primary" strokeWidth={1.75} />
        {title}
      </div>
      <dl className="space-y-2.5">{children}</dl>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-[12px] text-muted-foreground">{k}</dt>
      <dd className="truncate text-right text-[13px] font-medium text-foreground">{v}</dd>
    </div>
  );
}
