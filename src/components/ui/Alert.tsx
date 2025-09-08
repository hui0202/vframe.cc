import * as React from "react";
import { cn } from "@/lib/cn";

export function Alert({ variant = "info", title, children, className }: {
  variant?: "info" | "success" | "warning" | "destructive";
  title?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const variantClasses: Record<string, string> = {
    info: "bg-accent/20 text-accent-foreground border border-accent/30 backdrop-filter backdrop-blur-sm",
    success: "bg-success/20 text-success-foreground border border-success/30 backdrop-filter backdrop-blur-sm",
    warning: "bg-warning/20 text-warning-foreground border border-warning/30 backdrop-filter backdrop-blur-sm",
    destructive: "bg-error/20 text-error-foreground border border-error/30 backdrop-filter backdrop-blur-sm",
  };
  return (
    <div className={cn("rounded-lg px-5 py-4 text-sm shadow-md", variantClasses[variant], className)}>
      {title ? <div className="font-medium mb-1">{title}</div> : null}
      {children}
    </div>
  );
}


