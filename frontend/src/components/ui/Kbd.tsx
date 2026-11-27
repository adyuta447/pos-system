export function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="grid size-5 place-items-center rounded-[5px] border border-line bg-card font-sans text-[11px] font-medium text-ink-3">
      {children}
    </kbd>
  );
}
