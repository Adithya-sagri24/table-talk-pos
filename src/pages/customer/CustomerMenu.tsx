import { useState } from 'react';
import { menuItems } from '@/lib/mock-data';
import { useCustomer } from '@/contexts/CustomerContext';
import { Search, Plus, Minus, ShoppingCart } from 'lucide-react';

const categories = ['All', ...Array.from(new Set(menuItems.map(m => m.category)))];

export default function CustomerMenu() {
  const { addToCart, updateCartQuantity, cart, cartTotal } = useCustomer();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const filtered = menuItems.filter(m => {
    if (!m.available) return false;
    if (category !== 'All' && m.category !== category) return false;
    if (search && !m.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const getCartQty = (id: string) => cart.find(c => c.menuItem.id === id)?.quantity || 0;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Our Menu</h2>
          <p className="text-sm text-muted-foreground mt-1">Browse and add items to your cart</p>
        </div>
        {cart.length > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-lg">
            <ShoppingCart className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-primary">{cart.length} items · ${cartTotal.toFixed(2)}</span>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search dishes..."
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${category === cat ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted'}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(item => {
          const qty = getCartQty(item.id);
          return (
            <div key={item.id} className="bg-card rounded-xl border border-border p-5 card-hover">
              <div className="flex items-start justify-between mb-3">
                <span className="text-4xl">{item.image}</span>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-muted text-muted-foreground">{item.category}</span>
              </div>
              <h3 className="font-semibold text-foreground mb-1">{item.name}</h3>
              <p className="font-mono text-lg font-bold text-primary mb-4">${item.price.toFixed(2)}</p>
              {qty === 0 ? (
                <button onClick={() => addToCart(item)} className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors btn-press flex items-center justify-center gap-2">
                  <Plus className="h-4 w-4" /> Add to Cart
                </button>
              ) : (
                <div className="flex items-center justify-between bg-primary/10 rounded-lg px-3 py-2">
                  <button onClick={() => updateCartQuantity(item.id, qty - 1)} className="h-8 w-8 rounded-lg bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors">
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="font-mono font-semibold text-primary">{qty}</span>
                  <button onClick={() => addToCart(item)} className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors">
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
