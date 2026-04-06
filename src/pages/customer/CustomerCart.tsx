import { useState } from 'react';
import { useCustomer } from '@/contexts/CustomerContext';
import { Minus, Plus, Trash2, ShoppingBag, CreditCard, Banknote, Smartphone, ArrowLeft, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type OrderType = 'dine-in' | 'takeaway';

export default function CustomerCart() {
  const { cart, updateCartQuantity, removeFromCart, clearCart, cartTotal, placeOrder } = useCustomer();
  const navigate = useNavigate();
  const [orderType, setOrderType] = useState<OrderType>('dine-in');
  const [tableNumber, setTableNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<string>('card');
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [placedOrderId, setPlacedOrderId] = useState('');

  const tax = cartTotal * 0.1;
  const grandTotal = cartTotal + tax;

  const handlePlaceOrder = () => {
    const tbl = orderType === 'dine-in' ? parseInt(tableNumber) || 1 : 0;
    const order = placeOrder(orderType, tbl);
    setPlacedOrderId(order.id);
    setStep('success');
  };

  if (cart.length === 0 && step === 'cart') {
    return (
      <div className="p-6 max-w-2xl mx-auto text-center mt-20">
        <ShoppingBag className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-foreground mb-2">Your cart is empty</h2>
        <p className="text-sm text-muted-foreground mb-6">Browse our menu and add some delicious items!</p>
        <button onClick={() => navigate('/customer/menu')} className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
          Browse Menu
        </button>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="p-6 max-w-md mx-auto text-center mt-20">
        <div className="h-20 w-20 rounded-full bg-status-ready/10 flex items-center justify-center mx-auto mb-6">
          <Check className="h-10 w-10 text-status-ready" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Order Placed!</h2>
        <p className="text-muted-foreground mb-1">Order <span className="font-mono font-semibold">{placedOrderId}</span></p>
        <p className="text-sm text-muted-foreground mb-6">
          {orderType === 'dine-in' ? `Table ${tableNumber || '1'} · ` : 'Takeaway · '}
          Paid via {paymentMethod} · ${grandTotal.toFixed(2)}
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => navigate('/customer/orders')} className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
            Track Order
          </button>
          <button onClick={() => { setStep('cart'); navigate('/customer/menu'); }} className="px-5 py-2.5 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors">
            Order More
          </button>
        </div>
      </div>
    );
  }

  if (step === 'checkout') {
    return (
      <div className="p-6 max-w-lg mx-auto">
        <button onClick={() => setStep('cart')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to cart
        </button>
        <h2 className="text-2xl font-bold text-foreground mb-6">Checkout</h2>

        {/* Order Type */}
        <div className="mb-6">
          <label className="text-sm font-medium text-foreground block mb-2">Order Type</label>
          <div className="flex gap-3">
            {(['dine-in', 'takeaway'] as OrderType[]).map(t => (
              <button key={t} onClick={() => setOrderType(t)}
                className={`flex-1 py-3 rounded-lg text-sm font-medium border transition-colors ${orderType === t ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-muted'}`}>
                {t === 'dine-in' ? '🍽️ Dine-In' : '🥡 Takeaway'}
              </button>
            ))}
          </div>
        </div>

        {orderType === 'dine-in' && (
          <div className="mb-6">
            <label className="text-sm font-medium text-foreground block mb-1.5">Table Number</label>
            <input type="number" min="1" max="12" value={tableNumber} onChange={e => setTableNumber(e.target.value)} placeholder="e.g. 5"
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
          </div>
        )}

        {/* Payment */}
        <div className="mb-6">
          <label className="text-sm font-medium text-foreground block mb-2">Payment Method</label>
          <div className="grid grid-cols-3 gap-3">
            {[{ id: 'card', label: 'Card', icon: CreditCard }, { id: 'cash', label: 'Cash', icon: Banknote }, { id: 'upi', label: 'UPI', icon: Smartphone }].map(pm => (
              <button key={pm.id} onClick={() => setPaymentMethod(pm.id)}
                className={`py-3 rounded-lg text-sm font-medium border flex flex-col items-center gap-1.5 transition-colors ${paymentMethod === pm.id ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-muted'}`}>
                <pm.icon className="h-5 w-5" />{pm.label}
              </button>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-muted/50 rounded-xl p-4 mb-6 space-y-2">
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span className="font-mono">${cartTotal.toFixed(2)}</span></div>
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Tax (10%)</span><span className="font-mono">${tax.toFixed(2)}</span></div>
          <div className="flex justify-between font-semibold border-t border-border pt-2 mt-2"><span>Total</span><span className="font-mono">${grandTotal.toFixed(2)}</span></div>
        </div>

        <button onClick={handlePlaceOrder} className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors btn-press">
          Pay ${grandTotal.toFixed(2)}
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-foreground mb-6">Your Cart</h2>
      <div className="space-y-3 mb-6">
        {cart.map(ci => (
          <div key={ci.menuItem.id} className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
            <span className="text-3xl">{ci.menuItem.image}</span>
            <div className="flex-1">
              <h4 className="font-medium text-foreground">{ci.menuItem.name}</h4>
              <p className="text-sm text-muted-foreground font-mono">${ci.menuItem.price.toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => updateCartQuantity(ci.menuItem.id, ci.quantity - 1)} className="h-8 w-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors">
                <Minus className="h-3 w-3" />
              </button>
              <span className="font-mono font-semibold w-6 text-center">{ci.quantity}</span>
              <button onClick={() => updateCartQuantity(ci.menuItem.id, ci.quantity + 1)} className="h-8 w-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors">
                <Plus className="h-3 w-3" />
              </button>
            </div>
            <span className="font-mono font-semibold w-16 text-right">${(ci.menuItem.price * ci.quantity).toFixed(2)}</span>
            <button onClick={() => removeFromCart(ci.menuItem.id)} className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between bg-card rounded-xl border border-border p-4">
        <div>
          <span className="text-muted-foreground text-sm">Total ({cart.length} items)</span>
          <p className="font-mono text-xl font-bold text-foreground">${cartTotal.toFixed(2)}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={clearCart} className="px-4 py-2.5 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors">Clear</button>
          <button onClick={() => setStep('checkout')} className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors btn-press">
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
