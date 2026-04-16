"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRole, UserRole } from "@/lib/role-context";
import { Shield, ArrowLeft, Mail, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BorderBeam } from "@/components/ui/border-beam";
import { BlurFade } from "@/components/ui/blur-fade";

const DEMO_ACCOUNTS: {
  role: UserRole;
  label: string;
  email: string;
  password: string;
  color: string;
}[] = [
  { role: "student", label: "Student", email: "maya.rodriguez@lumiere.edu", password: "demo-student-2026", color: "border-info/30 hover:border-info/60 hover:bg-info/[0.03]" },
  { role: "staff", label: "Staff", email: "sarah.kim@lumiere.edu", password: "demo-staff-2026", color: "border-success/30 hover:border-success/60 hover:bg-success/[0.03]" },
  { role: "admin", label: "Admin", email: "admin@lumiere.edu", password: "demo-admin-2026", color: "border-primary/30 hover:border-primary/60 hover:bg-primary/[0.03]" },
];

export default function SignInPage() {
  const router = useRouter();
  const { setRole } = useRole();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const match = DEMO_ACCOUNTS.find((a) => a.email === email);
    setTimeout(() => {
      setRole(match?.role || "student");
      router.push(`/${match?.role || "student"}/dashboard`);
    }, 600);
  };

  const fillDemo = (account: (typeof DEMO_ACCOUNTS)[number]) => {
    setEmail(account.email);
    setPassword(account.password);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Panel — Dark brand experience */}
      <div className="hidden lg:flex lg:w-[45%] bg-navy relative items-center justify-center p-12 overflow-hidden">
        {/* Ambient crimson glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 opacity-20" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2 opacity-10" />
        </div>

        <div className="relative z-10 text-center max-w-md">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 mb-8">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="font-display text-5xl font-light text-white tracking-tight mb-4">
            Lumiere
          </h1>
          <p className="text-white/50 text-lg font-light leading-relaxed">
            The Private Academic Operating System.
            <span className="block mt-2 italic text-white/30">
              Precision. Clarity. Institutional Excellence.
            </span>
          </p>
        </div>

        <p className="absolute bottom-8 left-8 text-white/15 text-[10px] font-mono uppercase tracking-widest">
          &copy; 2026 Lumiere Systems
        </p>
      </div>

      {/* Right Panel — Authentication */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 bg-background relative">
        {/* Mobile logo */}
        <div className="lg:hidden absolute top-8 text-center">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-navy text-white mb-2">
            <Shield className="w-5 h-5" />
          </div>
          <p className="font-display font-semibold text-lg">Lumiere</p>
        </div>

        {/* Back link */}
        <div className="absolute top-8 left-8 lg:left-12 z-20">
          <Link href="/" className="flex items-center gap-2 text-sm text-foreground/40 hover:text-foreground/60 transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back
          </Link>
        </div>

        <div className="w-full max-w-[420px]">
          {/* Header */}
          <BlurFade delay={0.05} duration={0.5}>
            <div className="mb-8">
              <h2 className="font-display text-3xl font-semibold text-navy dark:text-foreground tracking-tight mb-2">
                Sign in
              </h2>
              <p className="text-foreground/40 text-sm">
                Access your workspace
              </p>
            </div>
          </BlurFade>

          {/* Card */}
          <BlurFade delay={0.15} duration={0.5}>
            <div className="relative rounded-2xl border border-border/50 bg-card p-8 overflow-hidden">
              <BorderBeam
                size={180}
                duration={10}
                colorFrom="rgba(164,16,52,0.25)"
                colorTo="rgba(164,16,52,0.02)"
                borderWidth={1.5}
              />

              {/* Google */}
              <Button
                variant="outline"
                className="w-full h-12 text-sm gap-3 mb-6 bg-background/50"
                onClick={() => fillDemo(DEMO_ACCOUNTS[0])}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </Button>

              {/* Divider */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/40" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-card px-3 text-foreground/20 uppercase tracking-wider">or</span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSignIn} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs text-foreground/50">Email address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/20" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@lumiere.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-11 h-12 bg-background/50 text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-xs text-foreground/50">Password</Label>
                    <button type="button" className="text-xs text-primary/60 hover:text-primary transition-colors">
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pr-11 h-12 bg-background/50 text-sm"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-foreground/20 hover:text-foreground/40 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-white text-sm font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing in...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Sign in
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </form>
            </div>
          </BlurFade>

          {/* Demo accounts */}
          <BlurFade delay={0.3} duration={0.5}>
            <div className="mt-8">
              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/30" />
                </div>
                <div className="relative flex justify-center text-[10px]">
                  <span className="bg-background px-3 text-foreground/20 uppercase tracking-[0.15em] font-mono">
                    Demo Accounts
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                {DEMO_ACCOUNTS.map(({ role, label, email: demoEmail, color }) => (
                  <button
                    key={role}
                    onClick={() => fillDemo(DEMO_ACCOUNTS.find((a) => a.role === role)!)}
                    className={`p-3.5 rounded-xl border ${color} bg-card/50 transition-all duration-200 cursor-pointer group text-center`}
                  >
                    <p className="text-xs font-semibold text-foreground/60 group-hover:text-foreground transition-colors">
                      {label}
                    </p>
                    <p className="font-mono text-[9px] text-foreground/20 mt-1 truncate">{demoEmail}</p>
                  </button>
                ))}
              </div>
            </div>
          </BlurFade>
        </div>
      </div>
    </div>
  );
}
