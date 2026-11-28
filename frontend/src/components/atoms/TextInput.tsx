import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export const INPUT_CLASS =
  "h-9 w-full rounded-ctrl border border-line bg-card px-3 text-[13px] text-ink outline-none hover:border-line-strong focus:border-ink focus:ring-[3px] focus:ring-ink/[0.08]";

interface TextInputProps {
  mono?: boolean;
}

export function TextInput({ mono, className, ...props }: TextInputProps & InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(INPUT_CLASS, mono && "font-mono", className)} />;
}
