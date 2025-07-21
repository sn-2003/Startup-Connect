'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/use-auth';
import { apiClient } from '@/lib/api-client';
import { 
  StartupWithRelations, 
  JobWithStartup, 
  ApplicationWithJobDetails, 
  ResumeWithRelations 
} from '@/lib/types';
import { 
  Building2, 
  Briefcase, 
  FileText, 
  Users, 
  TrendingUp, 
  Calendar,
  MapPin,
  CheckCircle,
  Clock,
  Eye,
  Plus,
  ArrowRight
} from 'lucide-react';

interface OverviewProps {
  onTabChange: (tab: string) => void;
}

export default function Overview({ onTabChange }: OverviewProps) {
  const { user } = useAuth();
  const [startups, setStartups] = useState<StartupWithRelations[]>([]);
  const [jobs, setJobs] = useState<JobWithStartup[]>([]);
  const [applications, setApplications] = useState<ApplicationWithJobDetails[]>([]);
  const [resume, setResume] = useState<ResumeWithRelations | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOverviewData = async () => {
      if (!user) return;

      try {
        const [startupsRes, jobsRes, applicationsRes, resumeRes] = await Promise.all([
          apiClient.getMyStartups(),
          apiClient.getJobs(),
          apiClient.getMyApplications(),
          apiClient.getMyResume(),
        ]);

        if (startupsRes.success && startupsRes.data) {
          setStartups(startupsRes.data);
        }

        if (jobsRes.success && jobsRes.data) {
          setJobs(jobsRes.data.slice(0, 5)); // Show only recent 5 jobs
        }

        if (applicationsRes.success && applicationsRes.data) {
          setApplications(applicationsRes.data);
        }

        if (resumeRes.success && resumeRes.data) {
          setResume(resumeRes.data);
        }
      } catch (error) {
        console.error('Error loading overview data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOverviewData();
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUBMITTED':
        return 'bg-blue-100 text-blue-800';
      case 'REVIEWED':
        return 'bg-yellow-100 text-yellow-800';
      case 'SHORTLISTED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back, {user?.name}! Here's what's happening with your startup journey.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Startups</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{startups.length}</div>
            <p className="text-xs text-muted-foreground">
              {startups.length === 1 ? 'startup registered' : 'startups registered'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{applications.length}</div>
            <p className="text-xs text-muted-foreground">
              job applications submitted
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resume Status</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resume ? 'Complete' : 'Incomplete'}</div>
            <p className="text-xs text-muted-foreground">
              {resume ? 'Resume is ready' : 'Complete your resume'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(
                ((startups.length > 0 ? 25 : 0) +
                (resume ? 50 : 0) +
                (applications.length > 0 ? 25 : 0)) 
              )}%
            </div>
            <p className="text-xs text-muted-foreground">
              profile completion
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Get started with common tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => onTabChange('startup')}
            >
              <Building2 className="h-6 w-6" />
              <span>Add Startup</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => onTabChange('resume')}
            >
              <FileText className="h-6 w-6" />
              <span>Update Resume</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => onTabChange('jobs')}
            >
              <Briefcase className="h-6 w-6" />
              <span>Browse Jobs</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => onTabChange('investors')}
            >
              <Users className="h-6 w-6" />
              <span>Find Investors</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Applications</CardTitle>
              <CardDescription>Your latest job applications</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onTabChange('applications')}>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {applications.length === 0 ? (
              <div className="text-center py-6">
                <FileText className="mx-auto h-8 w-8 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">No applications yet</h3>
                <p className="mt-1 text-sm text-gray-500">Start applying to jobs to see them here.</p>
                <div className="mt-4">
                  <Button size="sm" onClick={() => onTabChange('jobs')}>
                    Browse Jobs
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {applications.slice(0, 3).map((application) => (
                  <div key={application.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <div className="bg-blue-100 p-2 rounded">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={application.job?.startup?.logo || undefined} alt={application.job?.startup?.name || 'Company'} />
                        <AvatarFallback>
                          <Building2 className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{application.job?.title || 'Job Title'}</h4>
                      <p className="text-xs text-gray-600 truncate">{application.job?.startup?.name || 'Company'}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={getStatusColor(application.status)} variant="secondary">
                          {application.status.toLowerCase()}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {new Date(application.appliedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {applications.length > 3 && (
                  <Button variant="ghost" size="sm" className="w-full" onClick={() => onTabChange('applications')}>
                    View all {applications.length} applications
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Resume Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Resume Status</CardTitle>
              <CardDescription>Your professional profile</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onTabChange('resume')}>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {!resume ? (
              <div className="text-center py-6">
                <FileText className="mx-auto h-8 w-8 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">No resume created</h3>
                <p className="mt-1 text-sm text-gray-500">Create your resume to apply for jobs.</p>
                <div className="mt-4">
                  <Button size="sm" onClick={() => onTabChange('resume')}>
                    Create Resume
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="font-medium">Resume Created</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Basic Information</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Skills ({resume.skills?.length || 0})</span>
                    {(resume.skills?.length || 0) > 0 ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Clock className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Experience ({resume.experience?.length || 0})</span>
                    {(resume.experience?.length || 0) > 0 ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Clock className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Education ({resume.education?.length || 0})</span>
                    {(resume.education?.length || 0) > 0 ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Clock className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                  {(resume.customSections?.length || 0) > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span>
                        {resume.customSections?.length || 0} custom section{(resume.customSections?.length || 0) !== 1 ? 's' : ''}
                      </span>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                  )}
                </div>

                <Button variant="outline" size="sm" className="w-full" onClick={() => onTabChange('resume')}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Resume
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Jobs */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Latest Job Opportunities</CardTitle>
            <CardDescription>Recent job postings from startups</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={() => onTabChange('jobs')}>
            View All Jobs <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </CardHeader>
        <CardContent>
          {jobs.length === 0 ? (
            <div className="text-center py-6">
              <Briefcase className="mx-auto h-8 w-8 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No jobs available</h3>
              <p className="mt-1 text-sm text-gray-500">Check back later for new opportunities.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={job.startup?.logo || undefined} alt={job.startup?.name || job.startupName} />
                      <AvatarFallback>
                        <Building2 className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm">{job.title}</h4>
                    <p className="text-sm text-gray-600">{job.startup?.name || job.startupName}</p>
                    <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                      <span className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {job.location}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                      {job.customQuestions && job.customQuestions.length > 0 && (
                        <span>
                          {job.customQuestions.length} custom question{job.customQuestions.length !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={job.remote ? 'default' : 'secondary'}>
                      {job.remote ? 'Remote' : 'On-site'}
                    </Badge>
                    <Badge variant="outline">{job.type}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* My Startups */}
      {startups.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>My Startups</CardTitle>
              <CardDescription>Your registered startups</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onTabChange('startup')}>
              Manage <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {startups.map((startup) => (
                <div key={startup.id} className="border rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={startup.logo || undefined} alt={startup.name} />
                      <AvatarFallback>
                        <Building2 className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold">{startup.name}</h4>
                      <p className="text-sm text-gray-600">{startup.industry}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{startup.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">{startup.stage}</Badge>
                      <Badge variant="outline">{startup.funding}</Badge>
                    </div>
                    <span className="text-xs text-gray-500">
                      {startup.jobs?.length || 0} jobs
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}