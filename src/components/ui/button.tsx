import { cn } from "@/lib/utils";
import { forwardRef, cloneElement, isValidElement } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "ghost" | "destructive" | "pill-primary" | "pill-outline";
  size?: "sm" | "md" | "lg" | "icon";
  loading?: boolean;
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, disabled, children, asChild, ...props }, ref) => {
    const classes = cn(
      "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 select-none",
      {
        "bg-primary text-white hover:bg-primary-active rounded-lg": variant === "primary",
        "bg-white text-primary border-[1.5px] border-primary hover:bg-surface-green rounded-lg": variant === "secondary",
        "bg-accent text-white hover:bg-accent-active rounded-lg": variant === "accent",
        "bg-transparent text-primary hover:bg-surface-green rounded-lg": variant === "ghost",
        "bg-error text-white hover:bg-error-hover rounded-lg": variant === "destructive",
        "bg-primary text-white rounded-full hover:bg-primary-active": variant === "pill-primary",
        "bg-transparent text-primary border-[1.5px] border-primary rounded-full hover:bg-surface-green": variant === "pill-outline",
      },
      {
        "text-sm px-3 py-2 h-9": size === "sm",
        "text-base px-6 py-3 h-12": size === "md",
        "text-base px-8 py-4 h-14": size === "lg",
        "w-9 h-9 p-0": size === "icon",
        "text-sm px-4 py-2": variant === "pill-primary" || variant === "pill-outline",
      },
      className
    );

    if (asChild && isValidElement(children)) {
      return cloneElement(children as React.ReactElement<{ className?: string }>, {
        className: cn(classes, (children as React.ReactElement<{ className?: string }>).props.className),
      });
    }

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={classes}
        {...props}
      >
        {loading ? (
          <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
