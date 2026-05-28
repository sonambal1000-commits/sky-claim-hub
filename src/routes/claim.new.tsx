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
              disabled={submitting}
              className={[
                "inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold transition-all active:scale-[0.98] disabled:cursor-not-allowed",
                canAdvance
                  ? "gradient-primary text-primary-foreground shadow-[var(--shadow-elegant)]"
                  : "bg-secondary text-muted-foreground",
              ].join(" ")}
            >
              {submitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Submitting…
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  {t("submit")}
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function SuccessView({ ref_, id }: { ref_: string; id: string }) {
  const steps = ["Submitted", "Under Review", "Decision", "Completed"];
  const current = 0;

  const copy = async () => {
    await navigator.clipboard.writeText(ref_);
    toast.info("Reference copied");
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: [0.6, 1.2, 1], opacity: 1 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 220, damping: 16 }}
          className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-success text-success-foreground shadow-[var(--shadow-elegant)]"
        >
          <CheckCircle2 className="h-12 w-12" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-5 text-center"
        >
          <h1 className="font-display text-2xl font-semibold tracking-tight">Claim submitted!</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            You'll get an email update within 24 hours.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-6 rounded-2xl border border-border bg-surface-raised p-4"
        >
          <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Your claim reference
          </div>
          <div className="mt-1 flex items-center justify-between gap-3">
            <div className="font-mono text-xl font-semibold tracking-wide text-primary">{ref_}</div>
            <button
              onClick={copy}
              className="grid h-9 w-9 place-items-center rounded-full bg-primary-light-bg text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
              aria-label="Copy reference"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
        </motion.div>

        {/* Horizontal 4-step timeline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="mt-6 rounded-2xl border border-border bg-surface-raised p-4"
        >
          <div className="grid grid-cols-4 gap-2">
            {steps.map((label, i) => {
              const done = i < current;
              const active = i === current;
              return (
                <div key={label} className="flex flex-col items-center text-center">
                  <div
                    className={[
                      "grid h-9 w-9 place-items-center rounded-full text-[11px] font-semibold",
                      done && "bg-success text-success-foreground",
                      active && "gradient-primary text-primary-foreground",
                      !done && !active && "bg-secondary text-muted-foreground",
                    ].filter(Boolean).join(" ")}
                  >
                    {done ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                  </div>
                  <div className={["mt-1.5 text-[10px] font-semibold leading-tight", active ? "text-primary" : "text-muted-foreground"].join(" ")}>
                    {label}
                  </div>
                  {active && (
                    <span className="relative mt-1 flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-[pulse-dot_1.8s_ease-in-out_infinite] rounded-full bg-primary opacity-60" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        <div className="mt-8 flex flex-col gap-2">
          <Link
            to="/track/$claimId"
            params={{ claimId: id }}
            className="inline-flex h-12 items-center justify-center rounded-xl gradient-primary text-sm font-semibold text-primary-foreground shadow-[var(--shadow-elegant)]"
          >
            Track your claim
          </Link>
          <Link
            to="/"
            className="inline-flex h-12 items-center justify-center rounded-xl border border-border bg-surface-raised text-sm font-medium text-foreground"
          >
            Done
          </Link>
        </div>
      </main>
    </div>
  );
}
