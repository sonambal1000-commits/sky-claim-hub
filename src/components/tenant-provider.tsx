import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Tenant = "eagle" | "easyjet" | "skybridge";

export const TENANTS: { id: Tenant; name: string; tagline: string }[] = [
  { id: "eagle", name: "Eagle Claims", tagline: "Assisting the world's airlines" },
  { id: "easyjet", name: "easyJet", tagline: "Powered by Eagle Claims" },
  { id: "skybridge", name: "Skybridge Air", tagline: "Powered by Eagle Claims" },
];

type Ctx = {
  tenant: Tenant;
  setTenant: (t: Tenant) => void;
  tenantInfo: (typeof TENANTS)[number];
};

const TenantCtx = createContext<Ctx | null>(null);

export function TenantProvider({ children }: { children: ReactNode }) {
  const [tenant, setTenantState] = useState<Tenant>("eagle");

  // Hydrate from localStorage on mount (client only)
  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("eagle.tenant") : null;
    if (stored && TENANTS.some((t) => t.id === stored)) {
      setTenantState(stored as Tenant);
    }
  }, []);

  // Apply data-tenant to <html>
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
