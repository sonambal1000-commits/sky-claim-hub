import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  Clock,
  ShieldCheck,
  Globe,
  Check,
} from "lucide-react";
import { LanguagePicker } from "@/components/language-picker";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Eagle Claims — Baggage claims, beautifully simple" },
      {
        name: "description",
        content:
          "Damaged or missing bag? Start a claim in about 3 minutes — calm, secure, in your language.",
      },
    ],
  }),
  component: LandingPage,
});

const STEPS = [
  {
    n: "01",
    title: "Verify flight",
    copy: "Enter your flight number and booking reference. We pull your manifest automatically.",
  },
  {
    n: "02",
    title: "Snap & describe",
    copy: "Take a photo of your bag or tag. Describe the contents and condition in plain language.",
  },
  {
    n: "03",
    title: "Instant resolution",
    copy: "Receive a claim ID right away. We handle the airline communication for you.",
    final: true,
  },
];

function LandingPage() {
  const reduce = useReducedMotion();
  const fade = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        transition: { type: "spring" as const, stiffness: 160, damping: 22 },
      };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/10">
      {/* Header */}
      <nav className="fixed inset-x-0 top-0 z-50 flex items-center justify-between border-b border-primary/5 bg-background/80 px-6 py-4 backdrop-blur-md">
        <Link to="/" className="flex items-center gap-2.5" aria-label="Eagle Claims home">
          <span
            className="grid h-8 w-8 place-items-center rounded-full bg-primary"
            aria-hidden="true"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-primary-foreground" fill="none">
              <path
                d="M3 14c4-1 7-3 9-7 2 4 5 6 9 7-3 1-6 3-9 6-3-3-6-5-9-6Z"
                fill="currentColor"
              />
            </svg>
          </span>
          <span className="text-lg font-semibold tracking-tight">Eagle Claims</span>
        </Link>
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <LanguagePicker />
          <Link
            to="/track"
            className="inline-flex h-9 items-center rounded-full px-3 transition-colors hover:text-foreground"
          >
            Track a claim
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-2xl px-6 pb-24 pt-32 sm:pt-40">
        {/* Hero */}
        <section className="space-y-8 text-center">
          <motion.div {...fade}>
            <div className="inline-flex items-center rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
              Official airport partner
            </div>
          </motion.div>

          <motion.div
            {...(reduce
              ? {}
              : {
                  initial: { opacity: 0, y: 10 },
                  animate: { opacity: 1, y: 0 },
                  transition: { delay: 0.05, type: "spring" as const, stiffness: 160, damping: 22 },
                })}
            className="space-y-5"
          >
            <h1
              className="text-balance text-5xl leading-[1.05] tracking-tight md:text-6xl"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Baggage claims,
              <br />
              <span className="italic text-primary">beautifully simple.</span>
            </h1>
            <p className="mx-auto max-w-md text-[17px] leading-relaxed text-muted-foreground">
              Damaged or missing bag? We'll guide you through it — calm, in about 3 minutes.
            </p>
          </motion.div>

          {/* CTAs */}
          <motion.div
            {...(reduce
              ? {}
              : {
                  initial: { opacity: 0, y: 10 },
                  animate: { opacity: 1, y: 0 },
                  transition: { delay: 0.12, type: "spring" as const, stiffness: 160, damping: 22 },
                })}
            className="flex flex-col items-center gap-3 pt-2"
          >
            <Link
              to="/claim/new"
              className="group flex w-full max-w-sm items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-4 text-[15px] font-semibold text-primary-foreground shadow-[var(--shadow-elegant)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Start a claim
              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
            <Link
              to="/track"
              className="flex w-full max-w-sm items-center justify-center rounded-2xl border border-primary/15 bg-surface-raised px-8 py-4 text-[15px] font-semibold text-primary transition-colors hover:bg-primary/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Track existing claim
            </Link>
          </motion.div>

          {/* Trust row */}
          <motion.ul
            {...(reduce
              ? {}
              : {
                  initial: { opacity: 0 },
                  animate: { opacity: 1 },
                  transition: { delay: 0.22, duration: 0.5 },
                })}
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 pt-6 text-xs font-medium text-muted-foreground/70"
            aria-label="Reassurance"
          >
            {[
              { icon: Clock, label: "3 min setup" },
              { icon: ShieldCheck, label: "Secure ID" },
              { icon: Globe, label: "8 languages" },
            ].map(({ icon: Icon, label }) => (
              <li key={label} className="inline-flex items-center gap-1.5">
                <Icon className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                {label}
              </li>
            ))}
          </motion.ul>
        </section>

        {/* How it works */}
        <section className="mt-32 space-y-12">
          <div className="space-y-3 text-center">
            <h2
              className="text-2xl tracking-tight"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              How it works
            </h2>
            <div className="mx-auto h-px w-12 bg-primary/20" />
          </div>

          <ol className="relative space-y-12">
            {/* Vertical line */}
            <div
              aria-hidden="true"
              className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-primary/25 via-primary/10 to-transparent"
            />

            {STEPS.map((step) => (
              <li key={step.n} className="relative flex items-start gap-8">
                {step.final ? (
                  <div className="z-10 grid h-16 w-16 flex-none place-items-center rounded-2xl bg-primary shadow-[var(--shadow-elegant)]">
                    <Check
                      className="h-6 w-6 text-primary-foreground"
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  </div>
                ) : (
                  <div className="z-10 grid h-16 w-16 flex-none place-items-center rounded-2xl border border-primary/10 bg-surface-raised text-lg font-bold text-primary shadow-sm">
                    {step.n}
                  </div>
                )}
                <div className="pt-2">
                  <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.copy}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </main>

      <footer className="border-t border-border/60 px-6 py-8">
        <div className="mx-auto flex max-w-2xl flex-col items-center justify-between gap-2 text-[11px] text-muted-foreground sm:flex-row">
          <div>© Eagle Claims · Powered by Eagle Claims</div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Sub-processors</a>
            <Link to="/sitemap" className="hover:text-foreground">Sitemap</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
