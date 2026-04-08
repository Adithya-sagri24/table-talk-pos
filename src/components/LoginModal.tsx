import { useState } from 'react';
import { UserRole } from '@/lib/types';
import { roleCredentials } from '@/lib/mock-data';
import { X, LogIn, AlertCircle } from 'lucide-react';

interface LoginModalProps {
  targetRole: UserRole;
  onSuccess: () => void;
  onClose: () => void;
}

const roleLabels: Record<UserRole, string> = {
  waiter: 'Waiter',
  chef: 'Chef',
  billing: 'Billing',
  manager: 'Manager',
  admin: 'Admin',
  customer: 'Customer',
};

export function LoginModal({ targetRole, onSuccess, onClose }: LoginModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cred = roleCredentials.find(
      c => c.role === targetRole && c.username === username && c.password === password
    );

    if (cred) {
      onSuccess();
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm">
      <div className="bg-card rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-primary/5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <LogIn className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Role Login</h3>
              <p className="text-xs text-muted-foreground">Authenticate as {roleLabels[targetRole]}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted transition-colors">
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
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
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Role</label>
            <div className="w-full px-4 py-2.5 rounded-lg border border-border bg-muted text-sm text-muted-foreground">
              {roleLabels[targetRole]}
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 px-3 py-2 rounded-lg">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors btn-press"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
