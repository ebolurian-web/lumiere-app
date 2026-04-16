"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRole, UserRole } from "@/lib/role-context";
import { Shield, ArrowLeft, Mail, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BorderBeam } from "@/components/ui/border-beam";
import { BlurFade } from "@/components/ui/blur-fade";
import { Particles } from "@/components/ui/particles";

const DEMO_ACCOUNTS: {
  role: UserRole;
  label: string;
  email: string;
  password: string;
}[] = [
  { role: "student", label: "Student Demo", email: "maya.rodriguez@lumiere.edu", password: "demo-student-2026" },
  { role: "staff", label: "Staff Demo", email: "sarah.kim@lumiere.edu", password: "demo-staff-2026" },
  { role: "admin", label: "Admin Demo", email: "admin@lumiere.edu", password: "demo-admin-2026" },
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

    // Match demo account
    const match = DEMO_ACCOUNTS.find((a) => a.email === email);
    if (match) {
      setTimeout(() => {
        setRole(match.role);
        router.push(`/${match.role}/dashboard`);
      }, 600);
    } else {
      // Default to student for any email
      setTimeout(() => {
        setRole("student");
        router.push("/student/dashboard");
      }, 600);
    }
  };

  const fillDemo = (account: (typeof DEMO_ACCOUNTS)[number]) => {
    setEmail(account.email);
    setPassword(account.password);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 relative overflow-hidden">
      <Particles className="absolute inset-0" quantity={15} color="#A41034" size={0.3} staticity={90} ease={100} />

      {/* Back link */}
      <div className="absolute top-6 left-6 z-20">
        <Link href="/" className="flex items-center gap-2 text-sm text-foreground/40 hover:text-foreground/60 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
      </div>

      <div className="relative z-10 w-full max-w-[420px]">
        {/* Logo */}
        <BlurFade delay={0.05} duration={0.5}>
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-navy text-white mb-4">
              <Shield className="w-6 h-6" />
            </Link>
            <h1 className="font-display text-2xl font-semibold text-navy dark:text-foreground tracking-tight">
              Sign in to Lumiere
            </h1>
            <p className="text-foreground/35 text-sm mt-1.5">
              Access your student, faculty, or admin portal
            </p>
          </div>
        </BlurFade>

        {/* Card */}
        <BlurFade delay={0.15} duration={0.5}>
          <div className="relative rounded-2xl border border-border/50 bg-card/95 backdrop-blur-sm p-8 overflow-hidden">
            <BorderBeam
              size={180}
              duration={10}
              colorFrom="rgba(164,16,52,0.25)"
              colorTo="rgba(164,16,52,0.02)"
              borderWidth={1.5}
            />

            {/* Google sign-in */}
            <Button
              variant="outline"
              className="w-full h-11 text-sm gap-3 mb-6"
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
                <span className="bg-card px-3 text-foreground/25 uppercase tracking-wider">or</span>
              </div>
            </div>

            {/* Email form */}
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs text-foreground/50">Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/25" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@lumiere.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11 bg-background/50"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs text-foreground/50">Password</Label>
                  <button type="button" className="text-xs text-primary/70 hover:text-primary transition-colors">
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
                    className="pr-10 h-11 bg-background/50"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/25 hover:text-foreground/50 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-primary hover:bg-primary/90 text-white text-sm font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </div>
        </BlurFade>

        {/* Demo quick-fill buttons */}
        <BlurFade delay={0.3} duration={0.5}>
          <div className="mt-6">
            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/30" />
              </div>
              <div className="relative flex justify-center text-[10px]">
                <span className="bg-background px-3 text-foreground/20 uppercase tracking-[0.15em]">Demo accounts</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {DEMO_ACCOUNTS.map(({ role, label, email: demoEmail }) => (
                <button
                  key={role}
                  onClick={() => fillDemo(DEMO_ACCOUNTS.find((a) => a.role === role)!)}
                  className="p-3 rounded-xl border border-border/30 bg-card/50 hover:bg-card hover:border-border/60 transition-all duration-200 cursor-pointer group text-center"
                >
                  <p className="text-xs font-medium text-foreground/60 group-hover:text-foreground transition-colors">{label}</p>
                  <p className="font-mono text-[9px] text-foreground/20 mt-0.5 truncate">{demoEmail}</p>
                </button>
              ))}
            </div>
          </div>
        </BlurFade>
      </div>
    </div>
  );
}
