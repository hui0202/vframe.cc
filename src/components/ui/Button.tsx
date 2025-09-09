"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "success" | "error";
  size?: "sm" | "md" | "lg";
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const variants: Record<string, string> = {
      primary:
        "gradient-primary text-primary-foreground hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring shadow-lg transition-all duration-200 ease-out",
      secondary:
        "bg-muted text-foreground hover:bg-muted/80 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all duration-200 ease-out",
      outline:
        "border border-border bg-transparent text-foreground hover:bg-muted/60 hover:scale-105 backdrop-filter backdrop-blur-sm transition-all duration-200 ease-out",
      ghost: 
        "bg-transparent hover:bg-muted/60 text-foreground hover:scale-105 transition-all duration-200 ease-out",
      success:
        "bg-success text-success-foreground hover:opacity-90 hover:scale-105 shadow-lg transition-all duration-200 ease-out",
      error:
        "bg-error text-error-foreground hover:opacity-90 hover:scale-105 shadow-lg transition-all duration-200 ease-out",
    };

    const sizes: Record<string, string> = {
      sm: "min-h-[38px] px-4 text-[15px] font-medium",
      md: "min-h-[44px] px-5 text-[17px] font-medium",
      lg: "min-h-[50px] px-6 text-[17px] font-semibold",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 active:scale-95 cursor-pointer",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";


