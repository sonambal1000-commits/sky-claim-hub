import { useTenant } from "./tenant-provider";

export function EagleLogo({ className = "" }: { className?: string }) {
  const { tenant, tenantInfo } = useTenant();

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div
        className="grid h-9 w-9 place-items-center rounded-xl gradient-primary shadow-[var(--shadow-elegant)]"
        aria-hidden="true"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-primary-foreground" fill="none">
          {/* stylized wing / eagle mark */}
          <path
            d="M3 14c4-1 7-3 9-7 2 4 5 6 9 7-3 1-6 3-9 6-3-3-6-5-9-6Z"
            fill="currentColor"
            opacity="0.95"
          />
          <path d="M12 7v13" stroke="currentColor" strokeWidth="1.25" opacity="0.4" />
        </svg>
      </div>
      <div className="leading-tight">
        <div className="font-display text-[15px] font-semibold tracking-tight">
          {tenantInfo.name}
        </div>
        {tenant !== "eagle" && (
          <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            {tenantInfo.tagline}
          </div>
        )}
      </div>
    </div>
  );
}
