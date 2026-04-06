import { createContext, useContext, useState, ReactNode } from 'react';
import { OrderItem, Order, MenuItem } from '@/lib/types';
import { useRMS } from '@/contexts/RMSContext';

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface Reservation {
  id: string;
  date: string;
  time: string;
  guests: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt: Date;
  customerName?: string;
}

export interface Feedback {
  id: string;
  orderId: string;
  rating: number;
  comment: string;
  createdAt: Date;
  customerName?: string;
}

interface CustomerContextType {
  customer: CustomerUser | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, phone: string, password: string) => boolean;
  logout: () => void;
  cart: OrderItem[];
  addToCart: (item: MenuItem, quantity?: number) => void;
  updateCartQuantity: (menuItemId: string, quantity: number) => void;
  removeFromCart: (menuItemId: string) => void;
  clearCart: () => void;
  cartTotal: number;
  customerOrders: Order[];
  placeOrder: (type: 'dine-in' | 'takeaway', tableNumber?: number) => Order;
  reservations: Reservation[];
  makeReservation: (date: string, time: string, guests: number) => void;
  cancelReservation: (id: string) => void;
  feedbacks: Feedback[];
  submitFeedback: (orderId: string, rating: number, comment: string) => void;
}

const mockCustomers = [
  { id: 'c1', name: 'John Doe', email: 'john@example.com', phone: '555-0101', password: 'customer123' },
  { id: 'c2', name: 'Jane Smith', email: 'jane@example.com', phone: '555-0102', password: 'customer123' },
];

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export function CustomerProvider({ children }: { children: ReactNode }) {
  const rms = useRMS();
  const [customer, setCustomer] = useState<CustomerUser | null>(null);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [customerOrderIds, setCustomerOrderIds] = useState<string[]>([]);
  const [customers, setCustomers] = useState(mockCustomers);

  const customerOrders = rms.orders.filter(o => customerOrderIds.includes(o.id));
  const reservations = rms.reservations;
  const feedbacks = rms.feedbacks;

  const login = (email: string, password: string): boolean => {
    const found = customers.find(c => c.email === email && c.password === password);
    if (found) {
      setCustomer({ id: found.id, name: found.name, email: found.email, phone: found.phone });
      rms.addAuditLog({ user: found.name, role: 'customer', action: 'Customer login', details: found.email, status: 'success' });
      return true;
    }
    rms.addAuditLog({ user: email, role: 'customer', action: 'Customer login failed', details: email, status: 'failure' });
    return false;
  };

  const signup = (name: string, email: string, phone: string, password: string): boolean => {
    if (customers.find(c => c.email === email)) return false;
    const newCustomer = { id: `c${Date.now()}`, name, email, phone, password };
    setCustomers(prev => [...prev, newCustomer]);
    setCustomer({ id: newCustomer.id, name, email, phone });
    rms.addAuditLog({ user: name, role: 'customer', action: 'Customer registered', details: email, status: 'success' });
    return true;
  };

  const logout = () => {
    if (customer) {
      rms.addAuditLog({ user: customer.name, role: 'customer', action: 'Customer logout', details: customer.email, status: 'info' });
    }
    setCustomer(null);
    setCart([]);
  };

  const addToCart = (item: MenuItem, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(ci => ci.menuItem.id === item.id);
      if (existing) return prev.map(ci => ci.menuItem.id === item.id ? { ...ci, quantity: ci.quantity + quantity } : ci);
      return [...prev, { menuItem: item, quantity }];
    });
  };

  const updateCartQuantity = (menuItemId: string, quantity: number) => {
    if (quantity <= 0) setCart(prev => prev.filter(ci => ci.menuItem.id !== menuItemId));
    else setCart(prev => prev.map(ci => ci.menuItem.id === menuItemId ? { ...ci, quantity } : ci));
  };

  const removeFromCart = (menuItemId: string) => setCart(prev => prev.filter(ci => ci.menuItem.id !== menuItemId));
  const clearCart = () => setCart([]);
  const cartTotal = cart.reduce((sum, ci) => sum + ci.menuItem.price * ci.quantity, 0);

  const placeOrder = (type: 'dine-in' | 'takeaway', tableNumber?: number): Order => {
    const order: Order = {
      id: `ORD-${Date.now().toString().slice(-4)}`,
      tableNumber: tableNumber || 0,
      items: [...cart],
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
      waiterName: customer?.name || 'Customer',
      total: cartTotal,
      orderType: type,
    };
    rms.addOrder(order);
    setCustomerOrderIds(prev => [order.id, ...prev]);
    clearCart();
    return order;
  };

  const makeReservation = (date: string, time: string, guests: number) => {
    const res: Reservation = {
      id: `r${Date.now()}`,
      date,
      time,
      guests,
      status: 'confirmed',
      createdAt: new Date(),
      customerName: customer?.name,
    };
    rms.addReservation(res);
  };

  const cancelReservation = (id: string) => rms.cancelReservation(id);

  const submitFeedback = (orderId: string, rating: number, comment: string) => {
    rms.addFeedback({
      id: `f${Date.now()}`,
      orderId,
      rating,
      comment,
      createdAt: new Date(),
      customerName: customer?.name,
    });
  };

  return (
    <CustomerContext.Provider value={{
      customer, isLoggedIn: !!customer, login, signup, logout,
      cart, addToCart, updateCartQuantity, removeFromCart, clearCart, cartTotal,
      customerOrders, placeOrder,
      reservations, makeReservation, cancelReservation,
      feedbacks, submitFeedback,
    }}>
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomer() {
  const ctx = useContext(CustomerContext);
  if (!ctx) throw new Error('useCustomer must be used within CustomerProvider');
  return ctx;
}
