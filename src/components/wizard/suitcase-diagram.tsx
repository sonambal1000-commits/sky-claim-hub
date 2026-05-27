import { useWizard } from "./wizard-context";

const AREAS = [
  { id: "top", label: "Top", d: "M40 20 H160 V45 H40 Z" },
  { id: "front", label: "Front", d: "M40 50 H160 V165 H40 Z" },
  { id: "handle", label: "Handle", d: "M85 5 H115 V18 H85 Z" },
  { id: "wheel-l", label: "Wheel (L)", d: "M40 170 H75 V190 H40 Z" },
  { id: "wheel-r", label: "Wheel (R)", d: "M125 170 H160 V190 H125 Z" },
  { id: "left", label: "Left side", d: "M28 50 H40 V165 H28 Z" },
  { id: "right", label: "Right side", d: "M160 50 H172 V165 H160 Z" },
];

export function SuitcaseDiagram() {
  const { data, patch } = useWizard();
  const selected = data.item.damageAreas;

  const toggle = (id: string) => {
    const next = selected.includes(id)
      ? selected.filter((a) => a !== id)
      : [...selected, id];
    patch("item", { damageAreas: next });
  };

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        Tap the area(s) where the damage is. Select all that apply.
      </p>
      <div className="rounded-2xl border border-border bg-surface p-4">
        <svg viewBox="0 0 200 200" className="mx-auto h-56 w-auto">
          {AREAS.map((a) => {
            const isOn = selected.includes(a.id);
            return (
              <g key={a.id}>
                <path
                  d={a.d}
                  onClick={() => toggle(a.id)}
                  className="cursor-pointer transition-all"
                  fill={isOn ? "var(--color-primary)" : "var(--color-surface-raised)"}
                  fillOpacity={isOn ? 0.9 : 1}
                  stroke="var(--color-border)"
                  strokeWidth="1.5"
                />
                <title>{a.label}</title>
              </g>
            );
          })}
        </svg>
      </div>
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map((id) => {
            const a = AREAS.find((x) => x.id === id);
            return (
              <span
                key={id}
                className="inline-flex items-center rounded-full bg-primary-light-bg px-2.5 py-1 text-xs font-medium text-primary"
              >
                {a?.label}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
