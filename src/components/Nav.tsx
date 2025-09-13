"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

export function Nav() {
  const pathname = usePathname();
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  
  const linkClasses = (path: string) =>
    `relative px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-out hover:scale-105 ${
      pathname === path 
        ? "text-primary-foreground bg-gradient-to-r from-primary-solid to-accent shadow-lg" 
        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
    }`;
  
  const isResourcesActive = ['/tutorials', '/use-cases', '/features', '/faq'].some(path => 
    pathname?.startsWith(path)
  );

  // Set mounted state for portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Update dropdown position when it opens
  useEffect(() => {
    if (resourcesOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const isMobile = window.innerWidth < 640;
      
      setDropdownPosition({
        top: rect.bottom + 8,
        left: isMobile ? Math.min(rect.left, window.innerWidth - 200) : rect.left
      });
    }
  }, [resourcesOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current && 
        !buttonRef.current.contains(event.target as Node) &&
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setResourcesOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setResourcesOpen(false);
      }
    };

    if (resourcesOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [resourcesOpen]);
  
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
      
      {/* Resources Dropdown */}
      <div className="relative">
        <button
          ref={buttonRef}
          onClick={() => setResourcesOpen(!resourcesOpen)}
          className={`relative px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-out hover:scale-105 flex items-center gap-1 ${
            isResourcesActive
              ? "text-primary-foreground bg-gradient-to-r from-primary-solid to-accent shadow-lg"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          <span className="hidden sm:inline">Resources</span>
          <span className="sm:hidden">📚</span>
          <svg
            className={`w-3 h-3 transition-transform ${resourcesOpen ? 'rotate-180' : ''}`}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        
        {/* Portal for dropdown menu */}
        {mounted && resourcesOpen && createPortal(
          <div 
            ref={dropdownRef}
            className="fixed w-48 bg-background border border-border rounded-lg shadow-xl py-2 z-[9999] animate-in fade-in slide-in-from-top-1"
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
            }}
          >
            <Link 
              href="/tutorials" 
              className="block px-4 py-2 text-sm hover:bg-muted/50 transition-colors"
              onClick={() => setResourcesOpen(false)}
            >
              <span className="flex items-center gap-2">
                <span>📚</span> Tutorials
              </span>
            </Link>
            <Link 
              href="/use-cases" 
              className="block px-4 py-2 text-sm hover:bg-muted/50 transition-colors"
              onClick={() => setResourcesOpen(false)}
            >
              <span className="flex items-center gap-2">
                <span>🎯</span> Use Cases
              </span>
            </Link>
            <Link 
              href="/features" 
              className="block px-4 py-2 text-sm hover:bg-muted/50 transition-colors"
              onClick={() => setResourcesOpen(false)}
            >
              <span className="flex items-center gap-2">
                <span>✨</span> Features
              </span>
            </Link>
            <Link 
              href="/faq" 
              className="block px-4 py-2 text-sm hover:bg-muted/50 transition-colors"
              onClick={() => setResourcesOpen(false)}
            >
              <span className="flex items-center gap-2">
                <span>❓</span> FAQ
              </span>
            </Link>
          </div>,
          document.body
        )}
      </div>
    </nav>
  );
}


