import { Order, Table, MenuItem, StaffMember, DailyMetrics, InventoryItem } from './types';

export const menuItems: MenuItem[] = [
  { id: 'm1', name: 'Margherita Pizza', category: 'Pizza', price: 12.99, available: true },
  { id: 'm2', name: 'Caesar Salad', category: 'Salad', price: 8.99, available: true },
  { id: 'm3', name: 'Grilled Salmon', category: 'Main', price: 22.99, available: true },
  { id: 'm4', name: 'Mushroom Risotto', category: 'Main', price: 16.99, available: true },
  { id: 'm5', name: 'Tiramisu', category: 'Dessert', price: 7.99, available: true },
  { id: 'm6', name: 'Bruschetta', category: 'Starter', price: 6.99, available: true },
  { id: 'm7', name: 'Penne Arrabbiata', category: 'Pasta', price: 13.99, available: true },
  { id: 'm8', name: 'Garlic Bread', category: 'Starter', price: 4.99, available: true },
  { id: 'm9', name: 'Chicken Parmesan', category: 'Main', price: 18.99, available: false },
  { id: 'm10', name: 'Espresso', category: 'Beverage', price: 3.99, available: true },
];

export const tables: Table[] = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  seats: [2, 4, 4, 6, 2, 4, 8, 4, 2, 6, 4, 2][i],
  status: (['occupied', 'available', 'occupied', 'available', 'reserved', 'occupied', 'available', 'cleaning', 'available', 'occupied', 'available', 'reserved'] as const)[i],
  currentOrderId: [1, 3, 6, 10].includes(i + 1) ? `ORD-${String(100 + i).padStart(3, '0')}` : undefined,
  waiter: [1, 3, 6, 10].includes(i + 1) ? ['Alex', 'Sam', 'Alex', 'Jordan'][([1, 3, 6, 10].indexOf(i + 1))] : undefined,
}));

export const orders: Order[] = [
  {
    id: 'ORD-100', tableNumber: 1, status: 'preparing',
    items: [
      { menuItem: menuItems[0], quantity: 2 },
      { menuItem: menuItems[1], quantity: 1 },
    ],
    createdAt: new Date(Date.now() - 15 * 60000), updatedAt: new Date(Date.now() - 5 * 60000),
    waiterName: 'Alex', total: 34.97,
  },
  {
    id: 'ORD-101', tableNumber: 3, status: 'pending',
    items: [
      { menuItem: menuItems[2], quantity: 1 },
      { menuItem: menuItems[4], quantity: 2 },
    ],
    createdAt: new Date(Date.now() - 3 * 60000), updatedAt: new Date(Date.now() - 3 * 60000),
    waiterName: 'Sam', total: 38.97, statusChanged: true,
  },
  {
    id: 'ORD-102', tableNumber: 6, status: 'ready',
    items: [
      { menuItem: menuItems[3], quantity: 1 },
      { menuItem: menuItems[5], quantity: 1 },
      { menuItem: menuItems[9], quantity: 2 },
    ],
    createdAt: new Date(Date.now() - 25 * 60000), updatedAt: new Date(Date.now() - 1 * 60000),
    waiterName: 'Alex', total: 31.96, statusChanged: true,
  },
  {
    id: 'ORD-103', tableNumber: 10, status: 'preparing',
    items: [
      { menuItem: menuItems[6], quantity: 2 },
      { menuItem: menuItems[7], quantity: 1 },
    ],
    createdAt: new Date(Date.now() - 10 * 60000), updatedAt: new Date(Date.now() - 7 * 60000),
    waiterName: 'Jordan', total: 32.97,
  },
  {
    id: 'ORD-104', tableNumber: 5, status: 'served',
    items: [
      { menuItem: menuItems[0], quantity: 1 },
      { menuItem: menuItems[9], quantity: 1 },
    ],
    createdAt: new Date(Date.now() - 45 * 60000), updatedAt: new Date(Date.now() - 30 * 60000),
    waiterName: 'Sam', total: 16.98,
  },
  {
    id: 'ORD-105', tableNumber: 2, status: 'cancelled',
    items: [
      { menuItem: menuItems[8], quantity: 1 },
    ],
    createdAt: new Date(Date.now() - 20 * 60000), updatedAt: new Date(Date.now() - 18 * 60000),
    waiterName: 'Alex', total: 18.99,
  },
];

export const staff: StaffMember[] = [
  { id: 's1', name: 'Alex Rivera', role: 'waiter', email: 'alex@rms.com', active: true },
  { id: 's2', name: 'Sam Chen', role: 'waiter', email: 'sam@rms.com', active: true },
  { id: 's3', name: 'Jordan Lee', role: 'waiter', email: 'jordan@rms.com', active: true },
  { id: 's4', name: 'Chef Marco', role: 'chef', email: 'marco@rms.com', active: true },
  { id: 's5', name: 'Chef Nina', role: 'chef', email: 'nina@rms.com', active: true },
  { id: 's6', name: 'Pat Kumar', role: 'billing', email: 'pat@rms.com', active: true },
  { id: 's7', name: 'Morgan Swift', role: 'manager', email: 'morgan@rms.com', active: true },
  { id: 's8', name: 'Admin Root', role: 'admin', email: 'admin@rms.com', active: true },
];

export const dailyMetrics: DailyMetrics = {
  totalRevenue: 4856.50,
  ordersCompleted: 47,
  pendingOrders: 3,
  inProgressOrders: 5,
  availableTables: 5,
  totalTables: 12,
  avgOrderTime: 18,
};

export const inventory: InventoryItem[] = [
  { id: 'inv1', name: 'Flour', quantity: 5, unit: 'kg', lowThreshold: 10, isLow: true },
  { id: 'inv2', name: 'Olive Oil', quantity: 8, unit: 'liters', lowThreshold: 5, isLow: false },
  { id: 'inv3', name: 'Mozzarella', quantity: 3, unit: 'kg', lowThreshold: 5, isLow: true },
  { id: 'inv4', name: 'Tomatoes', quantity: 15, unit: 'kg', lowThreshold: 10, isLow: false },
  { id: 'inv5', name: 'Salmon Fillet', quantity: 2, unit: 'kg', lowThreshold: 4, isLow: true },
  { id: 'inv6', name: 'Basil', quantity: 12, unit: 'bunches', lowThreshold: 5, isLow: false },
  { id: 'inv7', name: 'Arborio Rice', quantity: 7, unit: 'kg', lowThreshold: 3, isLow: false },
  { id: 'inv8', name: 'Heavy Cream', quantity: 4, unit: 'liters', lowThreshold: 5, isLow: true },
];

export const revenueData = [
  { day: 'Mon', revenue: 3200 },
  { day: 'Tue', revenue: 4100 },
  { day: 'Wed', revenue: 3800 },
  { day: 'Thu', revenue: 4500 },
  { day: 'Fri', revenue: 5800 },
  { day: 'Sat', revenue: 6200 },
  { day: 'Sun', revenue: 4856 },
];

export const popularDishes = [
  { name: 'Margherita Pizza', orders: 42 },
  { name: 'Grilled Salmon', orders: 35 },
  { name: 'Mushroom Risotto', orders: 28 },
  { name: 'Caesar Salad', orders: 24 },
  { name: 'Penne Arrabbiata', orders: 19 },
];
