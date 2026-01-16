export type ResourceType = 'notes' | 'timetable' | 'syllabus' | 'assignment' | 'pyq';

export type Department = 
  | 'computer-science'
  | 'electronics'
  | 'mechanical'
  | 'civil'
  | 'electrical';

export type Semester = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  department: Department;
  semester: Semester;
  fileUrl: string;
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  uploadedBy: string;
  downloads: number;
  status?: ApprovalStatus;
  subject?: string; // For PYQ
  year?: number; // For PYQ
}

export interface StudentSubmission {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  department: Department;
  semester: Semester;
  fileUrl: string;
  fileName: string;
  fileSize: string;
  submittedAt: string;
  submittedBy: string;
  studentEmail: string;
  status: ApprovalStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export const departmentLabels: Record<Department, string> = {
  'computer-science': 'Computer Science',
  'electronics': 'Electronics & Communication',
  'mechanical': 'Mechanical Engineering',
  'civil': 'Civil Engineering',
  'electrical': 'Electrical Engineering',
};

export const resourceTypeLabels: Record<ResourceType, string> = {
  notes: 'Notes',
  timetable: 'Timetable',
  syllabus: 'Syllabus',
  assignment: 'Assignment',
  pyq: 'Previous Year Questions',
};

export const statusLabels: Record<ApprovalStatus, string> = {
  pending: 'Pending Review',
  approved: 'Approved',
  rejected: 'Rejected',
};
