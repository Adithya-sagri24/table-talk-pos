import { orders } from '@/lib/mock-data';
import { OrderStatus } from '@/lib/types';
import { useState } from 'react';
import { Clock, ArrowRight } from 'lucide-react';

const columns: { status: OrderStatus; label: string; color: string }[] = [
  { status: 'pending', label: 'PENDING', color: 'border-t-status-pending' },
  { status: 'preparing', label: 'PREPARING', color: 'border-t-status-progress' },
  { status: 'ready', label: 'READY', color: 'border-t-status-ready' },
];

function timeSince(date: Date): string {
  const mins = Math.floor((Date.now() - date.getTime()) / 60000);
  return `${mins}m ago`;
}

export default function ChefDashboard() {
  const [orderList, setOrderList] = useState(orders.filter(o => ['pending', 'preparing', 'ready'].includes(o.status)));
  const [animating, setAnimating] = useState<string | null>(null);

  const advanceStatus = (orderId: string) => {
    setAnimating(orderId);
    setTimeout(() => setAnimating(null), 1500);
    setOrderList(prev =>
      prev.map(o => {
        if (o.id !== orderId) return o;
        const next: Record<string, OrderStatus> = { pending: 'preparing', preparing: 'ready' };
        return { ...o, status: next[o.status] || o.status, updatedAt: new Date(), statusChanged: true };
      })
    );
  };

  return (
    <div className="p-6 h-[calc(100vh-3rem)] overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-mono text-lg font-bold tracking-wide">KITCHEN DISPLAY</h2>
        <span className="font-mono text-xs text-muted-foreground">
          {orderList.filter(o => o.status === 'pending').length} INCOMING
        </span>
      </div>

      <div className="grid grid-cols-3 gap-6 h-[calc(100%-3rem)]">
        {columns.map(col => {
          const colOrders = orderList.filter(o => o.status === col.status);
          return (
            <div key={col.status} className="flex flex-col">
              <div className={`border-t-2 ${col.color} pb-3 mb-3`}>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-mono text-xs font-bold tracking-wider">{col.label}</span>
                  <span className="font-mono text-xs text-muted-foreground">{colOrders.length}</span>
                </div>
              </div>

              <div className="space-y-3 flex-1 overflow-auto">
                {colOrders.length === 0 ? (
                  <div className="font-mono text-xs text-muted-foreground text-center py-8">
                    NO {col.label} ORDERS
                  </div>
                ) : (
                  colOrders.map(order => (
                    <div
                      key={order.id}
                      className={`border border-border p-4 transition-all ${
                        animating === order.id
                          ? order.status === 'preparing'
                            ? 'animate-bleed-progress'
                            : 'animate-bleed-ready'
                          : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-mono text-sm font-bold">{order.id}</span>
                        <span className="font-mono text-lg font-bold">
                          T{String(order.tableNumber).padStart(2, '0')}
                        </span>
                      </div>

                      <div className="space-y-1.5 mb-3">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex justify-between">
                            <span className="font-body text-sm">{item.menuItem.name}</span>
                            <span className="font-mono text-sm text-muted-foreground">×{item.quantity}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                        <span className="font-body text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {timeSince(order.createdAt)}
                        </span>
                        {order.status !== 'ready' && (
                          <button
                            onClick={() => advanceStatus(order.id)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground font-mono text-[10px] tracking-wider hover:bg-primary/90 transition-colors"
                          >
                            {order.status === 'pending' ? 'START' : 'READY'}
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
