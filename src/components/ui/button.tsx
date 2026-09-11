import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "text-sm font-medium tracking-wide",
    "rounded-[4px] border transition-all duration-[220ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--bronze)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]",
    "disabled:pointer-events-none disabled:opacity-45",
    "[&_svg]:pointer-events-none [&_svg]:size-[14px] [&_svg]:shrink-0",
    "cursor-pointer select-none",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "bg-[var(--bronze-soft)] text-[#111] border-transparent",
          "hover:bg-[var(--bronze)] hover:-translate-y-px",
          "active:scale-[.98] active:translate-y-0",
        ].join(" "),

        outline: [
          "bg-transparent text-[var(--verde-ink)] border-[var(--verde-ink)]",
          "hover:bg-[var(--verde-ink)] hover:text-[var(--text)] hover:-translate-y-px",
          "active:scale-[.98] active:translate-y-0",
        ].join(" "),

        secondary: [
          "bg-white/[.06] text-[var(--text-soft)] border-white/10",
          "hover:bg-white/10 hover:text-[var(--text)] hover:border-white/[.18]",
          "active:scale-[.98]",
        ].join(" "),

        ghost: [
          "bg-transparent text-[var(--text-soft)] border-transparent",
          "hover:bg-white/[.07] hover:text-[var(--text)]",
          "active:scale-[.98]",
        ].join(" "),

        destructive: [
          "bg-red-500/[.12] text-red-400 border-red-500/25",
          "hover:bg-red-500/20 hover:text-red-300",
          "active:scale-[.98]",
        ].join(" "),

        link: [
          "bg-transparent text-[var(--bronze)] border-none rounded-none",
          "border-b border-b-[var(--bronze-faint)] pb-px",
          "hover:border-b-[var(--bronze)] hover:text-[var(--bronze-soft)]",
          "px-0",
        ].join(" "),
      },

      size: {
        default: "h-9 px-5 py-2",
        sm:      "h-8 px-3 py-1.5 text-xs",
        lg:      "h-10 px-7 py-2.5 text-[14px] tracking-[.04em]",
        icon:    "h-9 w-9 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size:    "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }