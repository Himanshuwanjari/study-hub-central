import { ApprovalStatus, statusLabels } from '@/types/resource';
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: ApprovalStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const Icon = status === 'pending' ? Clock : status === 'approved' ? CheckCircle : XCircle;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
        status === 'pending' && 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
        status === 'approved' && 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        status === 'rejected' && 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        className
      )}
    >
      <Icon className="w-3.5 h-3.5" />
      {statusLabels[status]}
    </span>
  );
}
