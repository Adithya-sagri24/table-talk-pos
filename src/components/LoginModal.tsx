import { useState, useRef, useEffect } from 'react';
import { UserRole } from '@/lib/types';
import { useRMS } from '@/contexts/RMSContext';
import { X, ShieldCheck, AlertCircle, Hash } from 'lucide-react';

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

const roleEmoji: Record<UserRole, string> = {
  waiter: '🍽️',
  chef: '👨‍🍳',
  billing: '💳',
  manager: '📊',
  admin: '🔐',
  customer: '👤',
};

export function LoginModal({ targetRole, onSuccess, onClose }: LoginModalProps) {
  const { authenticateStaff, staffCredentials } = useRMS();
  const [employeeId, setEmployeeId] = useState('');
  const [pin, setPin] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [showProfiles, setShowProfiles] = useState(true);
  const pinRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  const staffForRole = staffCredentials.filter(c => c.role === targetRole);

  const handlePinChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newPin = [...pin];
    newPin[index] = value.slice(-1);
    setPin(newPin);
    setError('');

    if (value && index < 3) {
      pinRefs[index + 1].current?.focus();
    }

    // Auto-submit when all 4 digits entered
    if (index === 3 && value) {
      const fullPin = [...newPin.slice(0, 3), value.slice(-1)].join('');
      if (fullPin.length === 4 && employeeId) {
        const result = authenticateStaff(employeeId, fullPin, targetRole);
        if (result.success) {
          onSuccess();
        } else {
          setError('Invalid PIN');
          setPin(['', '', '', '']);
          setTimeout(() => pinRefs[0].current?.focus(), 100);
        }
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      pinRefs[index - 1].current?.focus();
    }
  };

  const selectProfile = (empId: string) => {
    setEmployeeId(empId);
    setShowProfiles(false);
    setPin(['', '', '', '']);
    setError('');
    setTimeout(() => pinRefs[0].current?.focus(), 100);
  };

  const handleManualId = () => {
    if (!employeeId.trim()) {
      setError('Enter an Employee ID');
      return;
    }
    setShowProfiles(false);
    setPin(['', '', '', '']);
    setError('');
    setTimeout(() => pinRefs[0].current?.focus(), 100);
  };

  // Demo hint
  const demoCredential = staffForRole[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm">
      <div className="bg-card rounded-xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-primary/5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center text-xl">
              {roleEmoji[targetRole]}
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{roleLabels[targetRole]} Login</h3>
              <p className="text-xs text-muted-foreground">Enter your PIN to continue</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted transition-colors">
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        <div className="p-6">
          {showProfiles ? (
            <div className="space-y-4">
              {/* Staff profiles for quick select */}
              {staffForRole.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Select your profile</p>
                  {staffForRole.map(s => (
                    <button
                      key={s.employeeId}
                      onClick={() => selectProfile(s.employeeId)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all text-left"
                    >
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">{s.name.charAt(0)}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{s.name}</p>
                        <p className="text-xs font-mono text-muted-foreground">{s.employeeId}</p>
                      </div>
                      <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              )}

              {/* Manual ID entry */}
              <div className="pt-2 border-t border-border space-y-3">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Or enter Employee ID</p>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={employeeId}
                      onChange={e => { setEmployeeId(e.target.value.toUpperCase()); setError(''); }}
                      placeholder="EMP001"
                      className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                      autoFocus
                    />
                  </div>
                  <button onClick={handleManualId} className="px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors btn-press">
                    Next
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 px-3 py-2 rounded-lg">
                  <AlertCircle className="h-4 w-4 shrink-0" />{error}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-5">
              {/* Selected profile */}
              <button
                onClick={() => { setShowProfiles(true); setError(''); }}
                className="w-full flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20 text-left"
              >
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">{employeeId.charAt(0)}</span>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Employee ID</p>
                  <p className="text-sm font-mono font-medium text-foreground">{employeeId}</p>
                </div>
                <span className="text-xs text-primary font-medium">Change</span>
              </button>

              {/* PIN input */}
              <div className="text-center space-y-3">
                <p className="text-sm font-medium text-foreground">Enter your 4-digit PIN</p>
                <div className="flex justify-center gap-3">
                  {pin.map((digit, i) => (
                    <input
                      key={i}
                      ref={pinRefs[i]}
                      type="password"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={e => handlePinChange(i, e.target.value)}
                      onKeyDown={e => handleKeyDown(i, e)}
                      className="w-12 h-14 text-center text-xl font-bold rounded-xl border-2 border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    />
                  ))}
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 px-3 py-2 rounded-lg justify-center">
                  <AlertCircle className="h-4 w-4 shrink-0" />{error}
                </div>
              )}

              {/* Demo hint */}
              {demoCredential && (
                <div className="p-3 rounded-lg bg-muted/50 border border-border">
                  <p className="text-xs text-muted-foreground font-medium mb-1">Demo credentials:</p>
                  <p className="text-xs text-muted-foreground font-mono">
                    ID: {demoCredential.employeeId} · PIN: {demoCredential.pin}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
