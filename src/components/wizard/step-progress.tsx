import { Check } from "lucide-react";
import { STEPS, useWizard } from "./wizard-context";

export function StepProgress() {
  const { step } = useWizard();
  const pct = ((step - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
        <span>Step {step} of {STEPS.length}</span>
        <span className="text-primary">{STEPS[step - 1].label}</span>
      </div>
      <div className="relative h-1.5 overflow-hidden rounded-full bg-secondary">
        <div
          className="absolute inset-y-0 left-0 gradient-primary transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <ol className="flex items-center justify-between">
        {STEPS.map((s) => {
          const done = s.n < step;
          const active = s.n === step;
          return (
            <li key={s.n} className="flex flex-col items-center gap-1">
              <div
                className={[
                  "grid h-6 w-6 place-items-center rounded-full text-[10px] font-semibold transition-all",
                  done && "bg-primary text-primary-foreground",
                  active && "ring-2 ring-primary ring-offset-2 ring-offset-background bg-surface-raised text-primary",
                  !done && !active && "bg-secondary text-muted-foreground",
                ]
                  .filter(Boolean)
                  .join(" ")}
                aria-current={active ? "step" : undefined}
              >
                {done ? <Check className="h-3 w-3" /> : s.n}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
