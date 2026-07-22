"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowRight, Check, Cpu, Loader2, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROLE_DEFS, type UserRole } from "@/lib/role-store";
import { supabase, isSupabaseEnabled } from "@/lib/supabase";
import { cn } from "@/lib/utils";

// Demo credentials — match what you create in Supabase Auth dashboard
const DEMO_EMAIL: Record<UserRole, string> = {
  "md":                    "md@btv-demo.com",
  "plant-manager":         "plant@btv-demo.com",
  "production-supervisor": "production@btv-demo.com",
  "machine-operator":      "operator@btv-demo.com",
  "quality-inspector":     "quality@btv-demo.com",
  "finance-manager":       "finance@btv-demo.com",
  "procurement-manager":   "procurement@btv-demo.com",
  "sales-executive":       "sales@btv-demo.com",
};

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"role" | "credentials">("role");
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const roleDef = ROLE_DEFS.find((r) => r.id === selectedRole);

  function handleRoleSelect(r: UserRole) {
    setSelectedRole(r);
    setError(null);
  }

  function handleRoleConfirm() {
    if (!selectedRole) return;
    setEmail(isSupabaseEnabled ? DEMO_EMAIL[selectedRole] : "");
    setPassword("");
    setError(null);
    setStep("credentials");
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedRole) return;
    setLoading(true);
    setError(null);

    if (isSupabaseEnabled && supabase) {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }
      // Role is loaded from user_profiles in RoleProvider after redirect
    } else {
      // Demo mode — any password accepted
      window.localStorage.setItem("ott-user-role-v1", selectedRole);
    }

    router.push("/dashboard");
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-[420px] xl:w-[480px] flex-col justify-between bg-sidebar border-r border-sidebar-border p-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 border border-primary/30">
            <Cpu className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-bold tracking-tight text-foreground">One To Technologies</p>
            <p className="text-[11px] text-muted-foreground">Operational Intelligence Platform</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-[11px] font-semibold tracking-widest uppercase text-primary mb-3">
              Platform capabilities
            </p>
            {[
              "10 manufacturing intelligence modules",
              "Role-based access for 8 user types",
              "Real-time machine status & OEE",
              "PostgreSQL database via Supabase",
              "CRM pipeline for B2B sales",
            ].map((cap) => (
              <div key={cap} className="flex items-start gap-2.5 py-2.5 border-b border-sidebar-border last:border-0">
                <Check className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                <p className="text-sm text-muted-foreground">{cap}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-[11px] text-muted-foreground">Demo build · Coimbatore · Auto Parts Manufacturing</p>
          {isSupabaseEnabled && (
            <p className="text-[11px] text-emerald-500 font-medium">● Connected to Supabase</p>
          )}
          {!isSupabaseEnabled && (
            <p className="text-[11px] text-amber-500 font-medium">● Demo mode — mock data</p>
          )}
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl">
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 border border-primary/30">
              <Cpu className="h-4.5 w-4.5 text-primary" />
            </div>
            <p className="text-sm font-bold text-foreground">One To Technologies</p>
          </div>

          {step === "role" ? (
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground mb-1">
                Who are you?
              </h1>
              <p className="text-sm text-muted-foreground mb-8">
                Select your role to see a personalised dashboard.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 mb-8">
                {ROLE_DEFS.map((r) => {
                  const isSelected = selectedRole === r.id;
                  return (
                    <button
                      key={r.id}
                      onClick={() => handleRoleSelect(r.id)}
                      className={cn(
                        "relative text-left p-4 rounded-xl border-2 transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-primary",
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-border bg-card hover:border-border/80 hover:bg-secondary/50"
                      )}
                    >
                      {isSelected && (
                        <span className="absolute top-2.5 right-2.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary">
                          <Check className="h-2.5 w-2.5 text-primary-foreground" />
                        </span>
                      )}
                      <span className="text-2xl block mb-2">{r.emoji}</span>
                      <p className="text-sm font-semibold text-foreground leading-tight mb-1">
                        {r.label}
                      </p>
                      <p className="text-[11px] text-muted-foreground leading-snug">
                        {r.description}
                      </p>
                    </button>
                  );
                })}
              </div>

              <Button
                onClick={handleRoleConfirm}
                disabled={!selectedRole}
                className="h-11 px-8 gap-2"
              >
                Continue as {roleDef?.label ?? "…"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="max-w-sm">
              <button
                onClick={() => { setStep("role"); setError(null); }}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 mb-6 transition-colors"
              >
                ← Change role
              </button>

              {roleDef && (
                <div
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-6 text-sm font-medium"
                  style={{
                    background: roleDef.bgColor,
                    borderColor: `${roleDef.color}40`,
                    color: roleDef.color,
                  }}
                >
                  <span>{roleDef.emoji}</span>
                  {roleDef.label}
                </div>
              )}

              <h1 className="text-2xl font-bold tracking-tight text-foreground mb-1">
                Welcome back
              </h1>
              <p className="text-sm text-muted-foreground mb-8">
                {isSupabaseEnabled
                  ? "Sign in with your Supabase account credentials."
                  : "Demo mode — any password will sign you in."}
              </p>

              <form onSubmit={handleLogin} className="space-y-4">
                {isSupabaseEnabled && (
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="demo@btv-demo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-11 pl-9"
                        autoFocus
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11 pl-9"
                      autoFocus={!isSupabaseEnabled}
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 dark:bg-rose-950/20 dark:border-rose-800 px-3 py-2.5 text-sm text-rose-700 dark:text-rose-400">
                    <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                    {error}
                  </div>
                )}

                <Button type="submit" className="w-full h-11 gap-2 mt-2" disabled={loading}>
                  {loading ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Signing in…</>
                  ) : (
                    <>Sign in <ArrowRight className="h-4 w-4" /></>
                  )}
                </Button>
              </form>

              {isSupabaseEnabled ? (
                <div className="mt-6 rounded-lg border border-border bg-secondary/40 p-3">
                  <p className="text-[11px] font-semibold text-muted-foreground mb-1.5">Demo credentials</p>
                  <p className="text-[11px] text-muted-foreground font-mono">
                    {selectedRole && DEMO_EMAIL[selectedRole]}
                  </p>
                  <p className="text-[11px] text-muted-foreground font-mono">Password: Demo@2025</p>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground mt-6">
                  Demo mode · any password accepted · no Supabase configured
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
