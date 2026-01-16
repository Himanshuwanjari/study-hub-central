import { useState, useEffect, useCallback } from 'react';
import { StudentSubmission, ApprovalStatus } from '@/types/resource';
import { getSubmissions, saveSubmission, updateSubmissionStatus, getApprovedSubmissions } from '@/data/mockSubmissions';

export function useSubmissions() {
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setSubmissions(getSubmissions());
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addSubmission = useCallback((submission: Omit<StudentSubmission, 'id' | 'status' | 'submittedAt'>) => {
    const newSubmission: StudentSubmission = {
      ...submission,
      id: `sub-${Date.now()}`,
      status: 'pending',
      submittedAt: new Date().toISOString().split('T')[0],
    };
    saveSubmission(newSubmission);
    refresh();
    return newSubmission;
  }, [refresh]);

  const updateStatus = useCallback((
    id: string,
    status: 'approved' | 'rejected',
    reviewedBy: string,
    rejectionReason?: string
  ) => {
    updateSubmissionStatus(id, status, reviewedBy, rejectionReason);
    refresh();
  }, [refresh]);

  const getApproved = useCallback(() => {
    return getApprovedSubmissions();
  }, []);

  const getByStatus = useCallback((status: ApprovalStatus) => {
    return submissions.filter((s) => s.status === status);
  }, [submissions]);

  const getMySubmissions = useCallback((email: string) => {
    return submissions.filter((s) => s.studentEmail === email);
  }, [submissions]);

  return {
    submissions,
    loading,
    addSubmission,
    updateStatus,
    getApproved,
    getByStatus,
    getMySubmissions,
    refresh,
  };
}
