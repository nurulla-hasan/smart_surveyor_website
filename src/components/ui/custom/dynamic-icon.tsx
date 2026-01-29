/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { icons } from "lucide-react";

interface DynamicIconProps {
  name: string;
  className?: string;
}

export const DynamicIcon = ({ name, className }: DynamicIconProps) => {
  // Ensure icons object exists
  if (!icons) {
    return <span className={className}>?</span>;
  }

  // Access the icon from the icons object
  const IconComponent = (icons as any)[name];

  if (!IconComponent) {
    // Try to find a fallback icon, or default to a simple span if not found
    const Fallback = (icons as any).CircleHelp || (icons as any).HelpCircle || (() => <span className={className}>?</span>);
    // eslint-disable-next-line react-hooks/static-components
    return <Fallback className={className} />;
  }

  return <IconComponent className={className} />;
};
