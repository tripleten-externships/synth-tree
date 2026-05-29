import * as React from "react";
import { cn } from "@/utils";
import { Icon, type IconName } from "./icon";

const HEX_CLIP =
  "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";
const FACET_CLIP = "polygon(50% 0%, 100% 25%, 50% 50%, 0% 25%)";

export type HexStatus = "completed" | "current" | "unlocked" | "locked";
export type HexStyle = "solid" | "outline" | "textured";

export type HexProps = {
  icon: IconName;
  status?: HexStatus;
  size?: number;
  hexStyle?: HexStyle;
  onClick?: () => void;
  className?: string;
  "aria-label"?: string;
};

function HexLayer({
  className,
  clip = HEX_CLIP,
}: {
  className: string;
  clip?: string;
}) {
  return (
    <span aria-hidden className={className} style={{ clipPath: clip }} />
  );
}

function getFillClass(status: HexStatus) {
  if (status === "completed") return "bg-success";
  if (status === "current") return "bg-primary";
  if (status === "unlocked") {
    return "bg-[color-mix(in_hsl,hsl(var(--muted))_82%,hsl(var(--primary))_18%)]";
  }
  return "bg-muted";
}

function getIconColorClass(status: HexStatus, hexStyle: HexStyle) {
  const whiteCenter = hexStyle === "outline" || status === "unlocked";

  if (status === "completed") {
    return whiteCenter ? "text-success" : "text-success-foreground";
  }
  if (status === "current") {
    return whiteCenter ? "text-primary" : "text-primary-foreground";
  }
  if (status === "unlocked") {
    return "text-primary/70";
  }
  return "text-muted-foreground";
}

function getTexturedFillClass(status: HexStatus) {
  if (status === "completed") {
    return "bg-[linear-gradient(135deg,hsl(var(--success))_0%,hsl(var(--success)/0.7)_50%,hsl(var(--success))_100%)]";
  }
  if (status === "current") {
    return "bg-[linear-gradient(135deg,hsl(var(--primary))_0%,hsl(var(--primary)/0.7)_50%,hsl(var(--primary))_100%)]";
  }
  if (status === "unlocked") {
    return "bg-[linear-gradient(135deg,hsl(var(--muted))_0%,hsl(var(--primary)/0.2)_50%,hsl(var(--muted))_100%)]";
  }
  return "bg-[linear-gradient(135deg,hsl(var(--muted))_0%,hsl(var(--muted-foreground)/0.25)_50%,hsl(var(--muted))_100%)]";
}

function getFacetClass(status: HexStatus) {
  if (status === "locked") return "bg-white/10 dark:bg-white/5";
  return "bg-white/20";
}

function Hex({
  icon,
  status = "current",
  size = 64,
  hexStyle = "solid",
  onClick,
  className,
  "aria-label": ariaLabel,
}: HexProps) {
  const label = ariaLabel ?? icon;
  const iconSize = Math.max(12, Math.round(size * 0.5));

  const fillClass = getFillClass(status);
  const iconColor = getIconColorClass(status, hexStyle);

  const showHollow = hexStyle === "outline" || status === "unlocked";
  const showSolidFill = hexStyle === "solid" && status !== "unlocked";
  const showTextured = hexStyle === "textured" && status !== "unlocked";

  const wrapperClass = cn(
    "relative inline-flex shrink-0 items-center justify-center border-0 bg-transparent p-0",
    "transition-transform duration-200",
    onClick &&
      "cursor-pointer hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    className
  );
  const wrapperStyle = {
    width: size,
    height: size,
  };

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!onClick) return;
    if (e.key === "Enter") {
      e.preventDefault();
      onClick();
    }
    if (e.key === " ") {
      e.preventDefault();
    }
  }

  function handleKeyUp(e: React.KeyboardEvent) {
    if (!onClick) return;
    if (e.key === " ") {
      e.preventDefault();
      onClick();
    }
  }

  const content = (
    <>
      {showSolidFill && (
        <HexLayer className={cn("absolute inset-0", fillClass)} />
      )}

      {showHollow && (
        <>
          <HexLayer className={cn("absolute inset-0", fillClass)} />
          <HexLayer className="absolute inset-[3px] bg-background" />
        </>
      )}

      {showTextured && (
        <>
          <HexLayer
            className={cn("absolute inset-0", getTexturedFillClass(status))}
          />
          <HexLayer
            className={cn(
              "pointer-events-none absolute inset-0",
              getFacetClass(status)
            )}
            clip={FACET_CLIP}
          />
        </>
      )}

      <span
        className={cn(
          "relative z-10 inline-flex items-center justify-center",
          iconColor
        )}
      >
        <Icon name={icon} size={iconSize} />
      </span>
    </>
  );

  if (onClick) {
    return (
      <span
        className={wrapperClass}
        style={wrapperStyle}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        role="button"
        tabIndex={0}
        aria-label={label}
      >
        {content}
      </span>
    );
  }

  return (
    <span
      className={wrapperClass}
      style={wrapperStyle}
      role="img"
      aria-label={label}
    >
      {content}
    </span>
  );
}

export { Hex };
