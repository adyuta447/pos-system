import { PopoverCard } from "@/components/molecules/PopoverCard";
import { ROLE_META, type UserRole } from "@/config/nav";

interface AccountPopoverProps {
  role: UserRole;
  onRoleChange: (role: UserRole) => void;
}

const ROLES = ["superadmin", "owner", "branch_admin"] as const;

export function AccountPopover({ role, onRoleChange }: AccountPopoverProps) {
  const meta = ROLE_META[role];
  return (
    <PopoverCard width="w-[230px]">
      <div className="border-b border-line-subtle px-2 pb-2">
        <p className="text-[13px] font-semibold text-ink">{meta.name}</p>
        <p className="text-[11.5px] text-ink-3">{meta.title}</p>
      </div>
      <div className="mt-1.5 space-y-0.5 text-[12.5px]">
        {ROLES.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => onRoleChange(r)}
            className="flex w-full cursor-pointer items-center justify-between rounded-sm2 px-2 py-1.5 text-left text-ink-2 hover:bg-hover hover:text-ink"
          >
            <span>{ROLE_META[r].title}</span>
            {role === r && <span className="size-1.5 rounded-full bg-ink" />}
          </button>
        ))}
      </div>
    </PopoverCard>
  );
}
