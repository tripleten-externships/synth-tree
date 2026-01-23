import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "@skilltree/ui";
import { useTheme } from "@skilltree/theme";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@skilltree/ui";
import useAuth from "../hooks/useAuth";
import SkillTreeLogo from "../assets/skilltree.svg";
import GenericAvatar from "../assets/avatar-generic.svg";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const them = useTheme();
  return (
    <div className="min-h-screen flex flex-col text-foreground">
      <nav
        className="sticky top-0 z-50 bg-background flex items-center justify-between px-6 h-16 shadow"
        aria-label="Dashboard"
      >
        {/* LEFT: Logo */}
        <div className="flex items-center">
          <img
            src={SkillTreeLogo}
            alt="SkillTree logo"
            className="h-6 w-auto"
          />
        </div>
        {/* RIGHT: Courses link, avatar + admin badge container*/}
        <div className="flex items-center gap-8">
          {/* TODO: Update the "Courses" link when the actual route is implemented */}
          <Link to="/courses" className="font-medium">
            Courses
          </Link>
          <div className="flex items-center gap-1">
            {/* avatar + admin badge container */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user?.displayName || "User"}
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <img
                    src={GenericAvatar}
                    alt="Generic avatar"
                    className="h-8 w-8 bg-transparent "
                  />
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {/* TODO: Add navigation links/actions for Profile and Logout */}
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Logout</DropdownMenuItem>
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
