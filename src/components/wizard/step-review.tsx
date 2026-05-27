import { motion } from "motion/react";
import { ChevronRight, Shield, Lock, EyeOff, FileCheck2 } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useWizard } from "./wizard-context";
import { CLAIM_TYPE_LABEL } from "@/lib/claims-storage";

function Section({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="rounded-2xl border border-border bg-surface-raised">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <span className="text-sm font-semibold">{title}</span>
        <ChevronRight
          className={[
            "h-4 w-4 text-muted-foreground transition-transform",
            open && "rotate-90",
          ].join(" ")}
        />
      </button>
      {open && <div className="border-t border-border px-4 py-3 text-sm">{children}</div>}
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

export function StepReview() {
  const { data, patch, update } = useWizard();

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
          Review &amp; submit
        </h2>
        <p className="text-sm text-muted-foreground text-pretty">
          Almost done — check the details and tell us how to reach you.
        </p>
      </div>

      <section className="space-y-3 rounded-2xl border border-border bg-surface-raised p-4">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">
          Your contact details
        </Label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="fn">First name</Label>
            <Input
              id="fn"
              value={data.passenger.firstName}
              onChange={(e) => patch("passenger", { firstName: e.target.value })}
              className="mt-1.5 h-12"
            />
          </div>
          <div>
            <Label htmlFor="ln">Last name</Label>
            <Input
              id="ln"
              value={data.passenger.lastName}
              onChange={(e) => patch("passenger", { lastName: e.target.value })}
              className="mt-1.5 h-12"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="em">Email</Label>
          <Input
            id="em"
            type="email"
            inputMode="email"
            value={data.passenger.email}
            onChange={(e) => patch("passenger", { email: e.target.value })}
            className="mt-1.5 h-12"
          />
        </div>
        <div>
          <Label htmlFor="ph">Phone (optional)</Label>
          <Input
            id="ph"
            type="tel"
            inputMode="tel"
            value={data.passenger.phone}
            onChange={(e) => patch("passenger", { phone: e.target.value })}
            className="mt-1.5 h-12"
          />
        </div>
      </section>

      <Section title="Flight" defaultOpen>
        <Row label="Flight" value={data.flight.flightNo} />
        <Row label="Date" value={data.flight.date} />
        <Row label="From" value={data.flight.from} />
        <Row label="To" value={data.flight.to} />
        {data.flight.bookingRef && <Row label="Booking ref" value={data.flight.bookingRef} />}
        {data.flight.pir && <Row label="PIR" value={data.flight.pir} />}
      </Section>

      <Section title="Claim type">
        <Row label="Type" value={data.type ? CLAIM_TYPE_LABEL[data.type] : "—"} />
      </Section>

      <Section title="Bag &amp; damage">
        <Row label="Type" value={data.item.bagType} />
        <Row label="Brand" value={data.item.brand} />
        <Row label="Colour" value={data.item.color} />
        <Row label="Size" value={data.item.size} />
        <Row label="Tag No." value={data.item.tagNo} />
        {data.item.damageTypes.length > 0 && (
          <Row label="Damage" value={data.item.damageTypes.join(", ")} />
        )}
      </Section>

      <Section title={`Photos (${data.evidence.length})`}>
        <div className="grid grid-cols-4 gap-2">
          {data.evidence.map((e) => (
            <img
              key={e.name}
              src={e.preview}
              alt=""
              className="aspect-square w-full rounded-md object-cover"
            />
          ))}
        </div>
      </Section>

      <section className="rounded-2xl border border-border bg-primary-light-bg/50 p-4">
        <div className="mb-3 flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">How we'll use your data</h3>
        </div>
        <ul className="space-y-2 text-xs text-foreground">
          {[
            { icon: FileCheck2, text: "Used only to review your claim" },
            { icon: Lock, text: "Encrypted in transit and at rest" },
            { icon: EyeOff, text: "Never sold or shared with third parties" },
            { icon: Shield, text: "Deleted after the retention period" },
          ].map(({ icon: Icon, text }, i) => (
            <li key={i} className="flex items-start gap-2">
              <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
              <span>{text}</span>
            </li>
          ))}
        </ul>
        <label className="mt-4 flex cursor-pointer items-start gap-2.5 rounded-xl bg-surface-raised p-3">
          <Checkbox
            checked={data.consent}
            onCheckedChange={(c) => update("consent", Boolean(c))}
            className="mt-0.5"
          />
          <span className="text-xs leading-snug">
            I agree to the processing of my data for the sole purpose of reviewing this claim and for the prevention of fraud.{" "}
            <a href="#" className="text-primary underline-offset-2 hover:underline">
              View privacy policy
            </a>
          </span>
        </label>
      </section>
    </motion.div>
  );
}
