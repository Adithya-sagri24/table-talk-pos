import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCustomer } from '@/contexts/CustomerContext';
import { LogIn, UserPlus, AlertCircle, UtensilsCrossed, ArrowLeft } from 'lucide-react';

export default function CustomerAuth() {
  const navigate = useNavigate();
  const { login, signup } = useCustomer();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (isSignup) {
      if (!name || !email || !phone || !password) { setError('All fields are required'); return; }
      const ok = signup(name, email, phone, password);
      if (!ok) setError('Email already registered');
    } else {
      if (!email || !password) { setError('Email and password are required'); return; }
      const ok = login(email, password);
      if (!ok) setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <button onClick={() => navigate('/')} className="absolute top-6 left-6 text-sm text-muted-foreground hover:text-foreground transition-colors flex-row flex items-center justify-start gap-[10px] border-none shadow-md rounded-lg">
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </button>
      <div className="bg-card rounded-xl shadow-lg w-full max-w-md overflow-hidden">
        <div className="bg-primary/5 px-6 py-8 text-center border-b border-border">
          <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
            <UtensilsCrossed className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Welcome to RMS</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isSignup ? 'Create your account to get started' : 'Sign in to browse our menu & order'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {isSignup && (
            <>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Full Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Phone</label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="555-0101"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
              </div>
            </>
          )}
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="john@example.com"
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" autoFocus />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 px-3 py-2 rounded-lg">
              <AlertCircle className="h-4 w-4 shrink-0" />{error}
            </div>
          )}

          <button type="submit" className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors btn-press flex items-center justify-center gap-2">
            {isSignup ? <><UserPlus className="h-4 w-4" /> Create Account</> : <><LogIn className="h-4 w-4" /> Sign In</>}
          </button>

          <p className="text-center text-sm text-muted-foreground">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button type="button" onClick={() => { setIsSignup(!isSignup); setError(''); }} className="text-primary font-medium hover:underline">
              {isSignup ? 'Sign In' : 'Sign Up'}
            </button>
          </p>

          {!isSignup && (
            <div className="mt-4 p-3 rounded-lg bg-muted/50 border border-border">
              <p className="text-xs text-muted-foreground font-medium mb-1">Demo credentials:</p>
              <p className="text-xs text-muted-foreground">Email: john@example.com · Password: customer123</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
