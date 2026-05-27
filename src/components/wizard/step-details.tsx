import { motion } from "motion/react";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { LUGGAGE_BRANDS } from "@/lib/brands";
import { useWizard } from "./wizard-context";
import { SuitcaseDiagram } from "./suitcase-diagram";

const BAG_TYPES = ["Suitcase", "Holdall", "Backpack", "Travel bag", "Other"];
const SIZES = ["Cabin", "Medium", "Large", "Extra large"];
const DAMAGE_TYPES = [
  "Crushed",
  "Cracked",
  "Torn",
  "Handle broken",
  "Wheel broken",
  "Lock broken",
  "Scratched",
  "Other",
];

export function StepDetails() {
  const { data, patch } = useWizard();
  const [brandOpen, setBrandOpen] = useState(false);
  const isLost = data.type?.startsWith("lost");

  const toggleDamage = (t: string) => {
    const next = data.item.damageTypes.includes(t)
      ? data.item.damageTypes.filter((x) => x !== t)
      : [...data.item.damageTypes, t];
    patch("item", { damageTypes: next });
  };

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
          About your bag
        </h2>
        <p className="text-sm text-muted-foreground text-pretty">
          Tell us a bit more so we can process your claim quickly.
        </p>
      </div>

      <section className="space-y-3 rounded-2xl border border-border bg-surface-raised p-4">
        <div>
          <Label htmlFor="bagType">Bag type</Label>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {BAG_TYPES.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => patch("item", { bagType: b })}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  data.item.bagType === b
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-surface text-muted-foreground hover:text-foreground",
                )}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="brand">Brand</Label>
          <Popover open={brandOpen} onOpenChange={setBrandOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="mt-1.5 flex h-12 w-full items-center justify-between rounded-md border border-input bg-surface-raised px-3 text-sm"
              >
                <span className={cn(!data.item.brand && "text-muted-foreground")}>
                  {data.item.brand || "Select brand..."}
                </span>
                <ChevronsUpDown className="h-4 w-4 opacity-50" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
              <Command>
                <CommandInput placeholder="Search 54 brands..." />
                <CommandList>
                  <CommandEmpty>No brand found.</CommandEmpty>
                  <CommandGroup>
                    {LUGGAGE_BRANDS.map((b) => (
                      <CommandItem
                        key={b}
                        value={b}
                        onSelect={() => {
                          patch("item", { brand: b });
                          setBrandOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            data.item.brand === b ? "opacity-100" : "opacity-0",
                          )}
                        />
                        {b}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="color">Colour</Label>
            <Input
              id="color"
              placeholder="e.g. Navy"
              value={data.item.color}
              onChange={(e) => patch("item", { color: e.target.value })}
              className="mt-1.5 h-12"
            />
          </div>
          <div>
            <Label htmlFor="size">Size</Label>
            <select
              id="size"
              value={data.item.size}
              onChange={(e) => patch("item", { size: e.target.value })}
              className="mt-1.5 h-12 w-full rounded-md border border-input bg-surface-raised px-3 text-sm"
            >
              <option value="">Select...</option>
              {SIZES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="tag">Baggage tag No.</Label>
            <Input
              id="tag"
              placeholder="EZY123456"
              value={data.item.tagNo}
              onChange={(e) => patch("item", { tagNo: e.target.value.toUpperCase() })}
              className="mt-1.5 h-12 font-mono uppercase"
            />
          </div>
          <div>
            <Label htmlFor="locks">Locks</Label>
            <select
              id="locks"
              value={data.item.locks}
              onChange={(e) => patch("item", { locks: e.target.value })}
              className="mt-1.5 h-12 w-full rounded-md border border-input bg-surface-raised px-3 text-sm"
            >
              <option value="">Select...</option>
              <option value="none">No locks</option>
              <option value="tsa">TSA combination</option>
              <option value="key">Key lock</option>
              <option value="built-in">Built-in</option>
            </select>
          </div>
        </div>
      </section>

      {!isLost && (
        <>
          <section className="space-y-3 rounded-2xl border border-border bg-surface-raised p-4">
            <Label>Where is the damage?</Label>
            <SuitcaseDiagram />
          </section>

          <section className="space-y-3 rounded-2xl border border-border bg-surface-raised p-4">
            <Label>What type of damage?</Label>
            <div className="flex flex-wrap gap-1.5">
              {DAMAGE_TYPES.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => toggleDamage(d)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                    data.item.damageTypes.includes(d)
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-surface text-muted-foreground hover:text-foreground",
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
          </section>
        </>
      )}

      <div>
        <Label htmlFor="desc">Anything else we should know? (optional)</Label>
        <Textarea
          id="desc"
          rows={3}
          placeholder="Tell us anything that might help us process your claim..."
          value={data.item.description}
          onChange={(e) => patch("item", { description: e.target.value })}
          className="mt-1.5"
        />
      </div>
    </motion.div>
  );
}
