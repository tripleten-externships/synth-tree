import React, { useState } from "react"; 
import SkillTreeLogo from "../assets/skilltree.svg"; 
import Frame from "../assets/frame.svg"; 
import Navigation from "../src/components/Navigation";

export default function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <header className="border-b bg-white">
      <nav
        className="relative mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6"
        aria-label="Main navigation"
      >
        {/* LEFT: Logo */}
        <div className="flex items-center">
          <img
            src={SkillTreeLogo}
            alt="SkillTree logo"
            className="h-6 w-auto"
          />
        </div>

        {/* CENTER: Desktop navigation */}
        <div className="hidden md:flex">
          <Navigation />
        </div>

        {/* RIGHT: Logout + mobile menu button */}
        <div className="flex items-center gap-2">
          {/* Logout icon (desktop only) */}
          <button
            aria-label="Logout"
            className="hidden md:inline-flex rounded-md p-2 hover:bg-gray-100"
          >
            <img src={Frame} alt="Logout" className="h-5 w-5" />
          </button>

          {/* Mobile hamburger (mobile only) */}
          <button
            type="button"
            className="inline-flex flex-col items-center justify-center gap-1 rounded-md p-2 hover:bg-gray-100 md:hidden"
            aria-label="Toggle main menu"
            aria-expanded={isMobileOpen}
            onClick={() => setIsMobileOpen((open) => !open)}
          >
            <span className="sr-only">Toggle navigation</span>
            <span className="block h-0.5 w-5 bg-gray-900 rounded-full" />
            <span className="block h-0.5 w-5 bg-gray-900 rounded-full" />
            <span className="block h-0.5 w-5 bg-gray-900 rounded-full" />
          </button>
        </div>
      </nav>

      {/* MOBILE MENU PANEL */}
      {isMobileOpen && (
        <div className="border-t bg-white md:hidden">
          <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
            <Navigation />
          </div>
        </div>
      )}
    </header>
  );
}
