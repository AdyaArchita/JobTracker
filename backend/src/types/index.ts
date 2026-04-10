import { Document, Types } from 'mongoose';
import { z } from 'zod';

/**
 * @file types/index.ts
 * Centralized type definitions and Zod schemas for the JobTracker application.
 * Synchronizes backend validation with TypeScript interfaces.
 */

// Enums & Constants

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

// Zod Schemas 

export const ApplicationSchema = z.object({
  company: z.string().min(1, 'Company name is required'),
  role: z.string().min(1, 'Role/title is required'),
  status: z.nativeEnum(ApplicationStatus).default(ApplicationStatus.Applied),
  skills: z.array(z.string()).default([]),
  niceToHaveSkills: z.array(z.string()).default([]),
  seniorityLevel: z.string().optional().default(''),
  location: z.string().default('Remote'),
  jobType: z.string().default('Full-time'),
  jdText: z.string().optional().default(''),
  jdLink: z.string().url().optional().or(z.literal('')).default(''),
  notes: z.string().optional().default(''),
  dateApplied: z.coerce.date().default(() => new Date()),
  followUpDate: z.coerce.date().nullable().optional().default(null),
  salaryRange: z.string().optional().default(''),
  priority: z.enum(['High', 'Medium', 'Low']).default('Medium'),
});

// Interfaces

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  profileSummary?: string; // Career background for AI context
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

/**
 * Mongoose Document interface for Application.
 * Combines Zod inference with Mongoose-specific fields.
 */
export interface IApplication extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  company: string;
  role: string;
  status: ApplicationStatus;
  skills: string[];
  niceToHaveSkills: string[];
  seniorityLevel: string;
  location: string;
  jobType: string;
  jdText: string;
  jdLink: string;
  notes: string;
  dateApplied: Date;
  followUpDate: Date | null;
  salaryRange: string;
  priority: 'High' | 'Medium' | 'Low';

  // AI-generated metadata
  resumeBullets: string[];
  matchScore: number;
  coverLetterSnippet: string;
  matchReason: string;

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

export interface AIResumeOutput {
  bullets: string[];
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
