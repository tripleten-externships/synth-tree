import { Button, useColorMode } from "@skilltree/ui";
import React from "react";
import { FaMoon, FaSun } from "react-icons/fa";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const { isDark, toggleColorMode } = useColorMode();

  return (
    <div className="min-h-screen flex flex-col text-foreground">
      {/* Header with color mode toggle */}
      <header className="flex justify-end p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleColorMode}
          aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
          title={`Switch to ${isDark ? "light" : "dark"} mode`}
        >
          {isDark ? <FaSun /> : <FaMoon />}
        </Button>
      </header>

      {/* Main content area */}
      <main className="flex flex-col flex-1 px-4 pb-8">{children}</main>
    </div>
  );
};

export default AuthLayout;
