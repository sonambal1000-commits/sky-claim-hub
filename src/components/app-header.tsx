import { Link } from "@tanstack/react-router";
import { EagleLogo } from "./eagle-logo";
import { LanguagePicker } from "./language-picker";
import { TenantSwitcher } from "./tenant-switcher";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between gap-3 px-4">
        <Link to="/" className="flex items-center" aria-label="Home">
          <EagleLogo />
        </Link>
        <div className="flex items-center gap-2">
          <LanguagePicker />
          <TenantSwitcher />
        </div>
      </div>
    </header>
  );
}
