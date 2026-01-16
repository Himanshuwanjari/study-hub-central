import { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { useSubmissions } from '@/hooks/useSubmissions';
import { StatusBadge } from '@/components/StatusBadge';
import { StudentSubmitModal } from '@/components/StudentSubmitModal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { departmentLabels } from '@/types/resource';
import { FileText, User, Calendar, Search, Eye, Download } from 'lucide-react';
import { useBookmarks } from '@/hooks/useBookmarks';

const MySubmissions = () => {
  const { submissions, refresh } = useSubmissions();
  const { bookmarks } = useBookmarks();
  const [emailFilter, setEmailFilter] = useState('');

  const filteredSubmissions = useMemo(() => {
    if (!emailFilter.trim()) return submissions;
    return submissions.filter((s) =>
      s.studentEmail.toLowerCase().includes(emailFilter.toLowerCase())
    );
  }, [submissions, emailFilter]);

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
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary-foreground" />
              </div>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-foreground">
                My Submissions
              </h2>
            </div>
            <p className="text-muted-foreground">
              Track the status of your submitted notes
            </p>
          </div>
          <StudentSubmitModal />
        </div>

        {/* Email Filter */}
        <div className="flex items-center gap-3 mb-6 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Enter your email to see your submissions..."
              value={emailFilter}
              onChange={(e) => setEmailFilter(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Submissions List */}
        <div className="space-y-4">
          {filteredSubmissions.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-lg">
              <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                {emailFilter ? 'No submissions found for this email' : 'Enter your email to view your submissions'}
              </p>
              <StudentSubmitModal />
            </div>
          ) : (
            filteredSubmissions.map((submission) => (
              <div
                key={submission.id}
                className="bg-card rounded-lg p-5 shadow-card hover:shadow-card-hover transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-display font-semibold text-lg text-foreground">
                        {submission.title}
                      </h3>
                      <StatusBadge status={submission.status} />
                    </div>
                    <p className="text-muted-foreground text-sm mb-3">{submission.description}</p>
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        Submitted: {new Date(submission.submittedAt).toLocaleDateString()}
                      </span>
                      <span className="bg-muted px-2 py-0.5 rounded">
                        {departmentLabels[submission.department]}
                      </span>
                      <span className="bg-muted px-2 py-0.5 rounded">Sem {submission.semester}</span>
                    </div>
                    {submission.reviewedAt && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        Reviewed by {submission.reviewedBy} on{' '}
                        {new Date(submission.reviewedAt).toLocaleDateString()}
                      </p>
                    )}
                    {submission.rejectionReason && (
                      <p className="mt-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded">
                        <strong>Feedback:</strong> {submission.rejectionReason}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button variant="outline" size="sm" asChild>
                      <a href={submission.fileUrl} target="_blank" rel="noopener noreferrer">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </a>
                    </Button>
                    <Button size="sm" asChild>
                      <a href={submission.fileUrl} download={submission.fileName}>
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MySubmissions;
