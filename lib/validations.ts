import { z } from 'zod';
import { StartupStage, JobType, ExperienceLevel, QuestionType } from '@prisma/client';

// Auth validations
export const loginSchema = z.object({
  email: z.string().email('Invalid email address').max(255),
  password: z.string().min(6, 'Password must be at least 6 characters').max(128),
});

export const registerSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  email: z.string().email('Invalid email address').max(255),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(128, 'Password must be less than 128 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number'),
});

// Startup validations
export const startupSchema = z.object({
  name: z.string()
    .min(2, 'Company name must be at least 2 characters')
    .max(100, 'Company name must be less than 100 characters')
    .regex(/^[a-zA-Z0-9\s\-&.]+$/, 'Company name contains invalid characters'),
  domain: z.string()
    .max(100, 'Domain must be less than 100 characters')
    .regex(/^[a-zA-Z0-9\-\.]+$/, 'Invalid domain format')
    .optional()
    .or(z.literal('')),
  stage: z.nativeEnum(StartupStage),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description must be less than 2000 characters'),
  founded: z.string()
    .max(4, 'Founded year must be 4 digits')
    .regex(/^\d{4}$/, 'Founded year must be a valid year')
    .optional()
    .or(z.literal('')),
  location: z.string()
    .max(100, 'Location must be less than 100 characters')
    .optional()
    .or(z.literal('')),
  employees: z.string()
    .max(50, 'Employee count must be less than 50 characters')
    .optional()
    .or(z.literal('')),
  funding: z.string()
    .max(50, 'Funding stage must be less than 50 characters')
    .optional()
    .or(z.literal('')),
  website: z.string()
    .url('Invalid website URL')
    .max(255, 'Website URL must be less than 255 characters')
    .optional()
    .or(z.literal('')),
  industry: z.string()
    .min(1, 'Industry is required')
    .max(50, 'Industry must be less than 50 characters'),
  logo: z.string()
    .url('Invalid logo URL')
    .max(500, 'Logo URL must be less than 500 characters')
    .optional()
    .or(z.literal('')),
});

// Job validations
export const customQuestionSchema = z.object({
  question: z.string()
    .min(5, 'Question must be at least 5 characters')
    .max(500, 'Question must be less than 500 characters'),
  type: z.nativeEnum(QuestionType),
  required: z.boolean().default(false),
  order: z.number().min(0).max(100).default(0),
});

export const jobSchema = z.object({
  startupId: z.string().cuid('Invalid startup ID'),
  title: z.string()
    .min(2, 'Job title must be at least 2 characters')
    .max(100, 'Job title must be less than 100 characters'),
  location: z.string()
    .max(100, 'Location must be less than 100 characters')
    .optional()
    .or(z.literal('')),
  type: z.nativeEnum(JobType),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(5000, 'Description must be less than 5000 characters'),
  requirements: z.array(z.string().max(200, 'Each requirement must be less than 200 characters')).max(20, 'Maximum 20 requirements allowed').default([]),
  experienceLevel: z.nativeEnum(ExperienceLevel),
  salaryMin: z.number().min(0, 'Minimum salary must be positive').max(10000000, 'Salary too high').optional(),
  salaryMax: z.number().min(0, 'Maximum salary must be positive').max(10000000, 'Salary too high').optional(),
  remote: z.boolean().default(false),
  customQuestions: z.array(customQuestionSchema).max(10, 'Maximum 10 custom questions allowed').default([]),
}).refine((data) => {
  if (data.salaryMin && data.salaryMax) {
    return data.salaryMin <= data.salaryMax;
  }
  return true;
}, {
  message: "Minimum salary must be less than or equal to maximum salary",
  path: ["salaryMin"],
});

// Resume validations
export const experienceSchema = z.object({
  company: z.string()
    .min(1, 'Company name is required')
    .max(100, 'Company name must be less than 100 characters'),
  position: z.string()
    .min(1, 'Position is required')
    .max(100, 'Position must be less than 100 characters'),
  startDate: z.string()
    .min(1, 'Start date is required')
    .regex(/^\d{4}-\d{2}$/, 'Start date must be in YYYY-MM format'),
  endDate: z.string()
    .regex(/^\d{4}-\d{2}$/, 'End date must be in YYYY-MM format')
    .optional()
    .or(z.literal('')),
  current: z.boolean().default(false),
  description: z.string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional()
    .or(z.literal('')),
  order: z.number().min(0).max(100).default(0),
});

export const educationSchema = z.object({
  institution: z.string()
    .min(1, 'Institution is required')
    .max(100, 'Institution name must be less than 100 characters'),
  degree: z.string()
    .min(1, 'Degree is required')
    .max(100, 'Degree must be less than 100 characters'),
  field: z.string()
    .min(1, 'Field of study is required')
    .max(100, 'Field of study must be less than 100 characters'),
  startDate: z.string()
    .min(1, 'Start date is required')
    .regex(/^\d{4}-\d{2}$/, 'Start date must be in YYYY-MM format'),
  endDate: z.string()
    .min(1, 'End date is required')
    .regex(/^\d{4}-\d{2}$/, 'End date must be in YYYY-MM format'),
  gpa: z.string()
    .max(10, 'GPA must be less than 10 characters')
    .optional()
    .or(z.literal('')),
  order: z.number().min(0).max(100).default(0),
});

export const customSectionSchema = z.object({
  title: z.string()
    .min(1, 'Section title is required')
    .max(100, 'Section title must be less than 100 characters'),
  content: z.string()
    .min(1, 'Section content is required')
    .max(2000, 'Section content must be less than 2000 characters'),
  order: z.number().min(0).max(100).default(0),
});

export const resumeSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Invalid email address').max(255),
  phone: z.string()
    .max(20, 'Phone number must be less than 20 characters')
    .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Invalid phone number format')
    .optional()
    .or(z.literal('')),
  bio: z.string()
    .max(1000, 'Bio must be less than 1000 characters')
    .optional()
    .or(z.literal('')),
  skills: z.array(z.string().max(50, 'Each skill must be less than 50 characters')).max(50, 'Maximum 50 skills allowed').default([]),
  resumeText: z.string()
    .max(10000, 'Resume text must be less than 10000 characters')
    .optional()
    .or(z.literal('')),
  experience: z.array(experienceSchema).max(20, 'Maximum 20 experience entries allowed').default([]),
  education: z.array(educationSchema).max(10, 'Maximum 10 education entries allowed').default([]),
  customSections: z.array(customSectionSchema).max(10, 'Maximum 10 custom sections allowed').default([]),
});

// Application validations
export const customAnswerSchema = z.object({
  questionId: z.string().cuid(),
  answer: z.string()
    .min(1, 'Answer is required')
    .max(2000, 'Answer must be less than 2000 characters'),
});

export const applicationSchema = z.object({
  jobId: z.string().cuid(),
  customAnswers: z.array(customAnswerSchema).max(10, 'Maximum 10 custom answers allowed').default([]),
});

// Feedback validations
export const feedbackSchema = z.object({
  startupId: z.string().cuid(),
  comment: z.string()
    .min(5, 'Comment must be at least 5 characters')
    .max(1000, 'Comment must be less than 1000 characters'),
});

// Vote validations
export const voteSchema = z.object({
  startupId: z.string().cuid(),
  type: z.enum(['UPVOTE', 'DOWNVOTE']),
});