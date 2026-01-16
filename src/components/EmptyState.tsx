import { FileQuestion, Bookmark } from 'lucide-react';

interface EmptyStateProps {
  type: 'no-results' | 'no-bookmarks';
}

export function EmptyState({ type }: EmptyStateProps) {
  if (type === 'no-bookmarks') {
    return (
      <div className="text-center py-16 animate-fade-in">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
          <Bookmark className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="font-display font-semibold text-lg text-foreground mb-2">
          No Bookmarks Yet
        </h3>
        <p className="text-muted-foreground text-sm max-w-sm mx-auto">
          Start bookmarking resources to access them quickly later. Click the bookmark icon on any resource card.
        </p>
      </div>
    );
  }

  return (
    <div className="text-center py-16 animate-fade-in">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
        <FileQuestion className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="font-display font-semibold text-lg text-foreground mb-2">
        No Resources Found
      </h3>
      <p className="text-muted-foreground text-sm max-w-sm mx-auto">
        Try adjusting your filters or search query to find what you're looking for.
      </p>
    </div>
  );
}
