'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/use-auth';
import { apiClient } from '@/lib/api-client';
import { ApplicationWithJobDetails, JobWithStartup, ApplicationStatus, CustomAnswer, CustomQuestion } from '@/lib/types';
import { FileText, Building2, Calendar, Clock, CheckCircle, Eye } from 'lucide-react';
import { SocialIcons } from './social-icons';

export default function MyApplications() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<ApplicationWithJobDetails[]>([]);
  const [jobs, setJobs] = useState<JobWithStartup[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<ApplicationWithJobDetails | null>(null);
  const [selectedJob, setSelectedJob] = useState<JobWithStartup | null>(null);

  useEffect(() => {
    const loadApplications = async () => {
      if (!user) return;

      try {
        const [applicationsRes, jobsRes] = await Promise.all([
          apiClient.getMyApplications(),
          apiClient.getJobs(),
        ]);

        if (applicationsRes.success && applicationsRes.data) {
          setApplications(applicationsRes.data);
        }

        if (jobsRes.success && jobsRes.data) {
          setJobs(jobsRes.data);
        }
      } catch (error) {
        console.error('Error loading applications:', error);
      } finally {
        setLoading(false);
      }
    };

    loadApplications();
  }, [user]);

  const getJobDetails = (jobId: string): JobWithStartup | undefined => {
    return jobs.find(job => job.id === jobId);
  };

  const getStatusColor = (status: ApplicationStatus): string => {
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

  const getStatusIcon = (status: ApplicationStatus) => {
    switch (status) {
      case 'SUBMITTED':
        return <Clock className="h-4 w-4" />;
      case 'REVIEWED':
        return <Eye className="h-4 w-4" />;
      case 'SHORTLISTED':
        return <CheckCircle className="h-4 w-4" />;
      case 'REJECTED':
        return <FileText className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
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
        <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
        <p className="text-gray-600">Track the status of your job applications</p>
      </div>

      {applications.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No applications yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Start applying to jobs to track your applications here.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => {
            const job = getJobDetails(application.jobId);
            return (
              <Card key={application.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <Building2 className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold">{application.job?.title || 'Job Title'}</h3>
                          <p className="text-gray-600">{application.job?.startup?.name || 'Company Name'}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Applied {new Date(application.appliedAt).toLocaleDateString()}
                        </span>
                        {job && (
                          <>
                            <span>{job.location}</span>
                            <span>•</span>
                            <span>{job.type}</span>
                            <span>•</span>
                            <span>{job.experienceLevel}</span>
                          </>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 mb-4">
                        <Badge className={getStatusColor(application.status)}>
                          <span className="flex items-center space-x-1">
                            {getStatusIcon(application.status)}
                            <span className="capitalize">{application.status.toLowerCase()}</span>
                          </span>
                        </Badge>
                        {application.customAnswers && application.customAnswers.length > 0 && (
                          <Badge variant="outline">
                            {application.customAnswers.length} custom answer{application.customAnswers.length !== 1 ? 's' : ''}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center space-x-3">
                        {/* View Application Details */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              onClick={() => setSelectedApplication(application)}
                            >
                              View Application
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Application Details</DialogTitle>
                              <DialogDescription>
                                {selectedApplication?.job?.title} at {selectedApplication?.job?.startup?.name}
                              </DialogDescription>
                            </DialogHeader>
                            {selectedApplication && (
                              <div className="space-y-6">
                                <div className="bg-gray-50 rounded-lg p-4">
                                  <h3 className="font-semibold mb-2">Application Status</h3>
                                  <Badge className={getStatusColor(selectedApplication.status)}>
                                    <span className="flex items-center space-x-1">
                                      {getStatusIcon(selectedApplication.status)}
                                      <span className="capitalize">{selectedApplication.status.toLowerCase()}</span>
                                    </span>
                                  </Badge>
                                  <p className="text-sm text-gray-600 mt-2">
                                    Applied on {new Date(selectedApplication.appliedAt).toLocaleDateString()}
                                  </p>
                                </div>

                                {selectedApplication.customAnswers && selectedApplication.customAnswers.length > 0 && (
                                  <div>
                                    <h3 className="font-semibold mb-4">Your Answers</h3>
                                    <div className="space-y-4">
                                      {selectedApplication.customAnswers.map((answer: CustomAnswer & { question: CustomQuestion }, index: number) => {
                                        const question = selectedApplication.job?.customQuestions?.find((q: CustomQuestion) => q.id === answer.questionId);
                                        return (
                                          <div key={answer.questionId} className="border rounded-lg p-4">
                                            <h4 className="font-medium mb-2">
                                              {index + 1}. {question?.question || 'Question not found'}
                                            </h4>
                                            <p className="text-gray-600 whitespace-pre-line">
                                              {answer.answer}
                                            </p>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        {/* View Job Details */}
                        {job && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                onClick={() => setSelectedJob(job)}
                              >
                                View Job
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
                                    <h4 className="font-semibold mb-1">Description</h4>
                                    <p className="text-gray-700 whitespace-pre-line">{selectedJob.description}</p>
                                  </div>

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
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}