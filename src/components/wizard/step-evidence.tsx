import { motion } from "motion/react";
import { Camera, Plus, Trash2, Receipt, Package, Tag, ImageIcon, Search } from "lucide-react";
import { useRef } from "react";
import { useWizard } from "./wizard-context";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Slot = { key: string; label: string; sub: string; icon: typeof Camera };

const SLOTS: Slot[] = [
  { key: "exterior", label: "Full bag exterior", sub: "Show the whole bag", icon: Package },
  { key: "damage", label: "Close-up of damage", sub: "Focus on the issue", icon: Search },
  { key: "tag", label: "Baggage tag", sub: "Airline barcode tag", icon: Tag },
  { key: "receipt", label: "Purchase receipt", sub: "Or approx. purchase date", icon: Receipt },
];

export function StepEvidence() {
  const { data, update, patch } = useWizard();
  const extraRef = useRef<HTMLInputElement | null>(null);

  const handleUpload = (key: string, files: FileList | null) => {
    if (!files || !files[0]) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const url = String(reader.result);
      const filtered = data.evidence.filter((e) => e.name !== key);
      update("evidence", [...filtered, { name: key, preview: url }]);
    };
    reader.readAsDataURL(file);
  };

  const handleExtra = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((file, i) => {
      const reader = new FileReader();
      reader.onload = () => {
        const url = String(reader.result);
        update("evidence", [
          ...data.evidence,
          { name: `extra-${Date.now()}-${i}`, preview: url },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const remove = (name: string) => {
    update("evidence", data.evidence.filter((e) => e.name !== name));
  };

  const find = (key: string) => data.evidence.find((e) => e.name === key);
  const extras = data.evidence.filter((e) => e.name.startsWith("extra-"));

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
          Add your photos
        </h2>
        <p className="text-sm text-muted-foreground text-pretty">
          Four photos help us decide your claim faster. Tap to use your camera.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {SLOTS.map((slot) => {
          const existing = find(slot.key);
          const Icon = slot.icon;
          const isReceipt = slot.key === "receipt";

          if (isReceipt && data.noReceipt) {
            return (
              <div
                key={slot.key}
                className="col-span-2 rounded-2xl border-2 border-dashed border-border bg-surface-raised p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="grid h-9 w-9 place-items-center rounded-full bg-primary-light-bg text-primary">
                      <Receipt className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">Approx. purchase date</div>
                      <div className="text-[11px] text-muted-foreground">Used in lieu of a receipt</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => update("noReceipt", false)}
                    className="text-[11px] font-medium text-primary underline-offset-2 hover:underline"
                  >
                    I have a receipt
                  </button>
                </div>
                <Label htmlFor="pdate" className="sr-only">Purchase date</Label>
                <Input
                  id="pdate"
                  type="date"
                  value={data.purchaseDate}
                  onChange={(e) => update("purchaseDate", e.target.value)}
                  className="mt-3 h-12"
                />
              </div>
            );
          }

          return (
            <div key={slot.key} className="flex flex-col gap-1.5">
              <label
                className={[
                  "group relative flex min-h-[140px] cursor-pointer flex-col overflow-hidden rounded-2xl border-2 border-dashed transition-all",
                  existing
                    ? "border-primary/40"
                    : "border-border hover:border-primary/50 hover:bg-primary-light-bg/30",
                ].join(" ")}
              >
                {existing ? (
                  <>
                    <img
                      src={existing.preview}
                      alt={slot.label}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 text-[10px] font-medium text-white">
                      {slot.label}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); remove(slot.key); }}
                      className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full bg-black/60 text-white backdrop-blur-md"
                      aria-label={`Remove ${slot.label}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </>
                ) : (
                  <div className="flex flex-1 flex-col items-center justify-center gap-2 p-3 text-center">
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-primary-light-bg text-primary">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="text-xs font-semibold leading-tight">{slot.label}</div>
                    <div className="text-[10px] leading-tight text-muted-foreground">{slot.sub}</div>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="sr-only"
                  onChange={(e) => handleUpload(slot.key, e.target.files)}
                />
              </label>
              {isReceipt && (
                <button
                  type="button"
                  onClick={() => update("noReceipt", true)}
                  className="text-[10px] font-medium text-primary underline-offset-2 hover:underline"
                >
                  I don't have a receipt
                </button>
              )}
            </div>
          );
        })}
      </div>

      {extras.length > 0 && (
        <div>
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Extra photos
          </div>
          <div className="grid grid-cols-4 gap-2">
            {extras.map((e) => (
              <div key={e.name} className="relative aspect-square overflow-hidden rounded-lg">
                <img src={e.preview} alt="extra" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => remove(e.name)}
                  className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-black/60 text-white"
                  aria-label="Remove"
                >
                  <Trash2 className="h-2.5 w-2.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => extraRef.current?.click()}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-surface py-3.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
      >
        <Plus className="h-4 w-4" />
        Add more photos (optional)
      </button>
      <input
        ref={extraRef}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        onChange={(e) => handleExtra(e.target.files)}
      />

      <p className="flex items-start gap-2 rounded-xl bg-info/10 p-3 text-xs text-foreground">
        <ImageIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-info" />
        Photos are encrypted in transit and stored only for the purpose of reviewing your claim.
      </p>
    </motion.div>
  );
}
