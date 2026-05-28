import { Check, Plane, FileQuestion, Luggage, Camera, CheckCircle, type LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import { STEPS, useWizard } from "./wizard-context";
import { useI18n } from "@/lib/i18n";

const STEP_ICONS: LucideIcon[] = [Plane, FileQuestion, Luggage, Camera, CheckCircle];

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
          const Icon = STEP_ICONS[i];
          return (
            <li key={s.n} className="flex flex-1 flex-col items-center gap-1">
              <motion.div
                animate={done ? { scale: [1, 1.25, 1] } : { scale: 1 }}
                transition={{ duration: 0.35 }}
                className={[
                  "grid h-7 w-7 place-items-center rounded-full text-[10px] font-semibold transition-all",
                  done && "bg-success text-success-foreground",
                  active && "ring-2 ring-primary ring-offset-2 ring-offset-background bg-primary text-primary-foreground",
                  !done && !active && "bg-secondary text-muted-foreground",
                ]
                  .filter(Boolean)
                  .join(" ")}
                aria-current={active ? "step" : undefined}
              >
                {done ? <Check className="h-3.5 w-3.5" strokeWidth={1.5} /> : <Icon className="h-3.5 w-3.5" strokeWidth={1.5} />}
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
