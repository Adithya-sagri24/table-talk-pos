import { tables, orders } from '@/lib/mock-data';
import { OrderStatus, TableStatus } from '@/lib/types';
import { useState } from 'react';
import { Users, Clock, AlertCircle } from 'lucide-react';

const statusColor: Record<TableStatus, string> = {
  available: 'border-status-ready text-status-ready',
  occupied: 'border-status-progress text-status-progress',
  reserved: 'border-status-pending text-status-pending',
  cleaning: 'border-muted-foreground text-muted-foreground',
};

const statusLabel: Record<TableStatus, string> = {
  available: 'AVAILABLE',
  occupied: 'OCCUPIED',
  reserved: 'RESERVED',
  cleaning: 'CLEANING',
};

export default function WaiterDashboard() {
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const selectedOrder = selectedTable
    ? orders.find(o => o.tableNumber === selectedTable && !['served', 'cancelled'].includes(o.status))
    : null;

  const readyOrders = orders.filter(o => o.status === 'ready');

  return (
    <div className="flex h-[calc(100vh-3rem)]">
      {/* Main - Table Grid */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-mono text-lg font-bold tracking-wide">FLOOR MAP</h2>
          <span className="font-mono text-xs text-muted-foreground">
            {tables.filter(t => t.status === 'available').length} / {tables.length} AVAILABLE
          </span>
        </div>

        {/* Ready Notifications */}
        {readyOrders.length > 0 && (
          <div className="mb-6 space-y-2">
            {readyOrders.map(order => (
              <div
                key={order.id}
                className="flex items-center gap-3 px-4 py-3 border border-status-ready bg-status-ready/5 rounded-sm animate-bleed-ready"
              >
                <AlertCircle className="h-4 w-4 text-status-ready shrink-0" />
                <span className="font-mono text-sm text-status-ready">
                  {order.id} — TABLE {String(order.tableNumber).padStart(2, '0')} — READY FOR PICKUP
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-3 lg:grid-cols-4 gap-4">
          {tables.map((table) => (
            <button
              key={table.id}
              onClick={() => setSelectedTable(table.id)}
              className={`border-2 p-4 text-left transition-all hover:bg-accent/50 ${
                statusColor[table.status]
              } ${selectedTable === table.id ? 'ring-1 ring-primary' : ''}`}
            >
              <div className="font-mono text-2xl font-bold mb-2">
                T{String(table.id).padStart(2, '0')}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                <Users className="h-3 w-3" />
                <span className="font-body">{table.seats} seats</span>
              </div>
              <div className={`font-mono text-[10px] font-semibold tracking-wider ${statusColor[table.status]}`}>
                {statusLabel[table.status]}
              </div>
              {table.waiter && (
                <div className="font-body text-[11px] text-muted-foreground mt-1">
                  {table.waiter}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Right Panel - Order Details */}
      {selectedTable && (
        <div className="w-80 border-l border-border p-5 overflow-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-mono text-sm font-bold">
              TABLE {String(selectedTable).padStart(2, '0')}
            </h3>
            <button
              onClick={() => setSelectedTable(null)}
              className="font-mono text-xs text-muted-foreground hover:text-foreground"
            >
              CLOSE
            </button>
          </div>

          {selectedOrder ? (
            <div>
              <div className="font-mono text-xs text-muted-foreground mb-1">{selectedOrder.id}</div>
              <StatusBadge status={selectedOrder.status} />

              <div className="mt-4 space-y-3">
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="flex justify-between border-b border-border pb-2">
                    <div>
                      <div className="font-body text-sm">{item.menuItem.name}</div>
                      <div className="font-mono text-xs text-muted-foreground">×{item.quantity}</div>
                    </div>
                    <div className="font-mono text-sm">
                      ${(item.menuItem.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between mt-4 pt-3 border-t border-border">
                <span className="font-mono text-sm font-bold">TOTAL</span>
                <span className="font-mono text-sm font-bold">${selectedOrder.total.toFixed(2)}</span>
              </div>

              <div className="mt-6 space-y-2">
                {selectedOrder.status === 'pending' && (
                  <button className="w-full py-2 border border-status-issue text-status-issue font-mono text-xs tracking-wider hover:bg-status-issue/10 transition-colors">
                    CANCEL ORDER
                  </button>
                )}
                {selectedOrder.status === 'ready' && (
                  <button className="w-full py-2 bg-primary text-primary-foreground font-mono text-xs tracking-wider hover:bg-primary/90 transition-colors">
                    MARK SERVED
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center mt-12">
              <p className="font-mono text-sm text-muted-foreground">NO ACTIVE ORDER</p>
              <button className="mt-4 px-4 py-2 bg-primary text-primary-foreground font-mono text-xs tracking-wider hover:bg-primary/90 transition-colors">
                NEW ORDER
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const map: Record<OrderStatus, { color: string; label: string }> = {
    pending: { color: 'bg-status-pending/10 text-status-pending border-status-pending', label: 'PENDING' },
    preparing: { color: 'bg-status-progress/10 text-status-progress border-status-progress', label: 'PREPARING' },
    ready: { color: 'bg-status-ready/10 text-status-ready border-status-ready', label: 'READY' },
    served: { color: 'bg-muted text-muted-foreground border-muted', label: 'SERVED' },
    cancelled: { color: 'bg-status-issue/10 text-status-issue border-status-issue', label: 'CANCELLED' },
  };
  const { color, label } = map[status];
  return (
    <span className={`inline-block font-mono text-[10px] font-semibold tracking-wider px-2 py-0.5 border rounded-sm ${color}`}>
      {label}
    </span>
  );
}
