import { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { SearchBar } from '@/components/SearchBar';
import { SemesterFilter } from '@/components/SemesterFilter';
import { ResourceCard } from '@/components/ResourceCard';
import { EmptyState } from '@/components/EmptyState';
import { useBookmarks } from '@/hooks/useBookmarks';
import { mockPYQs, subjectsByDepartment } from '@/data/mockPYQs';
import { Department, Semester, departmentLabels } from '@/types/resource';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileQuestion } from 'lucide-react';

const PYQPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<Department | 'all'>('all');
  const [selectedSemester, setSelectedSemester] = useState<Semester | 'all'>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');

  const { bookmarks, toggleBookmark, isBookmarked } = useBookmarks();

  const availableYears = useMemo(() => {
    const years = [...new Set(mockPYQs.map((p) => p.year))].filter(Boolean) as number[];
    return years.sort((a, b) => b - a);
  }, []);

  const availableSubjects = useMemo(() => {
    if (selectedDepartment === 'all') {
      return [...new Set(mockPYQs.map((p) => p.subject))].filter(Boolean) as string[];
    }
    return subjectsByDepartment[selectedDepartment] || [];
  }, [selectedDepartment]);

  const filteredPYQs = useMemo(() => {
    let resources = mockPYQs;

    if (selectedDepartment !== 'all') {
      resources = resources.filter((r) => r.department === selectedDepartment);
    }

    if (selectedSemester !== 'all') {
      resources = resources.filter((r) => r.semester === selectedSemester);
    }

    if (selectedSubject !== 'all') {
      resources = resources.filter((r) => r.subject === selectedSubject);
    }

    if (selectedYear !== 'all') {
      resources = resources.filter((r) => r.year === parseInt(selectedYear));
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      resources = resources.filter(
        (r) =>
          r.title.toLowerCase().includes(query) ||
          r.description.toLowerCase().includes(query) ||
          r.subject?.toLowerCase().includes(query)
      );
    }

    return resources;
  }, [selectedDepartment, selectedSemester, selectedSubject, selectedYear, searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      <Header
        bookmarkCount={bookmarks.length}
        showBookmarks={false}
        onToggleBookmarks={() => {}}
        onMenuToggle={() => {}}
        isMobileMenuOpen={false}
      />

      <div className="container mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center">
              <FileQuestion className="w-5 h-5 text-primary-foreground" />
            </div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-foreground">
              Previous Year Questions
            </h2>
          </div>
          <p className="text-muted-foreground">
            Access past examination papers organized by department, semester, and subject
          </p>
        </div>

        {/* Filters */}
        <div className="space-y-4 mb-6">
          <div className="flex-1">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by title, subject..."
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Select
              value={selectedDepartment}
              onValueChange={(value) => {
                setSelectedDepartment(value as Department | 'all');
                setSelectedSubject('all');
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {(Object.keys(departmentLabels) as Department[]).map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {departmentLabels[dept]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedSemester === 'all' ? 'all' : selectedSemester.toString()}
              onValueChange={(value) =>
                setSelectedSemester(value === 'all' ? 'all' : (parseInt(value) as Semester))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Semester" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Semesters</SelectItem>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <SelectItem key={sem} value={sem.toString()}>
                    Semester {sem}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {availableSubjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger>
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {availableYears.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{filteredPYQs.length}</span> question paper
            {filteredPYQs.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* PYQ Grid */}
        {filteredPYQs.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredPYQs.map((pyq, index) => (
              <div
                key={pyq.id}
                style={{ animationDelay: `${index * 50}ms` }}
                className="animate-slide-up"
              >
                <ResourceCard
                  resource={pyq}
                  isBookmarked={isBookmarked(pyq.id)}
                  onToggleBookmark={toggleBookmark}
                />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState type="no-results" />
        )}
      </div>
    </div>
  );
};

export default PYQPage;
