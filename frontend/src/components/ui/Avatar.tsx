import { cn } from "../../lib/cn";

export function Avatar({
  alt,
  initials = "SP",
  size = 32,
  online,
}: {
  alt: string;
  initials?: string;
  size?: number;
  online?: boolean;
}) {
  return (
    <span
      className="relative inline-block shrink-0"
      style={{ width: size, height: size }}
      aria-label={alt}
    >
      <span className="grid size-full place-items-center rounded-sm2 border border-line bg-ink text-[11px] font-semibold tracking-tight text-white">
        {initials}
      </span>
      {online && (
        <span
          className={cn(
            "absolute -right-0.5 -bottom-0.5 size-2 rounded-full bg-presence ring-2 ring-white",
          )}
        />
      )}
    </span>
  );
}
