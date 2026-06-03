import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  Search,
  Clock,
  ShieldCheck,
  Globe,
  Plane,
  HelpCircle,
  Camera,
  CheckCircle2,
} from "lucide-react";
import { EagleLogo } from "@/components/eagle-logo";
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
  { n: 1, icon: Plane, label: "Flight details", copy: "Enter your booking reference or flight number." },
  { n: 2, icon: HelpCircle, label: "What happened", copy: "Choose the issue and tell us briefly." },
  { n: 3, icon: Camera, label: "Bag & photos", copy: "Mark the damage and add a few photos." },
  { n: 4, icon: CheckCircle2, label: "Review & submit", copy: "Check once and send securely." },
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
    <div className="min-h-screen bg-background">
      {/* Quiet sticky header */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5">
          <Link to="/" className="flex items-center gap-2" aria-label="Eagle Claims home">
            <EagleLogo />
            <span className="text-sm font-semibold tracking-tight">Eagle Claims</span>
          </Link>
          <div className="flex items-center gap-1">
            <LanguagePicker />
            <Link
              to="/track"
              className="ml-1 inline-flex h-9 items-center rounded-full px-3 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Track a claim
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative flex min-h-[calc(100svh-56px)] items-center overflow-hidden px-5 py-16 sm:py-24">
          {/* Soft radial brand glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 -z-0 h-[640px] w-[640px] -translate-x-1/2 -translate-y-[60%] rounded-full opacity-[0.18] blur-3xl"
            style={{
              background:
                "radial-gradient(circle at center, var(--color-primary), transparent 60%)",
            }}
          />

          <div className="relative z-10 mx-auto w-full max-w-xl text-center">
            <motion.div {...fade}>
              <div className="mx-auto mb-8 inline-flex h-12 w-12 items-center justify-center rounded-full border border-border/70 bg-surface-raised/60 text-muted-foreground">
                <Plane className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
              </div>

              <h1 className="font-display text-[40px] font-semibold leading-[1.05] tracking-tight text-balance sm:text-[56px]">
                Baggage claims,
                <br />
                <span className="text-primary">beautifully simple.</span>
              </h1>

              <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-muted-foreground sm:text-base">
                Damaged or missing bag? We'll guide you through it — calm, in about 3 minutes.
              </p>
            </motion.div>

            <motion.div
              {...(reduce
                ? {}
                : {
                    initial: { opacity: 0, y: 10 },
                    animate: { opacity: 1, y: 0 },
                    transition: { delay: 0.08, type: "spring" as const, stiffness: 160, damping: 22 },
                  })}
              className="mt-10 flex flex-col items-center gap-1"
            >
              <Link
                to="/claim/new"
                className="group inline-flex h-14 w-full max-w-sm items-center justify-center gap-2 rounded-2xl bg-primary px-6 text-[15px] font-semibold text-primary-foreground shadow-[var(--shadow-elegant)] transition-all duration-200 hover:-translate-y-px hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-0 active:scale-[0.99] sm:w-auto sm:min-w-[280px]"
              >
                Start a claim
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>

              <Link
                to="/track"
                className="mt-2 inline-flex h-11 items-center justify-center gap-1.5 rounded-full px-4 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <Search className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="underline-offset-4 hover:underline">Track an existing claim</span>
              </Link>
            </motion.div>

            <motion.ul
              {...(reduce
                ? {}
                : {
                    initial: { opacity: 0 },
                    animate: { opacity: 1 },
                    transition: { delay: 0.18, duration: 0.5 },
                  })}
              className="mt-12 flex flex-wrap items-center justify-center gap-2"
              aria-label="Reassurance"
            >
              {[
                { icon: Clock, label: "3 min" },
                { icon: ShieldCheck, label: "Secure" },
                { icon: Globe, label: "8 languages" },
              ].map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-surface-raised/60 px-3 py-1.5 text-xs font-medium text-muted-foreground"
                >
                  <Icon className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                  {label}
                </li>
              ))}
            </motion.ul>
          </div>
        </section>

        {/* How it works */}
        <section className="border-t border-border/60 px-5 py-20 sm:py-28">
          <div className="mx-auto max-w-5xl">
            <div className="text-center">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                How it works
              </div>
              <h2 className="mt-2 font-display text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                Four calm steps. About three minutes.
              </h2>
            </div>

            <ol className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
              {STEPS.map(({ n, icon: Icon, label, copy }) => (
                <li key={n} className="flex flex-col items-start">
                  <div className="flex items-center gap-3">
                    <span className="grid h-7 w-7 place-items-center rounded-full border border-border text-[11px] font-semibold tabular-nums text-muted-foreground">
                      {n}
                    </span>
                    <Icon className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 text-sm font-semibold text-foreground">{label}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{copy}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60 px-5 py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 text-[11px] text-muted-foreground sm:flex-row">
          <div>© Eagle Claims · Powered by Eagle Claims</div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Sub-processors</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
