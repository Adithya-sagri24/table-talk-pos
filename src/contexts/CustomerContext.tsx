import { createContext, useContext, useState, ReactNode } from 'react';
import { OrderItem, Order, MenuItem } from '@/lib/types';

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
}

export interface Feedback {
  id: string;
  orderId: string;
  rating: number;
  comment: string;
  createdAt: Date;
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
  const [customer, setCustomer] = useState<CustomerUser | null>(null);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [customerOrders, setCustomerOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([
    { id: 'r1', date: '2026-04-10', time: '19:00', guests: 4, status: 'confirmed', createdAt: new Date(Date.now() - 86400000) },
  ]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [customers, setCustomers] = useState(mockCustomers);

  const login = (email: string, password: string): boolean => {
    const found = customers.find(c => c.email === email && c.password === password);
    if (found) {
      setCustomer({ id: found.id, name: found.name, email: found.email, phone: found.phone });
      return true;
    }
    return false;
  };

  const signup = (name: string, email: string, phone: string, password: string): boolean => {
    if (customers.find(c => c.email === email)) return false;
    const newCustomer = { id: `c${Date.now()}`, name, email, phone, password };
    setCustomers(prev => [...prev, newCustomer]);
    setCustomer({ id: newCustomer.id, name, email, phone });
    return true;
  };

  const logout = () => {
    setCustomer(null);
    setCart([]);
  };

  const addToCart = (item: MenuItem, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(ci => ci.menuItem.id === item.id);
      if (existing) {
        return prev.map(ci => ci.menuItem.id === item.id ? { ...ci, quantity: ci.quantity + quantity } : ci);
      }
      return [...prev, { menuItem: item, quantity }];
    });
  };

  const updateCartQuantity = (menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(prev => prev.filter(ci => ci.menuItem.id !== menuItemId));
    } else {
      setCart(prev => prev.map(ci => ci.menuItem.id === menuItemId ? { ...ci, quantity } : ci));
    }
  };

  const removeFromCart = (menuItemId: string) => {
    setCart(prev => prev.filter(ci => ci.menuItem.id !== menuItemId));
  };

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
    setCustomerOrders(prev => [order, ...prev]);
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
    };
    setReservations(prev => [res, ...prev]);
  };

  const cancelReservation = (id: string) => {
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status: 'cancelled' as const } : r));
  };

  const submitFeedback = (orderId: string, rating: number, comment: string) => {
    setFeedbacks(prev => [...prev, { id: `f${Date.now()}`, orderId, rating, comment, createdAt: new Date() }]);
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
