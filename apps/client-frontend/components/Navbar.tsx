import React, { useState } from "react";
import SkillTreeLogo from "../assets/skilltree.svg";
import Frame from "../assets/frame.svg";
import Navigation from "../src/components/Navigation";

export default function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <header className="border-b bg-white">
      <nav
        className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-4"
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

        {/* CENTER: Navigation (Desktop only) */}
        <div className="hidden md:flex">
          <Navigation />
        </div>

        {/* RIGHT (desktop): Logout btn */}
        <div className="hidden md:flex items-center gap-4">
          <button
            aria-label="Logout"
            className="rounded-md p-2 hover:bg-gray-100"
          >
            <img src={Frame} alt="Logout" className="h-5 w-5" />
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {isMobileOpen && (
        <div className="border-t bg-white md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-3">
            <button
              className="text-left text-sm text-gray-700 hover:text-black"
              aria-label="Menu"
            >
              Menu
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
