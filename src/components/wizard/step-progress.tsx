import { Check } from "lucide-react";
import { motion } from "motion/react";
import { STEPS, useWizard } from "./wizard-context";
import { useI18n } from "@/lib/i18n";

export function StepProgress() {
  const { step } = useWizard();
  const { t } = useI18n();
  const pct = ((step - 1) / (STEPS.length - 1)) * 100;
  const labelKeys = ["sFlight", "sType", "sDetails", "sPhotos", "sReview"] as const;

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
        <span>Step {step} of {STEPS.length}</span>
        <span className="text-primary">{t(labelKeys[step - 1])}</span>
      </div>
      <div className="relative h-1.5 overflow-hidden rounded-full bg-secondary">
        <motion.div
          className="absolute inset-y-0 left-0 gradient-primary"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>
      <ol className="flex items-start justify-between">
        {STEPS.map((s, i) => {
          const done = s.n < step;
          const active = s.n === step;
          return (
            <li key={s.n} className="flex flex-1 flex-col items-center gap-1">
              <motion.div
                animate={done ? { scale: [1, 1.25, 1] } : { scale: 1 }}
                transition={{ duration: 0.35 }}
                className={[
                  "grid h-6 w-6 place-items-center rounded-full text-[10px] font-semibold transition-all",
                  done && "bg-success text-success-foreground",
                  active && "ring-2 ring-primary ring-offset-2 ring-offset-background bg-surface-raised text-primary",
                  !done && !active && "bg-secondary text-muted-foreground",
                ]
                  .filter(Boolean)
                  .join(" ")}
                aria-current={active ? "step" : undefined}
              >
                {done ? <Check className="h-3 w-3" /> : s.n}
              </motion.div>
              <span
                className={[
                  "text-center text-[9px] font-medium leading-tight",
                  active ? "text-primary" : done ? "text-foreground" : "text-muted-foreground",
                ].join(" ")}
              >
                {t(labelKeys[i])}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
