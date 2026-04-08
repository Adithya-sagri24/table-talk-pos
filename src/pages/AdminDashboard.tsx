import { staff } from '@/lib/mock-data';
import { StaffMember } from '@/lib/types';
import { useLocation } from 'react-router-dom';
import { Shield, Clock, Settings, Plus, Pencil, Trash2, Search, Filter, CheckCircle, XCircle, Info, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { CrudModal, FormField, inputClass, selectClass } from '@/components/CrudModal';
import { useRMS, AuditLogEntry } from '@/contexts/RMSContext';
import { useRole } from '@/contexts/RoleContext';

export default function AdminDashboard() {
  const location = useLocation();
  const path = location.pathname;

  if (path === '/admin/config') return <AdminConfig />;
  if (path === '/admin/logs') return <AdminLogs />;
  return <AdminUsers />;
}

function AdminUsers() {
  const [users, setUsers] = useState(staff);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<StaffMember | null>(null);
  const [form, setForm] = useState({ name: '', email: '', role: 'waiter', active: true });
  const { addAuditLog } = useRMS();
  const { userName } = useRole();

  const openAdd = () => { setForm({ name: '', email: '', role: 'waiter', active: true }); setAdding(true); };
  const openEdit = (s: StaffMember) => { setForm({ name: s.name, email: s.email, role: s.role, active: s.active }); setEditing(s); };
  const handleSave = () => {
    if (editing) {
      setUsers(prev => prev.map(s => s.id === editing.id ? { ...s, name: form.name, email: form.email, role: form.role as any, active: form.active } : s));
      addAuditLog({ user: userName, role: 'admin', action: 'Updated user', details: `${form.name} (${form.role})`, status: 'success' });
      setEditing(null);
    } else {
      setUsers(prev => [...prev, { id: `s${Date.now()}`, name: form.name, email: form.email, role: form.role as any, active: form.active }]);
      addAuditLog({ user: userName, role: 'admin', action: 'Created user', details: `${form.name} (${form.role})`, status: 'success' });
      setAdding(false);
    }
  };
  const handleDelete = (id: string) => {
    const s = users.find(x => x.id === id);
    setUsers(prev => prev.filter(x => x.id !== id));
    addAuditLog({ user: userName, role: 'admin', action: 'Deleted user', details: s?.name || id, status: 'info' });
  };

  return (
    <div className="p-6 overflow-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">User Management</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage system users and permissions</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors btn-press">
          <Plus className="h-4 w-4" /> Add User
        </button>
      </div>
      <div className="space-y-2">
        {users.map(s => (
          <div key={s.id} className="flex items-center justify-between p-4 rounded-xl bg-card shadow-sm border border-border">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">{s.name.charAt(0)}</span>
              </div>
              <div>
                <p className="text-sm font-medium">{s.name}</p>
                <p className="text-xs text-muted-foreground">{s.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-muted text-muted-foreground capitalize">{s.role}</span>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${s.active ? 'bg-status-ready/15 text-status-ready' : 'bg-status-issue/15 text-status-issue'}`}>
                {s.active ? 'Active' : 'Disabled'}
              </span>
              <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg hover:bg-muted transition-colors"><Pencil className="h-3.5 w-3.5 text-muted-foreground" /></button>
              <button onClick={() => handleDelete(s.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors"><Trash2 className="h-3.5 w-3.5 text-destructive" /></button>
            </div>
          </div>
        ))}
      </div>
      {(adding || editing) && (
        <CrudModal title={editing ? 'Edit User' : 'Add User'} onClose={() => { setEditing(null); setAdding(false); }} onSubmit={handleSave}>
          <FormField label="Name"><input className={inputClass} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} /></FormField>
          <FormField label="Email"><input className={inputClass} value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} /></FormField>
          <FormField label="Role">
            <select className={selectClass} value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}>
              <option value="waiter">Waiter</option>
              <option value="chef">Chef</option>
              <option value="billing">Billing</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </FormField>
          <FormField label="Active">
            <select className={selectClass} value={form.active ? 'yes' : 'no'} onChange={e => setForm(p => ({ ...p, active: e.target.value === 'yes' }))}>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </FormField>
        </CrudModal>
      )}
    </div>
  );
}

function AdminConfig() {
  const [configs, setConfigs] = useState([
    { key: 'TAX_RATE', value: '8%', description: 'Default tax rate for bills' },
    { key: 'CURRENCY', value: 'USD', description: 'System currency' },
    { key: 'ORDER_TIMEOUT', value: '30 min', description: 'Auto-cancel pending orders after' },
    { key: 'MAX_TABLES', value: '12', description: 'Maximum table capacity' },
  ]);
  const [editing, setEditing] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const { addAuditLog } = useRMS();
  const { userName } = useRole();

  const startEdit = (i: number) => { setEditing(i); setEditValue(configs[i].value); };
  const saveEdit = () => {
    if (editing !== null) {
      const oldValue = configs[editing].value;
      setConfigs(prev => prev.map((c, i) => i === editing ? { ...c, value: editValue } : c));
      addAuditLog({ user: userName, role: 'admin', action: 'Changed config', details: `${configs[editing].key}: ${oldValue} → ${editValue}`, status: 'info' });
      setEditing(null);
    }
  };

  return (
    <div className="p-6 overflow-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">System Configuration</h2>
        <p className="text-sm text-muted-foreground mt-1">Manage system-wide settings</p>
      </div>
      <div className="space-y-2">
        {configs.map((c, i) => (
          <div key={c.key} className="flex items-center justify-between p-4 rounded-xl bg-card shadow-sm border border-border">
            <div>
              <p className="font-mono text-sm font-bold">{c.key}</p>
              <p className="text-xs text-muted-foreground">{c.description}</p>
            </div>
            <div className="flex items-center gap-3">
              {editing === i ? (
                <>
                  <input className={`${inputClass} w-24`} value={editValue} onChange={e => setEditValue(e.target.value)} />
                  <button onClick={saveEdit} className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors">Save</button>
                </>
              ) : (
                <>
                  <span className="font-mono text-sm">{c.value}</span>
                  <button onClick={() => startEdit(i)} className="p-1.5 rounded-lg hover:bg-muted transition-colors"><Pencil className="h-3.5 w-3.5 text-muted-foreground" /></button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminLogs() {
  const { auditLogs } = useRMS();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const filteredLogs = auditLogs
    .filter(log => statusFilter === 'all' || log.status === statusFilter)
    .filter(log => roleFilter === 'all' || log.role === roleFilter)
    .filter(log =>
      search === '' ||
      log.user.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase())
    );

  const statusIcon = (status: AuditLogEntry['status']) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-status-ready" />;
      case 'failure': return <XCircle className="h-4 w-4 text-status-issue" />;
      case 'info': return <Info className="h-4 w-4 text-status-served" />;
    }
  };

  const statusBadgeClass = (status: AuditLogEntry['status']) => {
    switch (status) {
      case 'success': return 'bg-status-ready/15 text-status-ready';
      case 'failure': return 'bg-status-issue/15 text-status-issue';
      case 'info': return 'bg-status-served/15 text-status-served';
    }
  };

  const allRoles = Array.from(new Set(auditLogs.map(l => l.role)));

  return (
    <div className="p-6 overflow-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Audit Logs</h2>
        <p className="text-sm text-muted-foreground mt-1">Complete system activity and change history</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-card rounded-xl p-4 shadow-sm border border-border text-center">
          <p className="font-mono text-2xl font-bold text-foreground">{auditLogs.length}</p>
          <p className="text-xs text-muted-foreground">Total Events</p>
        </div>
        <div className="bg-card rounded-xl p-4 shadow-sm border border-border text-center">
          <p className="font-mono text-2xl font-bold text-status-ready">{auditLogs.filter(l => l.status === 'success').length}</p>
          <p className="text-xs text-muted-foreground">Successful</p>
        </div>
        <div className="bg-card rounded-xl p-4 shadow-sm border border-border text-center">
          <p className="font-mono text-2xl font-bold text-status-issue">{auditLogs.filter(l => l.status === 'failure').length}</p>
          <p className="text-xs text-muted-foreground">Failed</p>
        </div>
        <div className="bg-card rounded-xl p-4 shadow-sm border border-border text-center">
          <p className="font-mono text-2xl font-bold text-status-served">{auditLogs.filter(l => l.status === 'info').length}</p>
          <p className="text-xs text-muted-foreground">Info</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search logs..."
            className="pl-9 pr-4 py-2.5 rounded-lg border border-border bg-card text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2.5 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
          <option value="all">All Status</option>
          <option value="success">Success</option>
          <option value="failure">Failure</option>
          <option value="info">Info</option>
        </select>
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
          className="px-3 py-2.5 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
          <option value="all">All Roles</option>
          {allRoles.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      {/* Log Entries */}
      <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
        {filteredLogs.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">No matching log entries</div>
        ) : (
          filteredLogs.map((log) => (
            <div key={log.id} className="flex items-start gap-4 p-4 border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
              <div className="mt-0.5 shrink-0">{statusIcon(log.status)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-foreground">{log.user}</span>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground capitalize">{log.role}</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusBadgeClass(log.status)}`}>{log.status}</span>
                </div>
                <p className="text-sm text-foreground mt-0.5">{log.action}</p>
                <p className="text-xs text-muted-foreground">{log.details}</p>
              </div>
              <span className="font-mono text-xs text-muted-foreground shrink-0 mt-0.5">
                {log.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
