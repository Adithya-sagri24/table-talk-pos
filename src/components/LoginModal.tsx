import { useState, useRef } from 'react';
import { UserRole } from '@/lib/types';
import { useRMS } from '@/contexts/RMSContext';
import { X, LogIn, AlertCircle, Hash } from 'lucide-react';

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
  const { authenticateStaff, staffCredentials } = useRMS();
  const [mode, setMode] = useState<'select' | 'pin'>('select');
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [employeeId, setEmployeeId] = useState('');
  const [pin, setPin] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const pinRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  const staffForRole = staffCredentials.filter(c => c.role === targetRole);

  const handleSelectProfile = (empId: string) => {
    setSelectedEmployee(empId);
    setEmployeeId(empId);
    setPin(['', '', '', '']);
    setError('');
    setMode('pin');
    setTimeout(() => pinRefs[0].current?.focus(), 100);
  };

  const handleManualEntry = () => {
    setSelectedEmployee('');
    setEmployeeId('');
    setPin(['', '', '', '']);
    setError('');
    setMode('pin');
  };

  const handlePinChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newPin = [...pin];
    newPin[index] = value.slice(-1);
    setPin(newPin);

    if (value && index < 3) {
      pinRefs[index + 1].current?.focus();
    }

    // Auto-submit when all 4 digits entered
    if (value && index === 3) {
      const fullPin = [...newPin.slice(0, 3), value.slice(-1)].join('');
      if (fullPin.length === 4) {
        const eid = employeeId || selectedEmployee;
        submitLogin(eid, fullPin);
      }
    }
  };

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      pinRefs[index - 1].current?.focus();
    }
  };

  const submitLogin = (eid: string, fullPin: string) => {
    setError('');
    if (!eid.trim()) {
      setError('Please enter your Employee ID');
      return;
    }
    const result = authenticateStaff(eid, fullPin, targetRole);
    if (result.success) {
      onSuccess();
    } else {
      setError('Invalid Employee ID or PIN');
      setPin(['', '', '', '']);
      setTimeout(() => pinRefs[0].current?.focus(), 100);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullPin = pin.join('');
    const eid = employeeId || selectedEmployee;
    submitLogin(eid, fullPin);
  };

  const selectedStaff = staffForRole.find(s => s.employeeId === (employeeId || selectedEmployee));

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
              <h3 className="font-semibold text-foreground">Staff Login</h3>
              <p className="text-xs text-muted-foreground">Sign in as {roleLabels[targetRole]}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted transition-colors">
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        {mode === 'select' ? (
          <div className="p-6 space-y-4">
            <p className="text-sm font-medium text-foreground">Select your profile</p>
            <div className="space-y-2">
              {staffForRole.map(s => (
                <button
                  key={s.employeeId}
                  onClick={() => handleSelectProfile(s.employeeId)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all text-left"
                >
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-primary">{s.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{s.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">{s.employeeId}</p>
                  </div>
                  <Hash className="h-4 w-4 text-muted-foreground" />
                </button>
              ))}
            </div>
            <div className="pt-2 border-t border-border">
              <button
                onClick={handleManualEntry}
                className="w-full text-center text-sm text-primary hover:text-primary/80 font-medium py-2 transition-colors"
              >
                Enter Employee ID manually
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Back button */}
            <button
              type="button"
              onClick={() => setMode('select')}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to profiles
            </button>

            {/* Selected profile or manual entry */}
            {selectedStaff ? (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/20">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">{selectedStaff.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{selectedStaff.name}</p>
                  <p className="text-xs text-muted-foreground font-mono">{selectedStaff.employeeId}</p>
                </div>
              </div>
            ) : (
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Employee ID</label>
                <input
                  type="text"
                  value={employeeId}
                  onChange={e => setEmployeeId(e.target.value.toUpperCase())}
                  placeholder="e.g. EMP001"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                  autoFocus
                />
              </div>
            )}

            {/* Role display */}
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Role</label>
              <div className="w-full px-4 py-2.5 rounded-lg border border-border bg-muted text-sm text-muted-foreground">
                {roleLabels[targetRole]}
              </div>
            </div>

            {/* PIN Input */}
            <div>
              <label className="text-sm font-medium text-foreground block mb-3">Enter 4-digit PIN</label>
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
                    onKeyDown={e => handlePinKeyDown(i, e)}
                    className="w-14 h-14 text-center text-xl font-bold rounded-xl border-2 border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                ))}
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
        )}
      </div>
    </div>
  );
}
