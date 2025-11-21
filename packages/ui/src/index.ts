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
export { Label } from "./components/ui/label"; // Form labeling (Radix)
export { Textarea } from "./components/ui/textarea/textarea"; // Resizable modal textarea
export { Checkbox, checkboxVariants } from "./components/ui/checkbox/checkbox"; // Binary select (Radix)
export { Switch, switchVariants } from "./components/ui/switch/switch"; // Toggle (Radix)

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
