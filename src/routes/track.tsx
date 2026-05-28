import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Search } from "lucide-react";
import { useState } from "react";
import { AppHeader } from "@/components/app-header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/track")({
  head: () => ({
    meta: [
      { title: "Track a claim · Eagle Claims Portal" },
      { name: "description", content: "Track the status of your existing baggage claim." },
    ],
  }),
  component: TrackPage,
});

function TrackPage() {
  const [ref, setRef] = useState("");
  const navigate = useNavigate();

  const search = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo: any reference looks up the demo claim
    const id = ref.trim() ? `demo-${ref.trim().toUpperCase()}` : "demo-EC-260527-4821";
    navigate({ to: "/track/$claimId", params: { claimId: id } });
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-3xl px-4 py-6">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </Link>
        <div className="mt-4 space-y-1.5">
          <h1 className="font-display text-[26px] font-semibold tracking-tight">Track your claim</h1>
          <p className="text-sm text-muted-foreground">
            Enter the reference we emailed when you filed your claim.
          </p>
        </div>

        <form onSubmit={search} className="mt-6 space-y-3 rounded-2xl border border-border bg-surface-raised p-4">
          <div>
            <Label htmlFor="ref">Claim reference</Label>
            <Input id="ref" placeholder="EC-260527-4821" value={ref}
              onChange={(e) => setRef(e.target.value.toUpperCase())}
              className="mt-1.5 h-12 font-mono uppercase tracking-wider" autoComplete="off" />
          </div>
          <button type="submit" className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl gradient-primary text-sm font-semibold text-primary-foreground shadow-[var(--shadow-elegant)]">
            <Search className="h-4 w-4" />
            Look up claim
          </button>
          <p className="text-center text-[11px] text-muted-foreground">
            Try the demo: <button type="button" onClick={() => setRef("EC-260527-4821")} className="font-mono text-primary hover:underline">EC-260527-4821</button>
          </p>
        </form>
      </main>
    </div>
  );
}
