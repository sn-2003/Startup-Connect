import { z } from 'zod';
import { StartupStage, JobType, ExperienceLevel, QuestionType } from '@prisma/client';

// Custom URL validation that allows www. URLs
const urlWithWww = z.string().refine((val) => {
  if (!val || val === '') return true; // Allow empty strings
  try {
    // Add https:// if the URL doesn't start with http:// or https://
    let urlToTest = val;
    if (!val.startsWith('http://') && !val.startsWith('https://')) {
      urlToTest = `https://${val}`;
    }
    new URL(urlToTest);
    return true;
  } catch {
    return false;
  }
}, 'Please enter a valid URL (e.g., https://example.com or www.example.com)');

// Auth validations
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Startup validations
export const startupSchema = z.object({
  name: z.string().min(2, 'Company name must be at least 2 characters'),
  domain: z.string().optional(),
  stage: z.nativeEnum(StartupStage),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  founded: z.string().optional(),
  location: z.string().optional(),
  employees: z.string().optional(),
  funding: z.string().optional(),
  website: urlWithWww.optional().or(z.literal('')),
  industry: z.string().min(1, 'Industry is required'),
  logo: z.string().nullable().optional(),
  xUrl: urlWithWww.optional().or(z.literal('')),
  instagramUrl: urlWithWww.optional().or(z.literal('')),
  linkedinUrl: urlWithWww.optional().or(z.literal('')),
  promotionalImages: z.array(z.string()).optional(),
});

// Job validations
export const customQuestionSchema = z.object({
  question: z.string().min(5, 'Question must be at least 5 characters'),
  type: z.nativeEnum(QuestionType),
  required: z.boolean().default(false),
  order: z.number().default(0),
});

export const jobSchema = z.object({
  startupId: z.string().cuid('Invalid startup ID'),
  title: z.string().min(2, 'Job title must be at least 2 characters'),
  location: z.string().optional(),
  type: z.nativeEnum(JobType),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  requirements: z.array(z.string()).default([]),
  experienceLevel: z.nativeEnum(ExperienceLevel),
  salaryMin: z.number().min(0).optional(),
  salaryMax: z.number().min(0).optional(),
  unpaid: z.boolean().default(false),
  remote: z.boolean().default(false),
  customQuestions: z.array(customQuestionSchema).default([]),
}).refine((data) => {
  if (data.unpaid) {
    // If unpaid, salaryMin and salaryMax must be undefined or zero
    return (!data.salaryMin || data.salaryMin === 0) && (!data.salaryMax || data.salaryMax === 0);
  }
  // If paid, allow salaryMin/salaryMax as before
  return true;
}, {
  message: 'Unpaid jobs cannot have a salary range.',
  path: ['salaryMin', 'salaryMax'],
});

// Resume validations
export const experienceSchema = z.object({
  company: z.string().min(1, 'Company name is required'),
  position: z.string().min(1, 'Position is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  description: z.string().optional(),
  order: z.number().default(0),
});

export const educationSchema = z.object({
  institution: z.string().min(1, 'Institution is required'),
  degree: z.string().min(1, 'Degree is required'),
  field: z.string().min(1, 'Field of study is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  gpa: z.string().optional(),
  order: z.number().default(0),
});

export const customSectionSchema = z.object({
  title: z.string().min(1, 'Section title is required'),
  content: z.string().min(1, 'Section content is required'),
  order: z.number().default(0),
});

export const resumeSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  bio: z.string().optional(),
  skills: z.array(z.string()).default([]),
  resumeText: z.string().optional(),
  experience: z.array(experienceSchema).default([]),
  education: z.array(educationSchema).default([]),
  customSections: z.array(customSectionSchema).default([]),
}).refine((data) => {
  // Ensure all experience entries have required fields when not empty
  const validExperience = data.experience.every(exp => 
    !exp.company || (exp.company.trim() && exp.position.trim() && exp.startDate.trim())
  );
  
  // Ensure all education entries have required fields when not empty
  const validEducation = data.education.every(edu => 
    !edu.institution || (edu.institution.trim() && edu.degree.trim() && edu.field.trim() && edu.startDate.trim() && edu.endDate.trim())
  );
  
  return validExperience && validEducation;
}, {
  message: "Please fill in all required fields for experience and education entries",
  path: ["experience", "education"]
});

// User Profile validations
export const userProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Invalid email address'),
  website: urlWithWww.optional().or(z.literal('')),
  linkedin: urlWithWww.optional().or(z.literal('')),
  github: urlWithWww.optional().or(z.literal('')),
});

// Application validations
export const customAnswerSchema = z.object({
  questionId: z.string().cuid(),
  answer: z.string().min(1, 'Answer is required'),
});

export const applicationSchema = z.object({
  jobId: z.string().cuid(),
  customAnswers: z.array(customAnswerSchema).default([]),
});

// Feedback validations
export const feedbackSchema = z.object({
  startupId: z.string().cuid(),
  comment: z.string().min(5, 'Comment must be at least 5 characters'),
});

// Vote validations
export const voteSchema = z.object({
  startupId: z.string().cuid(),
  type: z.enum(['UPVOTE', 'DOWNVOTE']),
});