export type UserRole = 'waiter' | 'chef' | 'billing' | 'manager' | 'admin' | 'customer';

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'served' | 'cancelled';
export type TableStatus = 'available' | 'occupied' | 'reserved' | 'cleaning';
export type PaymentMethod = 'cash' | 'card' | 'upi' | 'online';

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  available: boolean;
  image?: string;
}

export interface OrderItem {
  menuItem: MenuItem;
  quantity: number;
  notes?: string;
}

export interface Order {
  id: string;
  tableNumber: number;
  items: OrderItem[];
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  waiterName: string;
  total: number;
  statusChanged?: boolean;
  orderType?: 'dine-in' | 'takeaway';
}

export interface Table {
  id: number;
  seats: number;
  status: TableStatus;
  currentOrderId?: string;
  waiter?: string;
}

export interface StaffMember {
  id: string;
  employeeId: string;
  name: string;
  role: UserRole;
  email: string;
  pin: string;
  active: boolean;
}

export interface DailyMetrics {
  totalRevenue: number;
  ordersCompleted: number;
  pendingOrders: number;
  inProgressOrders: number;
  availableTables: number;
  totalTables: number;
  avgOrderTime: number;
  totalCustomers: number;
  avgOrderValue: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  lowThreshold: number;
  isLow: boolean;
}

export interface Promotion {
  id: string;
  code: string;
  discount: string;
  type: 'percentage' | 'fixed';
  active: boolean;
  uses: number;
}

export interface RoleCredentials {
  employeeId: string;
  pin: string;
  role: UserRole;
  name: string;
}
