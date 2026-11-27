import { cn } from "../../lib/cn";

export function SparkBars({
  values,
  highlight = [],
}: {
  values: number[];
  highlight?: number[];
}) {
  return (
    <div className="flex h-10 items-center gap-[5px]" aria-hidden>
      {values.map((v, i) => (
        <span
          key={i}
          style={{ height: `${v * 100}%` }}
          className={cn(
            "w-0.5 rounded-full",
            highlight.includes(i) ? "bg-chart-ink" : "bg-chart-spark",
          )}
        />
      ))}
    </div>
  );
}
