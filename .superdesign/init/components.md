# Components

## Key Components (full source)

### src/components/ui/card.tsx
```tsx
import * as React from "react"

import { cn } from "@/lib/utils"

function Card({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"div"> & { size?: "default" | "sm" }) {
  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(
        "group/card flex flex-col gap-4 overflow-hidden rounded-xl bg-card py-4 text-sm text-card-foreground border border-border/60 has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:gap-3 data-[size=sm]:py-3 data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-xl px-4 group-data-[size=sm]/card:px-3 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-4 group-data-[size=sm]/card:[.border-b]:pb-3",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "font-heading text-base leading-snug font-medium group-data-[size=sm]/card:text-sm",
        className
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-4 group-data-[size=sm]/card:px-3", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center rounded-b-xl border-t bg-muted/50 p-4 group-data-[size=sm]/card:p-3",
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
```

### src/components/ui/button.tsx
```tsx
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
```

### src/components/ui/badge.tsx
```tsx
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        secondary:
          "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        destructive:
          "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20",
        outline:
          "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
        ghost:
          "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
```

### src/components/ui/browser-mockup.tsx
```tsx
"use client";

import { cn } from "@/lib/utils";

interface BrowserMockupProps {
  url?: string;
  children: React.ReactNode;
  className?: string;
}

export function BrowserMockup({
  url = "app.lumiere.edu",
  children,
  className,
}: BrowserMockupProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border/60 bg-card overflow-hidden shadow-lg dark:shadow-2xl",
        className
      )}
    >
      {/* Chrome */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border/40 bg-muted/30">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#28CA41]" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-background/60 border border-border/30 text-[11px] text-foreground/35 font-mono">
            <svg
              width="10"
              height="10"
              viewBox="0 0 16 16"
              fill="none"
              className="text-success"
            >
              <path
                d="M8 1a5 5 0 0 0-5 5v1H2a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1h-1V6a5 5 0 0 0-5-5z"
                fill="currentColor"
                opacity="0.5"
              />
            </svg>
            {url}
          </div>
        </div>
        <div className="w-14" />
      </div>
      {/* Content */}
      <div className="bg-background">{children}</div>
    </div>
  );
}
```

### src/components/ui/scroll-reveal.tsx
```tsx
"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { cn } from "@/lib/utils";

type Direction = "up" | "down" | "left" | "right" | "scale";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: Direction;
  delay?: number;
  duration?: number;
  distance?: number;
  once?: boolean;
}

const getInitial = (direction: Direction, distance: number) => {
  switch (direction) {
    case "up":
      return { opacity: 0, y: distance };
    case "down":
      return { opacity: 0, y: -distance };
    case "left":
      return { opacity: 0, x: distance };
    case "right":
      return { opacity: 0, x: -distance };
    case "scale":
      return { opacity: 0, scale: 0.92 };
  }
};

const getAnimate = (direction: Direction) => {
  switch (direction) {
    case "up":
    case "down":
      return { opacity: 1, y: 0 };
    case "left":
    case "right":
      return { opacity: 1, x: 0 };
    case "scale":
      return { opacity: 1, scale: 1 };
  }
};

export function ScrollReveal({
  children,
  className,
  direction = "up",
  delay = 0,
  duration = 0.6,
  distance = 30,
  once = true,
}: ScrollRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={getInitial(direction, distance)}
      animate={isInView ? getAnimate(direction) : getInitial(direction, distance)}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
```

### src/components/dashboard/stat-card.tsx
```tsx
"use client";

import { NumberTicker } from "@/components/ui/number-ticker";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  numericValue?: number;
  decimalPlaces?: number;
  className?: string;
  ring?: { value: number; max: number };
}

function ProgressRing({ value, max }: { value: number; max: number }) {
  const percentage = (value / max) * 100;
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-12 h-12">
      <svg width="48" height="48" className="-rotate-90">
        <circle
          cx="24"
          cy="24"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="text-muted/60"
        />
        <circle
          cx="24"
          cy="24"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="text-gold transition-all duration-1000"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-mono text-[11px] font-medium text-foreground/60">
        {Math.round(percentage)}%
      </span>
    </div>
  );
}

export function StatCard({
  label,
  value,
  numericValue,
  decimalPlaces = 0,
  className,
  ring,
}: StatCardProps) {
  return (
    <div className={cn(
      "rounded-xl border border-border/60 bg-card p-5",
      className
    )}>
      <p className="text-[11px] font-medium uppercase tracking-widest text-foreground/35 mb-3">
        {label}
      </p>
      <div className="flex items-end justify-between">
        {numericValue !== undefined ? (
          <NumberTicker
            value={numericValue}
            decimalPlaces={decimalPlaces}
            delay={0.2}
            className="text-[1.7rem] font-mono font-semibold text-foreground leading-none"
          />
        ) : (
          <span className="text-[1.7rem] font-mono font-semibold text-foreground leading-none">
            {value}
          </span>
        )}
        {ring && <ProgressRing value={ring.value} max={ring.max} />}
      </div>
    </div>
  );
}
```

### src/components/theme-toggle.tsx
```tsx
"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="h-9 w-9 rounded-lg"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
```

## All UI Components

- `src/components/ui/alert.tsx` — alert component
- `src/components/ui/animated-beam.tsx` — animated-beam component
- `src/components/ui/animated-grid-pattern.tsx` — animated-grid-pattern component
- `src/components/ui/animated-shiny-text.tsx` — animated-shiny-text component
- `src/components/ui/avatar.tsx` — avatar component
- `src/components/ui/badge.tsx` — badge component
- `src/components/ui/bento-grid.tsx` — bento-grid component
- `src/components/ui/blur-fade.tsx` — blur-fade component
- `src/components/ui/border-beam.tsx` — border-beam component
- `src/components/ui/breadcrumb.tsx` — breadcrumb component
- `src/components/ui/browser-mockup.tsx` — browser-mockup component
- `src/components/ui/button.tsx` — button component
- `src/components/ui/calendar.tsx` — calendar component
- `src/components/ui/card.tsx` — card component
- `src/components/ui/chart.tsx` — chart component
- `src/components/ui/checkbox.tsx` — checkbox component
- `src/components/ui/collapsible.tsx` — collapsible component
- `src/components/ui/command.tsx` — command component
- `src/components/ui/dialog.tsx` — dialog component
- `src/components/ui/dock.tsx` — dock component
- `src/components/ui/dot-pattern.tsx` — dot-pattern component
- `src/components/ui/dropdown-menu.tsx` — dropdown-menu component
- `src/components/ui/flickering-grid.tsx` — flickering-grid component
- `src/components/ui/gradient-orb.tsx` — gradient-orb component
- `src/components/ui/input-group.tsx` — input-group component
- `src/components/ui/input.tsx` — input component
- `src/components/ui/label.tsx` — label component
- `src/components/ui/marquee.tsx` — marquee component
- `src/components/ui/number-ticker.tsx` — number-ticker component
- `src/components/ui/orbiting-circles.tsx` — orbiting-circles component
- `src/components/ui/particles.tsx` — particles component
- `src/components/ui/popover.tsx` — popover component
- `src/components/ui/progress.tsx` — progress component
- `src/components/ui/scroll-area.tsx` — scroll-area component
- `src/components/ui/scroll-reveal.tsx` — scroll-reveal component
- `src/components/ui/select.tsx` — select component
- `src/components/ui/separator.tsx` — separator component
- `src/components/ui/sheet.tsx` — sheet component
- `src/components/ui/shimmer-button.tsx` — shimmer-button component
- `src/components/ui/sidebar.tsx` — sidebar component
- `src/components/ui/skeleton.tsx` — skeleton component
- `src/components/ui/switch.tsx` — switch component
- `src/components/ui/table.tsx` — table component
- `src/components/ui/tabs.tsx` — tabs component
- `src/components/ui/text-animate.tsx` — text-animate component
- `src/components/ui/textarea.tsx` — textarea component
- `src/components/ui/toggle.tsx` — toggle component
- `src/components/ui/tooltip.tsx` — tooltip component
