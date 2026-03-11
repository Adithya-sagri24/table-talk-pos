import { orders } from '@/lib/mock-data';
import { useState } from 'react';
import { DollarSign, CreditCard, Smartphone, Globe, Percent } from 'lucide-react';

export default function BillingDashboard() {
  const servedOrders = orders.filter(o => o.status === 'served' || o.status === 'ready');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [discount, setDiscount] = useState('');
  const [promoCode, setPromoCode] = useState('');

  const selected = servedOrders.find(o => o.id === selectedOrder);
  const taxRate = 0.08;
  const discountAmount = discount ? parseFloat(discount) || 0 : 0;

  const subtotal = selected ? selected.total : 0;
  const discountedTotal = Math.max(0, subtotal - discountAmount);
  const tax = discountedTotal * taxRate;
  const grandTotal = discountedTotal + tax;

  return (
    <div className="flex h-[calc(100vh-3rem)]">
      {/* Order List */}
      <div className="flex-1 p-6 overflow-auto">
        <h2 className="font-mono text-lg font-bold tracking-wide mb-6">BILLING</h2>

        <div className="space-y-2">
          {servedOrders.length === 0 ? (
            <div className="font-mono text-sm text-muted-foreground py-8 text-center">
              NO COMPLETED ORDERS
            </div>
          ) : (
            servedOrders.map(order => (
              <button
                key={order.id}
                onClick={() => setSelectedOrder(order.id)}
                className={`w-full flex items-center justify-between p-4 border text-left transition-colors ${
                  selectedOrder === order.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:bg-accent/50'
                }`}
              >
                <div>
                  <span className="font-mono text-sm font-bold">{order.id}</span>
                  <span className="font-mono text-sm text-muted-foreground ml-3">
                    T{String(order.tableNumber).padStart(2, '0')}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-body text-xs text-muted-foreground">
                    {order.items.length} items
                  </span>
                  <span className="font-mono text-sm font-bold">${order.total.toFixed(2)}</span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Bill Details */}
      {selected && (
        <div className="w-96 border-l border-border p-5 overflow-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-mono text-sm font-bold">GENERATE BILL</h3>
            <button
              onClick={() => setSelectedOrder(null)}
              className="font-mono text-xs text-muted-foreground hover:text-foreground"
            >
              CLOSE
            </button>
          </div>

          <div className="font-mono text-xs text-muted-foreground mb-1">{selected.id}</div>
          <div className="font-mono text-xs text-muted-foreground mb-4">
            TABLE {String(selected.tableNumber).padStart(2, '0')} — {selected.waiterName}
          </div>

          {/* Items */}
          <div className="space-y-2 mb-4">
            {selected.items.map((item, i) => (
              <div key={i} className="flex justify-between pb-2 border-b border-border">
                <div>
                  <div className="font-body text-sm">{item.menuItem.name}</div>
                  <div className="font-mono text-xs text-muted-foreground">×{item.quantity}</div>
                </div>
                <div className="font-mono text-sm">${(item.menuItem.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>

          {/* Promo Code */}
          <div className="mb-3">
            <label className="font-mono text-[10px] text-muted-foreground tracking-wider block mb-1">PROMO CODE</label>
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="ENTER CODE"
              className="w-full bg-input border border-border px-3 py-2 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          {/* Discount */}
          <div className="mb-4">
            <label className="font-mono text-[10px] text-muted-foreground tracking-wider block mb-1">DISCOUNT ($)</label>
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-input border border-border px-3 py-2 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          {/* Totals */}
          <div className="space-y-2 py-3 border-t border-border">
            <div className="flex justify-between font-body text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-mono">${subtotal.toFixed(2)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between font-body text-sm text-status-ready">
                <span className="flex items-center gap-1"><Percent className="h-3 w-3" /> Discount</span>
                <span className="font-mono">-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-body text-sm">
              <span className="text-muted-foreground">Tax (8%)</span>
              <span className="font-mono">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-mono text-base font-bold pt-2 border-t border-border">
              <span>TOTAL</span>
              <span>${grandTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="mt-4">
            <div className="font-mono text-[10px] text-muted-foreground tracking-wider mb-2">PAYMENT METHOD</div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'CASH', icon: DollarSign },
                { label: 'CARD', icon: CreditCard },
                { label: 'UPI', icon: Smartphone },
                { label: 'ONLINE', icon: Globe },
              ].map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  className="flex items-center gap-2 px-3 py-2.5 border border-border font-mono text-xs tracking-wider hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <button className="w-full mt-4 py-3 bg-status-ready text-primary-foreground font-mono text-xs tracking-wider font-bold hover:bg-status-ready/90 transition-colors">
            GENERATE RECEIPT
          </button>
        </div>
      )}
    </div>
  );
}
