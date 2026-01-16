export type ResourceType = 'notes' | 'timetable' | 'syllabus' | 'assignment';

export type Department = 
  | 'computer-science'
  | 'electronics'
  | 'mechanical'
  | 'civil'
  | 'electrical';

export type Semester = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

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
};
