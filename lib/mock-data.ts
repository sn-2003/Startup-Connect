import { User, Startup, Job, Resume, Investor, Application, Resource, StartupVote, StartupFeedback, CustomQuestion, CustomAnswer, CustomSection } from './types';

// In-memory data stores
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    savedJobs: [],
    createdAt: new Date(),
  },
  {
    id: '2',
    name: 'Sarah Chen',
    email: 'sarah@techstartup.com',
    password: 'password123',
    savedJobs: [],
    createdAt: new Date(),
  },
];

export const mockStartups: Startup[] = [
  {
    id: '1',
    userId: '2',
    name: 'TechFlow',
    domain: 'techflow.com',
    stage: 'growth',
    description: 'AI-powered workflow automation for modern teams',
    logo: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    founded: '2022',
    location: 'San Francisco, CA',
    employees: '25-50',
    funding: 'Series A',
    website: 'https://techflow.com',
    industry: 'SaaS',
    upvotes: 15,
    downvotes: 2,
    createdAt: new Date(),
  },
  {
    id: '2',
    userId: '1',
    name: 'DataViz Pro',
    domain: 'datavizpro.com',
    stage: 'mvp',
    description: 'Beautiful data visualization tools for businesses',
    logo: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    founded: '2023',
    location: 'New York, NY',
    employees: '5-10',
    funding: 'Seed',
    website: 'https://datavizpro.com',
    industry: 'Analytics',
    upvotes: 8,
    downvotes: 1,
    createdAt: new Date(),
  },
];

export const mockStartupVotes: StartupVote[] = [];
export const mockStartupFeedback: StartupFeedback[] = [
  {
    id: '1',
    userId: '1',
    startupId: '1',
    userName: 'John Doe',
    userEmail: 'john@example.com',
    comment: 'Great product! Really helps with our team workflow.',
    createdAt: new Date(),
  },
];

export const mockJobs: Job[] = [
  {
    id: '1',
    startupId: '1',
    startupName: 'TechFlow',
    title: 'Senior Frontend Developer',
    location: 'San Francisco, CA',
    type: 'full-time',
    description: 'Join our growing team to build the future of workflow automation. We are looking for a senior frontend developer with React and TypeScript experience.',
    requirements: ['React', 'TypeScript', 'Next.js', '5+ years experience'],
    experienceLevel: 'senior',
    salaryMin: 120000,
    salaryMax: 160000,
    remote: true,
    customQuestions: [
      {
        id: '1',
        question: 'Why do you want to join TechFlow?',
        type: 'textarea',
        required: true,
      },
      {
        id: '2',
        question: 'Link to your GitHub profile',
        type: 'url',
        required: false,
      },
    ],
    createdAt: new Date(),
    applications: 12,
  },
  {
    id: '2',
    startupId: '1',
    startupName: 'TechFlow',
    title: 'Product Designer',
    location: 'San Francisco, CA',
    type: 'full-time',
    description: 'Design beautiful and intuitive user experiences for our AI-powered platform.',
    requirements: ['Figma', 'User Research', 'Prototyping', '3+ years experience'],
    experienceLevel: 'mid',
    salaryMin: 90000,
    salaryMax: 130000,
    remote: true,
    customQuestions: [
      {
        id: '3',
        question: 'Share a link to your design portfolio',
        type: 'url',
        required: true,
      },
    ],
    createdAt: new Date(),
    applications: 8,
  },
];

export const mockResumes: Resume[] = [];

export const mockInvestors: Investor[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    firm: 'Venture Capital Partners',
    preferredStage: ['Seed', 'Series A'],
    sectors: ['SaaS', 'AI/ML', 'Enterprise'],
    geography: ['North America', 'Europe'],
    description: 'Former founder turned investor, focusing on B2B software and AI technologies.',
    portfolio: ['DataCorp', 'CloudTech', 'AutomateAI'],
    email: 'alex@vcpartners.com',
    linkedin: 'https://linkedin.com/in/alexjohnson',
    imageUrl: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
  },
  {
    id: '2',
    name: 'Maria Rodriguez',
    firm: 'TechAngels',
    preferredStage: ['Pre-seed', 'Seed'],
    sectors: ['FinTech', 'HealthTech', 'EdTech'],
    geography: ['Global'],
    description: 'Angel investor with 15+ years in tech, specializing in early-stage consumer and enterprise startups.',
    portfolio: ['PaymentPro', 'HealthAI', 'LearnFast'],
    email: 'maria@techangels.com',
    linkedin: 'https://linkedin.com/in/mariarodriguez',
    imageUrl: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
  },
];

export const mockApplications: Application[] = [];

export const mockResources: Resource[] = [
  {
    id: '1',
    title: 'The Complete Startup Playbook',
    description: 'Essential guide covering everything from idea validation to scaling your business.',
    category: 'playbook',
    type: 'pdf',
    url: '#',
    imageUrl: 'https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    featured: true,
  },
  {
    id: '2',
    title: 'Pitch Deck Template',
    description: 'Professional pitch deck template used by successful startups to raise funding.',
    category: 'template',
    type: 'pdf',
    url: '#',
    imageUrl: 'https://images.pexels.com/photos/3184639/pexels-photo-3184639.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    featured: true,
  },
  {
    id: '3',
    title: 'Fundraising Guide 2024',
    description: 'Comprehensive guide to raising venture capital in the current market.',
    category: 'guide',
    type: 'link',
    url: '#',
    imageUrl: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    featured: false,
  },
  {
    id: '4',
    title: 'MVP Development Framework',
    description: 'Step-by-step framework for building and launching your minimum viable product.',
    category: 'playbook',
    type: 'pdf',
    url: '#',
    imageUrl: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    featured: false,
  },
];

// Mock API functions
export const mockAPI = {
  // Authentication
  login: async (email: string, password: string): Promise<User | null> => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    const user = mockUsers.find(u => u.email === email && u.password === password);
    return user || null;
  },

  register: async (name: string, email: string, password: string): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      password,
      savedJobs: [],
      createdAt: new Date(),
    };
    mockUsers.push(newUser);
    return newUser;
  },

  // Saved Jobs
  saveJob: async (userId: string, jobId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const user = mockUsers.find(u => u.id === userId);
    if (user && !user.savedJobs.includes(jobId)) {
      user.savedJobs.push(jobId);
    }
  },

  unsaveJob: async (userId: string, jobId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
      user.savedJobs = user.savedJobs.filter(id => id !== jobId);
    }
  },

  getSavedJobs: async (userId: string): Promise<Job[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const user = mockUsers.find(u => u.id === userId);
    if (!user) return [];
    
    return mockJobs.filter(job => user.savedJobs.includes(job.id));
  },

  isJobSaved: async (userId: string, jobId: string): Promise<boolean> => {
    const user = mockUsers.find(u => u.id === userId);
    return user ? user.savedJobs.includes(jobId) : false;
  },

  // Startups
  getAllStartups: async (): Promise<Startup[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...mockStartups];
  },

  getStartupsByUserId: async (userId: string): Promise<Startup[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockStartups.filter(s => s.userId === userId);
  },

  getStartupByUserId: async (userId: string): Promise<Startup | null> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockStartups.find(s => s.userId === userId) || null;
  },

  createStartup: async (startupData: Omit<Startup, 'id' | 'createdAt' | 'upvotes' | 'downvotes'>): Promise<Startup> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newStartup: Startup = {
      ...startupData,
      id: Date.now().toString(),
      upvotes: 0,
      downvotes: 0,
      createdAt: new Date(),
    };
    mockStartups.push(newStartup);
    return newStartup;
  },

  updateStartup: async (id: string, updates: Partial<Startup>): Promise<Startup> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockStartups.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Startup not found');
    mockStartups[index] = { ...mockStartups[index], ...updates };
    return mockStartups[index];
  },

  deleteStartup: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockStartups.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Startup not found');
    mockStartups.splice(index, 1);
  },

  // Startup Voting & Feedback
  voteStartup: async (userId: string, startupId: string, type: 'upvote' | 'downvote'): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Remove existing vote if any
    const existingVoteIndex = mockStartupVotes.findIndex(v => v.userId === userId && v.startupId === startupId);
    if (existingVoteIndex !== -1) {
      const existingVote = mockStartupVotes[existingVoteIndex];
      const startup = mockStartups.find(s => s.id === startupId);
      if (startup) {
        if (existingVote.type === 'upvote') startup.upvotes--;
        else startup.downvotes--;
      }
      mockStartupVotes.splice(existingVoteIndex, 1);
    }

    // Add new vote
    const newVote: StartupVote = {
      id: Date.now().toString(),
      userId,
      startupId,
      type,
      createdAt: new Date(),
    };
    mockStartupVotes.push(newVote);

    // Update startup counts
    const startup = mockStartups.find(s => s.id === startupId);
    if (startup) {
      if (type === 'upvote') startup.upvotes++;
      else startup.downvotes++;
    }
  },

  getUserVote: async (userId: string, startupId: string): Promise<StartupVote | null> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockStartupVotes.find(v => v.userId === userId && v.startupId === startupId) || null;
  },

  addStartupFeedback: async (userId: string, startupId: string, comment: string): Promise<StartupFeedback> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const user = mockUsers.find(u => u.id === userId);
    if (!user) throw new Error('User not found');

    const feedback: StartupFeedback = {
      id: Date.now().toString(),
      userId,
      startupId,
      userName: user.name,
      userEmail: user.email,
      comment,
      createdAt: new Date(),
    };
    mockStartupFeedback.push(feedback);
    return feedback;
  },

  getStartupFeedback: async (startupId: string): Promise<StartupFeedback[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockStartupFeedback.filter(f => f.startupId === startupId);
  },

  // Jobs
  getJobs: async (): Promise<Job[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...mockJobs];
  },

  getJobsByStartupId: async (startupId: string): Promise<Job[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockJobs.filter(j => j.startupId === startupId);
  },

  createJob: async (jobData: Omit<Job, 'id' | 'createdAt' | 'applications'>): Promise<Job> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newJob: Job = {
      ...jobData,
      id: Date.now().toString(),
      createdAt: new Date(),
      applications: 0,
    };
    mockJobs.push(newJob);
    return newJob;
  },

  updateJob: async (id: string, updates: Partial<Job>): Promise<Job> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockJobs.findIndex(j => j.id === id);
    if (index === -1) throw new Error('Job not found');
    mockJobs[index] = { ...mockJobs[index], ...updates };
    return mockJobs[index];
  },

  deleteJob: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockJobs.findIndex(j => j.id === id);
    if (index === -1) throw new Error('Job not found');
    mockJobs.splice(index, 1);
  },

  // Resumes
  getResumeByUserId: async (userId: string): Promise<Resume | null> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockResumes.find(r => r.userId === userId) || null;
  },

  createResume: async (resumeData: Omit<Resume, 'id' | 'createdAt'>): Promise<Resume> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newResume: Resume = {
      ...resumeData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    mockResumes.push(newResume);
    return newResume;
  },

  updateResume: async (id: string, updates: Partial<Resume>): Promise<Resume> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockResumes.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Resume not found');
    mockResumes[index] = { ...mockResumes[index], ...updates };
    return mockResumes[index];
  },

  // Applications
  applyToJob: async (userId: string, jobId: string, customAnswers: CustomAnswer[]): Promise<Application> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const user = mockUsers.find(u => u.id === userId);
    const job = mockJobs.find(j => j.id === jobId);
    
    if (!user || !job) throw new Error('User or job not found');

    const newApplication: Application = {
      id: Date.now().toString(),
      userId,
      jobId,
      jobTitle: job.title,
      startupName: job.startupName,
      applicantName: user.name,
      applicantEmail: user.email,
      customAnswers,
      appliedAt: new Date(),
      status: 'submitted',
    };
    mockApplications.push(newApplication);
    
    // Update job applications count
    const jobIndex = mockJobs.findIndex(j => j.id === jobId);
    if (jobIndex !== -1) {
      mockJobs[jobIndex].applications += 1;
    }
    
    return newApplication;
  },

  getUserApplications: async (userId: string): Promise<Application[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockApplications.filter(a => a.userId === userId);
  },

  getJobApplications: async (jobId: string): Promise<Application[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockApplications.filter(a => a.jobId === jobId);
  },

  updateApplicationStatus: async (applicationId: string, status: Application['status']): Promise<Application> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockApplications.findIndex(a => a.id === applicationId);
    if (index === -1) throw new Error('Application not found');
    
    mockApplications[index].status = status;
    return mockApplications[index];
  },

  // Investors
  getInvestors: async (): Promise<Investor[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...mockInvestors];
  },

  // Resources
  getResources: async (): Promise<Resource[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...mockResources];
  },
};