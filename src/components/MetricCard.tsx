import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  iconBg?: string;
  iconColor?: string;
}

export function MetricCard({ label, value, icon: Icon, trend, trendUp, iconBg = 'bg-primary/10', iconColor = 'text-primary' }: MetricCardProps) {
  return (
    <div className="bg-card rounded-xl p-5 shadow-sm border border-border card-hover">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{label}</p>
          <p className="font-mono text-2xl font-bold text-foreground">{value}</p>
          {trend && (
            <p className={`text-xs mt-1 font-medium ${trendUp ? 'text-status-ready' : 'text-status-issue'}`}>
              {trend}
            </p>
          )}
        </div>
        <div className={`h-11 w-11 rounded-xl ${iconBg} flex items-center justify-center`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
}
