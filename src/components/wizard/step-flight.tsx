import { motion } from "motion/react";
import { CheckCircle2, Plane, Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useWizard } from "./wizard-context";

export function StepFlight() {
  const { data, patch } = useWizard();
  const [looking, setLooking] = useState(false);
  const [found, setFound] = useState(false);

  const refValid = /^[A-Z0-9]{6}$/i.test(data.flight.bookingRef);

  const lookup = () => {
    if (!refValid) return;
    setLooking(true);
    setTimeout(() => {
      patch("flight", {
        flightNo: "U2 8472",
        date: "2026-05-22",
        from: "London Gatwick (LGW)",
        to: "Palma de Mallorca (PMI)",
      });
      setLooking(false);
      setFound(true);
    }, 900);
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
          Find your flight
        </h2>
        <p className="text-sm text-muted-foreground text-pretty">
          We'll pull your route details automatically — no need to type them in.
        </p>
      </div>

      {data.flight.hasBookingRef ? (
        <div className="space-y-3">
          <div>
            <Label htmlFor="bref">Booking reference</Label>
            <div className="relative mt-1.5">
              <Input
                id="bref"
                placeholder="e.g. K9R2XQ"
                value={data.flight.bookingRef}
                onChange={(e) =>
                  patch("flight", { bookingRef: e.target.value.toUpperCase() })
                }
                maxLength={8}
                className="h-12 pr-10 text-base font-mono tracking-widest uppercase"
                inputMode="text"
                autoCapitalize="characters"
                autoComplete="off"
              />
              {refValid && (
                <CheckCircle2 className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-success" />
              )}
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">
              6 characters, letters and numbers
            </p>
          </div>

          <Button
            type="button"
            onClick={lookup}
            disabled={!refValid || looking}
            className="h-12 w-full gap-2"
          >
            {looking ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                Looking up...
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                Find flight
              </>
            )}
          </Button>

          {found && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl border border-primary/30 bg-primary-light-bg p-4"
            >
              <div className="flex items-center gap-2 text-xs font-medium text-primary">
                <Plane className="h-3.5 w-3.5" />
                Flight found
              </div>
              <div className="mt-2 font-display text-lg font-semibold">
                {data.flight.flightNo}
              </div>
              <div className="mt-1 flex items-center gap-2 text-sm text-foreground">
                <span>{data.flight.from}</span>
                <Plane className="h-3.5 w-3.5 rotate-90 text-muted-foreground" />
                <span>{data.flight.to}</span>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">{data.flight.date}</div>
            </motion.div>
          )}

          <button
            type="button"
            onClick={() => patch("flight", { hasBookingRef: false })}
            className="text-xs text-primary underline-offset-4 hover:underline"
          >
            I don't have my booking reference
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <Label htmlFor="fno">Flight number</Label>
            <Input
              id="fno"
              placeholder="U2 8472"
              value={data.flight.flightNo}
              onChange={(e) => patch("flight", { flightNo: e.target.value })}
              className="mt-1.5 h-12"
            />
          </div>
          <div>
            <Label htmlFor="fdate">Date of flight</Label>
            <Input
              id="fdate"
              type="date"
              value={data.flight.date}
              onChange={(e) => patch("flight", { date: e.target.value })}
              className="mt-1.5 h-12"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="ffrom">From</Label>
              <Input
                id="ffrom"
                placeholder="LGW"
                value={data.flight.from}
                onChange={(e) => patch("flight", { from: e.target.value })}
                className="mt-1.5 h-12"
              />
            </div>
            <div>
              <Label htmlFor="fto">To</Label>
              <Input
                id="fto"
                placeholder="PMI"
                value={data.flight.to}
                onChange={(e) => patch("flight", { to: e.target.value })}
                className="mt-1.5 h-12"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={() => patch("flight", { hasBookingRef: true })}
            className="text-xs text-primary underline-offset-4 hover:underline"
          >
            I have my booking reference
          </button>
        </div>
      )}

      <div className="border-t border-border pt-4">
        <Label htmlFor="pir" className="text-xs uppercase tracking-wider text-muted-foreground">
          Optional
        </Label>
        <div className="mt-1.5">
          <Label htmlFor="pir">PIR reference (if reported at airport)</Label>
          <Input
            id="pir"
            placeholder="LHRBA12345"
            value={data.flight.pir}
            onChange={(e) =>
              patch("flight", { pir: e.target.value.toUpperCase() })
            }
            className="mt-1.5 h-12 font-mono uppercase"
          />
        </div>
      </div>
    </motion.div>
  );
}
