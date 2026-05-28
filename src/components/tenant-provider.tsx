import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Tenant = "eagle" | "easyjet" | "airpeace" | "malaysia" | "thai" | "oman";

export type TenantInfo = {
  id: Tenant;
  name: string;
  iata: string;
  color: string;
  tagline: string;
};

export const TENANTS: TenantInfo[] = [
  { id: "eagle",    name: "Eagle Claims",      iata: "",   color: "#1A6B5A", tagline: "Assisting the world's airlines" },
  { id: "easyjet",  name: "easyJet",           iata: "EZY", color: "#FF6600", tagline: "Powered by Eagle Claims" },
  { id: "airpeace", name: "Air Peace",         iata: "P4",  color: "#006400", tagline: "Powered by Eagle Claims" },
  { id: "malaysia", name: "Malaysia Airlines", iata: "MH",  color: "#C8102E", tagline: "Powered by Eagle Claims" },
  { id: "thai",     name: "Thai Airways",      iata: "TG",  color: "#6B0F8C", tagline: "Powered by Eagle Claims" },
  { id: "oman",     name: "Oman Air",          iata: "WY",  color: "#8B0000", tagline: "Powered by Eagle Claims" },
];

type Ctx = {
  tenant: Tenant;
  setTenant: (t: Tenant) => void;
  tenantInfo: TenantInfo;
};

const TenantCtx = createContext<Ctx | null>(null);

export function TenantProvider({ children }: { children: ReactNode }) {
  const [tenant, setTenantState] = useState<Tenant>("eagle");

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("eagle.tenant") : null;
    if (stored && TENANTS.some((t) => t.id === stored)) {
      setTenantState(stored as Tenant);
    }
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-tenant", tenant);
    }
  }, [tenant]);

  const setTenant = (t: Tenant) => {
    setTenantState(t);
    if (typeof window !== "undefined") localStorage.setItem("eagle.tenant", t);
  };

  const tenantInfo = TENANTS.find((t) => t.id === tenant) ?? TENANTS[0];

  return (
    <TenantCtx.Provider value={{ tenant, setTenant, tenantInfo }}>{children}</TenantCtx.Provider>
  );
}

export function useTenant() {
  const ctx = useContext(TenantCtx);
  if (!ctx) throw new Error("useTenant must be used within TenantProvider");
  return ctx;
}
