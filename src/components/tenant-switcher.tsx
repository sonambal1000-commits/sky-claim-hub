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

export function TenantSwitcher() {
  const { tenant, tenantInfo, setTenant } = useTenant();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex h-9 items-center gap-2 rounded-full border border-border bg-surface-raised px-3 text-xs font-medium text-foreground transition-colors hover:bg-surface"
        aria-label="Switch tenant"
      >
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: tenantInfo.color }} />
        <span className="hidden sm:inline">{tenantInfo.name}</span>
        {tenantInfo.iata && (
          <span className="hidden text-[10px] font-mono text-muted-foreground sm:inline">
            {tenantInfo.iata}
          </span>
        )}
        <Building2 className="h-3.5 w-3.5 text-muted-foreground sm:hidden" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-muted-foreground">
          White-label tenant
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {TENANTS.map((t) => (
          <DropdownMenuItem
            key={t.id}
            onClick={() => {
              setTenant(t.id);
              toast.success(`Switched to ${t.name}`, {
                icon: (
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ background: t.color }}
                  />
                ),
              });
            }}
            className="cursor-pointer gap-2"
          >
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: t.color }} />
            <span className="flex-1">{t.name}</span>
            {t.iata && (
              <span className="font-mono text-[10px] text-muted-foreground">{t.iata}</span>
            )}
            {tenant === t.id && <Check className="h-4 w-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
