import { Document, Types } from 'mongoose';


export const APPLICATION_STATUSES = [
  'Applied',
  'Phone Screen',
  'Interview',
  'Offer',
  'Rejected',
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

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


export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}


export interface IApplication extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  company: string;
  role: string;
  status: ApplicationStatus;
  skills: string[];
  niceToHaveSkills: string[];
  seniorityLevel: string;
  location: LocationType | string;
  jobType: JobType | string;
  jdText: string;
  jdLink: string;
  notes: string;
  dateApplied: Date;
  followUpDate: Date | null;
  salaryRange: string;
  resumeBullets: string[];
  matchScore: number;
  coverLetterSnippet: string;
  matchReason: string;
  priority: 'High' | 'Medium' | 'Low';
  createdAt: Date;
  updatedAt: Date;
}


export interface ParsedJD {
  company: string;
  role: string;
  skills: string[];
  niceToHaveSkills: string[];
  seniorityLevel: string;
  location: LocationType | string;
  jobType: JobType | string;
}


export interface AIParseResponse {
  parsed: ParsedJD;
  resumeBullets: string[];
  matchScore: number;
  coverLetterSnippet: string;
  matchReason: string;
}


export interface AuthPayload {
  userId: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}


declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}
