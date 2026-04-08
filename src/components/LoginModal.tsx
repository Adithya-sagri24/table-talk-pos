import { useState } from 'react';
import { UserRole } from '@/lib/types';
import { useRMS } from '@/contexts/RMSContext';
import { X, LogIn, AlertCircle, UserPlus } from 'lucide-react';

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
  const { authenticateStaff, registerStaff } = useRMS();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const resetForm = () => {
    setUsername('');
    setPassword('');
    setName('');
    setConfirmPassword('');
    setError('');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const result = authenticateStaff(username, password, targetRole);
    if (result.success) {
      onSuccess();
    } else {
      setError('Invalid username or password');
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim() || !username.trim() || !password.trim()) {
      setError('All fields are required');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    const success = registerStaff(username, password, targetRole, name);
    if (success) {
      onSuccess();
    } else {
      setError('Username already exists');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm">
      <div className="bg-card rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-primary/5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              {mode === 'login' ? <LogIn className="h-5 w-5 text-primary-foreground" /> : <UserPlus className="h-5 w-5 text-primary-foreground" />}
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{mode === 'login' ? 'Role Login' : 'Staff Registration'}</h3>
              <p className="text-xs text-muted-foreground">{mode === 'login' ? 'Authenticate' : 'Register'} as {roleLabels[targetRole]}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted transition-colors">
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          <button
            onClick={() => { setMode('login'); resetForm(); }}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${mode === 'login' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setMode('signup'); resetForm(); }}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${mode === 'signup' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={mode === 'login' ? handleLogin : handleSignup} className="p-6 space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter full name"
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
              />
            </div>
          )}

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

          {mode === 'signup' && (
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
              />
            </div>
          )}

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
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
