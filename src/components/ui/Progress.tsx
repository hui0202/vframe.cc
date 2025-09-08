import * as React from "react";
import { cn } from "@/lib/cn";

export function Progress({ value = 0, className }: { value?: number; className?: string }) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("h-3 w-full overflow-hidden rounded-full bg-muted/50 backdrop-filter backdrop-blur-sm", className)}>
      <div
        className="h-full bg-gradient-to-r from-primary-solid to-accent transition-[width] duration-500 ease-out rounded-full shadow-sm"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}


