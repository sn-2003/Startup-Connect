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
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/use-auth';
import { apiClient } from '@/lib/api-client';
import { JobWithStartup, Application, CustomAnswerInput } from '@/lib/types';
import { Search, MapPin, Building2, Clock, DollarSign, Users, CheckCircle, Bookmark, BookmarkCheck, Briefcase, ExternalLink } from 'lucide-react';
import StartupDetails from './startup-details';
import { SocialIcons } from './social-icons';

export default function EnhancedJobBoard() {
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

  const loadData = async () => {
    try {
      console.log('EnhancedJobBoard: Loading data...');
      
      const jobsRes = await apiClient.getJobs();
      console.log('EnhancedJobBoard: Jobs response:', jobsRes);

      if (jobsRes.success && jobsRes.data) {
        setJobs(jobsRes.data);
        setFilteredJobs(jobsRes.data);
        // Set the first job as selected by default
        if (jobsRes.data.length > 0) {
          setSelectedJob(jobsRes.data[0]);
        }
      }

      if (user) {
        const [applicationsRes, savedJobsRes] = await Promise.all([
          apiClient.getMyApplications(),
          apiClient.getSavedJobs(),
        ]);

        if (applicationsRes.success && applicationsRes.data) {
          setApplications(applicationsRes.data);
        }

        if (savedJobsRes.success && savedJobsRes.data) {
          setSavedJobs(savedJobsRes.data.map((job: JobWithStartup) => job.id));
        }
      }
    } catch (error) {
      console.error('EnhancedJobBoard: Error loading job data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  useEffect(() => {
    let filtered = jobs;

    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (job.startup as any)?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(job => job.type === typeFilter);
    }

    if (experienceFilter !== 'all') {
      filtered = filtered.filter(job => job.experienceLevel === experienceFilter);
    }

    if (remoteFilter !== 'all') {
      filtered = filtered.filter(job => {
        if (remoteFilter === 'remote') return job.remote;
        if (remoteFilter === 'onsite') return !job.remote;
        return true;
      });
    }

    setFilteredJobs(filtered);
    
    // Update selected job if it's no longer in filtered results
    if (selectedJob && !filtered.find(j => j.id === selectedJob.id)) {
      setSelectedJob(filtered.length > 0 ? filtered[0] : null);
    }
  }, [jobs, searchTerm, typeFilter, experienceFilter, remoteFilter, selectedJob]);

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
        setSelectedJob(null);
        setCustomAnswers([]);
        setShowApplicationForm(false);
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
    if (showApplicationForm && selectedJob && selectedJob.id === job.id && job.customQuestions && job.customQuestions.length > 0) {
      return job.customQuestions.every((q) => {
        if (!q.required) return true;
        const answer = customAnswers.find(a => a.questionId === q.id);
        return answer && answer.answer.trim();
      });
    }
    return true;
  };

  const getExperienceColor = (level: string) => {
    const colors = {
      'ENTRY': 'bg-green-100 text-green-800',
      'MID': 'bg-blue-100 text-blue-800',
      'SENIOR': 'bg-purple-100 text-purple-800',
      'LEAD': 'bg-orange-100 text-orange-800'
    };
    return colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getTypeColor = (type: string) => {
    const colors = {
      'FULL_TIME': 'bg-blue-100 text-blue-800',
      'PART_TIME': 'bg-green-100 text-green-800',
      'CONTRACT': 'bg-yellow-100 text-yellow-800',
      'INTERNSHIP': 'bg-purple-100 text-purple-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  // Count jobs for the selected startup
  const getJobCountForStartup = (startupId: string) => {
    return jobs.filter(job => job.startup?.id === startupId).length;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="hidden lg:grid grid-cols-12 gap-6">
            <div className="col-span-3 h-96 bg-gray-200 rounded"></div>
            <div className="col-span-6 h-96 bg-gray-200 rounded"></div>
            <div className="col-span-3 h-96 bg-gray-200 rounded"></div>
          </div>
          <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        
        <CardContent className="pt-0">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search jobs, companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10 sm:h-11 text-sm sm:text-base"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-32 md:w-40 h-10 sm:h-11 text-sm sm:text-base">
                <SelectValue placeholder="Type" />
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
              <SelectTrigger className="w-full sm:w-32 md:w-40 h-10 sm:h-11 text-sm sm:text-base">
                <SelectValue placeholder="Level" />
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
              <SelectTrigger className="w-full sm:w-32 md:w-40 h-10 sm:h-11 text-sm sm:text-base">
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

      {/* Desktop Layout - Job list and combined details */}
      <div className="hidden lg:grid grid-cols-12 gap-6 min-h-[600px]">
        {/* Left Column - Job Cards */}
        <div className="col-span-4 space-y-3 max-h-[600px] overflow-y-auto">
          {filteredJobs.map((job) => (
            <Card
              key={job.id}
              className={`cursor-pointer transition-all duration-200 border-0 shadow-sm hover:shadow-md ${
                selectedJob?.id === job.id ? 'ring-2 ring-blue-500 shadow-md' : ''
              }`}
              onClick={() => handleJobSelect(job)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={job.startup?.logo || undefined} alt={job.startup?.name || job.startupName} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        <Building2 className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-sm leading-tight truncate">{job.title}</CardTitle>
                      <CardDescription className="text-xs font-medium text-gray-600 truncate">
                        {job.startup?.name || job.startupName}
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSaveJob(job.id);
                    }}
                    disabled={saving === job.id}
                    className="h-6 w-6 p-0"
                  >
                    {isJobSaved(job.id) ? (
                      <BookmarkCheck className="h-3 w-3 text-blue-600" />
                    ) : (
                      <Bookmark className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1">
                    <Badge className={`${getTypeColor(job.type)} text-xs`}>
                      {job.type.replace('_', ' ')}
                    </Badge>
                    <Badge variant={job.remote ? 'default' : 'secondary'} className="text-xs">
                      {job.remote ? 'Remote' : 'On-site'}
                    </Badge>
                  </div>

                  <div className="text-xs text-gray-600">
                    <div className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span className="truncate">{job.location}</span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-xs line-clamp-2">
                    {job.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      {typeof job.applications === 'number' ? job.applications : (job.applications?.length || 0)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Combined Column - Job and Company Details with Tabs */}
        <div className="col-span-8">
          {selectedJob ? (
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedJob.startup?.logo || undefined} alt={selectedJob.startup?.name || selectedJob.startupName} />
                    <AvatarFallback>
                      <Building2 className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="text-lg">{selectedJob.title}</span>
                    <p className="text-sm text-gray-600 font-normal">
                      {selectedJob.startup?.name || selectedJob.startupName} • {selectedJob.location}
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant={selectedJob.remote ? 'default' : 'secondary'}>
                    {selectedJob.remote ? 'Remote' : 'On-site'}
                  </Badge>
                  <Badge variant="outline">{selectedJob.type.replace('_', ' ')}</Badge>
                  <Badge className={getExperienceColor(selectedJob.experienceLevel)}>
                    {selectedJob.experienceLevel}
                  </Badge>
                </div>

                <Tabs defaultValue="job" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="job" className="flex items-center space-x-2">
                      <Briefcase className="h-4 w-4" />
                      <span>About Job</span>
                    </TabsTrigger>
                    <TabsTrigger value="company" className="flex items-center space-x-2">
                      <Building2 className="h-4 w-4" />
                      <span>About Company</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="job" className="space-y-6 max-h-[400px] overflow-y-auto mt-4">
                    <div>
                      <h3 className="font-semibold mb-2">Job Description</h3>
                      <p className="text-gray-600 whitespace-pre-line text-sm">
                        {selectedJob.description}
                      </p>
                    </div>

                    {selectedJob.requirements.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-2">Requirements</h3>
                        <ul className="space-y-1">
                          {selectedJob.requirements.map((req, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-600 text-sm">{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedJob.salaryMin && selectedJob.salaryMax && !selectedJob.unpaid && (
                      <div>
                        <h3 className="font-semibold mb-2">Compensation</h3>
                        <p className="text-gray-600 text-sm">
                          Rs.{selectedJob.salaryMin.toLocaleString()} - Rs.{selectedJob.salaryMax.toLocaleString()} per year
                        </p>
                      </div>
                    )}
                    {selectedJob.unpaid && (
                      <div>
                        <h3 className="font-semibold mb-2">Compensation</h3>
                        <p className="text-red-600 font-semibold text-sm">Unpaid</p>
                      </div>
                    )}

                    {/* Custom Questions */}
                    {selectedJob.customQuestions && selectedJob.customQuestions.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-4">Additional Questions</h3>
                        <div className="space-y-4">
                          {selectedJob.customQuestions.map((question) => {
                            const answer = customAnswers.find(a => a.questionId === question.id);
                            return (
                              <div key={question.id} className="space-y-2">
                                <Label className="text-sm">
                                  {question.question}
                                  {question.required && <span className="text-red-500 ml-1">*</span>}
                                </Label>
                                {question.type === 'TEXTAREA' ? (
                                  <Textarea
                                    value={answer?.answer || ''}
                                    onChange={(e) => updateCustomAnswer(question.id, e.target.value)}
                                    placeholder="Enter your answer..."
                                    rows={3}
                                    className="text-sm"
                                  />
                                ) : (
                                  <Input
                                    type={question.type === 'URL' ? 'url' : 'text'}
                                    value={answer?.answer || ''}
                                    onChange={(e) => updateCustomAnswer(question.id, e.target.value)}
                                    placeholder={question.type === 'URL' ? 'https://...' : 'Enter your answer...'}
                                    className="text-sm"
                                  />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="company" className="space-y-6 max-h-[400px] overflow-y-auto mt-4">
                    {selectedJob.startup ? (
                      <>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={selectedJob.startup.logo || undefined} alt={selectedJob.startup.name} />
                            <AvatarFallback>
                              <Building2 className="h-6 w-6" />
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold">{selectedJob.startup.name}</h4>
                            <p className="text-sm text-gray-600">{selectedJob.startup.industry}</p>
                            <div className="flex items-center space-x-1 mt-1">
                              <Users className="h-3 w-3 text-gray-500" />
                              <span className="text-xs text-gray-500">
                                {getJobCountForStartup(selectedJob.startup.id)} open position{getJobCountForStartup(selectedJob.startup.id) !== 1 ? 's' : ''}
                              </span>
                            </div>
                            <SocialIcons
                              xUrl={selectedJob.startup.xUrl}
                              instagramUrl={selectedJob.startup.instagramUrl}
                              linkedinUrl={selectedJob.startup.linkedinUrl}
                              className="mt-2"
                            />
                          </div>
                        </div>

                        {selectedJob.startup.description && (
                          <div>
                            <h4 className="font-semibold mb-2">Company Description</h4>
                            <p className="text-gray-1000 text-sm">{selectedJob.startup.description}</p>
                          </div>
                        )}

                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            {selectedJob.startup.stage && (
                              <div>
                                <span className="font-medium text-gray-900">Stage</span>
                                <p className="text-gray-800">{selectedJob.startup.stage}</p>
                              </div>
                            )}
                            {selectedJob.startup.industry && (
                              <div>
                                <span className="font-medium text-gray-900">Industry</span>
                                <p className="text-gray-800">{selectedJob.startup.industry}</p>
                              </div>
                            )}
                            {selectedJob.startup.employees && (
                              <div>
                                <span className="font-medium text-gray-900">Team Size</span>
                                <p className="text-gray-800">{selectedJob.startup.employees}</p>
                              </div>
                            )}
                            {selectedJob.startup.funding && (
                              <div>
                                <span className="font-medium text-gray-900">Funding</span>
                                <p className="text-gray-800">{selectedJob.startup.funding}</p>
                              </div>
                            )}
                            {selectedJob.startup.founded && (
                              <div>
                                <span className="font-medium text-gray-900">Founded</span>
                                <p className="text-gray-800">{selectedJob.startup.founded}</p>
                              </div>
                            )}
                            {selectedJob.startup.location && (
                              <div>
                                <span className="font-medium text-gray-900">Location</span>
                                <p className="text-gray-800">{selectedJob.startup.location}</p>
                              </div>
                            )}
                            {selectedJob.startup.website && (
                              <div className="col-span-2">
                                <span className="font-medium text-gray-900">Website</span>
                                <p>
                                  <a
                                    href={selectedJob.startup.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                                  >
                                    <ExternalLink className="h-3 w-3" />
                                    <span>{selectedJob.startup.website}</span>
                                  </a>
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Building2 className="mx-auto h-12 w-12 mb-2" />
                        <p>Company information not available</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>

                {/* Apply Button */}
                <div className="sticky bottom-0 bg-white pt-4 border-t">
                  {!user ? (
                    <Button
                      onClick={() => {
                        window.location.href = `/login?returnUrl=${encodeURIComponent(window.location.pathname)}`;
                      }}
                      className="w-full"
                    >
                      Login to Apply
                    </Button>
                  ) : hasApplied(selectedJob.id) ? (
                    <Button disabled className="w-full bg-green-600 hover:bg-green-700">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Applied
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleApply(selectedJob.id)}
                      disabled={applying === selectedJob.id || !canApply(selectedJob)}
                      className="w-full"
                    >
                      {applying === selectedJob.id ? 'Applying...' : 'Apply Now'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent>
                <div className="text-center">
                  <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">Select a job</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Choose a job from the list to view details.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Mobile Card Layout */}
      <div className="lg:hidden space-y-4">
        {filteredJobs.map((job) => (
          <Card key={job.id} className="hover:shadow-lg transition-all duration-200 border-0 shadow-sm hover:shadow-xl">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={job.startup?.logo || undefined} alt={job.startup?.name || job.startupName} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      <Building2 className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg leading-tight">{job.title}</CardTitle>
                    <CardDescription className="text-sm font-medium text-gray-600">
                      {job.startup?.name || job.startupName}
                    </CardDescription>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSaveJob(job.id)}
                  disabled={saving === job.id}
                  className="h-8 w-8 p-0"
                >
                  {isJobSaved(job.id) ? (
                    <BookmarkCheck className="h-4 w-4 text-blue-600" />
                  ) : (
                    <Bookmark className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-4">
                {/* Job Details */}
                <div className="flex flex-wrap gap-2">
                  <Badge className={getTypeColor(job.type)}>
                    {job.type.replace('_', ' ')}
                  </Badge>
                  <Badge className={getExperienceColor(job.experienceLevel)}>
                    {job.experienceLevel}
                  </Badge>
                  <Badge variant={job.remote ? 'default' : 'secondary'}>
                    {job.remote ? 'Remote' : 'On-site'}
                  </Badge>
                </div>

                {/* Location and Salary */}
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {job.location}
                  </div>
                  
                  {job.salaryMin && job.salaryMax && !job.unpaid ? (
                    <div className="flex items-center text-sm text-gray-600">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Rs.{job.salaryMin.toLocaleString()} - Rs.{job.salaryMax.toLocaleString()}
                    </div>
                  ) : job.unpaid ? (
                    <div className="flex items-center text-sm text-red-600 font-medium">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Unpaid
                    </div>
                  ) : null}
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm line-clamp-3">
                  {job.description}
                </p>

                {/* Job Stats */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      {typeof job.applications === 'number' ? job.applications : (job.applications?.length || 0)} applications
                    </span>
                  </div>
                  
                  {job.customQuestions && job.customQuestions.length > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {job.customQuestions.length} Q&A
                    </Badge>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2 pt-2">
                  {!user ? (
                    <Button 
                      onClick={() => {
                        window.location.href = `/login?returnUrl=${encodeURIComponent(window.location.pathname)}`;
                      }}
                      className="w-full"
                    >
                      Login to Apply
                    </Button>
                  ) : hasApplied(job.id) ? (
                    <Button disabled className="w-full bg-green-600 hover:bg-green-700">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Applied
                    </Button>
                  ) : (
                    <>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => handleJobSelect(job, false)}
                          >
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="flex items-center space-x-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={selectedJob?.startup?.logo || undefined} alt={selectedJob?.startup?.name || selectedJob?.startupName} />
                                <AvatarFallback>
                                  <Building2 className="h-5 w-5" />
                                </AvatarFallback>
                              </Avatar>
                              <span>{selectedJob?.title}</span>
                            </DialogTitle>
                            <DialogDescription>
                              {selectedJob?.startup?.name || selectedJob?.startupName} • {selectedJob?.location}
                            </DialogDescription>
                          </DialogHeader>
                          {selectedJob && (
                            <div className="space-y-4">
                              <div className="flex flex-wrap gap-2">
                                <Badge variant={selectedJob.remote ? 'default' : 'secondary'}>
                                  {selectedJob.remote ? 'Remote' : 'On-site'}
                                </Badge>
                                <Badge variant="outline">{selectedJob.type}</Badge>
                                <Badge variant="outline">{selectedJob.experienceLevel}</Badge>
                              </div>

                              <Tabs defaultValue="job" className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                  <TabsTrigger value="job" className="flex items-center space-x-2">
                                    <Briefcase className="h-4 w-4" />
                                    <span>Job Details</span>
                                  </TabsTrigger>
                                  <TabsTrigger value="company" className="flex items-center space-x-2">
                                    <Building2 className="h-4 w-4" />
                                    <span>Company</span>
                                  </TabsTrigger>
                                </TabsList>

                                <TabsContent value="job" className="space-y-4 mt-4">
                                  <div>
                                    <h4 className="font-semibold mb-2">Job Description</h4>
                                    <p className="text-gray-900 whitespace-pre-line">
                                      {selectedJob.description}
                                    </p>
                                  </div>

                                  {selectedJob.requirements.length > 0 && (
                                    <div>
                                      <h4 className="font-semibold mb-2">Requirements</h4>
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

                                  {selectedJob.salaryMin && selectedJob.salaryMax && !selectedJob.unpaid && (
                                    <div>
                                      <h4 className="font-semibold mb-2">Compensation</h4>
                                      <p className="text-gray-600">
                                        Rs.{selectedJob.salaryMin.toLocaleString()} - Rs.{selectedJob.salaryMax.toLocaleString()} per year
                                      </p>
                                    </div>
                                  )}
                                  {selectedJob.unpaid && (
                                    <div>
                                      <h4 className="font-semibold mb-2">Compensation</h4>
                                      <p className="text-red-600 font-semibold">Unpaid</p>
                                    </div>
                                  )}
                                </TabsContent>

                                <TabsContent value="company" className="space-y-4 mt-4">
                                  {selectedJob.startup ? (
                                    <>
                                      <div className="flex items-center space-x-3">
                                        <Avatar className="h-12 w-12">
                                          <AvatarImage src={selectedJob.startup.logo || undefined} alt={selectedJob.startup.name} />
                                          <AvatarFallback>
                                            <Building2 className="h-6 w-6" />
                                          </AvatarFallback>
                                        </Avatar>
                                        <div>
                                          <h4 className="font-semibold">{selectedJob.startup.name}</h4>
                                          <p className="text-sm text-gray-600">{selectedJob.startup.industry}</p>
                                          <SocialIcons
                                            xUrl={selectedJob.startup.xUrl}
                                            instagramUrl={selectedJob.startup.instagramUrl}
                                            linkedinUrl={selectedJob.startup.linkedinUrl}
                                            className="mt-2"
                                          />
                                        </div>
                                      </div>

                                      {selectedJob.startup.description && (
                                        <div>
                                          <h4 className="font-semibold mb-2">Company Description</h4>
                                          <p className="text-gray-600">{selectedJob.startup.description}</p>
                                        </div>
                                      )}

                                      <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                          {selectedJob.startup.stage && (
                                            <div>
                                              <span className="font-medium text-gray-900">Stage</span>
                                              <p className="text-gray-600">{selectedJob.startup.stage}</p>
                                            </div>
                                          )}
                                          {selectedJob.startup.industry && (
                                            <div>
                                              <span className="font-medium text-gray-900">Industry</span>
                                              <p className="text-gray-600">{selectedJob.startup.industry}</p>
                                            </div>
                                          )}
                                          {selectedJob.startup.employees && (
                                            <div>
                                              <span className="font-medium text-gray-900">Team Size</span>
                                              <p className="text-gray-600">{selectedJob.startup.employees}</p>
                                            </div>
                                          )}
                                          {selectedJob.startup.funding && (
                                            <div>
                                              <span className="font-medium text-gray-900">Funding</span>
                                              <p className="text-gray-600">{selectedJob.startup.funding}</p>
                                            </div>
                                          )}
                                          {selectedJob.startup.founded && (
                                            <div>
                                              <span className="font-medium text-gray-900">Founded</span>
                                              <p className="text-gray-600">{selectedJob.startup.founded}</p>
                                            </div>
                                          )}
                                          {selectedJob.startup.location && (
                                            <div>
                                              <span className="font-medium text-gray-900">Location</span>
                                              <p className="text-gray-600">{selectedJob.startup.location}</p>
                                            </div>
                                          )}
                                          {selectedJob.startup.website && (
                                            <div className="col-span-2">
                                              <span className="font-medium text-gray-900">Website</span>
                                              <p>
                                                <a
                                                  href={selectedJob.startup.website}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                                                >
                                                  <ExternalLink className="h-3 w-3" />
                                                  <span>{selectedJob.startup.website}</span>
                                                </a>
                                              </p>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </>
                                  ) : (
                                    <div className="text-center py-8 text-gray-500">
                                      <Building2 className="mx-auto h-12 w-12 mb-2" />
                                      <p>Company information not available</p>
                                    </div>
                                  )}
                                </TabsContent>
                              </Tabs>

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

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            onClick={() => handleJobSelect(job, job.customQuestions && job.customQuestions.length > 0)}
                            disabled={applying === job.id}
                            className="flex-1"
                          >
                            {applying === job.id ? 'Applying...' : (job.customQuestions && job.customQuestions.length > 0 ? 'Apply' : 'Apply Now')}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="flex items-center space-x-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={job.startup?.logo || undefined} alt={job.startup?.name || job.startupName} />
                                <AvatarFallback>
                                  <Building2 className="h-5 w-5" />
                                </AvatarFallback>
                              </Avatar>
                              <span>{job.title}</span>
                            </DialogTitle>
                            <DialogDescription>
                              {job.startup?.name || job.startupName} • {job.location}
                            </DialogDescription>
                          </DialogHeader>
                          {selectedJob && (
                            <div className="space-y-4">
                              <div className="flex flex-wrap gap-2">
                                <Badge variant={selectedJob.remote ? 'default' : 'secondary'}>
                                  {selectedJob.remote ? 'Remote' : 'On-site'}
                                </Badge>
                                <Badge variant="outline">{selectedJob.type}</Badge>
                                <Badge variant="outline">{selectedJob.experienceLevel}</Badge>
                              </div>

                              <Tabs defaultValue="job" className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                  <TabsTrigger value="job" className="flex items-center space-x-2">
                                    <Briefcase className="h-4 w-4" />
                                    <span>Job Details</span>
                                  </TabsTrigger>
                                  <TabsTrigger value="company" className="flex items-center space-x-2">
                                    <Building2 className="h-4 w-4" />
                                    <span>Company</span>
                                  </TabsTrigger>
                                </TabsList>

                                <TabsContent value="job" className="space-y-4 mt-4">
                                  <div>
                                    <h4 className="font-semibold mb-2">Job Description</h4>
                                    <p className="text-gray-600 whitespace-pre-line">{selectedJob.description}</p>
                                  </div>

                                  {selectedJob.requirements.length > 0 && (
                                    <div>
                                      <h4 className="font-semibold mb-2">Requirements</h4>
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

                                  {selectedJob.salaryMin && selectedJob.salaryMax && !selectedJob.unpaid && (
                                    <div>
                                      <h4 className="font-semibold mb-2">Compensation</h4>
                                      <p className="text-gray-600">
                                        Rs.{selectedJob.salaryMin.toLocaleString()} - Rs.{selectedJob.salaryMax.toLocaleString()} per year
                                      </p>
                                    </div>
                                  )}
                                  {selectedJob.unpaid && (
                                    <div>
                                      <h4 className="font-semibold mb-2">Compensation</h4>
                                      <p className="text-red-600 font-semibold">Unpaid</p>
                                    </div>
                                  )}
                                </TabsContent>

                                <TabsContent value="company" className="space-y-4 mt-4">
                                  {selectedJob.startup ? (
                                    <>
                                      <div className="flex items-center space-x-3">
                                        <Avatar className="h-12 w-12">
                                          <AvatarImage src={selectedJob.startup.logo || undefined} alt={selectedJob.startup.name} />
                                          <AvatarFallback>
                                            <Building2 className="h-6 w-6" />
                                          </AvatarFallback>
                                        </Avatar>
                                        <div>
                                          <h4 className="font-semibold">{selectedJob.startup.name}</h4>
                                          <p className="text-sm text-gray-600">{selectedJob.startup.industry}</p>
                                          <SocialIcons
                                            xUrl={selectedJob.startup.xUrl}
                                            instagramUrl={selectedJob.startup.instagramUrl}
                                            linkedinUrl={selectedJob.startup.linkedinUrl}
                                            className="mt-2"
                                          />
                                        </div>
                                      </div>

                                      {selectedJob.startup.description && (
                                        <div>
                                          <h4 className="font-semibold mb-2">Company Description</h4>
                                          <p className="text-gray-600">{selectedJob.startup.description}</p>
                                        </div>
                                      )}

                                      <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                          {selectedJob.startup.stage && (
                                            <div>
                                              <span className="font-medium text-gray-900">Stage</span>
                                              <p className="text-gray-600">{selectedJob.startup.stage}</p>
                                            </div>
                                          )}
                                          {selectedJob.startup.industry && (
                                            <div>
                                              <span className="font-medium text-gray-900">Industry</span>
                                              <p className="text-gray-600">{selectedJob.startup.industry}</p>
                                            </div>
                                          )}
                                          {selectedJob.startup.employees && (
                                            <div>
                                              <span className="font-medium text-gray-900">Team Size</span>
                                              <p className="text-gray-600">{selectedJob.startup.employees}</p>
                                            </div>
                                          )}
                                          {selectedJob.startup.funding && (
                                            <div>
                                              <span className="font-medium text-gray-900">Funding</span>
                                              <p className="text-gray-600">{selectedJob.startup.funding}</p>
                                            </div>
                                          )}
                                          {selectedJob.startup.founded && (
                                            <div>
                                              <span className="font-medium text-gray-900">Founded</span>
                                              <p className="text-gray-600">{selectedJob.startup.founded}</p>
                                            </div>
                                          )}
                                          {selectedJob.startup.location && (
                                            <div>
                                              <span className="font-medium text-gray-900">Location</span>
                                              <p className="text-gray-600">{selectedJob.startup.location}</p>
                                            </div>
                                          )}
                                          {selectedJob.startup.website && (
                                            <div className="col-span-2">
                                              <span className="font-medium text-gray-900">Website</span>
                                              <p>
                                                <a
                                                  href={selectedJob.startup.website}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                                                >
                                                  <ExternalLink className="h-3 w-3" />
                                                  <span>{selectedJob.startup.website}</span>
                                                </a>
                                              </p>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </>
                                  ) : (
                                    <div className="text-center py-8 text-gray-500">
                                      <Building2 className="mx-auto h-12 w-12 mb-2" />
                                      <p>Company information not available</p>
                                    </div>
                                  )}
                                </TabsContent>
                              </Tabs>

                              {selectedJob.customQuestions && selectedJob.customQuestions.length > 0 && showApplicationForm && (
                                <div className="border-t pt-4">
                                  <h4 className="font-semibold mb-2">Additional Questions</h4>
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
                    </>
                  )}
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
