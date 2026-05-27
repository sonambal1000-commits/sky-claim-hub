import { Check, Palette } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TENANTS, useTenant } from "./tenant-provider";

/**
 * Demo-only tenant switcher. In production this binding comes from
 * subdomain or session, not user choice.
 */
export function TenantSwitcher() {
  const { tenant, setTenant } = useTenant();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-surface-raised px-3 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        aria-label="Switch tenant theme (demo)"
      >
        <Palette className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Tenant</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-muted-foreground">
          White-label demo
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {TENANTS.map((t) => (
          <DropdownMenuItem
            key={t.id}
            onClick={() => setTenant(t.id)}
            className="cursor-pointer"
          >
            <span className="flex-1">{t.name}</span>
            {tenant === t.id && <Check className="h-4 w-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
