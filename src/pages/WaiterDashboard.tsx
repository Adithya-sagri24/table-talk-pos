import { tables, menuItems } from '@/lib/mock-data';
import { OrderStatus, TableStatus, Order, OrderItem } from '@/lib/types';
import { useState } from 'react';
import { Users, AlertCircle, Plus, X, CalendarDays } from 'lucide-react';
import { StatusBadge } from '@/components/StatusBadge';
import { CrudModal, FormField, inputClass, selectClass } from '@/components/CrudModal';
import { useRMS } from '@/contexts/RMSContext';
import { useRole } from '@/contexts/RoleContext';
import { useLocation } from 'react-router-dom';

const statusColors: Record<TableStatus, string> = {
  available: 'bg-status-ready/10 border-status-ready/40 text-status-ready',
  occupied: 'bg-status-served/10 border-status-served/40 text-status-served',
  reserved: 'bg-status-pending/10 border-status-pending/40 text-status-pending',
  cleaning: 'bg-muted border-border text-muted-foreground',
};

export default function WaiterDashboard() {
  const location = useLocation();
  if (location.pathname === '/waiter/orders') return <WaiterOrders />;
  return <WaiterFloor />;
}

function WaiterFloor() {
  const { orders, addOrder, updateOrderStatus, cancelOrder: rmsCancel, reservations } = useRMS();
  const { userName } = useRole();
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [showNewOrder, setShowNewOrder] = useState(false);
  const [newOrderItems, setNewOrderItems] = useState<{ menuItemId: string; quantity: number }[]>([]);

  const activeOrders = orders.filter(o => !['served', 'cancelled'].includes(o.status));
  const selectedOrder = selectedTable ? activeOrders.find(o => o.tableNumber === selectedTable) : null;
  const readyOrders = orders.filter(o => o.status === 'ready');

  // Show reservations relevant to waiter
  const upcomingReservations = reservations.filter(r => r.status === 'confirmed');

  const handleCreateOrder = () => {
    if (!selectedTable || newOrderItems.length === 0) return;
    const items: OrderItem[] = newOrderItems.map(ni => ({
      menuItem: menuItems.find(m => m.id === ni.menuItemId)!,
      quantity: ni.quantity,
    })).filter(i => i.menuItem);
    const total = items.reduce((s, i) => s + i.menuItem.price * i.quantity, 0);
    const newOrder: Order = {
      id: `ORD-${Date.now().toString().slice(-3)}`,
      tableNumber: selectedTable,
      items,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
      waiterName: userName,
      total,
    };
    addOrder(newOrder);
    setShowNewOrder(false);
    setNewOrderItems([]);
  };

  const markServed = (orderId: string) => updateOrderStatus(orderId, 'served', userName, 'waiter');
  const cancelOrderFn = (orderId: string) => rmsCancel(orderId, userName, 'waiter');

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      <div className="flex-1 p-6 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Floor Map</h2>
            <p className="text-sm text-muted-foreground mt-1">{tables.filter(t => t.status === 'available').length} of {tables.length} tables available</p>
          </div>
        </div>

        {readyOrders.length > 0 && (
          <div className="mb-6 space-y-2">
            {readyOrders.map(order => (
              <div key={order.id} className="flex items-center gap-3 px-4 py-3 bg-status-ready/10 border border-status-ready/30 rounded-xl animate-status-pulse">
                <AlertCircle className="h-4 w-4 text-status-ready shrink-0" />
                <span className="text-sm font-medium text-status-ready">
                  {order.id} — Table {String(order.tableNumber).padStart(2, '0')} — Ready for pickup
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Upcoming Reservations */}
        {upcomingReservations.length > 0 && (
          <div className="mb-6 bg-status-served/5 border border-status-served/20 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-status-served flex items-center gap-2 mb-2">
              <CalendarDays className="h-4 w-4" /> Upcoming Reservations
            </h3>
            <div className="space-y-1">
              {upcomingReservations.slice(0, 3).map(r => (
                <div key={r.id} className="text-sm text-muted-foreground">
                  {r.date} at {r.time} — {r.guests} guests {r.customerName ? `(${r.customerName})` : ''}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 lg:grid-cols-4 gap-4">
          {tables.map((table) => (
            <button
              key={table.id}
              onClick={() => setSelectedTable(table.id)}
              className={`rounded-xl border-2 p-5 text-left transition-all card-hover ${statusColors[table.status]} ${selectedTable === table.id ? 'ring-2 ring-primary shadow-lg' : ''}`}
            >
              <div className="font-mono text-2xl font-bold mb-2">T{String(table.id).padStart(2, '0')}</div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                <Users className="h-3 w-3" /><span>{table.seats} seats</span>
              </div>
              <div className="text-xs font-medium capitalize mt-1">{table.status}</div>
              {table.waiter && <div className="text-xs text-muted-foreground mt-1">{table.waiter}</div>}
            </button>
          ))}
        </div>
      </div>

      {selectedTable && (
        <div className="w-80 border-l border-border bg-card p-5 overflow-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Table {String(selectedTable).padStart(2, '0')}</h3>
            <button onClick={() => setSelectedTable(null)} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>

          {selectedOrder ? (
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-sm text-muted-foreground">{selectedOrder.id}</span>
                <StatusBadge status={selectedOrder.status} />
              </div>
              <div className="space-y-3">
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="flex justify-between border-b border-border pb-2">
                    <div>
                      <p className="text-sm font-medium">{item.menuItem.name}</p>
                      <p className="text-xs text-muted-foreground">×{item.quantity}</p>
                    </div>
                    <span className="font-mono text-sm">${(item.menuItem.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-4 pt-3 border-t border-border">
                <span className="font-semibold">Total</span>
                <span className="font-mono font-semibold">${selectedOrder.total.toFixed(2)}</span>
              </div>
              <div className="mt-4 space-y-2">
                {selectedOrder.status === 'pending' && (
                  <button onClick={() => cancelOrderFn(selectedOrder.id)} className="w-full py-2.5 rounded-lg border border-destructive text-destructive text-sm font-medium hover:bg-destructive/10 transition-colors">
                    Cancel Order
                  </button>
                )}
                {selectedOrder.status === 'ready' && (
                  <button onClick={() => markServed(selectedOrder.id)} className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors btn-press">
                    Mark Served
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center mt-12">
              <p className="text-sm text-muted-foreground">No active order</p>
              <button onClick={() => setShowNewOrder(true)} className="mt-4 flex items-center gap-2 mx-auto px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors btn-press">
                <Plus className="h-4 w-4" /> New Order
              </button>
            </div>
          )}
        </div>
      )}

      {showNewOrder && selectedTable && (
        <CrudModal title={`New Order — Table ${selectedTable}`} onClose={() => { setShowNewOrder(false); setNewOrderItems([]); }} onSubmit={handleCreateOrder} submitLabel="Send to Kitchen">
          <p className="text-sm text-muted-foreground mb-2">Select items:</p>
          {menuItems.filter(m => m.available).map(item => {
            const existing = newOrderItems.find(n => n.menuItemId === item.id);
            return (
              <div key={item.id} className="flex items-center justify-between py-2 border-b border-border">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{item.image}</span>
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">${item.price.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setNewOrderItems(prev => {
                    const ex = prev.find(n => n.menuItemId === item.id);
                    if (ex && ex.quantity > 1) return prev.map(n => n.menuItemId === item.id ? { ...n, quantity: n.quantity - 1 } : n);
                    return prev.filter(n => n.menuItemId !== item.id);
                  })} className="h-7 w-7 rounded-lg border border-border text-sm hover:bg-muted transition-colors">-</button>
                  <span className="font-mono text-sm w-6 text-center">{existing?.quantity || 0}</span>
                  <button onClick={() => setNewOrderItems(prev => {
                    const ex = prev.find(n => n.menuItemId === item.id);
                    if (ex) return prev.map(n => n.menuItemId === item.id ? { ...n, quantity: n.quantity + 1 } : n);
                    return [...prev, { menuItemId: item.id, quantity: 1 }];
                  })} className="h-7 w-7 rounded-lg border border-border text-sm hover:bg-muted transition-colors">+</button>
                </div>
              </div>
            );
          })}
        </CrudModal>
      )}
    </div>
  );
}

function WaiterOrders() {
  const { orders } = useRMS();
  const activeOrders = orders.filter(o => !['cancelled'].includes(o.status));

  return (
    <div className="p-6 overflow-auto space-y-6">
      <h2 className="text-2xl font-bold text-foreground">All Orders</h2>
      <div className="space-y-2">
        {activeOrders.map(order => (
          <div key={order.id} className="flex items-center justify-between p-4 rounded-xl bg-card shadow-sm border border-border">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-lg">
                {order.items[0]?.menuItem.image || '🍽️'}
              </div>
              <div>
                <p className="text-sm font-bold font-mono">{order.id}</p>
                <p className="text-xs text-muted-foreground">Table {order.tableNumber} • {order.waiterName}</p>
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
  );
}
