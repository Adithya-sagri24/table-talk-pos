import { useState } from 'react';
import { useCustomer } from '@/contexts/CustomerContext';
import { CalendarDays, Clock, Users, X } from 'lucide-react';

export default function CustomerReservations() {
  const { reservations, makeReservation, cancelReservation } = useCustomer();
  const [showForm, setShowForm] = useState(false);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState('2');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time) return;
    makeReservation(date, time, parseInt(guests));
    setShowForm(false);
    setDate(''); setTime(''); setGuests('2');
  };

  const statusColors: Record<string, string> = {
    confirmed: 'bg-status-ready/10 text-status-ready',
    pending: 'bg-status-pending/10 text-status-pending',
    cancelled: 'bg-status-cancelled/10 text-status-cancelled',
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Reservations</h2>
          <p className="text-sm text-muted-foreground mt-1">Book a table for your visit</p>
        </div>
        <button onClick={() => setShowForm(true)} className="px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors btn-press">
          + New Reservation
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm">
          <div className="bg-card rounded-xl shadow-2xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 className="font-semibold text-foreground">Book a Table</h3>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-muted transition-colors"><X className="h-4 w-4 text-muted-foreground" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Date</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Time</label>
                <input type="time" value={time} onChange={e => setTime(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Number of Guests</label>
                <input type="number" min="1" max="20" value={guests} onChange={e => setGuests(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
              </div>
              <button type="submit" className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors btn-press">
                Confirm Reservation
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {reservations.length === 0 ? (
          <div className="text-center mt-16">
            <CalendarDays className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">No reservations yet</p>
          </div>
        ) : reservations.map(r => (
          <div key={r.id} className="bg-card rounded-xl border border-border p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <CalendarDays className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">{new Date(r.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{r.time}</span>
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" />{r.guests} guests</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColors[r.status]}`}>{r.status}</span>
              {r.status !== 'cancelled' && (
                <button onClick={() => cancelReservation(r.id)} className="text-xs text-destructive hover:underline">Cancel</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
