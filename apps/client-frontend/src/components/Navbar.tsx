import { useState } from "react";
import { useColorMode } from "@synth-tree/theme";
import Navigation from "./Navigation";
import useAuth from "../hooks/useAuth";

export default function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { logout } = useAuth();
  const { isDark, toggleColorMode } = useColorMode();

  return (
    <header className="border-b border-border bg-background">
      <nav
        className="relative mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6"
        aria-label="Main navigation"
      >
        {/* LEFT: Logo */}
        <div className="flex items-center">
          <span className="text-lg font-semibold tracking-tight text-foreground">
            Synth<span className="text-primary">Tree</span>
          </span>
        </div>

        {/* CENTER: Desktop navigation */}
        <div className="hidden md:flex">
          <Navigation />
        </div>

        {/* RIGHT: theme toggle + logout + mobile menu button */}
        <div className="flex items-center gap-1">
          {/* Light/dark toggle */}
          <button
            type="button"
            onClick={toggleColorMode}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className="inline-flex rounded-md p-2 text-foreground hover:bg-accent hover:text-accent-foreground"
          >
            {isDark ? (
              // Sun
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
              </svg>
            ) : (
              // Moon
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          {/* Logout (desktop only) */}
          <button
            type="button"
            onClick={logout}
            aria-label="Logout"
            className="hidden md:inline-flex rounded-md p-2 text-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <path d="M16 17l5-5-5-5" />
              <path d="M21 12H9" />
            </svg>
          </button>

          {/* Mobile hamburger (mobile only) */}
          <button
            type="button"
            className="inline-flex flex-col items-center justify-center gap-1 rounded-md p-2 hover:bg-accent md:hidden"
            aria-label="Toggle main menu"
            aria-expanded={isMobileOpen}
            onClick={() => setIsMobileOpen((open) => !open)}
          >
            <span className="sr-only">Toggle navigation</span>
            <span className="block h-0.5 w-5 bg-foreground rounded-full" />
            <span className="block h-0.5 w-5 bg-foreground rounded-full" />
            <span className="block h-0.5 w-5 bg-foreground rounded-full" />
          </button>
        </div>
      </nav>

      {/* MOBILE MENU PANEL */}
      {isMobileOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
            <Navigation />
            <button
              type="button"
              onClick={logout}
              className="mt-2 inline-flex items-center gap-2 rounded-md p-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <path d="M16 17l5-5-5-5" />
                <path d="M21 12H9" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
