import { useState, useEffect } from 'react';

const BOOKMARKS_KEY = 'college-hub-bookmarks';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(BOOKMARKS_KEY);
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  }, [bookmarks]);

  const toggleBookmark = (resourceId: string) => {
    setBookmarks((prev) =>
      prev.includes(resourceId)
        ? prev.filter((id) => id !== resourceId)
        : [...prev, resourceId]
    );
  };

  const isBookmarked = (resourceId: string) => bookmarks.includes(resourceId);

  return { bookmarks, toggleBookmark, isBookmarked };
}
