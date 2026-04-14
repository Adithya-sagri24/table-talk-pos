import { useState } from 'react';
import { useCustomer } from '@/contexts/CustomerContext';
import { User, Mail, Phone, Save, CheckCircle } from 'lucide-react';

export default function CustomerProfile() {
  const { customer, updateProfile } = useCustomer();
  const [name, setName] = useState(customer?.name || '');
  const [email, setEmail] = useState(customer?.email || '');
  const [phone, setPhone] = useState(customer?.phone || '');
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    updateProfile({ name, email, phone });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (!customer) return null;

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-foreground mb-1">My Profile</h2>
      <p className="text-sm text-muted-foreground mb-6">View and update your details</p>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {/* Avatar header */}
        <div className="bg-primary/5 border-b border-border px-6 py-8 flex flex-col items-center">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-3">
            <span className="text-3xl font-bold text-primary">{customer.name.charAt(0).toUpperCase()}</span>
          </div>
          <p className="font-semibold text-foreground">{customer.name}</p>
          <p className="text-xs text-muted-foreground">{customer.email}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground flex items-center gap-1.5 mb-1.5">
              <User className="h-3.5 w-3.5 text-muted-foreground" /> Full Name
            </label>
            <input type="text" value={name} onChange={e => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground flex items-center gap-1.5 mb-1.5">
              <Mail className="h-3.5 w-3.5 text-muted-foreground" /> Email
            </label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground flex items-center gap-1.5 mb-1.5">
              <Phone className="h-3.5 w-3.5 text-muted-foreground" /> Phone
            </label>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
          </div>

          <button type="submit"
            className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors btn-press flex items-center justify-center gap-2">
            <Save className="h-4 w-4" /> Save Changes
          </button>

          {saved && (
            <p className="text-sm text-status-ready font-medium flex items-center gap-1.5 justify-center">
              <CheckCircle className="h-4 w-4" /> Profile updated successfully
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
