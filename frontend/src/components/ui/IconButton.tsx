import { cn } from "../../lib/cn";

export function IconButton({
  className,
  round,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { round?: boolean }) {
  return (
    <button
      {...props}
      className={cn(
        "grid cursor-pointer place-items-center border border-line bg-card text-ink-2 shadow-card transition-all duration-150 hover:bg-hover active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-40",
        round ? "size-6 rounded-full bg-muted/60" : "size-8 rounded-sm2",
        className,
      )}
    />
  );
}
