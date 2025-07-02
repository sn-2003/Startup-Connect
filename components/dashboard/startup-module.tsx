'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/use-auth';
import { mockAPI } from '@/lib/mock-data';
import { Startup, Job, CustomQuestion } from '@/lib/types';
import ApplicantList from './applicant-list';
import { Building2, Plus, MapPin, Users, TrendingUp, Edit, Trash2, Eye, Briefcase, X, Save, UserCheck } from 'lucide-react';

export default function StartupModule() {
  const { user } = useAuth();
  const [startups, setStartups] = useState<Startup[]>([]);
  const [selectedStartup, setSelectedStartup] = useState<Startup | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('startups');
  const [editingStartup, setEditingStartup] = useState<Startup | null>(null);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [customQuestions, setCustomQuestions] = useState<CustomQuestion[]>([]);
  const [selectedJobForApplicants, setSelectedJobForApplicants] = useState<Job | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;

      try {
        const startupsData = await mockAPI.getStartupsByUserId(user.id);
        setStartups(startupsData);
        
        if (startupsData.length > 0) {
          setSelectedStartup(startupsData[0]);
          const jobsData = await mockAPI.getJobsByStartupId(startupsData[0].id);
          setJobs(jobsData);
        }
      } catch (error) {
        console.error('Error loading startup data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  useEffect(() => {
    const loadJobs = async () => {
      if (selectedStartup) {
        try {
          const jobsData = await mockAPI.getJobsByStartupId(selectedStartup.id);
          setJobs(jobsData);
        } catch (error) {
          console.error('Error loading jobs:', error);
        }
      }
    };

    loadJobs();
  }, [selectedStartup]);

  const handleStartupSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    const formData = new FormData(e.currentTarget);
    
    const startupData = {
      userId: user.id,
      name: formData.get('name') as string,
      domain: formData.get('domain') as string,
      stage: formData.get('stage') as 'idea' | 'mvp' | 'early' | 'growth' | 'scale',
      description: formData.get('description') as string,
      founded: formData.get('founded') as string,
      location: formData.get('location') as string,
      employees: formData.get('employees') as string,
      funding: formData.get('funding') as string,
      website: formData.get('website') as string,
      industry: formData.get('industry') as string,
    };

    try {
      if (editingStartup) {
        const updatedStartup = await mockAPI.updateStartup(editingStartup.id, startupData);
        setStartups(startups.map(s => s.id === editingStartup.id ? updatedStartup : s));
        if (selectedStartup?.id === editingStartup.id) {
          setSelectedStartup(updatedStartup);
        }
        setEditingStartup(null);
      } else {
        const newStartup = await mockAPI.createStartup(startupData);
        setStartups([...startups, newStartup]);
        if (!selectedStartup) {
          setSelectedStartup(newStartup);
        }
      }
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error('Error saving startup:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteStartup = async (startupId: string) => {
    try {
      await mockAPI.deleteStartup(startupId);
      const updatedStartups = startups.filter(s => s.id !== startupId);
      setStartups(updatedStartups);
      
      if (selectedStartup?.id === startupId) {
        setSelectedStartup(updatedStartups.length > 0 ? updatedStartups[0] : null);
      }
    } catch (error) {
      console.error('Error deleting startup:', error);
    }
  };

  const addCustomQuestion = () => {
    const newQuestion: CustomQuestion = {
      id: Date.now().toString(),
      question: '',
      type: 'text',
      required: false,
    };
    setCustomQuestions([...customQuestions, newQuestion]);
  };

  const updateCustomQuestion = (id: string, updates: Partial<CustomQuestion>) => {
    setCustomQuestions(customQuestions.map(q => 
      q.id === id ? { ...q, ...updates } : q
    ));
  };

  const removeCustomQuestion = (id: string) => {
    setCustomQuestions(customQuestions.filter(q => q.id !== id));
  };

  const handleJobSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedStartup) return;

    setSaving(true);
    const formData = new FormData(e.currentTarget);
    
    const jobData = {
      startupId: selectedStartup.id,
      startupName: selectedStartup.name,
      title: formData.get('title') as string,
      location: formData.get('location') as string,
      type: formData.get('type') as 'full-time' | 'part-time' | 'contract' | 'internship',
      description: formData.get('description') as string,
      requirements: (formData.get('requirements') as string).split('\n').filter(req => req.trim()),
      experienceLevel: formData.get('experienceLevel') as 'entry' | 'mid' | 'senior' | 'lead',
      salaryMin: parseInt(formData.get('salaryMin') as string) || 0,
      salaryMax: parseInt(formData.get('salaryMax') as string) || 0,
      remote: formData.get('remote') === 'true',
      customQuestions: customQuestions.filter(q => q.question.trim()),
    };

    try {
      if (editingJob) {
        const updatedJob = await mockAPI.updateJob(editingJob.id, jobData);
        setJobs(jobs.map(j => j.id === editingJob.id ? updatedJob : j));
        setEditingJob(null);
      } else {
        const newJob = await mockAPI.createJob(jobData);
        setJobs([newJob, ...jobs]);
      }
      setCustomQuestions([]);
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error('Error saving job:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleEditJob = (job: Job) => {
    setEditingJob(job);
    setCustomQuestions(job.customQuestions);
    setActiveTab('jobs');
  };

  const handleDeleteJob = async (jobId: string) => {
    try {
      await mockAPI.deleteJob(jobId);
      setJobs(jobs.filter(j => j.id !== jobId));
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Startups</h1>
        <p className="text-gray-600">Manage your startup profiles and job postings</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="startups">My Startups</TabsTrigger>
          <TabsTrigger value="jobs">Job Postings</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="startups" className="space-y-6">
          {/* Startup List */}
          {startups.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Your Startups</CardTitle>
                <CardDescription>Select a startup to manage or create a new one</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {startups.map((startup) => (
                    <div 
                      key={startup.id} 
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedStartup?.id === startup.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedStartup(startup)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{startup.name}</h3>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingStartup(startup);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteStartup(startup.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{startup.description}</p>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">{startup.stage}</Badge>
                        <Badge variant="outline">{startup.industry}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Create/Edit Startup Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="h-5 w-5" />
                <span>{editingStartup ? 'Edit Startup' : 'Create New Startup'}</span>
              </CardTitle>
              <CardDescription>
                {editingStartup ? 'Update your startup information' : 'Register a new startup to get started'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleStartupSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Company Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      required
                      defaultValue={editingStartup?.name || ''}
                      placeholder="Your startup name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="domain">Domain</Label>
                    <Input
                      id="domain"
                      name="domain"
                      defaultValue={editingStartup?.domain || ''}
                      placeholder="yourcompany.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry *</Label>
                    <Select name="industry" defaultValue={editingStartup?.industry || ''}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SaaS">SaaS</SelectItem>
                        <SelectItem value="Analytics">Analytics</SelectItem>
                        <SelectItem value="FinTech">FinTech</SelectItem>
                        <SelectItem value="HealthTech">HealthTech</SelectItem>
                        <SelectItem value="EdTech">EdTech</SelectItem>
                        <SelectItem value="E-commerce">E-commerce</SelectItem>
                        <SelectItem value="AI/ML">AI/ML</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stage">Stage *</Label>
                    <Select name="stage" defaultValue={editingStartup?.stage || ''}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select stage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="idea">Idea</SelectItem>
                        <SelectItem value="mvp">MVP</SelectItem>
                        <SelectItem value="early">Early Stage</SelectItem>
                        <SelectItem value="growth">Growth</SelectItem>
                        <SelectItem value="scale">Scale</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="founded">Founded Year</Label>
                    <Input
                      id="founded"
                      name="founded"
                      type="number"
                      min="1900"
                      max="2024"
                      defaultValue={editingStartup?.founded || ''}
                      placeholder="2023"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      defaultValue={editingStartup?.location || ''}
                      placeholder="San Francisco, CA"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employees">Team Size</Label>
                    <Select name="employees" defaultValue={editingStartup?.employees || ''}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select team size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-5">1-5 employees</SelectItem>
                        <SelectItem value="6-10">6-10 employees</SelectItem>
                        <SelectItem value="11-25">11-25 employees</SelectItem>
                        <SelectItem value="26-50">26-50 employees</SelectItem>
                        <SelectItem value="51-100">51-100 employees</SelectItem>
                        <SelectItem value="100+">100+ employees</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="funding">Funding Stage</Label>
                    <Select name="funding" defaultValue={editingStartup?.funding || ''}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select funding stage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Bootstrapped">Bootstrapped</SelectItem>
                        <SelectItem value="Pre-seed">Pre-seed</SelectItem>
                        <SelectItem value="Seed">Seed</SelectItem>
                        <SelectItem value="Series A">Series A</SelectItem>
                        <SelectItem value="Series B">Series B</SelectItem>
                        <SelectItem value="Series C+">Series C+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      name="website"
                      type="url"
                      defaultValue={editingStartup?.website || ''}
                      placeholder="https://yourcompany.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    required
                    rows={4}
                    defaultValue={editingStartup?.description || ''}
                    placeholder="Describe what your startup does..."
                  />
                </div>
                <div className="flex items-center space-x-3">
                  <Button type="submit" disabled={saving}>
                    {saving ? 'Saving...' : (editingStartup ? 'Update Startup' : 'Create Startup')}
                  </Button>
                  {editingStartup && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setEditingStartup(null)}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="jobs" className="space-y-6">
          {!selectedStartup ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Building2 className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">No startup selected</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Create or select a startup to manage job postings.
                  </p>
                  <div className="mt-6">
                    <Button onClick={() => setActiveTab('startups')}>
                      Manage Startups
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Startup Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Select Startup for Job Posting</CardTitle>
                  <CardDescription>Choose which startup to post jobs for</CardDescription>
                </CardHeader>
                <CardContent>
                  <Select 
                    value={selectedStartup.id} 
                    onValueChange={(value) => {
                      const startup = startups.find(s => s.id === value);
                      if (startup) setSelectedStartup(startup);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {startups.map((startup) => (
                        <SelectItem key={startup.id} value={startup.id}>
                          {startup.name} ({startup.industry})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Plus className="h-5 w-5" />
                    <span>{editingJob ? 'Edit Job' : 'Post New Job'} for {selectedStartup.name}</span>
                  </CardTitle>
                  <CardDescription>
                    {editingJob ? 'Update job listing details' : 'Create a job listing to attract talented candidates'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleJobSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="title">Job Title *</Label>
                        <Input
                          id="title"
                          name="title"
                          required
                          defaultValue={editingJob?.title || ''}
                          placeholder="Senior Frontend Developer"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="type">Employment Type *</Label>
                        <Select name="type" defaultValue={editingJob?.type || ''}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="full-time">Full-time</SelectItem>
                            <SelectItem value="part-time">Part-time</SelectItem>
                            <SelectItem value="contract">Contract</SelectItem>
                            <SelectItem value="internship">Internship</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          name="location"
                          defaultValue={editingJob?.location || ''}
                          placeholder="San Francisco, CA"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="experienceLevel">Experience Level *</Label>
                        <Select name="experienceLevel" defaultValue={editingJob?.experienceLevel || ''}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="entry">Entry Level</SelectItem>
                            <SelectItem value="mid">Mid Level</SelectItem>
                            <SelectItem value="senior">Senior Level</SelectItem>
                            <SelectItem value="lead">Lead Level</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="salaryMin">Minimum Salary</Label>
                        <Input
                          id="salaryMin"
                          name="salaryMin"
                          type="number"
                          defaultValue={editingJob?.salaryMin || ''}
                          placeholder="80000"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="salaryMax">Maximum Salary</Label>
                        <Input
                          id="salaryMax"
                          name="salaryMax"
                          type="number"
                          defaultValue={editingJob?.salaryMax || ''}
                          placeholder="120000"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="remote">Remote Work</Label>
                      <Select name="remote" defaultValue={editingJob?.remote ? 'true' : 'false'}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select remote option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Remote</SelectItem>
                          <SelectItem value="false">On-site</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Job Description *</Label>
                      <Textarea
                        id="description"
                        name="description"
                        required
                        rows={4}
                        defaultValue={editingJob?.description || ''}
                        placeholder="Describe the role, responsibilities, and what you're looking for..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="requirements">Requirements (one per line)</Label>
                      <Textarea
                        id="requirements"
                        name="requirements"
                        rows={4}
                        defaultValue={editingJob?.requirements.join('\n') || ''}
                        placeholder="React experience&#10;TypeScript&#10;5+ years experience&#10;Bachelor's degree"
                      />
                    </div>

                    {/* Custom Questions */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Custom Application Questions</Label>
                        <Button type="button" variant="outline" size="sm" onClick={addCustomQuestion}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Question
                        </Button>
                      </div>
                      
                      {customQuestions.map((question) => (
                        <div key={question.id} className="border rounded-lg p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <Label>Question {customQuestions.indexOf(question) + 1}</Label>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeCustomQuestion(question.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <Input
                            placeholder="Enter your question..."
                            value={question.question}
                            onChange={(e) => updateCustomQuestion(question.id, { question: e.target.value })}
                          />
                          <div className="flex items-center space-x-4">
                            <Select 
                              value={question.type} 
                              onValueChange={(value) => updateCustomQuestion(question.id, { type: value as any })}
                            >
                              <SelectTrigger className="w-40">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="text">Short Text</SelectItem>
                                <SelectItem value="textarea">Long Text</SelectItem>
                                <SelectItem value="url">URL</SelectItem>
                              </SelectContent>
                            </Select>
                            <label className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={question.required}
                                onChange={(e) => updateCustomQuestion(question.id, { required: e.target.checked })}
                              />
                              <span className="text-sm">Required</span>
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center space-x-3">
                      <Button type="submit" disabled={saving}>
                        {saving ? 'Saving...' : (editingJob ? 'Update Job' : 'Post Job')}
                      </Button>
                      {editingJob && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => {
                            setEditingJob(null);
                            setCustomQuestions([]);
                          }}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Job Postings for {selectedStartup.name}</CardTitle>
                  <CardDescription>
                    Manage your active job listings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {jobs.length === 0 ? (
                    <div className="text-center py-6">
                      <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-semibold text-gray-900">No job postings</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Create your first job posting to start attracting candidates.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {jobs.map((job) => (
                        <div key={job.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">{job.title}</h3>
                              <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                <span className="flex items-center">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  {job.location}
                                </span>
                                <span className="flex items-center">
                                  <Users className="h-4 w-4 mr-1" />
                                  {job.applications} applications
                                </span>
                              </div>
                              <div className="flex items-center space-x-2 mt-2">
                                <Badge variant={job.remote ? 'default' : 'secondary'}>
                                  {job.remote ? 'Remote' : 'On-site'}
                                </Badge>
                                <Badge variant="outline">{job.type}</Badge>
                                <Badge variant="outline">{job.experienceLevel}</Badge>
                                {job.customQuestions.length > 0 && (
                                  <Badge variant="outline">
                                    {job.customQuestions.length} custom question{job.customQuestions.length !== 1 ? 's' : ''}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                {job.description}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleEditJob(job)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => setSelectedJobForApplicants(job)}
                                  >
                                    <UserCheck className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle>Applicants</DialogTitle>
                                    <DialogDescription>
                                      Review and manage applications for this job
                                    </DialogDescription>
                                  </DialogHeader>
                                  {selectedJobForApplicants && (
                                    <ApplicantList job={selectedJobForApplicants} />
                                  )}
                                </DialogContent>
                              </Dialog>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleDeleteJob(job.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Startups</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{startups.length}</div>
                <p className="text-xs text-muted-foreground">
                  Registered startups
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{jobs.length}</div>
                <p className="text-xs text-muted-foreground">
                  Active job postings
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Applications</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {jobs.reduce((total, job) => total + job.applications, 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total applications received
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Applications</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {jobs.length > 0 ? Math.round(jobs.reduce((total, job) => total + job.applications, 0) / jobs.length) : 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Per job posting
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}