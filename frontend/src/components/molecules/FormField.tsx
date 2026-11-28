import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface FormFieldProps {
  label: string;
  /** Isi bila anak berupa input native; tanpa ini label dirender sebagai <p>. */
  htmlFor?: string;
  labelGap?: "sm" | "md";
  children: ReactNode;
}

export function FormField({ label, htmlFor, labelGap = "sm", children }: FormFieldProps) {
  const className = cn(
    "block text-[12px] font-medium text-ink-2",
    labelGap === "sm" ? "mb-1" : "mb-1.5",
  );
  return (
    <div>
      {htmlFor ? (
        <label htmlFor={htmlFor} className={className}>
          {label}
        </label>
      ) : (
        <p className={className}>{label}</p>
      )}
      {children}
    </div>
  );
}
