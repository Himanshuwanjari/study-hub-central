import { Department, departmentLabels } from '@/types/resource';
import { cn } from '@/lib/utils';
import {
  Monitor,
  Cpu,
  Wrench,
  Building2,
  Zap,
  GraduationCap,
} from 'lucide-react';

interface DepartmentSidebarProps {
  selectedDepartment: Department | 'all';
  onSelect: (dept: Department | 'all') => void;
}

const departmentIcons: Record<Department | 'all', React.ReactNode> = {
  all: <GraduationCap className="w-5 h-5" />,
  'computer-science': <Monitor className="w-5 h-5" />,
  electronics: <Cpu className="w-5 h-5" />,
  mechanical: <Wrench className="w-5 h-5" />,
  civil: <Building2 className="w-5 h-5" />,
  electrical: <Zap className="w-5 h-5" />,
};

const departments: (Department | 'all')[] = [
  'all',
  'computer-science',
  'electronics',
  'mechanical',
  'civil',
  'electrical',
];

export function DepartmentSidebar({ selectedDepartment, onSelect }: DepartmentSidebarProps) {
  return (
    <nav className="space-y-1">
      {departments.map((dept) => (
        <button
          key={dept}
          onClick={() => onSelect(dept)}
          className={cn(
            'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 text-left',
            selectedDepartment === dept
              ? 'bg-accent text-accent-foreground'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          )}
        >
          <span className={cn(
            'transition-colors',
            selectedDepartment === dept ? 'text-primary' : ''
          )}>
            {departmentIcons[dept]}
          </span>
          {dept === 'all' ? 'All Departments' : departmentLabels[dept]}
        </button>
      ))}
    </nav>
  );
}
