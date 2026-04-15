import { orders } from '@/lib/mock-data';
import { useState } from 'react';
import { DollarSign, CreditCard, Smartphone, Globe, Percent, X, Check } from 'lucide-react';
import { StatusBadge } from '@/components/StatusBadge';
import { PaymentFlow } from '@/components/PaymentFlow';
import { toast } from 'sonner';

type PaymentMethod = 'cash' | 'card' | 'upi' | 'online';

export default function BillingDashboard() {
  const servedOrders = orders.filter(o => o.status === 'served' || o.status === 'ready');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [discount, setDiscount] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [showPaymentFlow, setShowPaymentFlow] = useState(false);

  const selected = servedOrders.find(o => o.id === selectedOrder);
  const taxRate = 0.08;
  const discountAmount = discount ? parseFloat(discount) || 0 : 0;

  const subtotal = selected ? selected.total : 0;
  const discountedTotal = Math.max(0, subtotal - discountAmount);
  const tax = discountedTotal * taxRate;
  const grandTotal = discountedTotal + tax;

  const handleProceedPayment = () => {
    if (!paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }
    setShowPaymentFlow(true);
  };

  const handlePaymentComplete = () => {
    toast.success(`Payment successful! ${paymentMethod?.toUpperCase()} — $${grandTotal.toFixed(2)}`);
    setShowPaymentFlow(false);
    setPaymentMethod(null);
    setSelectedOrder(null);
    setDiscount('');
    setPromoCode('');
  };

  const handlePaymentCancel = () => {
    setShowPaymentFlow(false);
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* Order List */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground">Billing</h2>
          <p className="text-sm text-muted-foreground mt-1">Select an order to generate a bill</p>
        </div>

        <div className="space-y-2">
          {servedOrders.length === 0 ? (
            <div className="text-sm text-muted-foreground py-8 text-center">No completed orders</div>
          ) : (
            servedOrders.map(order => (
              <button
                key={order.id}
                onClick={() => { setSelectedOrder(order.id); setShowPaymentFlow(false); setPaymentMethod(null); }}
                className={`w-full flex items-center justify-between p-4 rounded-xl text-left transition-all shadow-sm ${
                  selectedOrder === order.id
                    ? 'border-2 border-primary bg-primary/5'
                    : 'border border-border bg-card hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-lg">
                    {order.items[0]?.menuItem.image || '🍽️'}
                  </div>
                  <div>
                    <span className="font-mono text-sm font-bold">{order.id}</span>
                    <p className="text-xs text-muted-foreground">Table {String(order.tableNumber).padStart(2, '0')} • {order.items.length} items</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={order.status} />
                  <span className="font-mono text-sm font-bold">${order.total.toFixed(2)}</span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Bill Details */}
      {selected && (
        <div className="w-96 border-l border-border bg-card p-6 overflow-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">
              {showPaymentFlow ? 'Processing Payment' : 'Generate Bill'}
            </h3>
            <button onClick={() => { setSelectedOrder(null); setShowPaymentFlow(false); }} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>

          {showPaymentFlow && paymentMethod ? (
            <PaymentFlow
              method={paymentMethod}
              amount={grandTotal}
              onComplete={handlePaymentComplete}
              onCancel={handlePaymentCancel}
            />
          ) : (
            <>
              <div className="text-sm text-muted-foreground mb-4">
                {selected.id} • Table {String(selected.tableNumber).padStart(2, '0')} • {selected.waiterName}
              </div>

              {/* Items */}
              <div className="space-y-2 mb-4">
                {selected.items.map((item, i) => (
                  <div key={i} className="flex justify-between pb-2 border-b border-border">
                    <div>
                      <p className="text-sm font-medium">{item.menuItem.name}</p>
                      <p className="text-xs text-muted-foreground">×{item.quantity}</p>
                    </div>
                    <span className="font-mono text-sm">${(item.menuItem.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Promo */}
              <div className="mb-3">
                <label className="text-sm font-medium block mb-1.5">Promo Code</label>
                <input type="text" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} placeholder="Enter code"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
              </div>

              {/* Discount */}
              <div className="mb-4">
                <label className="text-sm font-medium block mb-1.5">Discount ($)</label>
                <input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} placeholder="0.00"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
              </div>

              {/* Totals */}
              <div className="space-y-2 py-3 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-mono">${subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-status-ready">
                    <span className="flex items-center gap-1"><Percent className="h-3 w-3" /> Discount</span>
                    <span className="font-mono">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (8%)</span>
                  <span className="font-mono">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                  <span>Total</span>
                  <span className="font-mono">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Payment Method</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Cash', value: 'cash' as PaymentMethod, icon: DollarSign },
                    { label: 'Card (POS)', value: 'card' as PaymentMethod, icon: CreditCard },
                    { label: 'UPI', value: 'upi' as PaymentMethod, icon: Smartphone },
                    { label: 'Online', value: 'online' as PaymentMethod, icon: Globe },
                  ].map(({ label, value, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => setPaymentMethod(value)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                        paymentMethod === value
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={handleProceedPayment} className="w-full mt-4 py-3 bg-status-ready text-primary-foreground rounded-lg text-sm font-semibold hover:bg-status-ready/90 transition-colors btn-press flex items-center justify-center gap-2">
                <Check className="h-4 w-4" />
                Proceed to Payment
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
