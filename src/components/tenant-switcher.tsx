import { Check, Building2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TENANTS, useTenant } from "./tenant-provider";
import { toast } from "sonner";

const DOT: Record<string, string> = {
  eagle: "#0e3b48",
  easyjet: "#FF6600",
  skybridge: "#1B3A6B",
};

export function TenantSwitcher() {
  const { tenant, tenantInfo, setTenant } = useTenant();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex h-9 items-center gap-2 rounded-full border border-border bg-surface-raised px-3 text-xs font-medium text-foreground transition-colors hover:bg-surface"
        aria-label="Switch tenant"
      >
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ background: DOT[tenant] }}
        />
        <span className="hidden sm:inline">{tenantInfo.name}</span>
        <Building2 className="h-3.5 w-3.5 text-muted-foreground sm:hidden" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-muted-foreground">
          White-label tenant
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {TENANTS.map((t) => (
          <DropdownMenuItem
            key={t.id}
            onClick={() => {
              setTenant(t.id);
              toast.success(`Switched to ${t.name}`);
            }}
            className="cursor-pointer gap-2"
          >
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: DOT[t.id] }} />
            <span className="flex-1">{t.name}</span>
            {tenant === t.id && <Check className="h-4 w-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
