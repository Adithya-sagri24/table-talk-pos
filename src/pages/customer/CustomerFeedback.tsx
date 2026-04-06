import { useState } from 'react';
import { useCustomer } from '@/contexts/CustomerContext';
import { Star, MessageSquare } from 'lucide-react';

export default function CustomerFeedback() {
  const { customerOrders, feedbacks, submitFeedback } = useCustomer();
  const [selectedOrder, setSelectedOrder] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const servedOrders = customerOrders.filter(o => !feedbacks.find(f => f.orderId === o.id));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || rating === 0) return;
    submitFeedback(selectedOrder, rating, comment);
    setSelectedOrder(''); setRating(0); setComment('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-foreground mb-6">Feedback & Ratings</h2>

      {/* Submit Form */}
      <div className="bg-card rounded-xl border border-border p-6 mb-8">
        <h3 className="font-semibold text-foreground mb-4">Rate Your Experience</h3>
        {servedOrders.length === 0 && customerOrders.length === 0 ? (
          <p className="text-sm text-muted-foreground">Place an order first to leave feedback.</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Select Order</label>
              <select value={selectedOrder} onChange={e => setSelectedOrder(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary">
                <option value="">Choose an order...</option>
                {(servedOrders.length > 0 ? servedOrders : customerOrders).map(o => (
                  <option key={o.id} value={o.id}>{o.id} — ${o.total.toFixed(2)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-2">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(s => (
                  <button key={s} type="button" onClick={() => setRating(s)} onMouseEnter={() => setHoverRating(s)} onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-transform hover:scale-110">
                    <Star className={`h-7 w-7 ${s <= (hoverRating || rating) ? 'text-status-pending fill-status-pending' : 'text-muted-foreground/30'}`} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Comment (optional)</label>
              <textarea value={comment} onChange={e => setComment(e.target.value)} rows={3} placeholder="Tell us about your experience..."
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none" />
            </div>

            <button type="submit" disabled={!selectedOrder || rating === 0}
              className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors btn-press disabled:opacity-50 disabled:cursor-not-allowed">
              Submit Feedback
            </button>
          </form>
        )}
        {submitted && <p className="text-sm text-status-ready mt-3 font-medium">✓ Thank you for your feedback!</p>}
      </div>

      {/* Previous Feedback */}
      {feedbacks.length > 0 && (
        <div>
          <h3 className="font-semibold text-foreground mb-4">Your Feedback</h3>
          <div className="space-y-3">
            {feedbacks.map(fb => (
              <div key={fb.id} className="bg-card rounded-xl border border-border p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-sm text-muted-foreground">{fb.orderId}</span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} className={`h-4 w-4 ${s <= fb.rating ? 'text-status-pending fill-status-pending' : 'text-muted-foreground/20'}`} />
                    ))}
                  </div>
                </div>
                {fb.comment && <p className="text-sm text-muted-foreground flex items-start gap-2"><MessageSquare className="h-3.5 w-3.5 mt-0.5 shrink-0" />{fb.comment}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
