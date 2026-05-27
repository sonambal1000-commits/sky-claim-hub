import { createContext, useContext, useState, type ReactNode } from "react";
import type { ClaimType } from "@/lib/claims-storage";

export type WizardData = {
  flight: {
    bookingRef: string;
    flightNo: string;
    date: string;
    from: string;
    to: string;
    pir: string;
    hasBookingRef: boolean;
  };
  passenger: { firstName: string; lastName: string; email: string; phone: string };
  type: ClaimType | null;
  item: {
    bagType: string;
    brand: string;
    color: string;
    size: string;
    tagNo: string;
    locks: string;
    damageAreas: string[];
    damageTypes: string[];
    description: string;
  };
  evidence: { name: string; preview: string }[];
  consent: boolean;
};

const initial: WizardData = {
  flight: { bookingRef: "", flightNo: "", date: "", from: "", to: "", pir: "", hasBookingRef: true },
  passenger: { firstName: "", lastName: "", email: "", phone: "" },
  type: null,
  item: {
    bagType: "",
    brand: "",
    color: "",
    size: "",
    tagNo: "",
    locks: "",
    damageAreas: [],
    damageTypes: [],
    description: "",
  },
  evidence: [],
  consent: false,
};

type Ctx = {
  step: number;
  setStep: (n: number) => void;
  data: WizardData;
  update: <K extends keyof WizardData>(key: K, value: WizardData[K]) => void;
  patch: <K extends keyof WizardData>(key: K, partial: Partial<WizardData[K]>) => void;
  reset: () => void;
};

const WizardCtx = createContext<Ctx | null>(null);

export function WizardProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<WizardData>(initial);

  const update: Ctx["update"] = (key, value) => setData((d) => ({ ...d, [key]: value }));
  const patch: Ctx["patch"] = (key, partial) =>
    setData((d) => ({ ...d, [key]: { ...(d[key] as object), ...partial } as WizardData[typeof key] }));
  const reset = () => {
    setData(initial);
    setStep(1);
  };

  return (
    <WizardCtx.Provider value={{ step, setStep, data, update, patch, reset }}>
      {children}
    </WizardCtx.Provider>
  );
}

export function useWizard() {
  const ctx = useContext(WizardCtx);
  if (!ctx) throw new Error("useWizard must be used inside WizardProvider");
  return ctx;
}

export const STEPS = [
  { n: 1, label: "Flight" },
  { n: 2, label: "Claim type" },
  { n: 3, label: "Details" },
  { n: 4, label: "Evidence" },
  { n: 5, label: "Review" },
];
