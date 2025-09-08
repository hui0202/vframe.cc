"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Nav() {
  const pathname = usePathname();
  const linkClasses = (path: string) =>
    `relative px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-out hover:scale-105 ${
      pathname === path 
        ? "text-primary-foreground bg-gradient-to-r from-primary-solid to-accent shadow-lg" 
        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
    }`;
  
  return (
    <nav className="flex items-center gap-1 sm:gap-2">
      <Link href="/" className={linkClasses("/")}>
        <span className="hidden sm:inline">Home</span>
        <span className="sm:hidden">🏠</span>
      </Link>
      <Link href="/extract" className={linkClasses("/extract")}>
        <span className="hidden sm:inline">Extract</span>
        <span className="sm:hidden">🎞️</span>
      </Link>
      <Link href="/interpolate" className={linkClasses("/interpolate")}>
        <span className="hidden sm:inline">Interpolate</span>
        <span className="sm:hidden">🚀</span>
      </Link>
    </nav>
  );
}


