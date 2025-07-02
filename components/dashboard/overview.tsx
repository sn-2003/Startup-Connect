'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';
import { mockAPI } from '@/lib/mock-data';
import { Startup, Job, Resume, Application } from '@/lib/types';
import { Building2, Briefcase, FileText, TrendingUp, Users, Star, ArrowRight, Bookmark, Send } from 'lucide-react';

interface OverviewProps {
  onTabChange: (tab: string) => void;
}

export default function Overview({ onTabChange }: OverviewProps) {
  const { user } = useAuth();
  const [startups, setStartups] = useState<Startup[]>([]);
  const [resume, setResume] = useState<Resume | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;

      try {
        const [startupsData, resumeData, applicationsData, savedJobsData, jobsData] = await Promise.all([
          mockAPI.getStartupsByUserId(user.id),
          mockAPI.getResumeByUserId(user.id),
          mockAPI.getUserApplications(user.id),
          mockAPI.getSavedJobs(user.id),
          mockAPI.getJobs(),
        ]);

        setStartups(startupsData);
        setResume(resumeData);
        setApplications(applicationsData);
        setSavedJobs(savedJobsData);
        setRecentJobs(jobsData.slice(0, 3));
      } catch (error) {
        console.error('Error loading overview data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

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
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600">Here's what's happening with your startup journey.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Startups</CardTitle>
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
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{applications.length}</div>
            <p className="text-xs text-muted-foreground">
              Total job applications
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saved Jobs</CardTitle>
            <Bookmark className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{savedJobs.length}</div>
            <p className="text-xs text-muted-foreground">
              Bookmarked opportunities
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Status</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {resume ? '✓' : '○'}
            </div>
            <p className="text-xs text-muted-foreground">
              Resume {resume ? 'Complete' : 'Missing'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4k</div>
            <p className="text-xs text-muted-foreground">
              Platform connections
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="h-5 w-5" />
              <span>Startup Management</span>
            </CardTitle>
            <CardDescription>
              {startups.length > 0 ? 'Manage your startup profiles' : 'Register your first startup to get started'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {startups.length > 0 ? (
              <div className="space-y-4">
                <div className="space-y-3">
                  {startups.slice(0, 2).map((startup) => (
                    <div key={startup.id} className="border rounded-lg p-3">
                      <h3 className="font-semibold">{startup.name}</h3>
                      <p className="text-sm text-gray-600 line-clamp-1">{startup.description}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="secondary">{startup.stage}</Badge>
                        <Badge variant="outline">{startup.industry}</Badge>
                      </div>
                    </div>
                  ))}
                  {startups.length > 2 && (
                    <p className="text-sm text-gray-500">
                      +{startups.length - 2} more startup{startups.length - 2 !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
                <Button onClick={() => onTabChange('startup')} className="w-full">
                  Manage Startups
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Set up your startup profile to post jobs and connect with investors.
                </p>
                <Button onClick={() => onTabChange('startup')} className="w-full">
                  Register Startup
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Resume & Profile</span>
            </CardTitle>
            <CardDescription>
              {resume ? 'Your profile is ready' : 'Complete your profile to apply for jobs'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {resume ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">{resume.name}</h3>
                  <p className="text-sm text-gray-600">{resume.bio}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {resume.skills.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {resume.skills.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{resume.skills.length - 3} more
                      </Badge>
                    )}
                  </div>
                  {resume.customSections.length > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      {resume.customSections.length} custom section{resume.customSections.length !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
                <Button onClick={() => onTabChange('resume')} className="w-full">
                  Update Resume
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Create your resume to apply for startup jobs and showcase your skills.
                </p>
                <Button onClick={() => onTabChange('resume')} className="w-full">
                  Create Resume
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Job Seeker Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Send className="h-5 w-5" />
                <span>My Applications</span>
              </CardTitle>
              <CardDescription>Track your job application status</CardDescription>
            </div>
            <Button variant="outline" onClick={() => onTabChange('applications')}>
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {applications.length === 0 ? (
              <div className="text-center py-4">
                <Send className="mx-auto h-8 w-8 text-gray-400" />
                <p className="text-sm text-gray-500 mt-2">No applications yet</p>
                <Button size="sm" onClick={() => onTabChange('jobs')} className="mt-3">
                  Browse Jobs
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {applications.slice(0, 3).map((application) => (
                  <div key={application.id} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <h4 className="font-medium text-sm">{application.jobTitle}</h4>
                      <p className="text-xs text-gray-600">{application.startupName}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {application.status}
                    </Badge>
                  </div>
                ))}
                {applications.length > 3 && (
                  <p className="text-xs text-gray-500 text-center">
                    +{applications.length - 3} more applications
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Bookmark className="h-5 w-5" />
                <span>Saved Jobs</span>
              </CardTitle>
              <CardDescription>Jobs you've bookmarked for later</CardDescription>
            </div>
            <Button variant="outline" onClick={() => onTabChange('saved-jobs')}>
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {savedJobs.length === 0 ? (
              <div className="text-center py-4">
                <Bookmark className="mx-auto h-8 w-8 text-gray-400" />
                <p className="text-sm text-gray-500 mt-2">No saved jobs yet</p>
                <Button size="sm" onClick={() => onTabChange('jobs')} className="mt-3">
                  Browse Jobs
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {savedJobs.slice(0, 3).map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <h4 className="font-medium text-sm">{job.title}</h4>
                      <p className="text-xs text-gray-600">{job.startupName}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Badge variant={job.remote ? 'default' : 'secondary'} className="text-xs">
                        {job.remote ? 'Remote' : 'On-site'}
                      </Badge>
                    </div>
                  </div>
                ))}
                {savedJobs.length > 3 && (
                  <p className="text-xs text-gray-500 text-center">
                    +{savedJobs.length - 3} more saved jobs
                  </p>
                )}
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
            <CardDescription>Discover new opportunities in the startup ecosystem</CardDescription>
          </div>
          <Button variant="outline" onClick={() => onTabChange('jobs')}>
            View All Jobs
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentJobs.map((job) => (
              <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded">
                      <Building2 className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{job.title}</h3>
                      <p className="text-sm text-gray-600">{job.startupName} • {job.location}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <Badge variant={job.remote ? 'default' : 'secondary'}>
                        {job.remote ? 'Remote' : 'On-site'}
                      </Badge>
                      <Badge variant="outline">{job.type}</Badge>
                      {job.customQuestions.length > 0 && (
                        <Badge variant="outline" className="text-xs">
                          Custom Q&A
                        </Badge>
                      )}
                    </div>
                    {job.salaryMin && job.salaryMax && (
                      <p className="text-sm text-gray-600 mt-1">
                        ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}
                      </p>
                    )}
                  </div>
                  <Button size="sm" onClick={() => onTabChange('jobs')}>
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}