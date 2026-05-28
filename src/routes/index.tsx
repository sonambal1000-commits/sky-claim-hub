import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowRight, Search, ShieldCheck, Sparkles, Timer, Languages } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Eagle Claims Portal — File baggage claims in minutes" },
      {
        name: "description",
        content: "Damaged or lost luggage? Start a claim in under 3 minutes, or track an existing one. Eagle Claims Portal works with the world's airlines.",
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  const { t } = useI18n();
  const steps = [
    { n: 1, t: t("step1"), d: "Type your booking ref — we pull the rest." },
    { n: 2, t: t("step2"), d: "Choose what happened from 6 clear options." },
    { n: 3, t: t("step3"), d: "Tap the damaged zones, pick the damage types." },
    { n: 4, t: t("step4"), d: "Snap exterior, close-up, tag and receipt." },
    { n: 5, t: t("step5"), d: "Confirm consent and submit in one tap." },
  ];

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-3xl px-4 pb-24 pt-6">
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 180, damping: 22 }}
          className="relative overflow-hidden rounded-3xl border border-border bg-surface-raised p-6 shadow-[var(--shadow-soft)]"
        >
          <div aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-50 blur-3xl"
            style={{ background: "var(--color-primary)" }} />
          <div className="relative">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary-light-bg px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
              <Sparkles className="h-3 w-3" />
              New claim portal
            </div>
            <h1 className="mt-4 font-display text-[34px] font-semibold leading-[1.05] tracking-tight text-balance">
              {t("heroTitle")}<br />
              <span className="text-primary">{t("heroAccent")}</span>
            </h1>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted-foreground text-pretty">
              {t("heroSub")}
            </p>

            <div className="mt-6 flex flex-col gap-2.5">
              <Link to="/claim/new"
                className="group inline-flex h-14 items-center justify-center gap-2 rounded-2xl gradient-primary px-5 text-[15px] font-semibold text-primary-foreground shadow-[var(--shadow-elegant)] transition-transform active:scale-[0.98]">
                {t("ctaStart")}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link to="/track"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl border border-border bg-surface-raised px-5 text-[15px] font-semibold text-foreground transition-colors hover:bg-surface">
                <Search className="h-4 w-4" />
                {t("ctaTrack")}
              </Link>
            </div>
          </div>
        </motion.section>

        <section className="mt-6 grid grid-cols-3 gap-2">
          {[
            { icon: Timer, label: "3 min", sub: "to file" },
            { icon: ShieldCheck, label: "Secure", sub: "GDPR-grade" },
            { icon: Languages, label: "8 langs", sub: "supported" },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="rounded-2xl border border-border bg-surface-raised p-3.5 text-center">
              <Icon className="mx-auto h-4 w-4 text-primary" />
              <div className="mt-1.5 font-display text-sm font-semibold">{label}</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{sub}</div>
            </div>
          ))}
        </section>

        <section className="mt-8">
          <h2 className="font-display text-lg font-semibold tracking-tight">{t("howItWorks")}</h2>
          <ol className="mt-3 space-y-2.5">
            {steps.map((s) => (
              <li key={s.n} className="flex items-start gap-3 rounded-2xl border border-border bg-surface-raised p-4">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary-light-bg font-display text-sm font-semibold text-primary">
                  {s.n}
                </div>
                <div>
                  <div className="text-sm font-semibold">{s.t}</div>
                  <div className="text-xs text-muted-foreground">{s.d}</div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-8 grid grid-cols-2 gap-2">
          <Link to="/staff/login" className="rounded-2xl border border-border bg-surface-raised p-4 transition-colors hover:bg-surface">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">For staff</div>
            <div className="mt-1 text-sm font-semibold">Sign in to console →</div>
          </Link>
          <Link to="/airline" className="rounded-2xl border border-border bg-surface-raised p-4 transition-colors hover:bg-surface">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">For airlines</div>
            <div className="mt-1 text-sm font-semibold">View tenant dashboard →</div>
          </Link>
        </section>

        <footer className="mt-12 text-center text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          © Eagle Claims Portal · Assisting the world's airlines
        </footer>
      </main>
    </div>
  );
}
