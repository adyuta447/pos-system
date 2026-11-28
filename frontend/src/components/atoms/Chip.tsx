import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface ChipProps {
  active: boolean;
  size?: "sm" | "md";
}

/** Tombol pil yang bisa dipilih (preset kategori, filter kategori). */
export function Chip({ active, size = "sm", className, ...props }: ChipProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      aria-pressed={active}
      {...props}
      className={cn(
        "cursor-pointer rounded-full font-medium transition-colors",
        size === "sm" ? "px-2.5 py-1 text-[11.5px]" : "px-3 py-1 text-[12px]",
        active
          ? cn("bg-ink text-white", size === "md" && "shadow-card")
          : cn(
              "border border-line bg-muted/60 text-ink-2 hover:bg-hover",
              size === "md" && "hover:text-ink",
            ),
        className,
      )}
    />
  );
}
