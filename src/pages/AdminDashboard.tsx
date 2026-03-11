import { staff } from '@/lib/mock-data';
import { useLocation } from 'react-router-dom';
import { Shield, Clock, Settings } from 'lucide-react';

export default function AdminDashboard() {
  const location = useLocation();
  const path = location.pathname;

  if (path === '/admin/config') return <AdminConfig />;
  if (path === '/admin/logs') return <AdminLogs />;
  return <AdminUsers />;
}

function AdminUsers() {
  return (
    <div className="p-6 overflow-auto">
      <h2 className="font-mono text-lg font-bold tracking-wide mb-6">USER MANAGEMENT</h2>
      <div className="space-y-2">
        {staff.map(s => (
          <div key={s.id} className="flex items-center justify-between p-4 border border-border">
            <div className="flex items-center gap-4">
              <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                <span className="font-mono text-xs font-bold">{s.name.charAt(0)}</span>
              </div>
              <div>
                <div className="font-body text-sm font-medium">{s.name}</div>
                <div className="font-mono text-xs text-muted-foreground">{s.email}</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono text-[10px] tracking-wider px-2 py-0.5 border border-border">
                {s.role.toUpperCase()}
              </span>
              <span className={`font-mono text-[10px] tracking-wider ${s.active ? 'text-status-ready' : 'text-status-issue'}`}>
                {s.active ? 'ACTIVE' : 'DISABLED'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminConfig() {
  const configs = [
    { key: 'TAX_RATE', value: '8%', description: 'Default tax rate for bills' },
    { key: 'CURRENCY', value: 'USD', description: 'System currency' },
    { key: 'ORDER_TIMEOUT', value: '30 min', description: 'Auto-cancel pending orders after' },
    { key: 'MAX_TABLES', value: '12', description: 'Maximum table capacity' },
  ];
  return (
    <div className="p-6 overflow-auto">
      <h2 className="font-mono text-lg font-bold tracking-wide mb-6">SYSTEM CONFIGURATION</h2>
      <div className="space-y-2">
        {configs.map(c => (
          <div key={c.key} className="flex items-center justify-between p-4 border border-border">
            <div>
              <div className="font-mono text-sm font-bold">{c.key}</div>
              <div className="font-body text-xs text-muted-foreground">{c.description}</div>
            </div>
            <span className="font-mono text-sm">{c.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminLogs() {
  const logs = [
    { timestamp: '14:32:05', user: 'Morgan Swift', action: 'Updated menu item: Grilled Salmon price → $22.99', level: 'info' },
    { timestamp: '14:28:12', user: 'Admin Root', action: 'Created promo code: WELCOME10', level: 'info' },
    { timestamp: '14:15:44', user: 'Alex Rivera', action: 'Cancelled order ORD-105', level: 'warning' },
    { timestamp: '13:58:00', user: 'Chef Marco', action: 'Marked ORD-102 as READY', level: 'info' },
    { timestamp: '13:45:22', user: 'Admin Root', action: 'Changed TAX_RATE from 7% to 8%', level: 'warning' },
    { timestamp: '13:30:00', user: 'System', action: 'Daily backup completed', level: 'info' },
  ];
  return (
    <div className="p-6 overflow-auto">
      <h2 className="font-mono text-lg font-bold tracking-wide mb-6">AUDIT LOGS</h2>
      <div className="space-y-1">
        {logs.map((log, i) => (
          <div key={i} className="flex items-start gap-4 p-3 border-b border-border">
            <span className="font-mono text-xs text-muted-foreground shrink-0">{log.timestamp}</span>
            <div className={`h-1.5 w-1.5 rounded-full mt-1.5 shrink-0 ${log.level === 'warning' ? 'bg-status-pending' : 'bg-muted-foreground'}`} />
            <div>
              <span className="font-mono text-xs font-medium">{log.user}</span>
              <span className="font-body text-sm text-muted-foreground ml-2">{log.action}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
