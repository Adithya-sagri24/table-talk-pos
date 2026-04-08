import { orders } from '@/lib/mock-data';
import { OrderStatus } from '@/lib/types';
import { useState } from 'react';
import { Clock, ArrowRight } from 'lucide-react';
import { StatusBadge } from '@/components/StatusBadge';

const columns: { status: OrderStatus; label: string; color: string }[] = [
  { status: 'pending', label: 'Pending', color: 'border-t-status-pending' },
  { status: 'preparing', label: 'Preparing', color: 'border-t-status-preparing' },
  { status: 'ready', label: 'Ready', color: 'border-t-status-ready' },
];

function timeSince(date: Date): string {
  const mins = Math.floor((Date.now() - date.getTime()) / 60000);
  return `${mins}m ago`;
}

export default function ChefDashboard() {
  const [orderList, setOrderList] = useState(orders.filter(o => ['pending', 'preparing', 'ready'].includes(o.status)));

  const advanceStatus = (orderId: string) => {
    setOrderList(prev =>
      prev.map(o => {
        if (o.id !== orderId) return o;
        const next: Record<string, OrderStatus> = { pending: 'preparing', preparing: 'ready' };
        return { ...o, status: next[o.status] || o.status, updatedAt: new Date(), statusChanged: true };
      })
    );
  };

  return (
    <div className="p-6 h-[calc(100vh-3.5rem)] overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Kitchen Display</h2>
          <p className="text-sm text-muted-foreground mt-1">{orderList.filter(o => o.status === 'pending').length} incoming orders</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 h-[calc(100%-5rem)]">
        {columns.map(col => {
          const colOrders = orderList.filter(o => o.status === col.status);
          return (
            <div key={col.status} className="flex flex-col">
              <div className={`border-t-4 ${col.color} rounded-t-xl bg-card p-3 mb-3 shadow-sm border border-border border-t-0`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">{col.label}</span>
                  <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded-full">{colOrders.length}</span>
                </div>
              </div>

              <div className="space-y-3 flex-1 overflow-auto">
                {colOrders.length === 0 ? (
                  <div className="text-sm text-muted-foreground text-center py-8">
                    No {col.label.toLowerCase()} orders
                  </div>
                ) : (
                  colOrders.map(order => (
                    <div key={order.id} className="bg-card rounded-xl p-4 shadow-sm border border-border card-hover">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-mono text-sm font-bold">{order.id}</span>
                        <span className="font-mono text-lg font-bold text-primary">T{String(order.tableNumber).padStart(2, '0')}</span>
                      </div>

                      <div className="space-y-1.5 mb-3">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span className="flex items-center gap-2">
                              <span>{item.menuItem.image}</span>
                              <span>{item.menuItem.name}</span>
                            </span>
                            <span className="font-mono text-muted-foreground">×{item.quantity}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {timeSince(order.createdAt)}
                        </span>
                        {order.status !== 'ready' && (
                          <button
                            onClick={() => advanceStatus(order.id)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors btn-press"
                          >
                            {order.status === 'pending' ? 'Start' : 'Ready'}
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
