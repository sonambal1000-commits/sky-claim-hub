import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowLeft, Printer, Download, Plane, User, Package, FileText, ShieldCheck, Clock } from "lucide-react";
import { DEMO_CLAIMS, STATUS_TONE, AIRLINE_META, formatSla, slaTone } from "@/lib/demo-data";

export const Route = createFileRoute("/staff/claims/$claimId/record")({
  head: ({ params }) => ({
    meta: [{ title: `Full record · ${params.claimId} · Eagle Claims` }],
  }),
  loader: ({ params }) => {
    const claim = DEMO_CLAIMS.find((c) => c.ref === params.claimId);
    if (!claim) throw notFound();
    return { claim };
  },
  component: FullRecordPage,
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center bg-background">
      <p className="font-serif text-3xl">Record not found</p>
    </div>
  ),
  errorComponent: () => (
    <div className="grid min-h-screen place-items-center bg-background">
      <p className="font-serif text-2xl">Could not load this record.</p>
    </div>
  ),
});

function FullRecordPage() {
  const { claim } = Route.useLoaderData();
  const meta = AIRLINE_META[claim.airline];
  const sla = slaTone(claim.slaHours);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/60 bg-surface-raised/80 backdrop-blur-md print:hidden">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-8 py-5">
          <Link
            to="/staff/claims/$claimId"
            params={{ claimId: claim.ref }}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
            Back to claim
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-raised px-4 py-2 text-[12px] font-medium hover:border-primary/30"
            >
              <Printer className="h-3.5 w-3.5" strokeWidth={1.5} /> Print
            </button>
            <button className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-[12px] font-semibold text-primary-foreground shadow-[var(--shadow-elegant)] hover:bg-primary-dark">
              <Download className="h-3.5 w-3.5" strokeWidth={1.75} /> Export PDF
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-8 py-16">
        {/* Cover */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="border-b border-border/60 pb-12"
        >
          <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" strokeWidth={1.75} />
            Full record · Confidential
          </div>
          <h1
            className="mt-5 text-balance text-6xl leading-[1.02] tracking-tight md:text-7xl"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Claim <span className="italic text-primary">{claim.ref}</span>
          </h1>
          <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-muted-foreground">
            Complete audited record for {claim.passenger}'s baggage claim against{" "}
            <span className="font-medium text-foreground">{claim.airline}</span>, generated{" "}
            {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4 text-[12px]">
            <span
              className="inline-flex h-7 items-center rounded-full px-3 text-[11px] font-bold text-white"
              style={{ background: meta.color }}
            >
              {meta.iata} · {claim.airline}
            </span>
            <span className={`inline-flex h-7 items-center rounded-full px-3 text-[11px] font-semibold ${STATUS_TONE[claim.status]}`}>
              {claim.status}
            </span>
            <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium ${sla.text}`}>
              <Clock className="h-3 w-3" /> SLA {formatSla(claim.slaHours)}
            </span>
          </div>
        </motion.section>

        {/* Sections */}
        <div className="space-y-16 pt-16">
          <Section number="01" title="Passenger" icon={User}>
            <Grid
              rows={[
                ["Full name", claim.passenger],
                ["Email", "sumandhamala8888@gmail.com"],
                ["Phone", "+447 311 350 553"],
                ["Country of residence", "United Kingdom"],
                ["Preferred language", "English"],
                ["Consent on file", "Yes — 05 Jun 2026"],
              ]}
            />
          </Section>

          <Section number="02" title="Flight" icon={Plane}>
            <Grid
              rows={[
                ["Flight number", claim.flight],
                ["Date of flight", claim.date],
                ["Route", claim.route],
                ["Booking reference", "438749"],
                ["Bag tag", "EZY 4429810"],
                ["PIR reference", "LGW EZY 28104"],
                ["Reported at airport", "No — reported online"],
                ["Tracking GUID", "bbd2ba12-9d8d-4fea-9d64-d1012dbe6cb3"],
              ]}
            />
          </Section>

          <Section number="03" title="Item & damage" icon={Package}>
            <Grid
              rows={[
                ["Item type", "Hard-shell suitcase"],
                ["Brand & model", "Samsonite — S'Cure Spinner 75"],
                ["Colour", "Charcoal"],
                ["Approximate age", "14 months"],
                ["Damage areas", "Wheel housing, lower spine, handle"],
                ["Damage types", "Crack, dent, detachment"],
                ["Contents declared", "Clothing, toiletries (no high-value)"],
              ]}
            />
            <p className="mt-6 text-[15px] leading-[1.75] text-foreground/85">
              Passenger described impact damage consistent with a fall during ramp handling.
              Inspection confirms the right-rear wheel assembly has separated from the chassis
              and the lower shell has a 6cm linear crack. The telescopic handle is bent and
              non-retractable.
            </p>
          </Section>

          <Section number="04" title="Decision & financials" icon={FileText}>
            <Grid
              rows={[
                ["Outcome", "Approved — replacement"],
                ["Public justification", "Needs wheel, handle and dent repair beyond economical fix."],
                ["Private note", "Had to order parts from supplier — replacement faster."],
                ["Cost to Eagle", "£950.00"],
                ["Cost to airline", `£${(claim.amount ?? 0).toLocaleString()}.00`],
                ["Ready to invoice", "Not yet"],
                ["Replacement model", "Medium Hard-Shell Spinner 67cm — Charcoal"],
              ]}
            />
          </Section>

          <Section number="05" title="Audit trail" icon={ShieldCheck}>
            <ol className="relative space-y-6 border-l border-border/60 pl-8">
              {[
                { at: "05 Jun 2026 · 20:28", who: "Passenger", what: "Claim submitted via portal" },
                { at: "06 Jun 2026 · 08:14", who: "Aoife K.", what: "Status → Under Review" },
                { at: "06 Jun 2026 · 11:02", who: "Aoife K.", what: "Evidence reviewed, contractor briefed" },
                { at: "07 Jun 2026 · 09:30", who: "System", what: "Replacement proposal generated" },
                { at: "07 Jun 2026 · 14:18", who: "Passenger", what: "Confirmed replacement model" },
              ].map((e) => (
                <li key={e.at} className="relative">
                  <span className="absolute -left-[33px] top-1.5 grid h-3 w-3 place-items-center rounded-full bg-primary ring-4 ring-background" />
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {e.at} · {e.who}
                  </div>
                  <div className="mt-0.5 text-[15px] text-foreground">{e.what}</div>
                </li>
              ))}
            </ol>
          </Section>
        </div>
      </main>

      <footer className="border-t border-border/60 px-8 py-6 print:hidden">
        <div className="mx-auto flex max-w-5xl items-center justify-between text-[11px] text-muted-foreground">
          <span>© Eagle Claims · Generated record</span>
          <Link to="/staff/dashboard" className="hover:text-foreground">
            Back to console
          </Link>
        </div>
      </footer>
    </div>
  );
}

function Section({
  number,
  title,
  icon: Icon,
  children,
}: {
  number: string;
  title: string;
  icon: typeof User;
  children: React.ReactNode;
}) {
  return (
    <section>
      <header className="mb-8 flex items-end justify-between border-b border-border/60 pb-4">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Section {number}
          </div>
          <h2 className="mt-1 text-3xl tracking-tight" style={{ fontFamily: "var(--font-serif)" }}>
            {title}
          </h2>
        </div>
        <Icon className="h-6 w-6 text-primary/60" strokeWidth={1.25} />
      </header>
      {children}
    </section>
  );
}

function Grid({ rows }: { rows: [string, string][] }) {
  return (
    <dl className="grid grid-cols-1 gap-x-12 gap-y-5 sm:grid-cols-2">
      {rows.map(([k, v]) => (
        <div key={k} className="border-b border-border/40 pb-3">
          <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {k}
          </dt>
          <dd className="mt-1 text-[15px] text-foreground">{v}</dd>
        </div>
      ))}
    </dl>
  );
}
