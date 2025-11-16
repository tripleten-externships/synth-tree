// Export all components
export { Button, buttonVariants } from "./components/ui/button";
export { Input } from "./components/ui/input";
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "./components/ui/card";
export { Badge, badgeVariants } from "./components/ui/badge";
export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "./components/ui/dialog";
export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from "./components/ui/select";
export { Toaster, toast } from "./components/ui/sonner";

// Form components - ST-34
export { Label } from "./components/ui/label";
export { Textarea, textareaVariants } from "./components/ui/textarea";
export { Checkbox, checkboxVariants } from "./components/ui/checkbox";
export { Switch, switchVariants } from "./components/ui/switch";
export { CustomizableTextarea } from "./components/ui/customizable-textarea";
export { EditableTextarea } from "./components/ui/editable-textarea";
export { TextareaCustomizationModal } from "./components/ui/textarea-customization-modal";

// UI customization hooks
export { useUICustomization, useUISettings } from "./hooks/useUICustomization";

// Export utilities
export { cn, cnUI } from "./utils";

// Re-export theme utilities for convenience
export {
  useTheme,
  useColorMode,
  ThemeProvider,
  type Theme,
  type ColorMode,
} from "@skilltree/theme";
