import { ReactNode } from 'react';
import { AppSidebar } from './AppSidebar';
import { useRole } from '@/contexts/RoleContext';
import { Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

function LiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <span className="font-mono text-xs text-muted-foreground flex items-center gap-1.5">
      <Clock className="h-3 w-3" />
      {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
    </span>
  );
}

export function AppLayout({ children }: { children: ReactNode }) {
  const { role, userName } = useRole();

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-12 border-b border-border flex items-center justify-between px-6 shrink-0">
          <div />
          <div className="flex items-center gap-4">
            <LiveClock />
            <div className="h-4 w-px bg-border" />
            <span className="font-mono text-xs text-foreground">{userName}</span>
          </div>
        </header>
        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
