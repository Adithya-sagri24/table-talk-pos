import { dailyMetrics, orders, revenueData, popularDishes, inventory, tables, menuItems, staff } from '@/lib/mock-data';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  DollarSign, ClipboardList, Clock, Grid3X3,
  TrendingUp, AlertTriangle, Package, Users,
} from 'lucide-react';

function MetricBlock({ label, value, icon: Icon, accent }: { label: string; value: string; icon: typeof DollarSign; accent?: string }) {
  return (
    <div className="border border-border p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-[10px] text-muted-foreground tracking-wider">{label}</span>
        <Icon className={`h-4 w-4 ${accent || 'text-muted-foreground'}`} />
      </div>
      <div className="font-mono text-2xl font-bold">{value}</div>
    </div>
  );
}

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

  return <ManagerOverview />;
}

function ManagerOverview() {
  const m = dailyMetrics;
  return (
    <div className="p-6 overflow-auto">
      <h2 className="font-mono text-lg font-bold tracking-wide mb-6">OVERVIEW</h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricBlock label="REVENUE TODAY" value={`$${m.totalRevenue.toLocaleString()}`} icon={DollarSign} accent="text-status-ready" />
        <MetricBlock label="ORDERS COMPLETED" value={String(m.ordersCompleted)} icon={ClipboardList} />
        <MetricBlock label="PENDING" value={String(m.pendingOrders)} icon={Clock} accent="text-status-pending" />
        <MetricBlock label="TABLES AVAILABLE" value={`${m.availableTables}/${m.totalTables}`} icon={Grid3X3} accent="text-status-progress" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="border border-border p-5">
          <h3 className="font-mono text-xs font-bold tracking-wider mb-4">WEEKLY REVENUE</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 22%)" />
              <XAxis dataKey="day" tick={{ fill: 'hsl(0 0% 55%)', fontSize: 11, fontFamily: 'Roboto Mono' }} axisLine={false} />
              <YAxis tick={{ fill: 'hsl(0 0% 55%)', fontSize: 11, fontFamily: 'Roboto Mono' }} axisLine={false} />
              <Tooltip
                contentStyle={{ background: 'hsl(0 0% 13%)', border: '1px solid hsl(0 0% 22%)', fontFamily: 'Roboto Mono', fontSize: 12 }}
                labelStyle={{ color: 'hsl(0 0% 88%)' }}
              />
              <Bar dataKey="revenue" fill="hsl(0 0% 100%)" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Popular Dishes - Horizontal Bar */}
        <div className="border border-border p-5">
          <h3 className="font-mono text-xs font-bold tracking-wider mb-4">POPULAR DISHES</h3>
          <div className="space-y-3">
            {popularDishes.map((dish, i) => {
              const maxOrders = popularDishes[0].orders;
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-body text-sm">{dish.name}</span>
                    <span className="font-mono text-xs text-muted-foreground">{dish.orders}</span>
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-foreground rounded-full transition-all"
                      style={{ width: `${(dish.orders / maxOrders) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="border border-border p-5 mt-6">
        <h3 className="font-mono text-xs font-bold tracking-wider mb-4">RECENT ACTIVITY</h3>
        <div className="space-y-2">
          {orders.slice(0, 5).map(order => (
            <div key={order.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-bold">{order.id}</span>
                <span className="font-mono text-sm text-muted-foreground">T{String(order.tableNumber).padStart(2, '0')}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-body text-xs text-muted-foreground">{order.waiterName}</span>
                <StatusDot status={order.status} />
                <span className="font-mono text-sm">${order.total.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Low Stock Alerts */}
      {inventory.filter(i => i.isLow).length > 0 && (
        <div className="border border-status-pending p-5 mt-6">
          <h3 className="font-mono text-xs font-bold tracking-wider mb-4 flex items-center gap-2 text-status-pending">
            <AlertTriangle className="h-3.5 w-3.5" />
            LOW STOCK ALERTS
          </h3>
          <div className="space-y-2">
            {inventory.filter(i => i.isLow).map(item => (
              <div key={item.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <span className="font-body text-sm">{item.name}</span>
                <span className="font-mono text-xs text-status-pending">
                  {item.quantity} {item.unit} (min: {item.lowThreshold})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: 'bg-status-pending',
    preparing: 'bg-status-progress',
    ready: 'bg-status-ready',
    served: 'bg-muted-foreground',
    cancelled: 'bg-status-issue',
  };
  return <div className={`h-2 w-2 rounded-full ${colors[status] || 'bg-muted-foreground'}`} />;
}

function ManagerOrders() {
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);
  return (
    <div className="p-6 overflow-auto">
      <h2 className="font-mono text-lg font-bold tracking-wide mb-4">ORDER MONITORING</h2>
      <div className="flex gap-2 mb-4">
        {['all', 'pending', 'preparing', 'ready', 'served', 'cancelled'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 font-mono text-[10px] tracking-wider border transition-colors ${
              f === filter ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        {filtered.map(order => (
          <div key={order.id} className="flex items-center justify-between p-4 border border-border">
            <div className="flex items-center gap-4">
              <span className="font-mono text-sm font-bold">{order.id}</span>
              <span className="font-mono text-sm">T{String(order.tableNumber).padStart(2, '0')}</span>
              <StatusDot status={order.status} />
              <span className="font-mono text-[10px] text-muted-foreground tracking-wider">{order.status.toUpperCase()}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-body text-xs text-muted-foreground">{order.waiterName}</span>
              <span className="font-mono text-sm font-bold">${order.total.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ManagerMenu() {
  return (
    <div className="p-6 overflow-auto">
      <h2 className="font-mono text-lg font-bold tracking-wide mb-4">MENU MANAGEMENT</h2>
      <div className="space-y-2">
        {menuItems.map(item => (
          <div key={item.id} className="flex items-center justify-between p-4 border border-border">
            <div className="flex items-center gap-4">
              <span className="font-body text-sm font-medium">{item.name}</span>
              <span className="font-mono text-xs text-muted-foreground">{item.category}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono text-sm">${item.price.toFixed(2)}</span>
              <span className={`font-mono text-[10px] tracking-wider ${item.available ? 'text-status-ready' : 'text-status-issue'}`}>
                {item.available ? 'AVAILABLE' : 'UNAVAILABLE'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ManagerTables() {
  return (
    <div className="p-6 overflow-auto">
      <h2 className="font-mono text-lg font-bold tracking-wide mb-4">TABLE CONFIGURATION</h2>
      <div className="grid grid-cols-3 lg:grid-cols-4 gap-4">
        {tables.map(table => (
          <div key={table.id} className="border border-border p-4">
            <div className="font-mono text-xl font-bold mb-1">T{String(table.id).padStart(2, '0')}</div>
            <div className="font-body text-xs text-muted-foreground">{table.seats} seats</div>
            <div className="font-mono text-[10px] tracking-wider mt-2 text-muted-foreground">{table.status.toUpperCase()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ManagerInventory() {
  return (
    <div className="p-6 overflow-auto">
      <h2 className="font-mono text-lg font-bold tracking-wide mb-4">INVENTORY</h2>
      <div className="space-y-2">
        {inventory.map(item => (
          <div key={item.id} className={`flex items-center justify-between p-4 border ${item.isLow ? 'border-status-pending' : 'border-border'}`}>
            <div className="flex items-center gap-3">
              {item.isLow && <AlertTriangle className="h-3.5 w-3.5 text-status-pending" />}
              <span className="font-body text-sm">{item.name}</span>
            </div>
            <span className="font-mono text-sm">
              {item.quantity} {item.unit}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ManagerStaff() {
  return (
    <div className="p-6 overflow-auto">
      <h2 className="font-mono text-lg font-bold tracking-wide mb-4">STAFF</h2>
      <div className="space-y-2">
        {staff.map(s => (
          <div key={s.id} className="flex items-center justify-between p-4 border border-border">
            <div className="flex items-center gap-4">
              <span className="font-body text-sm font-medium">{s.name}</span>
              <span className="font-mono text-[10px] text-muted-foreground tracking-wider">{s.role.toUpperCase()}</span>
            </div>
            <span className={`font-mono text-[10px] tracking-wider ${s.active ? 'text-status-ready' : 'text-muted-foreground'}`}>
              {s.active ? 'ACTIVE' : 'INACTIVE'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ManagerAnalytics() {
  return (
    <div className="p-6 overflow-auto">
      <h2 className="font-mono text-lg font-bold tracking-wide mb-6">ANALYTICS</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricBlock label="AVG ORDER TIME" value={`${dailyMetrics.avgOrderTime}m`} icon={Clock} />
        <MetricBlock label="REVENUE" value={`$${dailyMetrics.totalRevenue.toLocaleString()}`} icon={TrendingUp} accent="text-status-ready" />
        <MetricBlock label="ORDERS" value={String(dailyMetrics.ordersCompleted)} icon={ClipboardList} />
        <MetricBlock label="LOW STOCK" value={String(inventory.filter(i => i.isLow).length)} icon={Package} accent="text-status-pending" />
      </div>
      <div className="border border-border p-5">
        <h3 className="font-mono text-xs font-bold tracking-wider mb-4">REVENUE TREND</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 22%)" />
            <XAxis dataKey="day" tick={{ fill: 'hsl(0 0% 55%)', fontSize: 11, fontFamily: 'Roboto Mono' }} axisLine={false} />
            <YAxis tick={{ fill: 'hsl(0 0% 55%)', fontSize: 11, fontFamily: 'Roboto Mono' }} axisLine={false} />
            <Tooltip contentStyle={{ background: 'hsl(0 0% 13%)', border: '1px solid hsl(0 0% 22%)', fontFamily: 'Roboto Mono', fontSize: 12 }} />
            <Bar dataKey="revenue" fill="hsl(0 0% 100%)" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function ManagerPromos() {
  const promos = [
    { code: 'WELCOME10', discount: '10%', active: true, uses: 23 },
    { code: 'LUNCH20', discount: '$20', active: true, uses: 45 },
    { code: 'HOLIDAY15', discount: '15%', active: false, uses: 112 },
  ];
  return (
    <div className="p-6 overflow-auto">
      <h2 className="font-mono text-lg font-bold tracking-wide mb-4">PROMO CODES</h2>
      <div className="space-y-2">
        {promos.map(p => (
          <div key={p.code} className="flex items-center justify-between p-4 border border-border">
            <div className="flex items-center gap-4">
              <span className="font-mono text-sm font-bold">{p.code}</span>
              <span className="font-mono text-xs text-muted-foreground">{p.discount} off</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono text-xs text-muted-foreground">{p.uses} uses</span>
              <span className={`font-mono text-[10px] tracking-wider ${p.active ? 'text-status-ready' : 'text-muted-foreground'}`}>
                {p.active ? 'ACTIVE' : 'EXPIRED'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function useState(initial: string): [string, (v: string) => void] {
  const [state, setState] = __useState(initial);
  return [state, setState];
}

import { useState as __useState } from 'react';
