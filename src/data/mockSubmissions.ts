import { StudentSubmission } from '@/types/resource';

// Mock student submissions stored in localStorage
const SUBMISSIONS_KEY = 'student_submissions';

export const initialMockSubmissions: StudentSubmission[] = [
  {
    id: 'sub-1',
    title: 'Computer Networks Lecture Notes',
    description: 'Complete notes from all lectures covering OSI model, TCP/IP, and networking protocols.',
    type: 'notes',
    department: 'computer-science',
    semester: 5,
    fileUrl: 'https://www.africau.edu/images/default/sample.pdf',
    fileName: 'CN_Notes_Complete.pdf',
    fileSize: '3.2 MB',
    submittedAt: '2024-01-18',
    submittedBy: 'Rahul Sharma',
    studentEmail: 'rahul@college.edu',
    status: 'pending',
  },
  {
    id: 'sub-2',
    title: 'Algorithm Design Notes',
    description: 'Detailed notes on sorting, searching, and graph algorithms.',
    type: 'notes',
    department: 'computer-science',
    semester: 4,
    fileUrl: 'https://www.africau.edu/images/default/sample.pdf',
    fileName: 'Algo_Notes.pdf',
    fileSize: '2.1 MB',
    submittedAt: '2024-01-17',
    submittedBy: 'Priya Patel',
    studentEmail: 'priya@college.edu',
    status: 'approved',
    reviewedBy: 'Prof. Kumar',
    reviewedAt: '2024-01-18',
  },
  {
    id: 'sub-3',
    title: 'Microprocessor Lab Experiments',
    description: 'All lab experiments with code and explanations.',
    type: 'notes',
    department: 'electronics',
    semester: 4,
    fileUrl: 'https://www.africau.edu/images/default/sample.pdf',
    fileName: 'MP_Lab.pdf',
    fileSize: '1.8 MB',
    submittedAt: '2024-01-16',
    submittedBy: 'Amit Gupta',
    studentEmail: 'amit@college.edu',
    status: 'rejected',
    reviewedBy: 'Prof. Reddy',
    reviewedAt: '2024-01-17',
    rejectionReason: 'Content quality does not meet standards. Please add more detailed explanations.',
  },
  {
    id: 'sub-4',
    title: 'Heat Transfer Notes',
    description: 'Comprehensive notes on conduction, convection, and radiation.',
    type: 'notes',
    department: 'mechanical',
    semester: 4,
    fileUrl: 'https://www.africau.edu/images/default/sample.pdf',
    fileName: 'HT_Notes.pdf',
    fileSize: '2.5 MB',
    submittedAt: '2024-01-15',
    submittedBy: 'Sneha Rao',
    studentEmail: 'sneha@college.edu',
    status: 'pending',
  },
];

export function getSubmissions(): StudentSubmission[] {
  const stored = localStorage.getItem(SUBMISSIONS_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  // Initialize with mock data
  localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(initialMockSubmissions));
  return initialMockSubmissions;
}

export function saveSubmission(submission: StudentSubmission): void {
  const submissions = getSubmissions();
  submissions.push(submission);
  localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(submissions));
}

export function updateSubmissionStatus(
  id: string,
  status: 'approved' | 'rejected',
  reviewedBy: string,
  rejectionReason?: string
): void {
  const submissions = getSubmissions();
  const index = submissions.findIndex((s) => s.id === id);
  if (index !== -1) {
    submissions[index] = {
      ...submissions[index],
      status,
      reviewedBy,
      reviewedAt: new Date().toISOString().split('T')[0],
      rejectionReason,
    };
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(submissions));
  }
}

export function getApprovedSubmissions(): StudentSubmission[] {
  return getSubmissions().filter((s) => s.status === 'approved');
}
