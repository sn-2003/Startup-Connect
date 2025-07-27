'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/use-auth';
import { apiClient } from '@/lib/api-client';
import { ApplicationWithRelations, Application, JobWithRelations } from '@/lib/types';
import { Users, Calendar, Mail, Download, FileText, Eye, AlertCircle, Globe, Linkedin, Github } from 'lucide-react';
import { toast } from 'sonner';

interface ApplicantListProps {
  job: JobWithRelations;
}

export default function ApplicantList({ job }: ApplicantListProps) {
  const { user } = useAuth();
  const [applications, setApplications] = useState<ApplicationWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<ApplicationWithRelations | null>(null);
  const [showResumePreview, setShowResumePreview] = useState(false);
  const [resumePreviewError, setResumePreviewError] = useState(false);

  useEffect(() => {
    const loadApplications = async () => {
      try {
        const response = await apiClient.getJobApplications(job.id);
        if (response.success && response.data) {
          setApplications(response.data);
        }
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
      const response = await apiClient.updateApplicationStatus(applicationId, status);
      if (response.success && response.data) {
        setApplications(prev => 
          prev.map(app => app.id === applicationId ? response.data : app)
        );
      }
    } catch (error) {
      console.error('Error updating application status:', error);
    } finally {
      setUpdating(null);
    }
  };

  const downloadResume = async (application: ApplicationWithRelations) => {
    if (!application.resumePdfUrl) {
      toast.error('No resume available for this applicant');
      return;
    }

    try {
      const response = await fetch(application.resumePdfUrl, { mode: 'cors' });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = application.resumePdfFileName || 'resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the object URL
      window.URL.revokeObjectURL(url);
      toast.success('Resume downloaded successfully!');
    } catch (error) {
      console.error('Error downloading resume:', error);
      toast.error('Failed to download resume');
    }
  };

  const getStatusColor = (status: Application['status']) => {
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
          {applications.map((application) => (
            <Card key={application.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Users className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{(application.user as any)?.name}</h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Mail className="h-3 w-3" />
                          <span>{(application.user as any)?.email}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Applied {new Date(application.appliedAt).toLocaleDateString()}
                      </span>
                      <Badge className={getStatusColor(application.status)}>
                        <span className="capitalize">{application.status.toLowerCase()}</span>
                      </Badge>
                    </div>

                    {/* Custom Answers */}
                    {application.customAnswers && application.customAnswers.length > 0 && (
                      <div className="space-y-2 mb-3">
                        {application.customAnswers.map((answer) => (
                          <div key={answer.id} className="text-sm">
                            <span className="font-medium text-gray-700">
                              {answer.question.question}:
                            </span>
                            <p className="text-gray-600 ml-2">{answer.answer}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Resume Status */}
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                      <FileText className="h-3 w-3" />
                      <span>
                        {application.resumePdfUrl ? 'Resume attached' : 'No resume attached'}
                      </span>
                    </div>

                    {/* Professional Links */}
                    {((application.user as any)?.website || (application.user as any)?.linkedin || (application.user as any)?.github) && (
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="text-sm font-medium text-gray-700">Professional Links:</span>
                        <div className="flex space-x-1">
                          {(application.user as any)?.website && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open((application.user as any).website, '_blank')}
                              className="h-6 w-6 p-0 hover:bg-blue-50"
                              title="Website"
                            >
                              <Globe className="h-3 w-3 text-blue-600" />
                            </Button>
                          )}
                          {(application.user as any)?.linkedin && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open((application.user as any).linkedin, '_blank')}
                              className="h-6 w-6 p-0 hover:bg-blue-50"
                              title="LinkedIn"
                            >
                              <Linkedin className="h-3 w-3 text-blue-600" />
                            </Button>
                          )}
                          {(application.user as any)?.github && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open((application.user as any).github, '_blank')}
                              className="h-6 w-6 p-0 hover:bg-blue-50"
                              title="GitHub"
                            >
                              <Github className="h-3 w-3 text-gray-800" />
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Resume Actions */}
                    {application.resumePdfUrl && (
                      <>
                        {/* View Resume Button */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedApplication(application);
                            setShowResumePreview(true);
                            setResumePreviewError(false);
                          }}
                          className="flex items-center space-x-1"
                        >
                          <Eye className="h-3 w-3" />
                          <span>View</span>
                        </Button>

                        {/* Download Resume Button */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadResume(application)}
                          className="flex items-center space-x-1"
                        >
                          <Download className="h-3 w-3" />
                          <span>Download</span>
                        </Button>
                      </>
                    )}

                    {/* View Application Details */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedApplication(application)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Application Details</DialogTitle>
                          <DialogDescription>
                            {application.job?.title} at {application.job?.startup?.name}
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2">Applicant Information</h4>
                            <div className="space-y-1 text-sm">
                              <p><span className="font-medium">Name:</span> {(application.user as any)?.name}</p>
                              <p><span className="font-medium">Email:</span> {(application.user as any)?.email}</p>
                              <p><span className="font-medium">Applied:</span> {new Date(application.appliedAt).toLocaleDateString()}</p>
                              <p><span className="font-medium">Status:</span> 
                                <Badge className={`ml-2 ${getStatusColor(application.status)}`}>
                                  {application.status.toLowerCase()}
                                </Badge>
                              </p>
                            </div>
                          </div>

                          {/* Professional Links */}
                          {((application.user as any)?.website || (application.user as any)?.linkedin || (application.user as any)?.github) && (
                            <div>
                              <h4 className="font-semibold mb-2">Professional Links</h4>
                              <div className="flex flex-wrap gap-2">
                                {(application.user as any)?.website && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => window.open((application.user as any).website, '_blank')}
                                    className="flex items-center space-x-2"
                                  >
                                    <Globe className="h-4 w-4" />
                                    <span>Website</span>
                                  </Button>
                                )}
                                {(application.user as any)?.linkedin && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => window.open((application.user as any).linkedin, '_blank')}
                                    className="flex items-center space-x-2"
                                  >
                                    <Linkedin className="h-4 w-4" />
                                    <span>LinkedIn</span>
                                  </Button>
                                )}
                                {(application.user as any)?.github && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => window.open((application.user as any).github, '_blank')}
                                    className="flex items-center space-x-2"
                                  >
                                    <Github className="h-4 w-4" />
                                    <span>GitHub</span>
                                  </Button>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Resume Section */}
                          {application.resumePdfUrl && (
                            <div>
                              <h4 className="font-semibold mb-2">Resume</h4>
                              <div className="flex items-center space-x-2">
                                <FileText className="h-4 w-4 text-blue-600" />
                                <span className="text-sm text-gray-600">
                                  {application.resumePdfFileName || 'resume.pdf'}
                                </span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => downloadResume(application)}
                                >
                                  <Download className="h-3 w-3 mr-1" />
                                  Download
                                </Button>
                              </div>
                            </div>
                          )}

                          {/* Custom Answers */}
                          {application.customAnswers && application.customAnswers.length > 0 && (
                            <div>
                              <h4 className="font-semibold mb-2">Application Questions</h4>
                              <div className="space-y-3">
                                {application.customAnswers.map((answer) => (
                                  <div key={answer.id} className="border rounded-lg p-3">
                                    <h5 className="font-medium text-sm mb-1">{answer.question.question}</h5>
                                    <p className="text-sm text-gray-600">{answer.answer}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Status Update */}
                          <div>
                            <h4 className="font-semibold mb-2">Update Status</h4>
                            <Select
                              value={application.status}
                              onValueChange={(value: Application['status']) => 
                                handleStatusUpdate(application.id, value)
                              }
                              disabled={updating === application.id}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="SUBMITTED">Submitted</SelectItem>
                                <SelectItem value="REVIEWED">Reviewed</SelectItem>
                                <SelectItem value="SHORTLISTED">Shortlisted</SelectItem>
                                <SelectItem value="REJECTED">Rejected</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {/* Status Update */}
                    <Select
                      value={application.status}
                      onValueChange={(value: Application['status']) => 
                        handleStatusUpdate(application.id, value)
                      }
                      disabled={updating === application.id}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SUBMITTED">Submitted</SelectItem>
                        <SelectItem value="REVIEWED">Reviewed</SelectItem>
                        <SelectItem value="SHORTLISTED">Shortlisted</SelectItem>
                        <SelectItem value="REJECTED">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Resume Preview Dialog */}
      {selectedApplication && selectedApplication.resumePdfUrl && (
        <Dialog open={showResumePreview} onOpenChange={setShowResumePreview}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Resume Preview - {(selectedApplication.user as any)?.name}</span>
              </DialogTitle>
              <DialogDescription>
                {selectedApplication.resumePdfFileName || 'resume.pdf'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex justify-center items-center w-full">
              {!resumePreviewError ? (
                <iframe
                  src={`${selectedApplication.resumePdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                  className="w-full max-w-[700px] h-[600px] rounded-lg border"
                  title="Resume Preview"
                  onError={() => setResumePreviewError(true)}
                  style={{ background: 'white', transform: 'translateZ(0)' }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <AlertCircle className="h-10 w-10 text-red-500 mb-2" />
                  <p className="text-red-600 font-semibold mb-2">Unable to preview resume.</p>
                  <Button onClick={() => downloadResume(selectedApplication)}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Resume
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}