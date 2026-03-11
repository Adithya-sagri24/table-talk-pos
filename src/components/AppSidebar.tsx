import { useRole } from '@/contexts/RoleContext';
import { UserRole } from '@/lib/types';
import { useLocation, useNavigate } from 'react-router-dom';
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
  LogOut,
} from 'lucide-react';

const roleConfig: Record<UserRole, { label: string; icon: typeof LayoutDashboard; routes: { path: string; label: string; icon: typeof LayoutDashboard }[] }> = {
  waiter: {
    label: 'WAITER',
    icon: UtensilsCrossed,
    routes: [
      { path: '/waiter', label: 'Tables', icon: Grid3X3 },
      { path: '/waiter/orders', label: 'Orders', icon: ClipboardList },
    ],
  },
  chef: {
    label: 'KITCHEN',
    icon: ChefHat,
    routes: [
      { path: '/chef', label: 'Orders', icon: ClipboardList },
    ],
  },
  billing: {
    label: 'BILLING',
    icon: Receipt,
    routes: [
      { path: '/billing', label: 'Bills', icon: Receipt },
    ],
  },
  manager: {
    label: 'MANAGER',
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
    label: 'ADMIN',
    icon: Shield,
    routes: [
      { path: '/admin', label: 'Users', icon: Users },
      { path: '/admin/config', label: 'Config', icon: Settings },
      { path: '/admin/logs', label: 'Audit Logs', icon: ClipboardList },
    ],
  },
  customer: {
    label: 'GUEST',
    icon: Users,
    routes: [
      { path: '/customer', label: 'Menu', icon: UtensilsCrossed },
    ],
  },
};

const allRoles: UserRole[] = ['waiter', 'chef', 'billing', 'manager', 'admin'];

export function AppSidebar() {
  const { role, setRole } = useRole();
  const location = useLocation();
  const navigate = useNavigate();
  const config = roleConfig[role];

  const handleRoleSwitch = (newRole: UserRole) => {
    setRole(newRole);
    navigate(roleConfig[newRole].routes[0].path);
  };

  return (
    <aside className="w-56 min-h-screen bg-sidebar border-r border-sidebar-border flex flex-col shrink-0">
      {/* Logo */}
      <div className="p-4 border-b border-sidebar-border">
        <h1 className="font-mono text-sm font-bold tracking-widest text-sidebar-foreground">
          RMS
        </h1>
        <p className="font-mono text-[10px] text-muted-foreground mt-0.5 tracking-wider">
          RESTAURANT MGMT
        </p>
      </div>

      {/* Role Badge */}
      <div className="px-3 py-3 border-b border-sidebar-border">
        <div className="font-mono text-[10px] text-muted-foreground tracking-wider mb-2">STATION</div>
        <div className="flex items-center gap-2 px-2 py-1.5 bg-primary/10 rounded-sm">
          <config.icon className="h-3.5 w-3.5 text-primary" />
          <span className="font-mono text-xs font-semibold text-primary">{config.label}</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-2">
        <div className="px-3 mb-2">
          <span className="font-mono text-[10px] text-muted-foreground tracking-wider">NAVIGATION</span>
        </div>
        {config.routes.map((route) => {
          const isActive = location.pathname === route.path;
          return (
            <button
              key={route.path}
              onClick={() => navigate(route.path)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent'
              }`}
            >
              <route.icon className="h-4 w-4 shrink-0" />
              <span className="font-body text-sm">{route.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Role Switcher */}
      <div className="border-t border-sidebar-border p-3">
        <div className="font-mono text-[10px] text-muted-foreground tracking-wider mb-2">SWITCH ROLE</div>
        <div className="space-y-0.5">
          {allRoles.map((r) => {
            const Icon = roleConfig[r].icon;
            return (
              <button
                key={r}
                onClick={() => handleRoleSwitch(r)}
                className={`w-full flex items-center gap-2 px-2 py-1.5 text-left rounded-sm transition-colors text-xs ${
                  r === role
                    ? 'text-primary font-medium'
                    : 'text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent'
                }`}
              >
                <Icon className="h-3 w-3" />
                <span className="font-body">{roleConfig[r].label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
