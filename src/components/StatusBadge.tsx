import { OrderStatus } from '@/lib/types';

const statusConfig: Record<OrderStatus, { bg: string; text: string; label: string }> = {
  pending: { bg: 'bg-status-pending/15', text: 'text-status-pending', label: 'Pending' },
  preparing: { bg: 'bg-status-preparing/15', text: 'text-status-preparing', label: 'Preparing' },
  ready: { bg: 'bg-status-ready/15', text: 'text-status-ready', label: 'Ready' },
  served: { bg: 'bg-status-served/15', text: 'text-status-served', label: 'Served' },
  cancelled: { bg: 'bg-status-cancelled/15', text: 'text-status-cancelled', label: 'Cancelled' },
};

export function StatusBadge({ status, pulse }: { status: OrderStatus; pulse?: boolean }) {
  const config = statusConfig[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} ${pulse ? 'animate-status-pulse' : ''}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${config.text} bg-current`} />
      {config.label}
    </span>
  );
}
