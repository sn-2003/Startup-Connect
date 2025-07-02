'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/use-auth';
import { mockAPI } from '@/lib/mock-data';
import { Application, Job, Resume } from '@/lib/types';
import { Users, Mail, Calendar, CheckCircle, X, Eye, UserCheck, UserX } from 'lucide-react';

interface ApplicantListProps {
  job: Job;
}

export default function ApplicantList({ job }: ApplicantListProps) {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  useEffect(() => {
    const loadApplications = async () => {
      try {
        const applicationsData = await mockAPI.getJobApplications(job.id);
        setApplications(applicationsData);

        // Load resumes for all applicants
        const resumePromises = applicationsData.map(app => 
          mockAPI.getResumeByUserId(app.userId)
        );
        const resumesData = await Promise.all(resumePromises);
        setResumes(resumesData.filter(resume => resume !== null) as Resume[]);
      } catch (error) {
        console.error('Error loading applications:', error);
      } finally {
        setLoading(false);
      }
    };

    loadApplications();
  }, [job.id]);

  const handleStatusUpdate = async (applicationId: string, status: Application['status']) => {
    setUpdating(applicationId);
    try {
      const updatedApplication = await mockAPI.updateApplicationStatus(applicationId, status);
      setApplications(prev => 
        prev.map(app => app.id === applicationId ? updatedApplication : app)
      );
    } catch (error) {
      console.error('Error updating application status:', error);
    } finally {
      setUpdating(null);
    }
  };

  const getApplicantResume = (userId: string) => {
    return resumes.find(resume => resume.userId === userId);
  };

  const getStatusColor = (status: Application['status']) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'reviewed':
        return 'bg-yellow-100 text-yellow-800';
      case 'shortlisted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Applicants for {job.title}</h3>
        <Badge variant="outline" className="flex items-center space-x-1">
          <Users className="h-4 w-4" />
          <span>{applications.length} applicant{applications.length !== 1 ? 's' : ''}</span>
        </Badge>
      </div>

      {applications.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <Users className="mx-auto h-8 w-8 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No applications yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Applications will appear here once candidates start applying.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => {
            const resume = getApplicantResume(application.userId);
            return (
              <Card key={application.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <Users className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{application.applicantName}</h4>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Mail className="h-3 w-3" />
                            <span>{application.applicantEmail}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Applied {new Date(application.appliedAt).toLocaleDateString()}
                        </span>
                        <Badge className={getStatusColor(application.status)}>
                          <span className="capitalize">{application.status}</span>
                        </Badge>
                      </div>

                      {resume && (
                        <div className="mb-3">
                          <p className="text-sm text-gray-600 line-clamp-2">{resume.bio}</p>
                          {resume.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {resume.skills.slice(0, 5).map((skill) => (
                                <Badge key={skill} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                              {resume.skills.length > 5 && (
                                <Badge variant="outline" className="text-xs">
                                  +{resume.skills.length - 5} more
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex items-center space-x-2">
                        {/* View Application Details */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedApplication(application)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Application Details</DialogTitle>
                              <DialogDescription>
                                {selectedApplication?.applicantName} • {selectedApplication?.applicantEmail}
                              </DialogDescription>
                            </DialogHeader>
                            {selectedApplication && (
                              <div className="space-y-6">
                                {/* Application Info */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                  <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold">Application Status</h3>
                                    <Badge className={getStatusColor(selectedApplication.status)}>
                                      <span className="capitalize">{selectedApplication.status}</span>
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-gray-600">
                                    Applied on {new Date(selectedApplication.appliedAt).toLocaleDateString()}
                                  </p>
                                </div>

                                {/* Resume Info */}
                                {resume && (
                                  <div>
                                    <h3 className="font-semibold mb-3">Resume Summary</h3>
                                    <div className="space-y-4">
                                      <div>
                                        <h4 className="font-medium mb-1">Professional Bio</h4>
                                        <p className="text-gray-600">{resume.bio}</p>
                                      </div>
                                      
                                      {resume.skills.length > 0 && (
                                        <div>
                                          <h4 className="font-medium mb-2">Skills</h4>
                                          <div className="flex flex-wrap gap-2">
                                            {resume.skills.map((skill) => (
                                              <Badge key={skill} variant="secondary">
                                                {skill}
                                              </Badge>
                                            ))}
                                          </div>
                                        </div>
                                      )}

                                      {resume.experience.length > 0 && (
                                        <div>
                                          <h4 className="font-medium mb-2">Recent Experience</h4>
                                          <div className="space-y-2">
                                            {resume.experience.slice(0, 2).map((exp) => (
                                              <div key={exp.id} className="border-l-2 border-blue-500 pl-3">
                                                <h5 className="font-medium">{exp.position}</h5>
                                                <p className="text-sm text-gray-600">{exp.company}</p>
                                                <p className="text-xs text-gray-500">
                                                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                                                </p>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* Custom Answers */}
                                {selectedApplication.customAnswers.length > 0 && (
                                  <div>
                                    <h3 className="font-semibold mb-3">Custom Question Answers</h3>
                                    <div className="space-y-4">
                                      {selectedApplication.customAnswers.map((answer, index) => {
                                        const question = job.customQuestions.find(q => q.id === answer.questionId);
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

                        {/* Status Update Buttons */}
                        {application.status === 'submitted' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleStatusUpdate(application.id, 'shortlisted')}
                              disabled={updating === application.id}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <UserCheck className="h-4 w-4 mr-1" />
                              {updating === application.id ? 'Updating...' : 'Shortlist'}
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleStatusUpdate(application.id, 'rejected')}
                              disabled={updating === application.id}
                            >
                              <UserX className="h-4 w-4 mr-1" />
                              {updating === application.id ? 'Updating...' : 'Reject'}
                            </Button>
                          </>
                        )}

                        {application.status === 'shortlisted' && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleStatusUpdate(application.id, 'rejected')}
                            disabled={updating === application.id}
                          >
                            <UserX className="h-4 w-4 mr-1" />
                            {updating === application.id ? 'Updating...' : 'Reject'}
                          </Button>
                        )}

                        {application.status === 'rejected' && (
                          <Button
                            size="sm"
                            onClick={() => handleStatusUpdate(application.id, 'shortlisted')}
                            disabled={updating === application.id}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <UserCheck className="h-4 w-4 mr-1" />
                            {updating === application.id ? 'Updating...' : 'Reconsider'}
                          </Button>
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