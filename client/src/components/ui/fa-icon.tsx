import { cn } from "@/lib/utils";

interface FAIconProps {
  icon: string;
  className?: string;
}

// This component is a wrapper around Font Awesome icons
// We use CDN to load Font Awesome in index.html
export function FAIcon({ icon, className }: FAIconProps) {
  return (
    <i className={cn(`fas fa-${icon}`, className)} />
  );
}
