import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useCustomer } from '@/contexts/CustomerContext';
import CustomerAuth from './CustomerAuth';
import CustomerMenu from './CustomerMenu';
import CustomerCart from './CustomerCart';
import CustomerOrders from './CustomerOrders';
import CustomerReservations from './CustomerReservations';
import CustomerFeedback from './CustomerFeedback';
import CustomerProfile from './CustomerProfile';
import { UtensilsCrossed, ShoppingCart, ClipboardList, CalendarDays, Star, User, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { path: '/customer/menu', label: 'Menu', icon: UtensilsCrossed },
  { path: '/customer/cart', label: 'Cart', icon: ShoppingCart },
  { path: '/customer/orders', label: 'Orders', icon: ClipboardList },
  { path: '/customer/reservations', label: 'Reservations', icon: CalendarDays },
  { path: '/customer/feedback', label: 'Feedback', icon: Star },
  { path: '/customer/profile', label: 'Profile', icon: User },
];

function CustomerLayout({ children }: { children: React.ReactNode }) {
  const { customer, logout, cart } = useCustomer();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileNav, setMobileNav] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top nav */}
      <header className="bg-card border-b border-border sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button className="md:hidden p-2 rounded-lg hover:bg-muted" onClick={() => setMobileNav(!mobileNav)}>
              {mobileNav ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <UtensilsCrossed className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">PlateSync</span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => {
              const isActive = location.pathname === item.path;
              return (
                <button key={item.path} onClick={() => navigate(item.path)}
                  className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}>
                  {item.label}
                  {item.label === 'Cart' && cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] text-primary-foreground flex items-center justify-center font-bold">
                      {cart.length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:block">Hi, {customer?.name?.split(' ')[0]}</span>
            <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground" title="Logout">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileNav && (
          <nav className="md:hidden border-t border-border px-4 py-2 space-y-1">
            {navItems.map(item => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <button key={item.path} onClick={() => { navigate(item.path); setMobileNav(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}>
                  <Icon className="h-4 w-4" /> {item.label}
                </button>
              );
            })}
          </nav>
        )}
      </header>

      <main>{children}</main>
    </div>
  );
}

export default function CustomerDashboard() {
  const { isLoggedIn } = useCustomer();

  if (!isLoggedIn) {
    return <CustomerAuth />;
  }

  return (
    <CustomerLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/customer/menu" replace />} />
        <Route path="/menu" element={<CustomerMenu />} />
        <Route path="/cart" element={<CustomerCart />} />
        <Route path="/orders" element={<CustomerOrders />} />
        <Route path="/reservations" element={<CustomerReservations />} />
        <Route path="/feedback" element={<CustomerFeedback />} />
        <Route path="/profile" element={<CustomerProfile />} />
      </Routes>
    </CustomerLayout>
  );
}
