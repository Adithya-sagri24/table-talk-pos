import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '@/contexts/RoleContext';
import { UserRole } from '@/lib/types';
import { roleCredentials } from '@/lib/mock-data';
import { UtensilsCrossed, LogIn, AlertCircle, ArrowLeft } from 'lucide-react';

const staffRoles: { value: UserRole; label: string }[] = [
  { value: 'waiter', label: 'Waiter' },
  { value: 'chef', label: 'Chef' },
  { value: 'billing', label: 'Billing' },
  { value: 'manager', label: 'Manager' },
  { value: 'admin', label: 'Admin' },
];

const roleRoutes: Record<string, string> = {
  waiter: '/waiter',
  chef: '/chef',
  billing: '/billing',
  manager: '/manager',
  admin: '/admin',
};

export default function StaffLogin() {
  const navigate = useNavigate();
  const { setRole } = useRole();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('manager');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cred = roleCredentials.find(
      (c) => c.role === selectedRole && c.username === username && c.password === password
    );

    if (cred) {
      setRole(selectedRole);
      navigate(roleRoutes[selectedRole]);
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Back */}
        <button
          onClick={() => navigate('/')}
          className="text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors flex-row gap-[10px] flex items-center justify-start rounded-lg shadow-md"
        >
          <ArrowLeft className="h-4 w-4" /> Back to home
        </button>

        <div className="bg-card rounded-2xl border border-border shadow-xl overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-8 pb-6 text-center border-b border-border">
            <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
              <UtensilsCrossed className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-foreground">Staff Login</h1>
            <p className="text-sm text-muted-foreground mt-1">Sign in to access your dashboard</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Role</label>
              <div className="grid grid-cols-5 gap-1.5">
                {staffRoles.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setSelectedRole(r.value)}
                    className={`py-2 rounded-lg text-xs font-medium transition-all ${
                      selectedRole === r.value
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                autoFocus
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 px-4 py-2.5 rounded-xl">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
            >
              <LogIn className="h-4 w-4" /> Sign In
            </button>

            <p className="text-xs text-muted-foreground text-center pt-2">
              Demo: use role name as username (e.g. <span className="font-mono text-foreground">manager</span> / <span className="font-mono text-foreground">manager123</span>)
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
