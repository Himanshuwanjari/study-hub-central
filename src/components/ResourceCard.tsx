import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Resource, departmentLabels } from '@/types/resource';
import { ResourceTypeBadge } from './ResourceTypeBadge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Bookmark, Download, Eye, User, Calendar, FileDown, LogIn, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

interface ResourceCardProps {
  resource: Resource;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
}

export function ResourceCard({ resource, isBookmarked, onToggleBookmark }: ResourceCardProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [promptMessage, setPromptMessage] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const windowRef = useRef<Window | null>(null);

  const handleView = useCallback(() => {
    if (user) {
      // Logged in — open freely
      window.open(resource.fileUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    // Not logged in — open for 10 seconds, then close & prompt login
    const win = window.open(resource.fileUrl, '_blank', 'noopener,noreferrer');
    windowRef.current = win;

    timerRef.current = setTimeout(() => {
      if (win && !win.closed) {
        win.close();
      }
      setPromptMessage('Your 10-second preview has ended. Please log in to continue viewing.');
      setShowLoginPrompt(true);
    }, 10000);
  }, [user, resource.fileUrl]);

  const handleDownload = useCallback(() => {
    if (user) {
      // Logged in — download directly
      const a = document.createElement('a');
      a.href = resource.fileUrl;
      a.download = resource.fileName;
      a.click();
      return;
    }
    setPromptMessage('Please log in to download files.');
    setShowLoginPrompt(true);
  }, [user, resource.fileUrl, resource.fileName]);

  return (
    <>
      <div className="group bg-card rounded-lg shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden animate-fade-in">
        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <ResourceTypeBadge type={resource.type} />
            <button
              onClick={() => onToggleBookmark(resource.id)}
              className={cn(
                'p-1.5 rounded-full transition-colors duration-200',
                isBookmarked
                  ? 'text-primary bg-accent'
                  : 'text-muted-foreground hover:text-primary hover:bg-accent'
              )}
              aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
            >
              <Bookmark className={cn('w-4 h-4', isBookmarked && 'fill-current')} />
            </button>
          </div>

          {/* Title & Description */}
          <h3 className="font-display font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
            {resource.title}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">
            {resource.description}
          </p>

          {/* Metadata */}
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-4">
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              {resource.uploadedBy}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(resource.uploadedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
            <span className="flex items-center gap-1.5">
              <FileDown className="w-3.5 h-3.5" />
              {resource.downloads.toLocaleString()} downloads
            </span>
          </div>

          {/* File Info */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="text-sm">
              <span className="text-muted-foreground">Sem {resource.semester}</span>
              <span className="mx-2 text-border">•</span>
              <span className="text-muted-foreground">{resource.fileSize}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-3 text-muted-foreground hover:text-foreground"
                onClick={handleView}
              >
                <Eye className="w-4 h-4 mr-1.5" />
                View
                {!user && <Clock className="w-3 h-3 ml-1 opacity-60" />}
              </Button>
              <Button
                size="sm"
                className="h-8 px-3 bg-primary hover:bg-primary/90 text-primary-foreground shadow-button"
                onClick={handleDownload}
              >
                <Download className="w-4 h-4 mr-1.5" />
                Download
                {!user && <LogIn className="w-3 h-3 ml-1 opacity-60" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Login Prompt Dialog */}
      <Dialog open={showLoginPrompt} onOpenChange={setShowLoginPrompt}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LogIn className="w-5 h-5 text-primary" />
              Login Required
            </DialogTitle>
            <DialogDescription>{promptMessage}</DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-2">
            <Button variant="outline" className="flex-1" onClick={() => setShowLoginPrompt(false)}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={() => navigate('/auth')}>
              <LogIn className="w-4 h-4 mr-2" />
              Log In / Sign Up
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
