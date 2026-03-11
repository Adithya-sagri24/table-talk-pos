import { createContext, useContext, useState, ReactNode } from 'react';
import { UserRole } from '@/lib/types';

interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  userName: string;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>('manager');

  const nameMap: Record<UserRole, string> = {
    waiter: 'Alex Rivera',
    chef: 'Chef Marco',
    billing: 'Pat Kumar',
    manager: 'Morgan Swift',
    admin: 'Admin Root',
    customer: 'Guest',
  };

  return (
    <RoleContext.Provider value={{ role, setRole, userName: nameMap[role] }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) throw new Error('useRole must be used within RoleProvider');
  return context;
}
