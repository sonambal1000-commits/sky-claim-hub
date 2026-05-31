import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { EagleLogo } from "@/components/eagle-logo";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/staff/login")({
  head: () => ({ meta: [{ title: "Staff sign in · Eagle Claims" }] }),
  component: StaffLogin,
});

function StaffLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@eagle.com");
  const [pw, setPw] = useState("password");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    if (email && pw) {
      if (typeof window !== "undefined") sessionStorage.setItem("eagle.staff", "1");
      toast.success("Welcome back");
      navigate({ to: "/staff/dashboard" });
    } else {
      toast.error("Invalid credentials");
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-3xl border border-border bg-surface-raised p-8 shadow-[var(--shadow-soft)]"
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <EagleLogo />
          <h1 className="mt-2 font-display text-xl font-semibold tracking-tight">Staff sign in</h1>
          <p className="text-xs text-muted-foreground">Use admin@eagle.com / password</p>
        </div>

        <form onSubmit={submit} className="mt-6 space-y-3">
          <div>
            <Label htmlFor="em">Email</Label>
            <div className="relative mt-1.5">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="em" type="email" value={email}
                onChange={(e) => setEmail(e.target.value)} className="h-12 pl-9" />
            </div>
          </div>
          <div>
            <Label htmlFor="pw">Password</Label>
            <div className="relative mt-1.5">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="pw" type="password" value={pw}
                onChange={(e) => setPw(e.target.value)} className="h-12 pl-9" />
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl gradient-primary text-sm font-semibold text-primary-foreground shadow-[var(--shadow-elegant)] disabled:opacity-60">
            {loading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
            ) : "Sign in"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
