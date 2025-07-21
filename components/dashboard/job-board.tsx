'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/use-auth';
import { apiClient } from '@/lib/api-client';
import { JobWithStartup, Application, CustomAnswerInput } from '@/lib/types';
import { Search, MapPin, Building2, Clock, DollarSign, Users, CheckCircle, Bookmark, BookmarkCheck, Linkedin } from 'lucide-react';
import { SocialIcons } from './social-icons';

export default function JobBoard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<JobWithStartup[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobWithStartup[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<JobWithStartup | null>(null);
  const [customAnswers, setCustomAnswers] = useState<CustomAnswerInput[]>([]);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [experienceFilter, setExperienceFilter] = useState('all');
  const [remoteFilter, setRemoteFilter] = useState('all');

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;

      try {
        const [jobsRes, applicationsRes, savedJobsRes] = await Promise.all([
          apiClient.getJobs(),
          apiClient.getMyApplications(),
          apiClient.getSavedJobs(),
        ]);

        if (jobsRes.success && jobsRes.data) {
          setJobs(jobsRes.data);
          setFilteredJobs(jobsRes.data);
        }

        if (applicationsRes.success && applicationsRes.data) {
          setApplications(applicationsRes.data);
        }

        if (savedJobsRes.success && savedJobsRes.data) {
          setSavedJobs(savedJobsRes.data.map((job: JobWithStartup) => job.id));
        }
      } catch (error) {
        console.error('Error loading job data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  useEffect(() => {
    let filtered = jobs;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (job.startup as any)?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(job => job.type === typeFilter);
    }

    // Experience filter
    if (experienceFilter !== 'all') {
      filtered = filtered.filter(job => job.experienceLevel === experienceFilter);
    }

    // Remote filter
    if (remoteFilter !== 'all') {
      filtered = filtered.filter(job => {
        if (remoteFilter === 'remote') return job.remote;
        if (remoteFilter === 'onsite') return !job.remote;
        return true;
      });
    }

    setFilteredJobs(filtered);
  }, [jobs, searchTerm, typeFilter, experienceFilter, remoteFilter]);

  const handleJobSelect = (job: JobWithStartup, showApplication = false) => {
    setSelectedJob(job);
    setShowApplicationForm(showApplication);
    // Initialize custom answers
    const initialAnswers = job.customQuestions?.map((q) => ({
      questionId: q.id,
      answer: '',
    })) || [];
    setCustomAnswers(initialAnswers);
  };

  const updateCustomAnswer = (questionId: string, answer: string) => {
    setCustomAnswers(prev => 
      prev.map(a => a.questionId === questionId ? { ...a, answer } : a)
    );
  };

  const handleApply = async (jobId: string) => {
    if (!user) return;

    setApplying(jobId);
    try {
      const response = await apiClient.applyToJob(jobId, customAnswers);
      if (response.success && response.data) {
        setApplications([...applications, response.data]);
        setSelectedJob(null); // Close dialog/modal
        setCustomAnswers([]);
        setShowApplicationForm(false);
        // TODO: Show a success toast/message here
      }
    } catch (error) {
      console.error('Error applying to job:', error);
    } finally {
      setApplying(null);
    }
  };

  const handleSaveJob = async (jobId: string) => {
    if (!user) return;

    setSaving(jobId);
    try {
      const isCurrentlySaved = savedJobs.includes(jobId);
      
      if (isCurrentlySaved) {
        const response = await apiClient.unsaveJob(jobId);
        if (response.success) {
          setSavedJobs(prev => prev.filter(id => id !== jobId));
        }
      } else {
        const response = await apiClient.saveJob(jobId);
        if (response.success) {
          setSavedJobs(prev => [...prev, jobId]);
        }
      }
    } catch (error) {
      console.error('Error saving/unsaving job:', error);
    } finally {
      setSaving(null);
    }
  };

  const hasApplied = (jobId: string) => {
    return applications.some(app => app.jobId === jobId);
  };

  const isJobSaved = (jobId: string) => {
    return savedJobs.includes(jobId);
  };

  const canApply = (job: JobWithStartup) => {
    // Only require custom answers if the application form is open for this job
    if (showApplicationForm && selectedJob && selectedJob.id === job.id && job.customQuestions && job.customQuestions.length > 0) {
      return job.customQuestions.every((q) => {
        if (!q.required) return true;
        const answer = customAnswers.find(a => a.questionId === q.id);
        return answer && answer.answer.trim();
      });
    }
    return true;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Job Board</h1>
        <p className="text-gray-600">Discover opportunities at innovative startups</p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Find Your Perfect Role</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search jobs, companies, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="FULL_TIME">Full-time</SelectItem>
                <SelectItem value="PART_TIME">Part-time</SelectItem>
                <SelectItem value="CONTRACT">Contract</SelectItem>
                <SelectItem value="INTERNSHIP">Internship</SelectItem>
              </SelectContent>
            </Select>
            <Select value={experienceFilter} onValueChange={setExperienceFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Experience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="ENTRY">Entry Level</SelectItem>
                <SelectItem value="MID">Mid Level</SelectItem>
                <SelectItem value="SENIOR">Senior Level</SelectItem>
                <SelectItem value="LEAD">Lead Level</SelectItem>
              </SelectContent>
            </Select>
            <Select value={remoteFilter} onValueChange={setRemoteFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="onsite">On-site</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Job Listings */}
      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <Card key={job.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Building2 className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{job.title}</h3>
                      <p className="text-gray-600">{job.startup?.name || job.startupName}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                    <span className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {job.location}
                    </span>
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {typeof job.applications === 'number' ? job.applications : (job.applications?.length || 0)} applications
                    </span>
                    {job.salaryMin && job.salaryMax && (
                      <span className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant={job.remote ? 'default' : 'secondary'}>
                      {job.remote ? 'Remote' : 'On-site'}
                    </Badge>
                    <Badge variant="outline">{job.type}</Badge>
                    <Badge variant="outline">{job.experienceLevel}</Badge>
                    {job.customQuestions && job.customQuestions.length > 0 && (
                      <Badge variant="outline">
                        {job.customQuestions.length} custom question{job.customQuestions.length !== 1 ? 's' : ''}
                      </Badge>
                    )}
                  </div>

                  <p className="text-gray-600 line-clamp-2 mb-4">
                    {job.description}
                  </p>

                  <div className="flex items-center space-x-3">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" onClick={() => handleJobSelect(job, false)}>
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="flex items-center space-x-2">
                            <Building2 className="h-5 w-5" />
                            <span>{selectedJob?.title}</span>
                          </DialogTitle>
                          <DialogDescription>
                            {selectedJob?.startup?.name || selectedJob?.startupName} • {selectedJob?.location}
                          </DialogDescription>
                        </DialogHeader>
                        {selectedJob && (
                          <div className="space-y-6">
                            <div className="flex flex-wrap gap-2">
                              <Badge variant={selectedJob.remote ? 'default' : 'secondary'}>
                                {selectedJob.remote ? 'Remote' : 'On-site'}
                              </Badge>
                              <Badge variant="outline">{selectedJob.type}</Badge>
                              <Badge variant="outline">{selectedJob.experienceLevel}</Badge>
                            </div>

                            {/* Social Media Icons for Startup */}
                            <SocialIcons
                              xUrl={selectedJob.startup?.xUrl}
                              instagramUrl={selectedJob.startup?.instagramUrl}
                              linkedinUrl={selectedJob.startup?.linkedinUrl}
                              className="my-2"
                            />

                            <div>
                              <h3 className="font-semibold mb-2">Job Description</h3>
                              <p className="text-gray-600 whitespace-pre-line">
                                {selectedJob.description}
                              </p>
                            </div>

                            {/* LinkedIn URL for Startup */}
                            {selectedJob.startup?.linkedinUrl && (
                              <div>
                                <a
                                  href={selectedJob.startup.linkedinUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                                  title="View on LinkedIn"
                                >
                                  <Linkedin className="h-5 w-5" />
                                </a>
                              </div>
                            )}

                            {selectedJob.requirements.length > 0 && (
                              <div>
                                <h3 className="font-semibold mb-2">Requirements</h3>
                                <ul className="space-y-1">
                                  {selectedJob.requirements.map((req, index) => (
                                    <li key={index} className="flex items-start space-x-2">
                                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                      <span className="text-gray-600">{req}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {selectedJob.salaryMin && selectedJob.salaryMax && (
                              <div>
                                <h3 className="font-semibold mb-2">Compensation</h3>
                                <p className="text-gray-600">
                                  ${selectedJob.salaryMin.toLocaleString()} - ${selectedJob.salaryMax.toLocaleString()} per year
                                </p>
                              </div>
                            )}

                            {/* Show custom questions if any */}
                            {selectedJob.customQuestions && selectedJob.customQuestions.length > 0 && showApplicationForm && (
                              <div className="border-t pt-6">
                                <h3 className="font-semibold mb-4">Additional Questions</h3>
                                <div className="space-y-4 max-h-60 overflow-y-auto">
                                  {selectedJob.customQuestions.map((question) => {
                                    const answer = customAnswers.find(a => a.questionId === question.id);
                                    return (
                                      <div key={question.id} className="space-y-2">
                                        <Label>
                                          {question.question}
                                          {question.required && <span className="text-red-500 ml-1">*</span>}
                                        </Label>
                                        {question.type === 'TEXTAREA' ? (
                                          <Textarea
                                            value={answer?.answer || ''}
                                            onChange={(e) => updateCustomAnswer(question.id, e.target.value)}
                                            placeholder="Enter your answer..."
                                            rows={3}
                                          />
                                        ) : (
                                          <Input
                                            type={question.type === 'URL' ? 'url' : 'text'}
                                            value={answer?.answer || ''}
                                            onChange={(e) => updateCustomAnswer(question.id, e.target.value)}
                                            placeholder={question.type === 'URL' ? 'https://...' : 'Enter your answer...'}
                                          />
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            <div className="flex items-center space-x-3 pt-4 border-t sticky bottom-0 bg-white">
                              {hasApplied(selectedJob.id) ? (
                                <Button disabled className="bg-green-600">
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Applied
                                </Button>
                              ) : showApplicationForm ? (
                                <Button
                                  onClick={() => handleApply(selectedJob.id)}
                                  disabled={applying === selectedJob.id || !canApply(selectedJob)}
                                >
                                  {applying === selectedJob.id ? 'Applying...' : 'Submit Application'}
                                </Button>
                              ) : (
                                <Button
                                  onClick={() => {
                                    if (selectedJob.customQuestions && selectedJob.customQuestions.length > 0) {
                                      setShowApplicationForm(true);
                                    } else {
                                      handleApply(selectedJob.id);
                                    }
                                  }}
                                  disabled={applying === selectedJob.id}
                                >
                                  {applying === selectedJob.id ? 'Applying...' : (selectedJob.customQuestions && selectedJob.customQuestions.length > 0 ? 'Start Application' : 'Apply Now')}
                                </Button>
                              )}
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>

                    {hasApplied(job.id) ? (
                      <Button disabled className="bg-green-600">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Applied
                      </Button>
                    ) : (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            onClick={() => handleJobSelect(job, job.customQuestions && job.customQuestions.length > 0)}
                            disabled={applying === job.id}
                          >
                            {applying === job.id ? 'Applying...' : (job.customQuestions && job.customQuestions.length > 0 ? 'Start Application' : 'Apply Now')}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="flex items-center space-x-2">
                              <Building2 className="h-5 w-5" />
                              <span>{selectedJob?.title}</span>
                            </DialogTitle>
                            <DialogDescription>
                              {selectedJob?.startup?.name || selectedJob?.startupName} • {selectedJob?.location}
                            </DialogDescription>
                          </DialogHeader>
                          {selectedJob && (
                            <div className="space-y-6">
                              <div className="flex flex-wrap gap-2">
                                <Badge variant={selectedJob.remote ? 'default' : 'secondary'}>
                                  {selectedJob.remote ? 'Remote' : 'On-site'}
                                </Badge>
                                <Badge variant="outline">{selectedJob.type}</Badge>
                                <Badge variant="outline">{selectedJob.experienceLevel}</Badge>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-1">Description</h4>
                                <p className="text-gray-700 whitespace-pre-line">{selectedJob.description}</p>
                              </div>
                              {selectedJob.customQuestions && selectedJob.customQuestions.length > 0 && showApplicationForm && (
                                <div>
                                  <h4 className="font-semibold mb-2">Custom Questions</h4>
                                  <div className="space-y-4">
                                    {selectedJob.customQuestions.map((question) => {
                                      const answer = customAnswers.find(a => a.questionId === question.id);
                                      return (
                                        <div key={question.id}>
                                          <Label className="block mb-1">
                                            {question.question}
                                            {question.required && <span className="text-red-500 ml-1">*</span>}
                                          </Label>
                                          {question.type === 'TEXTAREA' ? (
                                            <Textarea
                                              value={answer?.answer || ''}
                                              onChange={e => updateCustomAnswer(question.id, e.target.value)}
                                              placeholder="Enter your answer..."
                                            />
                                          ) : (
                                            <Input
                                              type={question.type === 'URL' ? 'url' : 'text'}
                                              value={answer?.answer || ''}
                                              onChange={e => updateCustomAnswer(question.id, e.target.value)}
                                              placeholder={question.type === 'URL' ? 'https://...' : 'Enter your answer...'}
                                            />
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                              <div className="flex items-center space-x-3 pt-4 border-t sticky bottom-0 bg-white">
                                {hasApplied(selectedJob.id) ? (
                                  <Button disabled className="bg-green-600">
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Applied
                                  </Button>
                                ) : showApplicationForm ? (
                                  <Button
                                    onClick={() => handleApply(selectedJob.id)}
                                    disabled={applying === selectedJob.id || !canApply(selectedJob)}
                                  >
                                    {applying === selectedJob.id ? 'Applying...' : 'Submit Application'}
                                  </Button>
                                ) : (
                                  <Button
                                    onClick={() => {
                                      if (selectedJob.customQuestions && selectedJob.customQuestions.length > 0) {
                                        setShowApplicationForm(true);
                                      } else {
                                        handleApply(selectedJob.id);
                                      }
                                    }}
                                    disabled={applying === selectedJob.id}
                                  >
                                    {applying === selectedJob.id ? 'Applying...' : (selectedJob.customQuestions && selectedJob.customQuestions.length > 0 ? 'Start Application' : 'Apply Now')}
                                  </Button>
                                )}
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    )}

                    {/* Save Job Button */}
                    <Button
                      variant="outline"
                      onClick={() => handleSaveJob(job.id)}
                      disabled={saving === job.id}
                      className="flex items-center space-x-2"
                    >
                      {isJobSaved(job.id) ? (
                        <BookmarkCheck className="h-4 w-4" />
                      ) : (
                        <Bookmark className="h-4 w-4" />
                      )}
                      <span>
                        {saving === job.id ? 'Saving...' : isJobSaved(job.id) ? 'Saved' : 'Save'}
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Search className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No jobs found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search criteria or check back later for new opportunities.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}