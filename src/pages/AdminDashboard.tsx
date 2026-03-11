import { staff } from '@/lib/mock-data';
import { StaffMember } from '@/lib/types';
import { useLocation } from 'react-router-dom';
import { Shield, Clock, Settings, Plus, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { CrudModal, FormField, inputClass, selectClass } from '@/components/CrudModal';

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

  const openAdd = () => { setForm({ name: '', email: '', role: 'waiter', active: true }); setAdding(true); };
  const openEdit = (s: StaffMember) => { setForm({ name: s.name, email: s.email, role: s.role, active: s.active }); setEditing(s); };
  const handleSave = () => {
    if (editing) {
      setUsers(prev => prev.map(s => s.id === editing.id ? { ...s, name: form.name, email: form.email, role: form.role as any, active: form.active } : s));
      setEditing(null);
    } else {
      setUsers(prev => [...prev, { id: `s${Date.now()}`, name: form.name, email: form.email, role: form.role as any, active: form.active }]);
      setAdding(false);
    }
  };
  const handleDelete = (id: string) => setUsers(prev => prev.filter(s => s.id !== id));

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

  const startEdit = (i: number) => { setEditing(i); setEditValue(configs[i].value); };
  const saveEdit = () => {
    if (editing !== null) {
      setConfigs(prev => prev.map((c, i) => i === editing ? { ...c, value: editValue } : c));
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
  const logs = [
    { timestamp: '14:32:05', user: 'Morgan Swift', action: 'Updated menu item: Grilled Salmon price → $22.99', level: 'info' },
    { timestamp: '14:28:12', user: 'Admin Root', action: 'Created promo code: WELCOME10', level: 'info' },
    { timestamp: '14:15:44', user: 'Alex Rivera', action: 'Cancelled order ORD-105', level: 'warning' },
    { timestamp: '13:58:00', user: 'Chef Marco', action: 'Marked ORD-102 as READY', level: 'info' },
    { timestamp: '13:45:22', user: 'Admin Root', action: 'Changed TAX_RATE from 7% to 8%', level: 'warning' },
    { timestamp: '13:30:00', user: 'System', action: 'Daily backup completed', level: 'info' },
  ];

  return (
    <div className="p-6 overflow-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Audit Logs</h2>
        <p className="text-sm text-muted-foreground mt-1">System activity and change history</p>
      </div>
      <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
        {logs.map((log, i) => (
          <div key={i} className="flex items-start gap-4 p-4 border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
            <span className="font-mono text-xs text-muted-foreground shrink-0 mt-0.5">{log.timestamp}</span>
            <div className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${log.level === 'warning' ? 'bg-status-pending' : 'bg-status-ready'}`} />
            <div>
              <span className="text-sm font-medium">{log.user}</span>
              <span className="text-sm text-muted-foreground ml-2">{log.action}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
