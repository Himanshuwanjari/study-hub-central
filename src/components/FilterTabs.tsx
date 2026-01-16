import { ResourceType, resourceTypeLabels } from '@/types/resource';
import { cn } from '@/lib/utils';
import { FileText, Calendar, BookOpen, ClipboardList } from 'lucide-react';

interface FilterTabsProps {
  selectedType: ResourceType | 'all';
  onSelect: (type: ResourceType | 'all') => void;
}

const typeIcons: Record<ResourceType | 'all', React.ReactNode> = {
  all: null,
  notes: <FileText className="w-4 h-4" />,
  timetable: <Calendar className="w-4 h-4" />,
  syllabus: <BookOpen className="w-4 h-4" />,
  assignment: <ClipboardList className="w-4 h-4" />,
};

export function FilterTabs({ selectedType, onSelect }: FilterTabsProps) {
  const types: (ResourceType | 'all')[] = ['all', 'notes', 'timetable', 'syllabus', 'assignment'];

  return (
    <div className="flex flex-wrap gap-2">
      {types.map((type) => (
        <button
          key={type}
          onClick={() => onSelect(type)}
          className={cn(
            'inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
            selectedType === type
              ? 'bg-primary text-primary-foreground shadow-button'
              : 'bg-card text-muted-foreground hover:text-foreground hover:bg-muted border border-border'
          )}
        >
          {typeIcons[type]}
          {type === 'all' ? 'All Resources' : resourceTypeLabels[type]}
        </button>
      ))}
    </div>
  );
}
