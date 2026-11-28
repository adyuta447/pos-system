"use client";

import type { InputHTMLAttributes } from "react";
import { useRupiahInput } from "@/hooks/useRupiahInput";
import { cn } from "@/lib/cn";
import { INPUT_CLASS } from "./TextInput";

interface RupiahInputProps {
  value: string;
  onChange: (digits: string) => void;
}

/**
 * Input nominal Rupiah: tampil "50.000", nilai ke parent tetap digit polos "50000"
 * sehingga `Number(value)` di form tetap benar.
 */
export function RupiahInput({ value, onChange, className, ...rest
}: RupiahInputProps & Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "type">) {
  const { ref, displayValue, handleChange } = useRupiahInput({ value, onChange });
  return (
    <input
      {...rest}
      ref={ref}
      type="text"
      inputMode="numeric"
      autoComplete="off"
      value={displayValue}
      onChange={handleChange}
      className={cn(INPUT_CLASS, "font-mono", className)}
    />
  );
}
