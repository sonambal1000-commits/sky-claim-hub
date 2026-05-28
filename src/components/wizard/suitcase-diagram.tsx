import { X } from "lucide-react";
import { useWizard } from "./wizard-context";

type ZoneId = "handle" | "top" | "front" | "left" | "right" | "bottom" | "wheels" | "back";

const ZONE_LABELS: Record<ZoneId, string> = {
  handle: "Handle",
  top: "Top",
  front: "Front",
  left: "Left side",
  right: "Right side",
  bottom: "Bottom",
  wheels: "Wheels",
  back: "Back",
};

export function SuitcaseDiagram() {
  const { data, patch } = useWizard();
  const selected = data.item.damageAreas as ZoneId[];

  const toggle = (id: ZoneId) => {
    const next = selected.includes(id)
      ? selected.filter((a) => a !== id)
      : [...selected, id];
    patch("item", { damageAreas: next });
  };

  const zoneProps = (id: ZoneId) => {
    const on = selected.includes(id);
    return {
      onClick: () => toggle(id),
      style: { cursor: "pointer", transition: "all 200ms" },
      fill: on ? "var(--color-primary)" : "transparent",
      fillOpacity: on ? 0.4 : 0,
      stroke: on ? "var(--color-primary)" : "transparent",
      strokeWidth: 2,
      className: "hover:fill-[var(--color-primary)] hover:fill-opacity-15",
      "data-zone": id,
    } as const;
  };

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-border bg-surface p-5">
        <svg viewBox="0 0 280 320" className="mx-auto block h-[320px] w-[280px] max-w-full">
          {/* Telescopic handle slots */}
          <rect x="100" y="14" width="6" height="20" rx="1.5" fill="#CBD5E1" />
          <rect x="174" y="14" width="6" height="20" rx="1.5" fill="#CBD5E1" />

          {/* Handle */}
          <g {...zoneProps("handle")}>
            <rect x="90" y="6" width="100" height="22" rx="11" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2" />
            <rect x="100" y="14" width="80" height="6" rx="3" fill="#F8FAFC" />
            <rect x="90" y="6" width="100" height="22" rx="11" {...zoneProps("handle")} />
          </g>

          {/* Suitcase main body */}
          <rect x="40" y="36" width="200" height="240" rx="18" fill="#F0F0F0" stroke="#CBD5E1" strokeWidth="2" />

          {/* Left side strip */}
          <rect x="40" y="36" width="16" height="240" rx="8" fill="#E6E8EB" />
          {/* Right side strip */}
          <rect x="224" y="36" width="16" height="240" rx="8" fill="#E6E8EB" />

          {/* Zipper / opening seam (horizontal, ~1/3 from top of body) */}
          <line x1="56" y1="116" x2="224" y2="116" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="4 3" />
          <circle cx="220" cy="116" r="3.5" fill="#64748B" />

          {/* Brand stripe */}
          <rect x="56" y="170" width="168" height="3" fill="#CBD5E1" opacity="0.6" />

          {/* Corner protectors */}
          <rect x="44" y="40" width="14" height="14" rx="3" fill="#94A3B8" opacity="0.4" />
          <rect x="222" y="40" width="14" height="14" rx="3" fill="#94A3B8" opacity="0.4" />
          <rect x="44" y="258" width="14" height="14" rx="3" fill="#94A3B8" opacity="0.4" />
          <rect x="222" y="258" width="14" height="14" rx="3" fill="#94A3B8" opacity="0.4" />

          {/* Wheels */}
          <g {...zoneProps("wheels")}>
            <rect x="40" y="280" width="200" height="32" rx="6" fill="transparent" stroke="transparent" />
            <circle cx="62" cy="294" r="14" fill="#1F2937" stroke="#0F172A" strokeWidth="2" />
            <circle cx="62" cy="294" r="5" fill="#475569" />
            <circle cx="218" cy="294" r="14" fill="#1F2937" stroke="#0F172A" strokeWidth="2" />
            <circle cx="218" cy="294" r="5" fill="#475569" />
            <rect x="40" y="280" width="200" height="32" rx="6" {...zoneProps("wheels")} />
          </g>

          {/* Clickable zones — invisible overlays */}
          {/* Top panel (above zipper) */}
          <rect x="56" y="36" width="168" height="80" rx="12" {...zoneProps("top")} />
          {/* Front (main face below zipper) */}
          <rect x="56" y="116" width="168" height="160" rx="8" {...zoneProps("front")} />
          {/* Left side */}
          <rect x="40" y="36" width="16" height="240" rx="8" {...zoneProps("left")} />
          {/* Right side */}
          <rect x="224" y="36" width="16" height="240" rx="8" {...zoneProps("right")} />
          {/* Bottom strip */}
          <rect x="56" y="262" width="168" height="14" rx="4" {...zoneProps("bottom")} />

          {/* Back indicator button (bottom right corner) */}
          <g {...zoneProps("back")}>
            <rect x="186" y="288" width="50" height="22" rx="11" fill={selected.includes("back") ? "var(--color-primary)" : "#FFFFFF"} stroke={selected.includes("back") ? "var(--color-primary)" : "#CBD5E1"} strokeWidth="1.5" />
            <text
              x="211"
              y="303"
              textAnchor="middle"
              fontSize="10"
              fontWeight="700"
              fill={selected.includes("back") ? "var(--color-primary-foreground)" : "#64748B"}
              style={{ pointerEvents: "none", userSelect: "none" }}
            >
              BACK
            </text>
          </g>
        </svg>
      </div>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => toggle(id)}
              className="inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
            >
              {ZONE_LABELS[id]}
              <X className="h-3 w-3" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
