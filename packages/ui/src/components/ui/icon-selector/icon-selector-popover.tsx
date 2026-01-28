import * as React from "react";
import * as Popover from "@radix-ui/react-popover";

import { ICON_OPTIONS, type IconId } from "./icon-options";

// props type
export type IconSelectorPopoverProps = {
  // Optional controlled open state (Radix controlled pattern)
  open?: boolean;
  onOpenChange?: (open: boolean) => void;

  // Currently selected icon id (can be null for "none selected")
  value?: IconId | null;

  // return selected icon identifier to parent - fires immediately when the user clicks an icon
  onSelect: (id: IconId) => void;

  // trigger element hex button
  children: React.ReactNode;

  // side = which side of the trigger popover appears on
  // align = alignment of popover content along chosen side
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
};

// component function
export function IconSelectorPopover(props: IconSelectorPopoverProps) {
  const {
    open,
    onOpenChange,
    onSelect,
    children,
    side = "left",
    align = "center",
  } = props;

  return (
    <Popover.Root open={open} onOpenChange={onOpenChange}>
      {/* trigger - what popover will position itself against */}
      <Popover.Trigger asChild>{children}</Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          side={side}
          align={align}
          sideOffset={-15}
          className={[
            "relative",
            "z-50",
            "rounded-sm",
            "bg-[hsl(0_0%_22%)]",
            "shadow-lg",
            "border border-white/10",
            "outline-none",
          ].join(" ")}
        >
          {/* grid of 8 hex icons */}
          <div className="grid grid-cols-4 gap-x-5 gap-y-4 m-5">
            {ICON_OPTIONS.map(({ id, label, Icon }) => {
              return (
                <Popover.Close asChild key={id}>
                  <button
                    type="button"
                    aria-label={label}
                    onClick={() => {
                      // return id immediately
                      onSelect(id);
                      // and then close popover
                      onOpenChange?.(false);
                    }}
                    className={[
                      "relative h-10 w-10",
                      "grid place-items-center",
                      "text-white/90 hover:text-white",
                      "transition",
                    ].join(" ")}
                  >
                    {/* icon */}
                    <Icon className="h-10 w-10 inset-0 m-auto" />
                  </button>
                </Popover.Close>
              );
            })}
          </div>

          {/* arrow pointing to trigger */}
          <Popover.Arrow
            className="fill-[hsl(0_0%_22%)] absolute -left-3"
            width={25}
            height={10}
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
