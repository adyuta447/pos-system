import { cn } from "../../lib/cn";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "outline" | "dark" | "ghost";
  size?: "sm" | "md";
};

export function Button({ variant = "outline", size = "md", className, ...props }: Props) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center gap-2 rounded-ctrl px-3.5 text-[13px] font-medium transition-all duration-150 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50",
        size === "md" ? "h-9" : "h-8",
        variant === "outline" &&
          "border border-line bg-card text-ink shadow-card hover:bg-[#FAFAF8] active:bg-muted",
        variant === "ghost" && "text-ink-2 hover:bg-hover",
        variant === "dark" &&
          "border border-[#111110] bg-gradient-to-b from-[var(--btn-dark-top)] to-[var(--btn-dark-bottom)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] hover:brightness-110 active:translate-y-px",
        className,
      )}
    />
  );
}
