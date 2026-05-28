import { motion } from "motion/react";
import { ChevronDown, Shield, Camera, Plane } from "lucide-react";
import { useState } from "react";
import { useWizard } from "./wizard-context";
import { CLAIM_TYPE_LABEL } from "@/lib/claims-storage";
import { useTenant } from "@/components/tenant-provider";
import { AIRLINE_META, type AirlineName } from "@/lib/demo-data";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function Section({
  title,
  icon: Icon,
  children,
  defaultOpen = true,
}: {
  title: string;
  icon: typeof Plane;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="rounded-2xl border border-border bg-surface-raised">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
      >
        <div className="flex items-center gap-2.5">
          <div className="grid h-8 w-8 place-items-center rounded-full bg-primary-light-bg text-primary">
            <Icon className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold">{title}</span>
        </div>
        <ChevronDown
          className={[
            "h-4 w-4 text-muted-foreground transition-transform duration-200",
            open && "rotate-180",
          ].filter(Boolean).join(" ")}
        />
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
      >
        <div className="border-t border-border px-4 py-3.5">{children}</div>
      </motion.div>
    </section>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-right text-sm font-medium">{value || "—"}</span>
    </div>
  );
}

const PHOTO_SLOTS: { key: string; label: string }[] = [
  { key: "exterior", label: "Bag exterior" },
  { key: "damage",   label: "Damage close-up" },
  { key: "tag",      label: "Baggage tag" },
  { key: "receipt",  label: "Receipt" },
];

export function StepReview() {
  const { data, patch, update } = useWizard();
  const { tenantInfo } = useTenant();

  // Pick the airline pill colour: use the tenant if it's an airline, otherwise easyJet for demo polish
  const airlineName: AirlineName =
    tenantInfo.id === "easyjet"   ? "easyJet" :
    tenantInfo.id === "airpeace"  ? "Air Peace" :
    tenantInfo.id === "malaysia"  ? "Malaysia Airlines" :
    tenantInfo.id === "thai"      ? "Thai Airways" :
    tenantInfo.id === "oman"      ? "Oman Air" :
    "easyJet";
  const airlineMeta = AIRLINE_META[airlineName];

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
          Review your claim
        </h2>
        <p className="text-sm text-muted-foreground text-pretty">
          Check everything looks right before we submit.
        </p>
      </div>

      {/* Contact details */}
      <section className="space-y-3 rounded-2xl border border-border bg-surface-raised p-4">
        <Label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Your contact details
        </Label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="fn">First name</Label>
            <Input id="fn" value={data.passenger.firstName}
              onChange={(e) => patch("passenger", { firstName: e.target.value })}
              className="mt-1.5 h-12" />
          </div>
          <div>
            <Label htmlFor="ln">Last name</Label>
            <Input id="ln" value={data.passenger.lastName}
              onChange={(e) => patch("passenger", { lastName: e.target.value })}
              className="mt-1.5 h-12" />
          </div>
        </div>
        <div>
          <Label htmlFor="em">Email</Label>
          <Input id="em" type="email" inputMode="email" value={data.passenger.email}
            onChange={(e) => patch("passenger", { email: e.target.value })}
            className="mt-1.5 h-12" />
        </div>
      </section>

      {/* Section 1 — Flight details */}
      <Section title="Flight details" icon={Plane}>
        <div className="mb-2 flex items-center gap-2">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold text-white"
            style={{ background: airlineMeta.color }}
          >
            {airlineName}
            <span className="font-mono text-[9px] opacity-80">{airlineMeta.iata}</span>
          </span>
        </div>
        <Row label="Flight number" value={data.flight.flightNo || "U2 8472"} />
        <Row label="Route" value={data.flight.from && data.flight.to ? `${data.flight.from} → ${data.flight.to}` : "LGW → PMI"} />
        <Row label="Date" value={data.flight.date || "22 May 2026"} />
        {data.flight.bookingRef && <Row label="Booking ref" value={data.flight.bookingRef} />}
      </Section>

      {/* Section 2 — Claim details */}
      <Section title="Claim details" icon={Shield}>
        <Row label="Claim type" value={data.type ? CLAIM_TYPE_LABEL[data.type] : "Damaged suitcase"} />
        <Row label="Bag brand" value={data.item.brand || "Samsonite"} />
        <Row label="Bag type" value={data.item.bagType || "Suitcase"} />
        <Row label="Colour" value={data.item.color || "Navy"} />
        <Row label="Damage location" value={data.item.damageAreas.length ? data.item.damageAreas.join(", ") : "Front"} />
        <Row label="Damage type" value={data.item.damageTypes.length ? data.item.damageTypes.join(", ") : "Wheel broken"} />
        {data.item.tagNo && <Row label="Tag no." value={data.item.tagNo} />}
      </Section>

      {/* Section 3 — Photos */}
      <Section title={`Your photos (${data.evidence.length})`} icon={Camera}>
        <div className="grid grid-cols-4 gap-2">
          {PHOTO_SLOTS.map((slot) => {
            const photo = data.evidence.find((e) => e.name === slot.key);
            return (
              <div key={slot.key} className="space-y-1">
                <div className="relative aspect-square overflow-hidden rounded-lg border border-border bg-muted">
                  {photo ? (
                    <img src={photo.preview} alt={slot.label} className="h-full w-full object-cover" />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-muted-foreground">
                      <Camera className="h-5 w-5" />
                    </div>
                  )}
                </div>
                <div className="text-center text-[10px] font-medium leading-tight text-muted-foreground">
                  {slot.label}
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      <div className="h-px w-full bg-border" />

      {/* GDPR Consent */}
      <section className="rounded-2xl border border-border bg-primary-light-bg/40 p-4">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={data.consent}
            onChange={(e) => update("consent", e.target.checked)}
            className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded border-2 border-border accent-[var(--color-primary)]"
          />
          <span className="text-sm font-medium leading-snug text-foreground">
            I consent to Eagle Claims processing my personal data to handle this claim.
          </span>
        </label>
        <ul className="mt-3 space-y-1.5 pl-8 text-[11px] text-muted-foreground">
          <li>• Your data is used only to process this claim</li>
          <li>• Shared with the airline and our handling team only</li>
          <li>• Stored for 7 years per aviation regulation</li>
          <li>• Request deletion: <a className="text-primary hover:underline" href="mailto:privacy@eagleclaims.com">privacy@eagleclaims.com</a></li>
        </ul>
      </section>
    </motion.div>
  );
}
