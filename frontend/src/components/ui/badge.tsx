import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Slot } from "radix-ui"

const badgeVariants = cva(
  "group/badge inline-flex w-fit shrink-0 items-center justify-center gap-1.5 overflow-hidden border px-2 py-0.5 font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        secondary:
          "border-slate-200/80 bg-slate-100 text-slate-800 dark:border-slate-700/80 dark:bg-slate-800 dark:text-slate-200",
        outline:
          "border-border bg-background/80 text-foreground hover:bg-muted/50",
        ghost:
          "border-transparent hover:bg-muted hover:text-foreground",
        destructive:
          "border-rose-200/80 bg-rose-50 text-rose-800 dark:border-rose-800/80 dark:bg-rose-950/60 dark:text-rose-200",
        success:
          "border-emerald-200/80 bg-emerald-50 text-emerald-800 dark:border-emerald-800/80 dark:bg-emerald-950/60 dark:text-emerald-200",
        warning:
          "border-amber-200/80 bg-amber-50 text-amber-900 dark:border-amber-800/80 dark:bg-amber-950/60 dark:text-amber-200",
        info:
          "border-teal-200/80 bg-teal-50 text-[#0D6276] dark:border-teal-800/80 dark:bg-teal-950/60 dark:text-teal-200",
        purple:
          "border-purple-200/80 bg-purple-50 text-purple-900 dark:border-purple-800/80 dark:bg-purple-950/60 dark:text-purple-200",
        blue:
          "border-blue-200/80 bg-blue-50 text-blue-900 dark:border-blue-800/80 dark:bg-blue-950/60 dark:text-blue-200",
        link: "text-primary underline-offset-4 hover:underline border-transparent",
      },
      shape: {
        rounded: "rounded-md",
        pill: "rounded-full",
      },
      size: {
        default: "h-5 px-2 text-[11px]",
        sm: "h-4 px-1.5 text-[10px]",
        lg: "h-6 px-2.5 text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      shape: "rounded",
      size: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  shape = "rounded",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      data-shape={shape}
      data-size={size}
      className={cn(badgeVariants({ variant, shape, size }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
