interface PopoverItemProps {
  title: string;
  description: string;
  onClick?: () => void;
}

/** Baris judul + keterangan di dalam popover; jadi tombol bila `onClick` diisi. */
export function PopoverItem({ title, description, onClick }: PopoverItemProps) {
  const body = (
    <>
      <p className="font-medium text-ink">{title}</p>
      <p className="text-[11.5px] text-ink-3">{description}</p>
    </>
  );
  if (!onClick) return <div className="rounded-sm2 p-2 hover:bg-hover">{body}</div>;
  return (
    <button
      type="button"
      onClick={onClick}
      className="block w-full cursor-pointer rounded-sm2 p-2 text-left hover:bg-hover"
    >
      {body}
    </button>
  );
}
