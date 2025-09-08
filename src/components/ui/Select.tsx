"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export type Option = { label: string; value: string };

export type SelectProps = {
  value?: string;
  onChange?: (value: string) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
  id?: string;
  name?: string;
};

export function Select({ value, onChange, options, placeholder, className, id, name }: SelectProps) {
  return (
    <select
      id={id}
      name={name}
      className={cn(
        "h-11 w-full rounded-lg border border-input-border bg-input px-4 py-3 text-sm text-foreground transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary-solid backdrop-filter backdrop-blur-sm hover:border-primary-solid/50 cursor-pointer",
        className
      )}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
    >
      {placeholder ? (
        <option value="" disabled hidden>
          {placeholder}
        </option>
      ) : null}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}


