"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Gem, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push("/dashboard");
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-2 mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 border border-primary/30">
            <Gem className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-center">
            One To Technologies
          </h1>
          <p className="text-sm text-muted-foreground">Platform</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-lg shadow-black/20">
          <h2 className="text-base font-semibold mb-1">Welcome back</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Sign in to access your dashboard
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10 pl-8"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10 pl-8"
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-10 mt-2">
              Log in
            </Button>
          </form>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-5">
          Demo build &middot; any credentials will sign you in
        </p>
      </div>
    </div>
  );
}
