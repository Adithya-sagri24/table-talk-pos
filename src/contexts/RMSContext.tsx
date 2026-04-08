import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Order, OrderStatus, UserRole } from '@/lib/types';
import { orders as mockOrders, tables as mockTables } from '@/lib/mock-data';
import { Reservation, Feedback } from '@/contexts/CustomerContext';

export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  user: string;
  role: UserRole | 'customer' | 'system';
  action: string;
  details: string;
  status: 'success' | 'failure' | 'info';
}

interface RMSContextType {
  // Shared orders (visible to waiter, chef, manager, billing)
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus, updatedBy: string, role: UserRole) => void;
  cancelOrder: (orderId: string, cancelledBy: string, role: UserRole) => void;

  // Shared reservations (visible to manager, waiter)
  reservations: Reservation[];
  addReservation: (res: Reservation) => void;
  cancelReservation: (id: string) => void;

  // Shared feedback (visible to manager)
  feedbacks: Feedback[];
  addFeedback: (fb: Feedback) => void;

  // Audit log
  auditLogs: AuditLogEntry[];
  addAuditLog: (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => void;

  // Staff credentials registry (for signup)
  staffCredentials: { employeeId: string; pin: string; role: UserRole; name: string }[];
  registerStaff: (employeeId: string, pin: string, role: UserRole, name: string) => boolean;
  authenticateStaff: (employeeId: string, pin: string, role: UserRole) => { success: boolean; name: string };

  // Tables
  tableStatuses: typeof mockTables;
}

const RMSContext = createContext<RMSContextType | undefined>(undefined);

const initialCredentials = [
  { employeeId: 'EMP001', pin: '1234', role: 'admin' as UserRole, name: 'Admin Root' },
  { employeeId: 'EMP002', pin: '2345', role: 'manager' as UserRole, name: 'Morgan Swift' },
  { employeeId: 'EMP003', pin: '3456', role: 'chef' as UserRole, name: 'Chef Marco' },
  { employeeId: 'EMP004', pin: '4567', role: 'waiter' as UserRole, name: 'Alex Rivera' },
  { employeeId: 'EMP005', pin: '5678', role: 'billing' as UserRole, name: 'Pat Kumar' },
];

const initialAuditLogs: AuditLogEntry[] = [
  { id: 'log1', timestamp: new Date(Date.now() - 3600000), user: 'Morgan Swift', role: 'manager', action: 'Updated menu item', details: 'Grilled Salmon price → $22.99', status: 'success' },
  { id: 'log2', timestamp: new Date(Date.now() - 5400000), user: 'Admin Root', role: 'admin', action: 'Created promo code', details: 'WELCOME10', status: 'success' },
  { id: 'log3', timestamp: new Date(Date.now() - 7200000), user: 'Alex Rivera', role: 'waiter', action: 'Cancelled order', details: 'ORD-105', status: 'info' },
  { id: 'log4', timestamp: new Date(Date.now() - 9000000), user: 'Chef Marco', role: 'chef', action: 'Marked order ready', details: 'ORD-102', status: 'success' },
  { id: 'log5', timestamp: new Date(Date.now() - 10800000), user: 'Admin Root', role: 'admin', action: 'Changed config', details: 'TAX_RATE 7% → 8%', status: 'info' },
  { id: 'log6', timestamp: new Date(Date.now() - 14400000), user: 'System', role: 'system', action: 'Daily backup', details: 'Completed successfully', status: 'success' },
];

export function RMSProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [reservations, setReservations] = useState<Reservation[]>([
    { id: 'r1', date: '2026-04-10', time: '19:00', guests: 4, status: 'confirmed', createdAt: new Date(Date.now() - 86400000) },
  ]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(initialAuditLogs);
  const [staffCredentials, setStaffCredentials] = useState(initialCredentials);
  const [tableStatuses] = useState(mockTables);

  const addAuditLog = useCallback((entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => {
    setAuditLogs(prev => [{
      ...entry,
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date(),
    }, ...prev]);
  }, []);

  const addOrder = useCallback((order: Order) => {
    setOrders(prev => [order, ...prev]);
    addAuditLog({ user: order.waiterName, role: 'customer', action: 'Placed order', details: `${order.id} — Table ${order.tableNumber} — $${order.total.toFixed(2)}`, status: 'success' });
  }, [addAuditLog]);

  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus, updatedBy: string, role: UserRole) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status, updatedAt: new Date(), statusChanged: true } : o));
    addAuditLog({ user: updatedBy, role, action: `Updated order status to ${status}`, details: orderId, status: 'success' });
  }, [addAuditLog]);

  const cancelOrder = useCallback((orderId: string, cancelledBy: string, role: UserRole) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'cancelled' as OrderStatus, updatedAt: new Date() } : o));
    addAuditLog({ user: cancelledBy, role, action: 'Cancelled order', details: orderId, status: 'info' });
  }, [addAuditLog]);

  const addReservation = useCallback((res: Reservation) => {
    setReservations(prev => [res, ...prev]);
    addAuditLog({ user: 'Customer', role: 'customer', action: 'Made reservation', details: `${res.date} ${res.time} — ${res.guests} guests`, status: 'success' });
  }, [addAuditLog]);

  const cancelReservationFn = useCallback((id: string) => {
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status: 'cancelled' as const } : r));
    addAuditLog({ user: 'Customer', role: 'customer', action: 'Cancelled reservation', details: id, status: 'info' });
  }, [addAuditLog]);

  const addFeedback = useCallback((fb: Feedback) => {
    setFeedbacks(prev => [...prev, fb]);
    addAuditLog({ user: 'Customer', role: 'customer', action: 'Submitted feedback', details: `Order ${fb.orderId} — ${fb.rating}★`, status: 'success' });
  }, [addAuditLog]);

  const registerStaff = useCallback((employeeId: string, pin: string, role: UserRole, name: string): boolean => {
    const exists = staffCredentials.find(c => c.employeeId === employeeId);
    if (exists) return false;
    setStaffCredentials(prev => [...prev, { employeeId, pin, role, name }]);
    addAuditLog({ user: name, role, action: 'Staff registered', details: `Employee ID: ${employeeId}, Role: ${role}`, status: 'success' });
    return true;
  }, [staffCredentials, addAuditLog]);

  const authenticateStaff = useCallback((employeeId: string, pin: string, role: UserRole): { success: boolean; name: string } => {
    const cred = staffCredentials.find(c => c.role === role && c.employeeId === employeeId && c.pin === pin);
    if (cred) {
      addAuditLog({ user: cred.name, role, action: 'PIN login successful', details: `Employee ID: ${employeeId}, Role: ${role}`, status: 'success' });
      return { success: true, name: cred.name };
    }
    addAuditLog({ user: employeeId, role, action: 'PIN login failed', details: `Employee ID: ${employeeId}, Attempted role: ${role}`, status: 'failure' });
    return { success: false, name: '' };
  }, [staffCredentials, addAuditLog]);

  return (
    <RMSContext.Provider value={{
      orders, addOrder, updateOrderStatus, cancelOrder,
      reservations, addReservation, cancelReservation: cancelReservationFn,
      feedbacks, addFeedback,
      auditLogs, addAuditLog,
      staffCredentials, registerStaff, authenticateStaff,
      tableStatuses,
    }}>
      {children}
    </RMSContext.Provider>
  );
}

export function useRMS() {
  const ctx = useContext(RMSContext);
  if (!ctx) throw new Error('useRMS must be used within RMSProvider');
  return ctx;
}
