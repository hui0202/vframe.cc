import * as React from "react";
import { cn } from "@/lib/cn";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, leading, trailing, ...props }, ref) => {
    return (
      <div className={cn("relative", className)}>
        {leading ? (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
            {leading}
          </div>
        ) : null}
        <input
          ref={ref}
          className={cn(
            "flex h-11 w-full rounded-lg border border-input-border bg-input px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary-solid backdrop-filter backdrop-blur-sm disabled:cursor-not-allowed disabled:opacity-50 hover:border-primary-solid/50",
            leading ? "pl-10" : "",
            trailing ? "pr-10" : ""
          )}
          {...props}
        />
        {trailing ? (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground">
            {trailing}
          </div>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";


