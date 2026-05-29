import * as React from "react";
import * as Popover from "@radix-ui/react-popover";

import { Icon } from "../icon";
import { ICON_OPTIONS, type IconId } from "./icon-options";

export type IconSelectorPopoverProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  value?: IconId | null;
  onSelect: (id: IconId) => void;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
};

export function IconSelectorPopover({
  open,
  onOpenChange,
  onSelect,
  children,
  side = "left",
  align = "center",
}: IconSelectorPopoverProps) {
  return (
    <Popover.Root open={open} onOpenChange={onOpenChange}>
      <Popover.Trigger asChild>{children}</Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          side={side}
          align={align}
          sideOffset={-15}
          className="relative z-50 rounded-sm bg-[hsl(0_0%_22%)] shadow-lg border border-white/10 outline-none"
        >
          <div className="grid grid-cols-4 gap-x-5 gap-y-4 m-5">
            {ICON_OPTIONS.map(({ id, label }) => (
              <Popover.Close asChild key={id}>
                <button
                  type="button"
                  aria-label={label}
                  onClick={() => {
                    onSelect(id);
                    onOpenChange?.(false);
                  }}
                  className="relative h-10 w-10 grid place-items-center text-white/90 hover:text-white transition"
                >
                  <Icon name={id} size={28} />
                </button>
              </Popover.Close>
            ))}
          </div>
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
