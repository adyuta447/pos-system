import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

import type { Shift } from '@/db/shifts';
import type { User } from '@/db/users';

interface Session {
  user: User | null;
  shift: Shift | null;
  setUser(user: User | null): void;
  setShift(shift: Shift | null): void;
  /** Clears user and shift, e.g. after closing a shift. */
  signOut(): void;
}

const SessionContext = createContext<Session | null>(null);

interface Props {
  children: ReactNode;
}

/** Who is at the register and which shift is open. Lives in memory; the shift itself is in SQLite. */
export default function SessionProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [shift, setShift] = useState<Shift | null>(null);
  const value = useMemo<Session>(
    () => ({
      user,
      shift,
      setUser,
      setShift,
      signOut: () => {
        setUser(null);
        setShift(null);
      },
    }),
    [user, shift],
  );
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): Session {
  const session = useContext(SessionContext);
  if (!session) throw new Error('useSession must be used inside <SessionProvider>');
  return session;
}
