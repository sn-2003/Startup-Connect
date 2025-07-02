export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  savedJobs: string[];
  createdAt: Date;
}

export interface Startup {
  id: string;
  userId: string;
  name: string;
  domain: string;
  stage: 'idea' | 'mvp' | 'early' | 'growth' | 'scale';
  description: string;
  logo?: string;
  founded: string;
  location: string;
  employees: string;
  funding: string;
  website?: string;
  industry: string;
  upvotes: number;
  downvotes: number;
  createdAt: Date;
}

export interface StartupVote {
  id: string;
  userId: string;
  startupId: string;
  type: 'upvote' | 'downvote';
  createdAt: Date;
}

export interface StartupFeedback {
  id: string;
  userId: string;
  startupId: string;
  userName: string;
  userEmail: string;
  comment: string;
  createdAt: Date;
}

export interface Job {
  id: string;
  startupId: string;
  startupName: string;
  title: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  description: string;
  requirements: string[];
  experienceLevel: 'entry' | 'mid' | 'senior' | 'lead';
  salaryMin?: number;
  salaryMax?: number;
  remote: boolean;
  customQuestions: CustomQuestion[];
  createdAt: Date;
  applications: number;
}

export interface CustomQuestion {
  id: string;
  question: string;
  type: 'text' | 'textarea' | 'url';
  required: boolean;
}

export interface Resume {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  bio: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
  customSections: CustomSection[];
  resumeText?: string;
  createdAt: Date;
}

export interface CustomSection {
  id: string;
  title: string;
  content: string;
  order: number;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

export interface Investor {
  id: string;
  name: string;
  firm: string;
  preferredStage: string[];
  sectors: string[];
  geography: string[];
  description: string;
  portfolio: string[];
  email: string;
  linkedin?: string;
  imageUrl: string;
}

export interface Application {
  id: string;
  userId: string;
  jobId: string;
  jobTitle: string;
  startupName: string;
  applicantName: string;
  applicantEmail: string;
  customAnswers: CustomAnswer[];
  appliedAt: Date;
  status: 'submitted' | 'reviewed' | 'shortlisted' | 'rejected';
}

export interface CustomAnswer {
  questionId: string;
  answer: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: 'playbook' | 'template' | 'guide' | 'tool';
  type: 'pdf' | 'link' | 'video';
  url: string;
  imageUrl: string;
  featured: boolean;
}