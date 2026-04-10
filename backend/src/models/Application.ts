import mongoose, { Schema } from 'mongoose';
import { IApplication, APPLICATION_STATUSES, ApplicationStatus } from '../types';

/**
 * Application Schema
 * Represents a single job application and associated AI-generated insights.
 * Includes automated tracking for search/filter and overdue logic.
 */
const applicationSchema = new Schema<IApplication>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Role/title is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: APPLICATION_STATUSES,
      default: ApplicationStatus.Applied,
    },
    skills: {
      type: [String],
      default: [],
    },
    niceToHaveSkills: {
      type: [String],
      default: [],
    },
    seniorityLevel: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: 'Remote',
    },
    jobType: {
      type: String,
      default: 'Full-time',
    },
    jdText: {
      type: String,
      default: '',
    },
    jdLink: {
      type: String,
      default: '',
    },
    notes: {
      type: String,
      default: '',
    },
    dateApplied: {
      type: Date,
      default: Date.now,
    },
    followUpDate: {
      type: Date,
      default: null,
    },
    salaryRange: {
      type: String,
      default: '',
    },
    resumeBullets: {
      type: [String],
      default: [],
    },
    matchScore: {
      type: Number,
      default: 0,
    },
    coverLetterSnippet: {
      type: String,
      default: '',
    },
    matchReason: {
      type: String,
      default: '',
    },
    priority: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      default: 'Medium',
    },
  },
  {
    timestamps: true,
  }
);

export const Application = mongoose.model<IApplication>(
  'Application',
  applicationSchema
);
