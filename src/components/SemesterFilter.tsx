import { Semester } from '@/types/resource';
import { cn } from '@/lib/utils';

interface SemesterFilterProps {
  selectedSemester: Semester | 'all';
  onSelect: (sem: Semester | 'all') => void;
}

export function SemesterFilter({ selectedSemester, onSelect }: SemesterFilterProps) {
  const semesters: (Semester | 'all')[] = ['all', 1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <div className="flex flex-wrap gap-2">
      {semesters.map((sem) => (
        <button
          key={sem}
          onClick={() => onSelect(sem)}
          className={cn(
            'w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center',
            selectedSemester === sem
              ? 'bg-primary text-primary-foreground shadow-button'
              : 'bg-card text-muted-foreground hover:text-foreground hover:bg-muted border border-border'
          )}
        >
          {sem === 'all' ? 'All' : sem}
        </button>
      ))}
    </div>
  );
}
