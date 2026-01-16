import { ResourceType, resourceTypeLabels } from '@/types/resource';
import { FileText, Calendar, BookOpen, ClipboardList } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResourceTypeBadgeProps {
  type: ResourceType;
  className?: string;
}

const typeIcons: Record<ResourceType, React.ReactNode> = {
  notes: <FileText className="w-3.5 h-3.5" />,
  timetable: <Calendar className="w-3.5 h-3.5" />,
  syllabus: <BookOpen className="w-3.5 h-3.5" />,
  assignment: <ClipboardList className="w-3.5 h-3.5" />,
};

export function ResourceTypeBadge({ type, className }: ResourceTypeBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
        type === 'notes' && 'badge-notes',
        type === 'timetable' && 'badge-timetable',
        type === 'syllabus' && 'badge-syllabus',
        type === 'assignment' && 'badge-assignment',
        className
      )}
    >
      {typeIcons[type]}
      {resourceTypeLabels[type]}
    </span>
  );
}
