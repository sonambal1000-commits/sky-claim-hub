import { motion } from "motion/react";
import { Check } from "lucide-react";
import { useWizard } from "./wizard-context";
import type { ClaimType } from "@/lib/claims-storage";

const TYPES: { id: ClaimType; title: string; desc: string; emoji: string }[] = [
  { id: "damaged_suitcase", title: "Damaged suitcase", desc: "The bag itself is damaged", emoji: "🧳" },
  { id: "damaged_contents", title: "Damaged contents", desc: "Items inside are damaged", emoji: "📦" },
  { id: "damaged_both", title: "Both damaged", desc: "Bag and contents", emoji: "🧳📦" },
  { id: "lost_suitcase", title: "Lost suitcase", desc: "The bag never arrived", emoji: "❓" },
  { id: "lost_contents", title: "Lost contents", desc: "Items missing from bag", emoji: "📭" },
  { id: "lost_both", title: "Both lost", desc: "Bag and contents missing", emoji: "🚫" },
];

export function StepClaimType() {
  const { data, update } = useWizard();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ type: "spring", stiffness: 220, damping: 26 }}
      className="space-y-5"
    >
      <div className="space-y-1.5">
        <h2 className="font-display text-[22px] font-semibold tracking-tight">
          What happened?
        </h2>
        <p className="text-sm text-muted-foreground text-pretty">
          Choose the option that best describes your situation.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {TYPES.map((t) => {
          const active = data.type === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => update("type", t.id)}
              className={[
                "group relative flex flex-col items-start gap-2 rounded-2xl border p-3.5 text-left transition-all",
                "min-h-[132px]",
                active
                  ? "border-primary bg-primary-light-bg shadow-[var(--shadow-elegant)]"
                  : "border-border bg-surface-raised hover:border-primary/40 hover:bg-surface",
              ].join(" ")}
              aria-pressed={active}
            >
              {active && (
                <span className="absolute right-2.5 top-2.5 grid h-5 w-5 place-items-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-3 w-3" />
                </span>
              )}
              <div className="text-2xl leading-none">{t.emoji}</div>
              <div>
                <div className="text-sm font-semibold leading-tight">{t.title}</div>
                <div className="mt-1 text-[11px] leading-snug text-muted-foreground">
                  {t.desc}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
