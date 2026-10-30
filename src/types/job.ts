export type ApplicationStatus = 'Applied' | 'Interviewing' | 'Offer' | 'Rejected';

export interface JobApplication {
  id: string;
  company: string;
  jobTitle: string;
  jobLink?: string;
  applicationDate: string; // YYYY-MM-DD
  recruiterName?: string;
  recruiterEmail?: string;
  status: ApplicationStatus;
  interviewDate?: string; // YYYY-MM-DD
  followUpDate?: string; // YYYY-MM-DD
  notes?: string;
  isArchived: boolean;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export type JobApplicationInput = Omit<JobApplication, 'id' | 'createdAt' | 'updatedAt'>;

export type ViewMode = 'kanban' | 'followup' | 'archived';

export interface FollowUpSummary {
  overdueCount: number;
  todayCount: number;
  upcomingCount: number;
  totalFollowUps: number;
}
