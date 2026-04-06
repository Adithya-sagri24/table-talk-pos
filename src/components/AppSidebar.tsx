import { useState } from 'react';
import { useRole } from '@/contexts/RoleContext';
import { UserRole } from '@/lib/types';
import { useLocation, useNavigate } from 'react-router-dom';
import { LoginModal } from './LoginModal';
import {
  LayoutDashboard,
  UtensilsCrossed,
  ChefHat,
  Receipt,
  BarChart3,
  Shield,
  Users,
  ClipboardList,
  Settings,
  Package,
  Tag,
  Grid3X3,
  Menu,
  X,
  ShoppingCart,
  CalendarDays,
  Star,
  History,
  MessageSquare,
} from 'lucide-react';

const roleConfig: Record<UserRole, { label: string; icon: typeof LayoutDashboard; routes: { path: string; label: string; icon: typeof LayoutDashboard }[] }> = {
  waiter: {
    label: 'Waiter',
    icon: UtensilsCrossed,
    routes: [
      { path: '/waiter', label: 'Tables', icon: Grid3X3 },
      { path: '/waiter/orders', label: 'Orders', icon: ClipboardList },
    ],
  },
  chef: {
    label: 'Kitchen',
    icon: ChefHat,
    routes: [
      { path: '/chef', label: 'Orders', icon: ClipboardList },
    ],
  },
  billing: {
    label: 'Billing',
    icon: Receipt,
    routes: [
      { path: '/billing', label: 'Bills', icon: Receipt },
    ],
  },
  manager: {
    label: 'Manager',
    icon: BarChart3,
    routes: [
      { path: '/manager', label: 'Overview', icon: LayoutDashboard },
      { path: '/manager/orders', label: 'Orders', icon: ClipboardList },
      { path: '/manager/menu', label: 'Menu', icon: UtensilsCrossed },
      { path: '/manager/tables', label: 'Tables', icon: Grid3X3 },
      { path: '/manager/inventory', label: 'Inventory', icon: Package },
      { path: '/manager/staff', label: 'Staff', icon: Users },
      { path: '/manager/analytics', label: 'Analytics', icon: BarChart3 },
      { path: '/manager/promos', label: 'Promos', icon: Tag },
    ],
  },
  admin: {
    label: 'Admin',
    icon: Shield,
    routes: [
      { path: '/admin', label: 'Users', icon: Users },
      { path: '/admin/config', label: 'Config', icon: Settings },
      { path: '/admin/logs', label: 'Audit Logs', icon: ClipboardList },
    ],
  },
  customer: {
    label: 'Customer',
    icon: Users,
    routes: [
      { path: '/customer/menu', label: 'Menu', icon: UtensilsCrossed },
      { path: '/customer/cart', label: 'Cart', icon: ShoppingCart },
      { path: '/customer/orders', label: 'Orders', icon: ClipboardList },
      { path: '/customer/reservations', label: 'Reservations', icon: CalendarDays },
      { path: '/customer/feedback', label: 'Feedback', icon: Star },
    ],
  },
};

const allRoles: UserRole[] = ['waiter', 'chef', 'billing', 'manager', 'admin', 'customer'];

export function AppSidebar() {
  const { role, setRole } = useRole();
  const location = useLocation();
  const navigate = useNavigate();
  const config = roleConfig[role];
  const [loginTarget, setLoginTarget] = useState<UserRole | null>(null);
  const [collapsed, setCollapsed] = useState(false);

  const handleRoleSwitch = (newRole: UserRole) => {
    if (newRole === role) return;
    if (newRole === 'customer') {
      // Customer has its own auth — just navigate
      setRole(newRole);
      navigate('/customer/menu');
      return;
    }
    setLoginTarget(newRole);
  };

  const handleLoginSuccess = () => {
    if (loginTarget) {
      setRole(loginTarget);
      navigate(roleConfig[loginTarget].routes[0].path);
      setLoginTarget(null);
    }
  };

  return (
    <>
      <aside className={`${collapsed ? 'w-16' : 'w-60'} min-h-screen bg-card border-r border-border flex flex-col shrink-0 transition-all duration-300`}>
        {/* Logo */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          {!collapsed && (
            <div>
              <h1 className="text-lg font-bold text-foreground tracking-tight">🍽️ RMS</h1>
              <p className="text-[10px] text-muted-foreground mt-0.5">Restaurant Management</p>
            </div>
          )}
          <button onClick={() => setCollapsed(!collapsed)} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
            {collapsed ? <Menu className="h-4 w-4 text-muted-foreground" /> : <X className="h-4 w-4 text-muted-foreground" />}
          </button>
        </div>

        {/* Role Badge */}
        {!collapsed && (
          <div className="px-3 py-3 border-b border-border">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2 font-medium">Station</p>
            <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-lg">
              <config.icon className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-primary">{config.label}</span>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 py-3">
          {!collapsed && (
            <p className="px-4 mb-2 text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Navigation</p>
          )}
          {config.routes.map((route) => {
            const isActive = location.pathname === route.path;
            return (
              <button
                key={route.path}
                onClick={() => navigate(route.path)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all ${
                  isActive
                    ? 'bg-primary text-primary-foreground rounded-lg mx-2 w-[calc(100%-16px)]'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted mx-2 w-[calc(100%-16px)] rounded-lg'
                }`}
              >
                <route.icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span className="text-sm font-medium">{route.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Role Switcher */}
        <div className="border-t border-border p-3">
          {!collapsed && (
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2 font-medium">Switch Role</p>
          )}
          <div className="space-y-0.5">
            {allRoles.map((r) => {
              const Icon = roleConfig[r].icon;
              return (
                <button
                  key={r}
                  onClick={() => handleRoleSwitch(r)}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-left rounded-lg transition-all text-sm ${
                    r === role
                      ? 'text-primary font-medium bg-primary/5'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {!collapsed && <span>{roleConfig[r].label}</span>}
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      {loginTarget && (
        <LoginModal
          targetRole={loginTarget}
          onSuccess={handleLoginSuccess}
          onClose={() => setLoginTarget(null)}
        />
      )}
    </>
  );
}
