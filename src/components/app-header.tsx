import { Link } from "@tanstack/react-router";
import { EagleLogo } from "./eagle-logo";
import { LanguagePicker } from "./language-picker";
import { TenantSwitcher } from "./tenant-switcher";
import { ThemeToggle } from "./theme-provider";
import { useTenant } from "./tenant-provider";

export function AppHeader() {
  const { tenantInfo, tenant } = useTenant();
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between gap-3 px-4">
        <Link to="/" className="flex items-center gap-2" aria-label="Home">
          <EagleLogo />
          {tenant !== "eagle" && (
            <span className="hidden border-l border-border pl-2 text-xs font-semibold text-muted-foreground sm:inline">
              {tenantInfo.name}
            </span>
          )}
        </Link>
        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <LanguagePicker />
          <TenantSwitcher />
        </div>
      </div>
    </header>
  );
}
