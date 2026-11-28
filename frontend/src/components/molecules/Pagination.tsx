import { ChevronLeft, ChevronRight } from "lucide-react";
import { IconButton } from "@/components/atoms/IconButton";
import { cn } from "@/lib/cn";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const SMALL = "!size-7 !rounded-xs2";

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="flex items-center gap-1">
      <IconButton
        className={SMALL}
        aria-label="Halaman sebelumnya"
        disabled={page <= 1}
        onClick={() => onPageChange(Math.max(1, page - 1))}
      >
        <ChevronLeft className="size-3.5" />
      </IconButton>

      {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onPageChange(n)}
          className={cn(
            "grid size-7 cursor-pointer place-items-center rounded-xs2 font-mono text-[12px] transition-colors",
            n === page ? "bg-ink font-semibold text-white" : "border border-line bg-card text-ink-2 hover:bg-hover",
          )}
        >
          {n}
        </button>
      ))}

      <IconButton
        className={SMALL}
        aria-label="Halaman berikutnya"
        disabled={page >= totalPages}
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
      >
        <ChevronRight className="size-3.5" />
      </IconButton>
    </div>
  );
}
