export enum ApplicationStatus {
  Applied = 'Applied',
  PhoneScreen = 'Phone Screen',
  Interview = 'Interview',
  Offer = 'Offer',
  Rejected = 'Rejected',
}

export const APPLICATION_STATUSES = Object.values(ApplicationStatus);

export const JOB_TYPES = [
  'Full-time',
  'Part-time',
  'Contract',
  'Internship',
  'Freelance',
] as const;

export type JobType = (typeof JOB_TYPES)[number];

export const LOCATION_TYPES = ['On-site', 'Remote', 'Hybrid'] as const;

export type LocationType = (typeof LOCATION_TYPES)[number];

// ─── User ────────────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  profileSummary?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// ─── Application ─────────────────────────────────────────────────────
export interface Application {
  _id: string;
  userId: string;
  company: string;
  role: string;
  status: ApplicationStatus;
  skills: string[];
  niceToHaveSkills: string[];
  seniorityLevel: string;
  locationType: LocationType | string;
  location: string;
  jobType: JobType | string;
  jdText: string;
  jdLink: string;
  notes: string;
  dateApplied: string;
  followUpDate: string | null;
  salaryRange: string;
  resumeBullets: string[];
  matchScore: number;
  coverLetterSnippet: string;
  matchReason: string;
  priority: 'High' | 'Medium' | 'Low';
  createdAt: string;
  updatedAt: string;
}

export interface CreateApplicationData {
  company: string;
  role: string;
  status?: ApplicationStatus;
  skills?: string[];
  niceToHaveSkills?: string[];
  seniorityLevel?: string;
  locationType?: LocationType | string;
  location?: string;
  jobType?: JobType | string;
  jdText?: string;
  jdLink?: string;
  notes?: string;
  dateApplied?: string;
  followUpDate?: string | null;
  salaryRange?: string;
  resumeBullets?: string[];
  matchScore?: number;
  coverLetterSnippet?: string;
  matchReason?: string;
  priority?: 'High' | 'Medium' | 'Low';
}

export interface UpdateApplicationData extends Partial<CreateApplicationData> {}

// ─── Parsed JD (AI output) ──────────────────────────────────────────
export interface ParsedJD {
  company: string;
  role: string;
  skills: string[];
  niceToHaveSkills: string[];
  seniorityLevel: string;
  locationType: LocationType | string;
  location: string;
  jobType: JobType | string;
}

export interface AIParseResponse {
  parsed: ParsedJD;
  resumeBullets: string[];
  matchScore: number;
  coverLetterSnippet: string;
  matchReason: string;
}

// ─── Stats ───────────────────────────────────────────────────────────
export interface ApplicationStats {
  total: number;
  byStatus: Record<string, number>;
  weeklyCount: number;
  inProgressCount: number;
  offersReceived: number;
  averageMatchScore: number;
}

// ─── Column Config ───────────────────────────────────────────────────
export interface KanbanColumnConfig {
  id: ApplicationStatus;
  title: string;
  dotColor: string;
  countBg: string;
  countText: string;
  borderColor: string;
}

export const COLUMN_CONFIG: KanbanColumnConfig[] = [
  {
    id: ApplicationStatus.Applied,
    title: 'Applied',
    dotColor: 'bg-blue-400',
    countBg: 'bg-blue-500/15',
    countText: 'text-blue-400',
    borderColor: 'border-blue-500/30',
  },
  {
    id: ApplicationStatus.PhoneScreen,
    title: 'Phone Screen',
    dotColor: 'bg-amber-400',
    countBg: 'bg-amber-500/15',
    countText: 'text-amber-400',
    borderColor: 'border-amber-500/30',
  },
  {
    id: ApplicationStatus.Interview,
    title: 'Interview',
    dotColor: 'bg-violet-400',
    countBg: 'bg-violet-500/15',
    countText: 'text-violet-400',
    borderColor: 'border-violet-500/30',
  },
  {
    id: ApplicationStatus.Offer,
    title: 'Offer',
    dotColor: 'bg-emerald-400',
    countBg: 'bg-emerald-500/15',
    countText: 'text-emerald-400',
    borderColor: 'border-emerald-500/30',
  },
  {
    id: ApplicationStatus.Rejected,
    title: 'Rejected',
    dotColor: 'bg-red-400',
    countBg: 'bg-red-500/15',
    countText: 'text-red-400',
    borderColor: 'border-red-500/30',
  },
];
