"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BackButtonProps {
  label?: string;
  className?: string;
}

export function BackButton({ label = "Back", className }: BackButtonProps) {
  const router = useRouter();

  return (
    <Button
      variant="outline"
      onClick={() => router.back()}
      className={cn(
        "rounded-full font-medium transition-all hover:-translate-x-1 active:scale-95 flex items-center gap-2.5 shadow-xl",
        className
      )}
    >
      <ArrowLeft className="stroke-[2.5px]" />
      <span className="tracking-tight">{label}</span>
    </Button>
  );
}
