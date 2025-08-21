import { 
  User as PrismaUser, 
  Startup as PrismaStartup, 
  Job as PrismaJob, 
  Resume as PrismaResume,
  Experience as PrismaExperience,
  Education as PrismaEducation,
  CustomSection as PrismaCustomSection,
  Application as PrismaApplication,
  CustomQuestion as PrismaCustomQuestion,
  CustomAnswer as PrismaCustomAnswer,
  SavedJob as PrismaSavedJob,
  StartupVote as PrismaStartupVote,
  StartupFeedback as PrismaStartupFeedback,
  Investor as PrismaInvestor,
  Resource as PrismaResource,
  StartupStage,
  JobType,
  ExperienceLevel,
  QuestionType,
  ApplicationStatus,
  VoteType
} from '@prisma/client';

// Re-export Prisma types
export type User = PrismaUser;
export type Startup = PrismaStartup;
export type Job = PrismaJob;
// Extended Resume type with PDF fields
export interface Resume extends PrismaResume {
  // pdfUrl and pdfFileName are already defined in PrismaResume as string | null
  // No need to redeclare them here
}
export type Experience = PrismaExperience;
export type Education = PrismaEducation;
export type CustomSection = PrismaCustomSection;
export type Application = PrismaApplication;
export type CustomQuestion = PrismaCustomQuestion;
export type CustomAnswer = PrismaCustomAnswer;
export type SavedJob = PrismaSavedJob;
export type StartupVote = PrismaStartupVote;
export type StartupFeedback = PrismaStartupFeedback;
export type Investor = PrismaInvestor;
export type Resource = PrismaResource;

// Add CoinTransaction type
export interface CoinTransaction {
  id: string;
  userId: string;
  amount: number;
  action: string;
  description: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

// Add StartupReel type
export interface StartupReel {
  id: string;
  title: string;
  description?: string | null;
  instagramUrl: string;
  embedId: string;
  startupId: string;
  userId: string;
  featured: boolean;
  active: boolean;
  views: number;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface StartupReelWithRelations extends StartupReel {
  startup: Pick<Startup, 'id' | 'name' | 'logo' | 'industry' | 'stage'>;
  user: Pick<User, 'id' | 'name'>;
}

// Re-export enums
export { 
  StartupStage, 
  JobType, 
  ExperienceLevel, 
  QuestionType, 
  ApplicationStatus, 
  VoteType 
};

// Extended types with relations
export interface StartupWithRelations extends Startup {
  user: User;
  jobs: Job[];
  votes: StartupVote[];
  feedback: (StartupFeedback & { user: Pick<User, 'name' | 'email'> })[];
}

export interface JobWithRelations extends Job {
  startup: Pick<Startup, 'id' | 'name' | 'logo'>;
  customQuestions: CustomQuestion[];
  applications: Application[];
  savedJobs: SavedJob[];
}

// Job with startup info for API responses
export interface JobWithStartup extends Job {
  startup?: {
    id: string;
    name: string;
    logo: string | null;
    linkedinUrl: string | null;
    instagramUrl: string | null;
    xUrl: string | null;
    website?: string | null;
    description?: string | null;
    industry?: string | null;
    stage?: string | null;
    founded?: string | null;
    employees?: string | null;
    funding?: string | null;
  };
  startupName: string;
  applications: number | Array<{ id: string }>; // Can be a number or an array of objects with id
  customQuestions?: CustomQuestion[];
  savedJobs?: SavedJob[] | Array<{ id: string; userId: string }>;
  unpaid: boolean;
}

// Resume with all relations
export interface ResumeWithRelations extends Resume {
  user: User;
  experience: Experience[];
  education: Education[];
  customSections: CustomSection[];
}

// Application with all relations
export interface ApplicationWithRelations extends Application {
  user: User & {
    resume?: ResumeWithRelations;
  };
  job: JobWithRelations;
  customAnswers: (CustomAnswer & { question: CustomQuestion })[];
}

// Application with job info for bulk exports
export interface ApplicationWithJobInfo extends ApplicationWithRelations {
  jobTitle?: string;
}

// Enhanced Application type for frontend use
export interface ApplicationWithJobDetails extends Application {
  job?: {
    id: string;
    title: string;
    startup?: {
      name: string;
      logo?: string;
    };
    customQuestions?: CustomQuestion[];
  };
  customAnswers?: (CustomAnswer & { question: CustomQuestion })[];
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  details?: Array<{
    path: string[];
    message: string;
    code: string;
  }>;
}

// Form data types
export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface StartupFormData {
  name: string;
  domain?: string;
  stage: StartupStage;
  description: string;
  founded?: string;
  location?: string;
  employees?: string;
  funding?: string;
  website?: string;
  industry: string;
}

export interface JobFormData {
  title: string;
  location?: string;
  type: JobType;
  description: string;
  requirements: string[];
  experienceLevel: ExperienceLevel;
  salaryMin?: number;
  salaryMax?: number;
  remote: boolean;
  customQuestions: Omit<CustomQuestion, 'id' | 'jobId'>[];
}

export interface ResumeFormData {
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  skills: string[];
  resumeText?: string;
  experience: Omit<Experience, 'id' | 'resumeId' | 'createdAt' | 'updatedAt'>[];
  education: Omit<Education, 'id' | 'resumeId' | 'createdAt' | 'updatedAt'>[];
  customSections: Omit<CustomSection, 'id' | 'resumeId' | 'createdAt' | 'updatedAt'>[];
}

// JWT Payload type for auth
export interface JWTPayload {
  id: string;
  email: string;
  name: string;
  exp?: number;
}

// Custom Answer for applications
export interface CustomAnswerInput {
  questionId: string;
  answer: string;
}