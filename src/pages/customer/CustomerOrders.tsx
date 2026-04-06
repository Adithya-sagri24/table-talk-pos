import { useCustomer } from '@/contexts/CustomerContext';
import { Clock, Package } from 'lucide-react';
import { StatusBadge } from '@/components/StatusBadge';

export default function CustomerOrders() {
  const { customerOrders } = useCustomer();

  if (customerOrders.length === 0) {
    return (
      <div className="p-6 max-w-2xl mx-auto text-center mt-20">
        <Package className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-foreground mb-2">No active orders</h2>
        <p className="text-sm text-muted-foreground">Place an order from the menu to track it here.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-foreground mb-6">Your Orders</h2>
      <div className="space-y-4">
        {customerOrders.map(order => {
          const mins = Math.round((Date.now() - order.createdAt.getTime()) / 60000);
          return (
            <div key={order.id} className="bg-card rounded-xl border border-border p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-semibold text-foreground">{order.id}</span>
                  <StatusBadge status={order.status} pulse={order.status !== 'served' && order.status !== 'cancelled'} />
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{mins}m ago</span>
                </div>
              </div>

              {/* Progress bar */}
              {!['served', 'cancelled'].includes(order.status) && (
                <div className="flex items-center gap-1 mb-4">
                  {['pending', 'preparing', 'ready'].map((s, i) => {
                    const stages = ['pending', 'preparing', 'ready'];
                    const current = stages.indexOf(order.status);
                    return (
                      <div key={s} className={`flex-1 h-2 rounded-full ${i <= current ? 'bg-primary' : 'bg-muted'}`} />
                    );
                  })}
                </div>
              )}

              <div className="space-y-2 mb-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.menuItem.image} {item.menuItem.name} ×{item.quantity}</span>
                    <span className="font-mono">${(item.menuItem.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-border pt-3">
                <span className="text-xs text-muted-foreground capitalize">{order.orderType || 'dine-in'}{order.tableNumber ? ` · Table ${order.tableNumber}` : ''}</span>
                <span className="font-mono font-semibold">${order.total.toFixed(2)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
