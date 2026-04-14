import { useState } from 'react';
import { dailyMetrics, orders, revenueData, popularDishes, inventory, tables, menuItems, staff, promotions } from '@/lib/mock-data';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { useLocation } from 'react-router-dom';
import { MetricCard } from '@/components/MetricCard';
import { StatusBadge } from '@/components/StatusBadge';
import { CrudModal, FormField, inputClass, selectClass } from '@/components/CrudModal';
import { Order, MenuItem, InventoryItem, StaffMember, OrderStatus } from '@/lib/types';
import {
  Clock, ClipboardList, Grid3X3, TrendingUp, AlertTriangle, Package,
  Users, DollarSign, ShoppingBag, Plus, Pencil, Trash2, Search, Eye,
  UtensilsCrossed, Tag, BarChart3,
} from 'lucide-react';

export default function ManagerDashboard() {
  const location = useLocation();
  const path = location.pathname;

  if (path === '/manager/orders') return <ManagerOrders />;
  if (path === '/manager/menu') return <ManagerMenu />;
  if (path === '/manager/tables') return <ManagerTables />;
  if (path === '/manager/inventory') return <ManagerInventory />;
  if (path === '/manager/staff') return <ManagerStaff />;
  if (path === '/manager/analytics') return <ManagerAnalytics />;
  if (path === '/manager/promos') return <ManagerPromos />;
  if (path === '/manager/feedback') return <ManagerFeedback />;

  return <ManagerOverview />;
}

// ─── OVERVIEW ──────────────────────────────────────────────
function ManagerOverview() {
  const m = dailyMetrics;
  const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'short' });

  return (
    <div className="p-6 overflow-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Dashboard Overview</h2>
          <p className="text-sm text-muted-foreground mt-1">Welcome back! Here's what's happening today.</p>
        </div>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Pending Orders" value={m.pendingOrders} icon={Clock} trend="+12% from yesterday" trendUp iconBg="bg-status-pending/10" iconColor="text-status-pending" />
        <MetricCard label="In Progress" value={m.inProgressOrders} icon={ClipboardList} trend="+5% from yesterday" trendUp iconBg="bg-status-preparing/10" iconColor="text-status-preparing" />
        <MetricCard label="Available Tables" value={`${m.availableTables}/${m.totalTables}`} icon={Grid3X3} iconBg="bg-status-served/10" iconColor="text-status-served" />
        <MetricCard label="Total Revenue" value={`$${m.totalRevenue.toLocaleString()}`} icon={DollarSign} trend="+18% from last week" trendUp iconBg="bg-status-ready/10" iconColor="text-status-ready" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-card rounded-xl p-6 shadow-sm border border-border">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-lg font-semibold text-foreground">Total Revenue</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Sales Overview</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={revenueData} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 90%)" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: 'hsl(220 10% 50%)', fontSize: 12, fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'hsl(220 10% 50%)', fontSize: 12, fontFamily: 'Roboto Mono' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: 'white', border: '1px solid hsl(220 13% 90%)', borderRadius: '8px', fontFamily: 'Inter', fontSize: 13 }}
                labelStyle={{ color: 'hsl(220 20% 15%)', fontWeight: 600 }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
              />
              <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                {revenueData.map((entry) => (
                  <Cell key={entry.day} fill={entry.day === currentDay ? 'hsl(14 100% 62%)' : 'hsl(220 14% 88%)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Business Panel */}
        <div className="space-y-4">
          <div className="bg-card rounded-xl p-5 shadow-sm border border-border card-hover">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-xl bg-status-served/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-status-served" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Customers</p>
                <p className="font-mono text-xl font-bold text-foreground">{m.totalCustomers}</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl p-5 shadow-sm border border-border card-hover">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <ShoppingBag className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="font-mono text-xl font-bold text-foreground">{m.ordersCompleted}</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl p-5 shadow-sm border border-border card-hover">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-xl bg-status-ready/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-status-ready" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Order Value</p>
                <p className="font-mono text-xl font-bold text-foreground">${m.avgOrderValue.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {orders.slice(0, 5).map(order => (
              <div key={order.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-lg">
                    {order.items[0]?.menuItem.image || '🍽️'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {order.id} — Table {order.tableNumber}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {order.waiterName} • {Math.floor((Date.now() - order.createdAt.getTime()) / 60000)}m ago
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={order.status} />
                  <span className="font-mono text-sm font-semibold">${order.total.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Dishes */}
        <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Top Dishes</h3>
          <div className="space-y-3">
            {popularDishes.map((dish, i) => {
              const maxOrders = popularDishes[0].orders;
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-lg">
                    {dish.image}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">{dish.name}</span>
                      <span className="font-mono text-xs text-muted-foreground">{dish.orders} orders</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(dish.orders / maxOrders) * 100}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Low Stock Alert */}
      {inventory.filter(i => i.isLow).length > 0 && (
        <div className="bg-status-pending/5 border border-status-pending/30 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-status-pending flex items-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4" />
            Low Stock Alerts
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {inventory.filter(i => i.isLow).map(item => (
              <div key={item.id} className="bg-card rounded-lg p-3 border border-border">
                <p className="text-sm font-medium">{item.name}</p>
                <p className="font-mono text-xs text-status-pending">{item.quantity} {item.unit} (min: {item.lowThreshold})</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── ORDERS ────────────────────────────────────────────────
function ManagerOrders() {
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [orderList, setOrderList] = useState(orders);
  const [viewOrder, setViewOrder] = useState<Order | null>(null);

  const filtered = orderList
    .filter(o => filter === 'all' || o.status === filter)
    .filter(o => o.id.toLowerCase().includes(search.toLowerCase()) || o.waiterName.toLowerCase().includes(search.toLowerCase()));

  const statusCounts = {
    all: orderList.length,
    pending: orderList.filter(o => o.status === 'pending').length,
    preparing: orderList.filter(o => o.status === 'preparing').length,
    ready: orderList.filter(o => o.status === 'ready').length,
    served: orderList.filter(o => o.status === 'served').length,
    cancelled: orderList.filter(o => o.status === 'cancelled').length,
  };

  return (
    <div className="p-6 overflow-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Orders</h2>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
        {Object.entries(statusCounts).map(([key, count]) => (
          <div key={key} className={`bg-card rounded-xl p-4 shadow-sm border border-border text-center cursor-pointer transition-all ${filter === key ? 'ring-2 ring-primary' : ''}`} onClick={() => setFilter(key)}>
            <p className="font-mono text-2xl font-bold text-foreground">{count}</p>
            <p className="text-xs text-muted-foreground capitalize">{key}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search orders..."
          className="pl-9 pr-4 py-2.5 rounded-lg border border-border bg-card text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'pending', 'preparing', 'ready', 'served', 'cancelled'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${f === filter ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-muted-foreground hover:text-foreground'}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Order Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(order => (
          <div key={order.id} className="bg-card rounded-xl p-5 shadow-sm border border-border card-hover">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-sm font-bold text-foreground">{order.id}</span>
              <StatusBadge status={order.status} />
            </div>
            <div className="space-y-1 mb-3">
              <p className="text-sm text-muted-foreground">Table {order.tableNumber} • {order.waiterName}</p>
              <p className="text-xs text-muted-foreground">{Math.floor((Date.now() - order.createdAt.getTime()) / 60000)}m ago</p>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <span className="font-mono text-lg font-bold text-foreground">${order.total.toFixed(2)}</span>
              <button onClick={() => setViewOrder(order)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-primary hover:bg-primary/10 transition-colors">
                <Eye className="h-3.5 w-3.5" /> View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {viewOrder && (
        <CrudModal title={`Order ${viewOrder.id}`} onClose={() => setViewOrder(null)}>
          <div className="space-y-3">
            <p className="text-sm"><span className="font-medium">Table:</span> {viewOrder.tableNumber}</p>
            <p className="text-sm"><span className="font-medium">Waiter:</span> {viewOrder.waiterName}</p>
            <p className="text-sm"><span className="font-medium">Status:</span> <StatusBadge status={viewOrder.status} /></p>
            <div className="border-t border-border pt-3">
              <p className="text-sm font-medium mb-2">Items:</p>
              {viewOrder.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm py-1">
                  <span>{item.menuItem.name} ×{item.quantity}</span>
                  <span className="font-mono">${(item.menuItem.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-3 flex justify-between font-semibold">
              <span>Total</span>
              <span className="font-mono">${viewOrder.total.toFixed(2)}</span>
            </div>
          </div>
        </CrudModal>
      )}
    </div>
  );
}

// ─── MENU ──────────────────────────────────────────────────
function ManagerMenu() {
  const [items, setItems] = useState(menuItems);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: '', category: '', price: '', available: true });

  const openAdd = () => { setForm({ name: '', category: '', price: '', available: true }); setAdding(true); };
  const openEdit = (item: MenuItem) => { setForm({ name: item.name, category: item.category, price: String(item.price), available: item.available }); setEditing(item); };
  const handleSave = () => {
    if (editing) {
      setItems(prev => prev.map(i => i.id === editing.id ? { ...i, name: form.name, category: form.category, price: parseFloat(form.price) || 0, available: form.available } : i));
      setEditing(null);
    } else {
      setItems(prev => [...prev, { id: `m${Date.now()}`, name: form.name, category: form.category, price: parseFloat(form.price) || 0, available: form.available }]);
      setAdding(false);
    }
  };
  const handleDelete = (id: string) => setItems(prev => prev.filter(i => i.id !== id));

  const modal = adding || editing;

  return (
    <div className="p-6 overflow-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Menu Management</h2>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors btn-press">
          <Plus className="h-4 w-4" /> Add Item
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(item => (
          <div key={item.id} className="bg-card rounded-xl p-5 shadow-sm border border-border card-hover">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-lg">{item.image || '🍽️'}</div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.category}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg hover:bg-muted transition-colors"><Pencil className="h-3.5 w-3.5 text-muted-foreground" /></button>
                <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors"><Trash2 className="h-3.5 w-3.5 text-destructive" /></button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-lg font-bold">${item.price.toFixed(2)}</span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${item.available ? 'bg-status-ready/15 text-status-ready' : 'bg-status-issue/15 text-status-issue'}`}>
                {item.available ? 'Available' : 'Unavailable'}
              </span>
            </div>
          </div>
        ))}
      </div>
      {modal && (
        <CrudModal title={editing ? 'Edit Menu Item' : 'Add Menu Item'} onClose={() => { setEditing(null); setAdding(false); }} onSubmit={handleSave}>
          <FormField label="Name"><input className={inputClass} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} /></FormField>
          <FormField label="Category"><input className={inputClass} value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} /></FormField>
          <FormField label="Price"><input className={inputClass} type="number" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} /></FormField>
          <FormField label="Available">
            <select className={selectClass} value={form.available ? 'yes' : 'no'} onChange={e => setForm(p => ({ ...p, available: e.target.value === 'yes' }))}>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </FormField>
        </CrudModal>
      )}
    </div>
  );
}

// ─── TABLES ────────────────────────────────────────────────
function ManagerTables() {
  const [tableList, setTableList] = useState(tables);
  const statusColors: Record<string, string> = {
    available: 'bg-status-ready/10 border-status-ready/30 text-status-ready',
    occupied: 'bg-status-served/10 border-status-served/30 text-status-served',
    reserved: 'bg-status-pending/10 border-status-pending/30 text-status-pending',
    cleaning: 'bg-muted border-border text-muted-foreground',
  };

  return (
    <div className="p-6 overflow-auto space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Table Configuration</h2>
      <div className="grid grid-cols-3 lg:grid-cols-4 gap-4">
        {tableList.map(table => (
          <div key={table.id} className={`rounded-xl p-5 border-2 shadow-sm card-hover ${statusColors[table.status]}`}>
            <div className="font-mono text-2xl font-bold mb-1">T{String(table.id).padStart(2, '0')}</div>
            <p className="text-xs text-muted-foreground">{table.seats} seats</p>
            <p className="text-xs font-medium mt-2 capitalize">{table.status}</p>
            {table.waiter && <p className="text-xs text-muted-foreground mt-1">{table.waiter}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── INVENTORY ─────────────────────────────────────────────
function ManagerInventory() {
  const [items, setItems] = useState(inventory);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<InventoryItem | null>(null);
  const [form, setForm] = useState({ name: '', quantity: '', unit: '', lowThreshold: '' });

  const openAdd = () => { setForm({ name: '', quantity: '', unit: '', lowThreshold: '' }); setAdding(true); };
  const openEdit = (item: InventoryItem) => { setForm({ name: item.name, quantity: String(item.quantity), unit: item.unit, lowThreshold: String(item.lowThreshold) }); setEditing(item); };
  const handleSave = () => {
    const qty = parseInt(form.quantity) || 0;
    const threshold = parseInt(form.lowThreshold) || 0;
    if (editing) {
      setItems(prev => prev.map(i => i.id === editing.id ? { ...i, name: form.name, quantity: qty, unit: form.unit, lowThreshold: threshold, isLow: qty < threshold } : i));
      setEditing(null);
    } else {
      setItems(prev => [...prev, { id: `inv${Date.now()}`, name: form.name, quantity: qty, unit: form.unit, lowThreshold: threshold, isLow: qty < threshold }]);
      setAdding(false);
    }
  };
  const handleDelete = (id: string) => setItems(prev => prev.filter(i => i.id !== id));

  return (
    <div className="p-6 overflow-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Inventory</h2>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors btn-press">
          <Plus className="h-4 w-4" /> Add Item
        </button>
      </div>
      <div className="space-y-2">
        {items.map(item => (
          <div key={item.id} className={`flex items-center justify-between p-4 rounded-xl bg-card shadow-sm border ${item.isLow ? 'border-status-pending/40' : 'border-border'}`}>
            <div className="flex items-center gap-3">
              {item.isLow && <AlertTriangle className="h-4 w-4 text-status-pending" />}
              <span className="text-sm font-medium">{item.name}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono text-sm">{item.quantity} {item.unit}</span>
              <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg hover:bg-muted transition-colors"><Pencil className="h-3.5 w-3.5 text-muted-foreground" /></button>
              <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors"><Trash2 className="h-3.5 w-3.5 text-destructive" /></button>
            </div>
          </div>
        ))}
      </div>
      {(adding || editing) && (
        <CrudModal title={editing ? 'Edit Inventory Item' : 'Add Inventory Item'} onClose={() => { setEditing(null); setAdding(false); }} onSubmit={handleSave}>
          <FormField label="Name"><input className={inputClass} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} /></FormField>
          <FormField label="Quantity"><input className={inputClass} type="number" value={form.quantity} onChange={e => setForm(p => ({ ...p, quantity: e.target.value }))} /></FormField>
          <FormField label="Unit"><input className={inputClass} value={form.unit} onChange={e => setForm(p => ({ ...p, unit: e.target.value }))} /></FormField>
          <FormField label="Low Threshold"><input className={inputClass} type="number" value={form.lowThreshold} onChange={e => setForm(p => ({ ...p, lowThreshold: e.target.value }))} /></FormField>
        </CrudModal>
      )}
    </div>
  );
}

// ─── STAFF ─────────────────────────────────────────────────
function ManagerStaff() {
  const [staffList, setStaffList] = useState(staff);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<StaffMember | null>(null);
  const [form, setForm] = useState({ name: '', email: '', role: 'waiter', active: true });

  const openAdd = () => { setForm({ name: '', email: '', role: 'waiter', active: true }); setAdding(true); };
  const openEdit = (s: StaffMember) => { setForm({ name: s.name, email: s.email, role: s.role, active: s.active }); setEditing(s); };
  const handleSave = () => {
    if (editing) {
      setStaffList(prev => prev.map(s => s.id === editing.id ? { ...s, name: form.name, email: form.email, role: form.role as any, active: form.active } : s));
      setEditing(null);
    } else {
      setStaffList(prev => [...prev, { id: `s${Date.now()}`, name: form.name, email: form.email, role: form.role as any, active: form.active }]);
      setAdding(false);
    }
  };
  const handleDelete = (id: string) => setStaffList(prev => prev.filter(s => s.id !== id));

  return (
    <div className="p-6 overflow-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Staff Management</h2>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors btn-press">
          <Plus className="h-4 w-4" /> Add Staff
        </button>
      </div>
      <div className="space-y-2">
        {staffList.map(s => (
          <div key={s.id} className="flex items-center justify-between p-4 rounded-xl bg-card shadow-sm border border-border">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">{s.name.charAt(0)}</span>
              </div>
              <div>
                <p className="text-sm font-medium">{s.name}</p>
                <p className="text-xs text-muted-foreground">{s.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground capitalize">{s.role}</span>
              <span className={`text-xs font-medium ${s.active ? 'text-status-ready' : 'text-status-issue'}`}>{s.active ? 'Active' : 'Inactive'}</span>
              <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg hover:bg-muted transition-colors"><Pencil className="h-3.5 w-3.5 text-muted-foreground" /></button>
              <button onClick={() => handleDelete(s.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors"><Trash2 className="h-3.5 w-3.5 text-destructive" /></button>
            </div>
          </div>
        ))}
      </div>
      {(adding || editing) && (
        <CrudModal title={editing ? 'Edit Staff' : 'Add Staff'} onClose={() => { setEditing(null); setAdding(false); }} onSubmit={handleSave}>
          <FormField label="Name"><input className={inputClass} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} /></FormField>
          <FormField label="Email"><input className={inputClass} value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} /></FormField>
          <FormField label="Role">
            <select className={selectClass} value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}>
              <option value="waiter">Waiter</option>
              <option value="chef">Chef</option>
              <option value="billing">Billing</option>
              <option value="manager">Manager</option>
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

// ─── ANALYTICS ─────────────────────────────────────────────
function ManagerAnalytics() {
  return (
    <div className="p-6 overflow-auto space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Analytics</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Avg Order Time" value={`${dailyMetrics.avgOrderTime}m`} icon={Clock} />
        <MetricCard label="Revenue" value={`$${dailyMetrics.totalRevenue.toLocaleString()}`} icon={TrendingUp} trend="+18%" trendUp iconBg="bg-status-ready/10" iconColor="text-status-ready" />
        <MetricCard label="Orders" value={String(dailyMetrics.ordersCompleted)} icon={ClipboardList} />
        <MetricCard label="Low Stock" value={String(inventory.filter(i => i.isLow).length)} icon={Package} iconBg="bg-status-pending/10" iconColor="text-status-pending" />
      </div>
      <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Revenue Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={revenueData} barSize={40}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 90%)" vertical={false} />
            <XAxis dataKey="day" tick={{ fill: 'hsl(220 10% 50%)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'hsl(220 10% 50%)', fontSize: 12, fontFamily: 'Roboto Mono' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: 'white', border: '1px solid hsl(220 13% 90%)', borderRadius: '8px' }} formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']} />
            <Bar dataKey="revenue" fill="hsl(14 100% 62%)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─── PROMOS ────────────────────────────────────────────────
function ManagerPromos() {
  const [promos, setPromos] = useState(promotions);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<typeof promotions[0] | null>(null);
  const [form, setForm] = useState({ code: '', discount: '', type: 'percentage', active: true });

  const openAdd = () => { setForm({ code: '', discount: '', type: 'percentage', active: true }); setAdding(true); };
  const openEdit = (p: typeof promotions[0]) => { setForm({ code: p.code, discount: p.discount, type: p.type, active: p.active }); setEditing(p); };
  const handleSave = () => {
    if (editing) {
      setPromos(prev => prev.map(p => p.id === editing.id ? { ...p, code: form.code, discount: form.discount, type: form.type as any, active: form.active } : p));
      setEditing(null);
    } else {
      setPromos(prev => [...prev, { id: `p${Date.now()}`, code: form.code, discount: form.discount, type: form.type as any, active: form.active, uses: 0 }]);
      setAdding(false);
    }
  };
  const handleDelete = (id: string) => setPromos(prev => prev.filter(p => p.id !== id));

  return (
    <div className="p-6 overflow-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Promotions</h2>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors btn-press">
          <Plus className="h-4 w-4" /> Add Promo
        </button>
      </div>
      <div className="space-y-2">
        {promos.map(p => (
          <div key={p.id} className="flex items-center justify-between p-4 rounded-xl bg-card shadow-sm border border-border">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center"><Tag className="h-4 w-4 text-primary" /></div>
              <div>
                <span className="font-mono text-sm font-bold">{p.code}</span>
                <p className="text-xs text-muted-foreground">{p.discount} off • {p.uses} uses</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${p.active ? 'bg-status-ready/15 text-status-ready' : 'bg-muted text-muted-foreground'}`}>
                {p.active ? 'Active' : 'Expired'}
              </span>
              <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-muted transition-colors"><Pencil className="h-3.5 w-3.5 text-muted-foreground" /></button>
              <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors"><Trash2 className="h-3.5 w-3.5 text-destructive" /></button>
            </div>
          </div>
        ))}
      </div>
      {(adding || editing) && (
        <CrudModal title={editing ? 'Edit Promotion' : 'Add Promotion'} onClose={() => { setEditing(null); setAdding(false); }} onSubmit={handleSave}>
          <FormField label="Code"><input className={inputClass} value={form.code} onChange={e => setForm(p => ({ ...p, code: e.target.value }))} /></FormField>
          <FormField label="Discount"><input className={inputClass} value={form.discount} onChange={e => setForm(p => ({ ...p, discount: e.target.value }))} /></FormField>
          <FormField label="Type">
            <select className={selectClass} value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed</option>
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

// ─── FEEDBACK ──────────────────────────────────────────────

function ManagerFeedback() {
  // Import feedback from CustomerContext is not possible here since it's a separate context.
  // We'll show a standalone feedback view with mock data that mirrors the customer feedback structure.
  const [feedbackData] = useState([
    { id: 'f1', orderId: 'ORD-1001', customerName: 'John Doe', rating: 5, comment: 'Excellent food and quick service!', createdAt: new Date(Date.now() - 86400000) },
    { id: 'f2', orderId: 'ORD-1002', customerName: 'Jane Smith', rating: 4, comment: 'Great ambiance, slightly slow delivery.', createdAt: new Date(Date.now() - 172800000) },
    { id: 'f3', orderId: 'ORD-1003', customerName: 'Alex Johnson', rating: 3, comment: 'Food was okay, expected better seasoning.', createdAt: new Date(Date.now() - 259200000) },
    { id: 'f4', orderId: 'ORD-1004', customerName: 'Sarah Lee', rating: 5, comment: 'Best dining experience ever! Will come again.', createdAt: new Date(Date.now() - 345600000) },
    { id: 'f5', orderId: 'ORD-1005', customerName: 'Mike Brown', rating: 2, comment: 'Order was wrong and took too long to fix.', createdAt: new Date(Date.now() - 432000000) },
    { id: 'f6', orderId: 'ORD-1006', customerName: 'Emily Davis', rating: 4, comment: 'Loved the desserts! Main course was good too.', createdAt: new Date(Date.now() - 518400000) },
  ]);

  const [search, setSearch] = useState('');
  const [filterRating, setFilterRating] = useState<number | null>(null);

  const filtered = feedbackData.filter(f => {
    const matchesSearch = !search || f.customerName.toLowerCase().includes(search.toLowerCase()) || f.orderId.toLowerCase().includes(search.toLowerCase()) || f.comment.toLowerCase().includes(search.toLowerCase());
    const matchesRating = filterRating === null || f.rating === filterRating;
    return matchesSearch && matchesRating;
  });

  const avgRating = feedbackData.length > 0 ? (feedbackData.reduce((s, f) => s + f.rating, 0) / feedbackData.length).toFixed(1) : '0';

  const ratingCounts = [5, 4, 3, 2, 1].map(r => ({ rating: r, count: feedbackData.filter(f => f.rating === r).length }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Customer Feedback</h2>
        <p className="text-sm text-muted-foreground mt-1">View ratings and comments from customers</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border border-border p-5">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Average Rating</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-3xl font-bold text-foreground">{avgRating}</span>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map(s => (
                <Star key={s} className={`h-4 w-4 ${s <= Math.round(Number(avgRating)) ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground/20'}`} />
              ))}
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{feedbackData.length} total reviews</p>
        </div>

        <div className="bg-card rounded-xl border border-border p-5 col-span-1 sm:col-span-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-3">Rating Distribution</p>
          <div className="space-y-1.5">
            {ratingCounts.map(rc => (
              <div key={rc.rating} className="flex items-center gap-2 text-sm">
                <span className="w-3 text-muted-foreground">{rc.rating}</span>
                <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500 rounded-full transition-all" style={{ width: `${feedbackData.length > 0 ? (rc.count / feedbackData.length) * 100 : 0}%` }} />
                </div>
                <span className="text-xs text-muted-foreground w-6 text-right">{rc.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by customer, order, or comment..."
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
        </div>
        <select value={filterRating ?? ''} onChange={e => setFilterRating(e.target.value ? Number(e.target.value) : null)}
          className="px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary">
          <option value="">All Ratings</option>
          {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>)}
        </select>
      </div>

      {/* Feedback List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No feedback found</div>
        ) : filtered.map(fb => (
          <div key={fb.id} className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-semibold text-foreground">{fb.customerName}</p>
                <p className="text-xs text-muted-foreground font-mono">{fb.orderId} · {fb.createdAt.toLocaleDateString()}</p>
              </div>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} className={`h-4 w-4 ${s <= fb.rating ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground/20'}`} />
                ))}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{fb.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
