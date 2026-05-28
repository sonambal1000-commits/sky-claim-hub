import { useWizard } from "./wizard-context";

type Zone = { id: string; label: string; cx: number; cy: number; w: number; h: number };

const ZONES: Zone[] = [
  { id: "top", label: "Top", cx: 100, cy: 35, w: 110, h: 22 },
  { id: "front", label: "Front", cx: 100, cy: 105, w: 110, h: 80 },
  { id: "back", label: "Back", cx: 175, cy: 105, w: 16, h: 80 },
  { id: "left", label: "Left", cx: 36, cy: 105, w: 16, h: 80 },
  { id: "right", label: "Right", cx: 164, cy: 105, w: 16, h: 80 },
  { id: "bottom", label: "Bottom", cx: 100, cy: 170, w: 110, h: 16 },
  { id: "handle", label: "Handle", cx: 100, cy: 13, w: 40, h: 14 },
  { id: "wheels", label: "Wheels", cx: 100, cy: 192, w: 110, h: 14 },
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
        Tap each zone where the damage is. Select at least one to continue.
      </p>
      <div className="rounded-2xl border border-border bg-surface p-4">
        <svg viewBox="0 0 200 210" className="mx-auto h-64 w-auto">
          {ZONES.map((z) => {
            const on = selected.includes(z.id);
            return (
              <g
                key={z.id}
                onClick={() => toggle(z.id)}
                className="cursor-pointer"
                style={{ transition: "all 200ms" }}
              >
                <rect
                  x={z.cx - z.w / 2}
                  y={z.cy - z.h / 2}
                  width={z.w}
                  height={z.h}
                  rx={6}
                  fill={on ? "var(--color-primary)" : "var(--color-surface-raised)"}
                  fillOpacity={on ? 0.92 : 1}
                  stroke={on ? "var(--color-primary)" : "var(--color-border)"}
                  strokeWidth="1.5"
                />
                <text
                  x={z.cx}
                  y={z.cy + 3.5}
                  textAnchor="middle"
                  fontSize="9"
                  fontWeight="600"
                  fill={on ? "var(--color-primary-foreground)" : "var(--color-muted-foreground)"}
                  style={{ pointerEvents: "none", userSelect: "none" }}
                >
                  {z.label}
                </text>
                <title>{z.label}</title>
              </g>
            );
          })}
        </svg>
      </div>
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map((id) => {
            const z = ZONES.find((x) => x.id === id);
            return (
              <span
                key={id}
                className="inline-flex items-center rounded-full bg-primary-light-bg px-2.5 py-1 text-xs font-medium text-primary"
              >
                {z?.label}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
