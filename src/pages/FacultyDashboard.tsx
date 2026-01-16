import { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { useSubmissions } from '@/hooks/useSubmissions';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ApprovalStatus, departmentLabels } from '@/types/resource';
import { CheckCircle, XCircle, Eye, FileText, User, Calendar, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { useBookmarks } from '@/hooks/useBookmarks';

const FacultyDashboard = () => {
  const { submissions, updateStatus, refresh } = useSubmissions();
  const { bookmarks } = useBookmarks();
  const [statusFilter, setStatusFilter] = useState<ApprovalStatus | 'all'>('all');
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [facultyName] = useState('Prof. Faculty');

  const filteredSubmissions = useMemo(() => {
    if (statusFilter === 'all') return submissions;
    return submissions.filter((s) => s.status === statusFilter);
  }, [submissions, statusFilter]);

  const pendingCount = submissions.filter((s) => s.status === 'pending').length;
  const approvedCount = submissions.filter((s) => s.status === 'approved').length;
  const rejectedCount = submissions.filter((s) => s.status === 'rejected').length;

  const handleApprove = (id: string) => {
    updateStatus(id, 'approved', facultyName);
    toast.success('Submission approved and published!');
  };

  const handleReject = () => {
    if (selectedSubmission && rejectionReason.trim()) {
      updateStatus(selectedSubmission, 'rejected', facultyName, rejectionReason);
      toast.success('Submission rejected with feedback.');
      setShowRejectDialog(false);
      setRejectionReason('');
      setSelectedSubmission(null);
    }
  };

  const openRejectDialog = (id: string) => {
    setSelectedSubmission(id);
    setShowRejectDialog(true);
  };

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
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-foreground">
              Faculty Dashboard
            </h2>
          </div>
          <p className="text-muted-foreground">
            Review and approve student note submissions
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-card rounded-lg p-4 shadow-card">
            <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
            <div className="text-sm text-muted-foreground">Pending Review</div>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-card">
            <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
            <div className="text-sm text-muted-foreground">Approved</div>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-card">
            <div className="text-2xl font-bold text-red-600">{rejectedCount}</div>
            <div className="text-sm text-muted-foreground">Rejected</div>
          </div>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-4 mb-6">
          <span className="text-sm font-medium text-muted-foreground">Filter:</span>
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as ApprovalStatus | 'all')}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All submissions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Submissions</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Submissions List */}
        <div className="space-y-4">
          {filteredSubmissions.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-lg">
              <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No submissions found</p>
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
                        <User className="w-3.5 h-3.5" />
                        {submission.submittedBy}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(submission.submittedAt).toLocaleDateString()}
                      </span>
                      <span className="bg-muted px-2 py-0.5 rounded">
                        {departmentLabels[submission.department]}
                      </span>
                      <span className="bg-muted px-2 py-0.5 rounded">Sem {submission.semester}</span>
                    </div>
                    {submission.rejectionReason && (
                      <p className="mt-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded">
                        <strong>Rejection reason:</strong> {submission.rejectionReason}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <a href={submission.fileUrl} target="_blank" rel="noopener noreferrer">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </a>
                    </Button>
                    {submission.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => handleApprove(submission.id)}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => openRejectDialog(submission.id)}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Submission</DialogTitle>
            <DialogDescription>
              Provide feedback to help the student improve their submission.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Reason for rejection</label>
              <Textarea
                placeholder="Explain why this submission is being rejected..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
              />
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowRejectDialog(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={handleReject}
                disabled={!rejectionReason.trim()}
              >
                Reject Submission
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FacultyDashboard;
