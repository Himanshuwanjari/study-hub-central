import { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import { DepartmentSidebar } from '@/components/DepartmentSidebar';
import { SearchBar } from '@/components/SearchBar';
import { FilterTabs } from '@/components/FilterTabs';
import { SemesterFilter } from '@/components/SemesterFilter';
import { ResourceCard } from '@/components/ResourceCard';
import { EmptyState } from '@/components/EmptyState';
import { useBookmarks } from '@/hooks/useBookmarks';
import { mockResources } from '@/data/mockResources';
import { Department, ResourceType, Semester, departmentLabels } from '@/types/resource';
import { cn } from '@/lib/utils';

const Index = () => {
  const { user, role } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<Department | 'all'>('all');
  const [selectedType, setSelectedType] = useState<ResourceType | 'all'>('all');
  const [selectedSemester, setSelectedSemester] = useState<Semester | 'all'>('all');
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { bookmarks, toggleBookmark, isBookmarked } = useBookmarks();

  const filteredResources = useMemo(() => {
    let resources = mockResources;

    // Filter by bookmarks if enabled
    if (showBookmarks) {
      resources = resources.filter((r) => bookmarks.includes(r.id));
    }

    // Filter by department
    if (selectedDepartment !== 'all') {
      resources = resources.filter((r) => r.department === selectedDepartment);
    }

    // Filter by type
    if (selectedType !== 'all') {
      resources = resources.filter((r) => r.type === selectedType);
    }

    // Filter by semester
    if (selectedSemester !== 'all') {
      resources = resources.filter((r) => r.semester === selectedSemester);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      resources = resources.filter(
        (r) =>
          r.title.toLowerCase().includes(query) ||
          r.description.toLowerCase().includes(query) ||
          r.uploadedBy.toLowerCase().includes(query)
      );
    }

    return resources;
  }, [mockResources, selectedDepartment, selectedType, selectedSemester, searchQuery, showBookmarks, bookmarks]);

  const currentDeptLabel = selectedDepartment === 'all' 
    ? 'All Departments' 
    : departmentLabels[selectedDepartment];

  return (
    <div className="min-h-screen bg-background">
      <Header
        bookmarkCount={bookmarks.length}
        showBookmarks={showBookmarks}
        onToggleBookmarks={() => setShowBookmarks(!showBookmarks)}
        onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside
            className={cn(
              'fixed inset-y-0 left-0 z-40 w-72 bg-card border-r border-border pt-20 px-4 pb-6 transform transition-transform duration-300 lg:relative lg:inset-auto lg:z-auto lg:transform-none lg:pt-0 lg:px-0 lg:pb-0 lg:w-64 lg:shrink-0',
              isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            )}
          >
            <div className="lg:sticky lg:top-24">
              {/* Mobile nav links */}
              <nav className="lg:hidden flex flex-col gap-1 mb-6 px-4">
                <a href="/" className="px-3 py-2 rounded-lg text-sm font-medium bg-accent text-accent-foreground">Resources</a>
                <a href="/pyq" className="px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50">PYQ</a>
                {user && <a href="/my-submissions" className="px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50">My Submissions</a>}
                {(role === 'teacher' || role === 'admin') && (
                  <a href="/faculty" className="px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50">Faculty</a>
                )}
                <div className="border-b border-border my-2" />
              </nav>
              <h2 className="font-display font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-4 px-4">
                Departments
              </h2>
              <DepartmentSidebar
                selectedDepartment={selectedDepartment}
                onSelect={(dept) => {
                  setSelectedDepartment(dept);
                  setIsMobileMenuOpen(false);
                }}
              />
            </div>
          </aside>

          {/* Overlay for mobile */}
          {isMobileMenuOpen && (
            <div
              className="fixed inset-0 z-30 bg-foreground/20 backdrop-blur-sm lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Header Section */}
            <div className="mb-6">
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-foreground mb-2">
                {showBookmarks ? 'Your Bookmarks' : currentDeptLabel}
              </h2>
              <p className="text-muted-foreground">
                {showBookmarks
                  ? `${bookmarks.length} saved resource${bookmarks.length !== 1 ? 's' : ''}`
                  : `Browse study materials, notes, and academic resources`}
              </p>
            </div>

            {/* Filters */}
            <div className="space-y-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Search by title, description, or author..."
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <FilterTabs selectedType={selectedType} onSelect={setSelectedType} />
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-muted-foreground">Semester:</span>
                <SemesterFilter
                  selectedSemester={selectedSemester}
                  onSelect={setSelectedSemester}
                />
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-medium text-foreground">{filteredResources.length}</span> resource{filteredResources.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Resource Grid */}
            {filteredResources.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filteredResources.map((resource, index) => (
                  <div
                    key={resource.id}
                    style={{ animationDelay: `${index * 50}ms` }}
                    className="animate-slide-up"
                  >
                    <ResourceCard
                      resource={resource}
                      isBookmarked={isBookmarked(resource.id)}
                      onToggleBookmark={toggleBookmark}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState type={showBookmarks ? 'no-bookmarks' : 'no-results'} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Index;
