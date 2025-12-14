import React from "react";

export interface NextButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export const NextButton: React.FC<NextButtonProps> = ({
  onClick,
  disabled = false,
  children = "Next",
  className,
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-label="Next"
    className={`bg-primary text-white px-4 py-2 rounded-lg font-medium transition hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed ${className || ""}`}
  >
    {children}
  </button>
);
