import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDensity } from "@synth-tree/theme";
import { Badge, useColorMode } from "@synth-tree/ui";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@synth-tree/ui";
import useAuth from "../hooks/useAuth";
import SynthTreeLogo from "../assets/synth-tree.svg";
import GenericAvatar from "../assets/avatar-generic.svg";
import {Sun, Moon, LayoutList} from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const { colorMode, toggleColorMode } = useColorMode();
  const { density, setDensity } = useDensity();
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col text-foreground">
      <nav
        className="sticky top-0 z-50 bg-background flex items-center justify-between px-6 h-16 shadow"
        aria-label="Dashboard"
      >
        {/* LEFT: Logo */}
        <div className="flex items-center">
          <img
            src={SynthTreeLogo}
            alt="Synth Tree logo"
            className="h-6 w-auto dark:brightness-0 dark:invert"
          />
        </div>
        {/* RIGHT: Courses link, avatar + admin badge container*/}
        <div className="flex items-center gap-8">
          {/* TODO: Update the "Courses" link when the actual route is implemented */}
          <Link to="/courses" className="font-medium">
            Courses
          </Link>
          {/* Color mode toggle */}
          <button
            className="p-2 rounded-[10px] hover:bg-muted"
            aria-label="Toggle dark mode"
            onClick={toggleColorMode}
          >
            {colorMode === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>
          {/* Density */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 rounded-[10px] hover:bg-muted" aria-label="Toggle density">
                <LayoutList className="h-5 w-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center">
                {(["compact", "regular", "comfy"] as const).map((option) => (
                  <button
                    key={option}
                onClick={() => setDensity(option)}
                className={`px-2 py-1 text-xs rounded-md capitalize ${
                  density === option
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {option}
              </button>
            ))}
          </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex items-center gap-1">
            {/* avatar + admin badge container */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  aria-label="User menu"
                >
                  <img
                    src={user?.photoURL || GenericAvatar}
                    alt={user?.displayName || "User"}
                    className="h-8 w-8 rounded-full dark:brightness-0 dark:invert"
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="p-4 mr-8">
                {/* TODO: Add navigation links/actions for Profile and Logout */}
                 <DropdownMenuItem onClick={() => navigate("/profile")}>
      Profile
    </DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Badge>
              admin
              {/* TODO: Add interactivity or link if required by design */}
            </Badge>
          </div>
        </div>
      </nav>

      {/* Main content area */}
      <main className="flex flex-col flex-1 px-4 pb-8">{children}</main>
    </div>
  );
};

export default DashboardLayout;
