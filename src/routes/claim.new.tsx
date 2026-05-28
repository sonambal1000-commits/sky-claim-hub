import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, CheckCircle2, Copy, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { AppHeader } from "@/components/app-header";
import { StepProgress } from "@/components/wizard/step-progress";
import { StepFlight } from "@/components/wizard/step-flight";
import { StepClaimType } from "@/components/wizard/step-claim-type";
import { StepDetails } from "@/components/wizard/step-details";
import { StepEvidence } from "@/components/wizard/step-evidence";
import { StepReview } from "@/components/wizard/step-review";
import { STEPS, WizardProvider, useWizard } from "@/components/wizard/wizard-context";
import { useTenant } from "@/components/tenant-provider";
import { createReference, saveClaim, type Claim } from "@/lib/claims-storage";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/claim/new")({
  head: () => ({
    meta: [
      { title: "Start a baggage claim · Eagle Claims Portal" },
      { name: "description", content: "File a baggage claim in 5 simple steps. Mobile-first, calm, secure." },
    ],
  }),
  component: () => (
    <WizardProvider>
      <ClaimWizardPage />
    </WizardProvider>
  ),
});

function ClaimWizardPage() {
  const { step, setStep, data, bumpAttempts } = useWizard();
  const { tenant } = useTenant();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<{ ref: string; id: string } | null>(null);

  // visualViewport: keep CTA above mobile keyboard
  useEffect(() => {
    if (typeof window === "undefined" || !window.visualViewport) return;
    const vv = window.visualViewport;
    const handler = () => {
      const offset = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      document.documentElement.style.setProperty("--kb-offset", `${offset}px`);
    };
    handler();
    vv.addEventListener("resize", handler);
    vv.addEventListener("scroll", handler);
    return () => {
      vv.removeEventListener("resize", handler);
      vv.removeEventListener("scroll", handler);
      document.documentElement.style.setProperty("--kb-offset", "0px");
    };
  }, []);

  const isLost = data.type?.startsWith("lost");
  const canAdvance = (() => {
    switch (step) {
      case 1: return Boolean(data.flight.flightNo && data.flight.date);
      case 2: return Boolean(data.type);
      case 3:
        if (isLost) return Boolean(data.item.bagType && data.item.brand);
        return Boolean(
          data.item.bagType &&
          data.item.brand &&
          data.item.damageAreas.length > 0 &&
          data.item.damageTypes.length > 0,
        );
      case 4: return true; // photos optional for demo
      case 5:
        return data.consent;
      default: return false;
    }
  })();

  const onContinue = () => {
    if (!canAdvance) {
      bumpAttempts();
      toast.error("Please fill in the highlighted fields");
      return;
    }
    setStep(step + 1);
  };

  const submit = async () => {
    if (!canAdvance) { bumpAttempts(); return; }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    // Demo-stable reference for the pitch
    const reference = "EC-260527-4821";
    const id = crypto.randomUUID();
    const claim: Claim = {
      id, reference, tenant,
      type: data.type!, status: "submitted",
      createdAt: new Date().toISOString(),
      flight: {
        bookingRef: data.flight.bookingRef || undefined,
        flightNo: data.flight.flightNo, date: data.flight.date,
        from: data.flight.from, to: data.flight.to,
        pir: data.flight.pir || undefined,
      },
      passenger: { ...data.passenger },
      item: { ...data.item },
      evidence: data.evidence,
      timeline: [{ status: "submitted", at: new Date().toISOString() }],
    };
    try { saveClaim(claim); } catch { /* ignore */ }
    setSubmitting(false);
    setSuccess({ ref: reference, id });
    // Fire confetti
    setTimeout(() => {
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.35 } });
      confetti({ particleCount: 60, spread: 100, angle: 60, origin: { x: 0, y: 0.5 } });
      confetti({ particleCount: 60, spread: 100, angle: 120, origin: { x: 1, y: 0.5 } });
    }, 100);
  };

  if (success) return <SuccessView ref_={success.ref} id={success.id} />;

  return (
    <div className="flex min-h-screen flex-col bg-background pb-32">
      <AppHeader />

      <div className="sticky top-14 z-30 border-b border-border/60 bg-background/85 backdrop-blur-md">
        <div className="mx-auto max-w-3xl px-4 py-3.5">
          <StepProgress />
        </div>
      </div>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-5">
        <AnimatePresence mode="wait">
          <motion.div key={step}>
            {step === 1 && <StepFlight />}
            {step === 2 && <StepClaimType />}
            {step === 3 && <StepDetails />}
            {step === 4 && <StepEvidence />}
            {step === 5 && <StepReview />}
          </motion.div>
        </AnimatePresence>
      </main>

      <div
        className="fixed inset-x-0 z-30 border-t border-border bg-background/95 pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-3 backdrop-blur-md"
        style={{ bottom: "var(--kb-offset, 0px)" }}
      >
        <div className="mx-auto flex max-w-3xl items-center gap-2 px-4">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="inline-flex h-12 items-center justify-center gap-1.5 rounded-xl border border-border bg-surface-raised px-4 text-sm font-medium text-foreground transition-colors hover:bg-surface"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("back")}
            </button>
          ) : (
            <Link
              to="/"
              className="inline-flex h-12 items-center justify-center gap-1.5 rounded-xl border border-border bg-surface-raised px-4 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Cancel"
            >
              <X className="h-4 w-4" />
            </Link>
          )}

          {step < STEPS.length ? (
            <button
              type="button"
              onClick={onContinue}
              className={[
                "group inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold transition-all active:scale-[0.98]",
                canAdvance
                  ? "gradient-primary text-primary-foreground shadow-[var(--shadow-elegant)]"
                  : "bg-secondary text-muted-foreground",
              ].join(" ")}
            >
              {t("continue")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={submitting || !canAdvance}
              className={[
                "inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold transition-all active:scale-[0.98] disabled:cursor-not-allowed",
                canAdvance && !submitting
                  ? "gradient-primary text-primary-foreground shadow-[var(--shadow-elegant)]"
                  : "bg-secondary text-muted-foreground",
              ].join(" ")}
            >
              {submitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Submitting…
                </>
              ) : (
                <>
                  Submit my claim
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ConfettiBurst() {
  // 48 absolutely-positioned particles raining from top with randomised x drift, colour, size, delay
  const colors = ["var(--color-primary)", "#FFD700", "#ffffff", "var(--color-primary-dark)"];
  const particles = Array.from({ length: 48 }, (_, i) => {
    const left = Math.random() * 100;
    const cx = (Math.random() * 200 - 100).toFixed(0) + "px";
    const delay = (Math.random() * 0.6).toFixed(2);
    const duration = (2 + Math.random() * 1.5).toFixed(2);
    const size = 6 + Math.round(Math.random() * 8);
    const color = colors[i % colors.length];
    const round = Math.random() > 0.5;
    return (
      <span
        key={i}
        className="pointer-events-none absolute top-0 block"
        style={{
          left: `${left}%`,
          width: `${size}px`,
          height: `${size}px`,
          background: color,
          borderRadius: round ? "9999px" : "1px",
          // @ts-expect-error custom property
          "--cx": cx,
          animation: `confetti-fall ${duration}s cubic-bezier(0.2, 0.6, 0.4, 1) ${delay}s forwards`,
        }}
      />
    );
  });
  return <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">{particles}</div>;
}

function AnimatedCheckmark() {
  return (
    <motion.div
      initial={{ scale: 0.4, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 200, damping: 16 }}
      className="relative mx-auto h-28 w-28"
    >
      <span className="absolute inset-0 animate-[pulse-dot_2.4s_ease-in-out_infinite] rounded-full bg-success/30" />
      <div className="relative grid h-full w-full place-items-center rounded-full bg-success text-success-foreground shadow-[var(--shadow-elegant)]">
        <svg viewBox="0 0 52 52" className="h-14 w-14">
          <circle cx="26" cy="26" r="24" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" />
          <path
            d="M14 27 L23 36 L39 18"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: 60,
              strokeDashoffset: 60,
              animation: "draw-check 0.6s 0.25s cubic-bezier(0.65, 0, 0.45, 1) forwards",
            }}
          />
        </svg>
      </div>
    </motion.div>
  );
}

function SuccessView({ ref_, id: _id }: { ref_: string; id: string }) {
  const [copied, setCopied] = useState(false);
  const steps = ["Submitted", "Under Review", "Decision", "Completed"];
  const currentIdx = 0; // "Submitted" is done; next-up shown as locked grey

  const copy = async () => {
    await navigator.clipboard.writeText(ref_);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="relative min-h-screen bg-background"
    >
      <ConfettiBurst />
      <AppHeader />
      <main className="mx-auto max-w-2xl px-4 py-10">
        <AnimatedCheckmark />

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 text-center"
        >
          <h1 className="font-display text-3xl font-bold tracking-tight">Claim submitted!</h1>
          <p className="mt-2 text-sm text-muted-foreground text-pretty">
            We've received your claim and will be in touch within 48 hours.
          </p>
        </motion.div>

        {/* Reference badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 flex justify-center"
        >
          <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface-raised px-3 py-2 shadow-[var(--shadow-raised)]">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">REF</span>
            <code className="font-mono text-sm font-bold tracking-wider text-primary">{ref_}</code>
            <div className="relative">
              <button
                onClick={copy}
                className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-primary-light-bg hover:text-primary"
                aria-label="Copy reference"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
              {copied && (
                <span className="pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2 rounded-md bg-foreground px-2 py-0.5 text-[10px] font-semibold text-background shadow-md">
                  Copied!
                </span>
              )}
            </div>
          </div>
        </motion.div>

        {/* Horizontal 4-step timeline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 rounded-2xl border border-border bg-surface-raised p-5"
        >
          <div className="relative">
            {/* Connector line */}
            <div className="absolute left-[12.5%] right-[12.5%] top-5 h-0.5 bg-border" />
            <div className="absolute left-[12.5%] top-5 h-0.5 bg-primary" style={{ width: "calc((100% - 25%) * 0.16)" }} />
            <div className="relative grid grid-cols-4">
              {steps.map((label, i) => {
                const done = i <= currentIdx;
                const active = i === currentIdx;
                return (
                  <div key={label} className="flex flex-col items-center text-center">
                    <div
                      className={[
                        "relative grid h-10 w-10 place-items-center rounded-full text-[11px] font-semibold",
                        done ? "gradient-primary text-primary-foreground" : "border-2 border-border bg-surface-raised text-muted-foreground",
                      ].join(" ")}
                    >
                      {active && (
                        <span className="absolute inset-0 animate-[pulse-dot_2s_ease-in-out_infinite] rounded-full bg-primary/30" />
                      )}
                      {done ? <CheckCircle2 className="relative h-5 w-5" /> : <span className="relative">{i + 1}</span>}
                    </div>
                    <div className={["mt-2 text-[11px] font-semibold leading-tight", done ? "text-primary" : "text-muted-foreground"].join(" ")}>
                      {label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Info box */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-5 rounded-xl bg-muted/70 p-3.5 text-xs text-foreground"
        >
          📧 We'll send updates to your email address. You can also track your claim anytime.
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-6 flex flex-col gap-2 sm:flex-row"
        >
          <Link
            to="/track/$claimId"
            params={{ claimId: ref_ }}
            className="inline-flex h-12 flex-1 items-center justify-center gap-1.5 rounded-xl gradient-primary text-sm font-semibold text-primary-foreground shadow-[var(--shadow-elegant)] transition-transform active:scale-[0.98]"
          >
            Track my claim
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/"
            className="inline-flex h-12 flex-1 items-center justify-center rounded-xl border border-border bg-surface-raised text-sm font-medium text-foreground transition-colors hover:bg-surface"
          >
            Back to home
          </Link>
        </motion.div>
      </main>
    </motion.div>
  );
}
