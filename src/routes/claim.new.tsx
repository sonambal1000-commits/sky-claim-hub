import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, CheckCircle2, Copy, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppHeader } from "@/components/app-header";
import { StepProgress } from "@/components/wizard/step-progress";
import { StepFlight } from "@/components/wizard/step-flight";
import { StepClaimType } from "@/components/wizard/step-claim-type";
import { StepDetails } from "@/components/wizard/step-details";
import { StepEvidence } from "@/components/wizard/step-evidence";
import { StepReview } from "@/components/wizard/step-review";
import {
  STEPS,
  WizardProvider,
  useWizard,
} from "@/components/wizard/wizard-context";
import { useTenant } from "@/components/tenant-provider";
import {
  createReference,
  saveClaim,
  type Claim,
} from "@/lib/claims-storage";

export const Route = createFileRoute("/claim/new")({
  head: () => ({
    meta: [
      { title: "Start a baggage claim · Eagle Claims Portal" },
      {
        name: "description",
        content: "File a baggage claim in 5 simple steps. Mobile-first, calm, secure.",
      },
    ],
  }),
  component: () => (
    <WizardProvider>
      <ClaimWizardPage />
    </WizardProvider>
  ),
});

function ClaimWizardPage() {
  const { step, setStep, data } = useWizard();
  const { tenant } = useTenant();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<{ ref: string; id: string } | null>(null);

  const canAdvance = (() => {
    switch (step) {
      case 1:
        return Boolean(data.flight.flightNo && data.flight.date);
      case 2:
        return Boolean(data.type);
      case 3:
        return Boolean(data.item.bagType && data.item.brand);
      case 4:
        return data.evidence.length >= 1;
      case 5:
        return (
          Boolean(
            data.passenger.firstName &&
              data.passenger.lastName &&
              data.passenger.email,
          ) && data.consent
        );
      default:
        return false;
    }
  })();

  const submit = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 900));
    const reference = createReference();
    const id = crypto.randomUUID();
    const claim: Claim = {
      id,
      reference,
      tenant,
      type: data.type!,
      status: "submitted",
      createdAt: new Date().toISOString(),
      flight: {
        bookingRef: data.flight.bookingRef || undefined,
        flightNo: data.flight.flightNo,
        date: data.flight.date,
        from: data.flight.from,
        to: data.flight.to,
        pir: data.flight.pir || undefined,
      },
      passenger: { ...data.passenger },
      item: { ...data.item },
      evidence: data.evidence,
      timeline: [{ status: "submitted", at: new Date().toISOString() }],
    };
    saveClaim(claim);
    setSubmitting(false);
    setSuccess({ ref: reference, id });
  };

  if (success) return <SuccessView ref_={success.ref} id={success.id} />;

  return (
    <div className="flex min-h-screen flex-col bg-background pb-32">
      <AppHeader />

      {/* Sticky progress */}
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

      {/* Fixed bottom CTA */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center gap-2 px-4">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="inline-flex h-12 items-center justify-center gap-1.5 rounded-xl border border-border bg-surface-raised px-4 text-sm font-medium text-foreground transition-colors hover:bg-surface"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
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
              onClick={() => canAdvance && setStep(step + 1)}
              disabled={!canAdvance}
              className="group inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl gradient-primary px-5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-elegant)] transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
            >
              Continue
              <ArrowRight className="h-4 w-4 transition-transform group-enabled:group-hover:translate-x-0.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={!canAdvance || submitting}
              className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl gradient-primary px-5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-elegant)] transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
            >
              {submitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Submit claim
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
  const steps = ["Submitted", "Under review", "Decision", "Completed"];
  const current = 0;

  const copy = async () => {
    await navigator.clipboard.writeText(ref_);
    toast.success("Reference copied");
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 18 }}
          className="mx-auto grid h-20 w-20 place-items-center rounded-full gradient-primary shadow-[var(--shadow-elegant)]"
        >
          <CheckCircle2 className="h-10 w-10 text-primary-foreground" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-5 text-center"
        >
          <h1 className="font-display text-2xl font-semibold tracking-tight">
            Claim submitted
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            You'll get an email update within 24 hours.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 rounded-2xl border border-border bg-surface-raised p-4"
        >
          <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Your claim reference
          </div>
          <div className="mt-1 flex items-center justify-between gap-3">
            <div className="font-mono text-xl font-semibold tracking-wide text-primary">
              {ref_}
            </div>
            <button
              onClick={copy}
              className="grid h-9 w-9 place-items-center rounded-full bg-primary-light-bg text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
              aria-label="Copy reference"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
        </motion.div>

        <motion.ol
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 space-y-3"
        >
          {steps.map((label, i) => {
            const done = i < current;
            const active = i === current;
            return (
              <li key={label} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={[
                      "grid h-8 w-8 place-items-center rounded-full text-xs font-semibold",
                      done && "bg-success text-success-foreground",
                      active && "gradient-primary text-primary-foreground",
                      !done && !active && "bg-secondary text-muted-foreground",
                    ].filter(Boolean).join(" ")}
                  >
                    {done ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                  </div>
                  {i < steps.length - 1 && (
                    <div className="my-1 h-6 w-px bg-border" />
                  )}
                </div>
                <div className="pt-1">
                  <div className="text-sm font-semibold">{label}</div>
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
        </motion.ol>

        <div className="mt-8 flex flex-col gap-2">
          <Link
            to="/track/$claimId"
            params={{ claimId: id }}
            className="inline-flex h-12 items-center justify-center rounded-xl gradient-primary text-sm font-semibold text-primary-foreground shadow-[var(--shadow-elegant)]"
          >
            View claim status
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
