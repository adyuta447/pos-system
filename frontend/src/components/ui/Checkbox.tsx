import { cn } from "../../lib/cn";

export function Checkbox({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type="checkbox"
      {...props}
      className={cn(
        "size-3.5 cursor-pointer appearance-none rounded-[4px] border border-line-strong bg-card transition-colors checked:border-ink checked:bg-ink",
        "checked:bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 16 16%22><path d=%22M4 8.5l2.5 2.5L12 5.5%22 fill=%22none%22 stroke=%22white%22 stroke-width=%222%22/></svg>')]",
        className,
      )}
    />
  );
}
