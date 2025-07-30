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
import { Users, Calendar, Mail, Download, FileText, Eye, AlertCircle, Globe, Linkedin, Github, FileSpreadsheet, CheckCircle, XCircle, Clock, Star, UserCheck } from 'lucide-react';
import { toast } from 'sonner';
import { exportApplicationsToExcel, exportApplicationsToCSV } from '@/lib/excel-export';

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
  const [statusFilter, setStatusFilter] = useState<string>('all');

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
        toast.success(`Application ${status.toLowerCase()}`);
      }
    } catch (error) {
      console.error('Error updating application status:', error);
      toast.error('Failed to update application status');
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
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'REVIEWED':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'SHORTLISTED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: Application['status']) => {
    switch (status) {
      case 'SUBMITTED':
        return <Clock className="h-4 w-4" />;
      case 'REVIEWED':
        return <Eye className="h-4 w-4" />;
      case 'SHORTLISTED':
        return <Star className="h-4 w-4" />;
      case 'REJECTED':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const handleExportToExcel = () => {
    try {
      exportApplicationsToExcel({
        applications,
        jobTitle: job.title,
        startupName: job.startup.name,
      });
      toast.success('Applications exported to Excel successfully!');
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      toast.error('Failed to export applications');
    }
  };

  const handleExportToCSV = () => {
    try {
      exportApplicationsToCSV({
        applications,
        jobTitle: job.title,
        startupName: job.startup.name,
      });
      toast.success('Applications exported to CSV successfully!');
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      toast.error('Failed to export applications');
    }
  };

  const filteredApplications = statusFilter === 'all' 
    ? applications 
    : applications.filter(app => app.status === statusFilter);

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h3 className="text-xl font-semibold">Applicants for {job.title}</h3>
          <Badge variant="outline" className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>{applications.length} applicant{applications.length !== 1 ? 's' : ''}</span>
          </Badge>
        </div>
        
        {applications.length > 0 && (
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportToExcel}
              className="flex items-center space-x-2"
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span>Export Excel</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportToCSV}
              className="flex items-center space-x-2"
            >
              <FileText className="h-4 w-4" />
              <span>Export CSV</span>
            </Button>
          </div>
        )}
      </div>

      {/* Status Filter */}
      {applications.length > 0 && (
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Filter by status:</span>
          <div className="flex items-center space-x-2">
            <Button
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('all')}
            >
              All ({applications.length})
            </Button>
            <Button
              variant={statusFilter === 'SUBMITTED' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('SUBMITTED')}
              className="flex items-center space-x-1"
            >
              <Clock className="h-3 w-3" />
              <span>Submitted ({applications.filter(app => app.status === 'SUBMITTED').length})</span>
            </Button>
            <Button
              variant={statusFilter === 'REVIEWED' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('REVIEWED')}
              className="flex items-center space-x-1"
            >
              <Eye className="h-3 w-3" />
              <span>Reviewed ({applications.filter(app => app.status === 'REVIEWED').length})</span>
            </Button>
            <Button
              variant={statusFilter === 'SHORTLISTED' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('SHORTLISTED')}
              className="flex items-center space-x-1"
            >
              <Star className="h-3 w-3" />
              <span>Shortlisted ({applications.filter(app => app.status === 'SHORTLISTED').length})</span>
            </Button>
            <Button
              variant={statusFilter === 'REJECTED' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('REJECTED')}
              className="flex items-center space-x-1"
            >
              <XCircle className="h-3 w-3" />
              <span>Rejected ({applications.filter(app => app.status === 'REJECTED').length})</span>
            </Button>
          </div>
        </div>
      )}

      {filteredApplications.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">
                {statusFilter === 'all' ? 'No applications yet' : `No ${statusFilter.toLowerCase()} applications`}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {statusFilter === 'all' 
                  ? 'Applications will appear here once candidates start applying.'
                  : `No applications with ${statusFilter.toLowerCase()} status found.`
                }
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredApplications.map((application) => (
            <Card key={application.id} className="hover:shadow-lg transition-all duration-200 border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-full">
                        <UserCheck className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold">{(application.user as any)?.name}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Mail className="h-4 w-4 mr-1" />
                            {(application.user as any)?.email}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            Applied {new Date(application.appliedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <Badge className={`flex items-center space-x-1 px-3 py-1 ${getStatusColor(application.status)}`}>
                        {getStatusIcon(application.status)}
                        <span className="capitalize font-medium">{application.status.toLowerCase()}</span>
                      </Badge>
                    </div>

                    {/* Custom Answers Preview */}
                    {application.customAnswers && application.customAnswers.length > 0 && (
                      <div className="mb-4">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Application Questions:</h5>
                        <div className="space-y-2">
                          {application.customAnswers.slice(0, 2).map((answer) => (
                            <div key={answer.id} className="text-sm bg-gray-50 rounded-lg p-3">
                              <span className="font-medium text-gray-700">
                                {answer.question.question}:
                              </span>
                              <p className="text-gray-600 mt-1 line-clamp-2">{answer.answer}</p>
                            </div>
                          ))}
                          {application.customAnswers.length > 2 && (
                            <p className="text-xs text-gray-500">
                              +{application.customAnswers.length - 2} more answers
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Resume Status */}
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                      <span className="flex items-center">
                        <FileText className="h-4 w-4 mr-1" />
                        {application.resumePdfUrl ? 'Resume attached' : 'No resume attached'}
                      </span>
                    </div>

                    {/* Professional Links */}
                    {((application.user as any)?.website || (application.user as any)?.linkedin || (application.user as any)?.github) && (
                      <div className="flex items-center space-x-3 mb-4">
                        <span className="text-sm font-medium text-gray-700">Professional Links:</span>
                        <div className="flex space-x-2">
                          {(application.user as any)?.website && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open((application.user as any).website, '_blank')}
                              className="h-8 w-8 p-0 hover:bg-blue-50"
                              title="Website"
                            >
                              <Globe className="h-4 w-4 text-blue-600" />
                            </Button>
                          )}
                          {(application.user as any)?.linkedin && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open((application.user as any).linkedin, '_blank')}
                              className="h-8 w-8 p-0 hover:bg-blue-50"
                              title="LinkedIn"
                            >
                              <Linkedin className="h-4 w-4 text-blue-600" />
                            </Button>
                          )}
                          {(application.user as any)?.github && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open((application.user as any).github, '_blank')}
                              className="h-8 w-8 p-0 hover:bg-blue-50"
                              title="GitHub"
                            >
                              <Github className="h-4 w-4 text-gray-800" />
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end space-y-3 ml-6">
                    {/* Resume Actions */}
                    {application.resumePdfUrl && (
                      <div className="flex items-center space-x-2">
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
                          <Eye className="h-4 w-4" />
                          <span>View</span>
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadResume(application)}
                          className="flex items-center space-x-1"
                        >
                          <Download className="h-4 w-4" />
                          <span>Download</span>
                        </Button>
                      </div>
                    )}

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
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Application Details</DialogTitle>
                          <DialogDescription>
                            {application.job?.title} at {application.job?.startup?.name}
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-6">
                          <div>
                            <h4 className="font-semibold mb-3">Applicant Information</h4>
                            <div className="space-y-2 text-sm">
                              <p><span className="font-medium">Name:</span> {(application.user as any)?.name}</p>
                              <p><span className="font-medium">Email:</span> {(application.user as any)?.email}</p>
                              <p><span className="font-medium">Applied:</span> {new Date(application.appliedAt).toLocaleDateString()}</p>
                              <div className="flex items-center space-x-2">
                                <span className="font-medium">Status:</span>
                                <Badge className={`${getStatusColor(application.status)}`}>
                                  {getStatusIcon(application.status)}
                                  <span className="ml-1 capitalize">{application.status.toLowerCase()}</span>
                                </Badge>
                              </div>
                            </div>
                          </div>

                          {/* Professional Links */}
                          {((application.user as any)?.website || (application.user as any)?.linkedin || (application.user as any)?.github) && (
                            <div>
                              <h4 className="font-semibold mb-3">Professional Links</h4>
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
                              <h4 className="font-semibold mb-3">Resume</h4>
                              <div className="flex items-center space-x-3">
                                <FileText className="h-5 w-5 text-blue-600" />
                                <span className="text-sm text-gray-600">
                                  {application.resumePdfFileName || 'resume.pdf'}
                                </span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => downloadResume(application)}
                                >
                                  <Download className="h-4 w-4 mr-1" />
                                  Download
                                </Button>
                              </div>
                            </div>
                          )}

                          {/* Custom Answers */}
                          {application.customAnswers && application.customAnswers.length > 0 && (
                            <div>
                              <h4 className="font-semibold mb-3">Application Questions</h4>
                              <div className="space-y-3">
                                {application.customAnswers.map((answer) => (
                                  <div key={answer.id} className="border rounded-lg p-4 bg-gray-50">
                                    <h5 className="font-medium text-sm mb-2">{answer.question.question}</h5>
                                    <p className="text-sm text-gray-600">{answer.answer}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Status Update */}
                          <div>
                            <h4 className="font-semibold mb-3">Update Application Status</h4>
                            <div className="grid grid-cols-2 gap-2">
                              <Button
                                variant={application.status === 'SUBMITTED' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => handleStatusUpdate(application.id, 'SUBMITTED')}
                                disabled={updating === application.id}
                                className="flex items-center space-x-2"
                              >
                                <Clock className="h-4 w-4" />
                                <span>Submitted</span>
                              </Button>
                              <Button
                                variant={application.status === 'REVIEWED' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => handleStatusUpdate(application.id, 'REVIEWED')}
                                disabled={updating === application.id}
                                className="flex items-center space-x-2"
                              >
                                <Eye className="h-4 w-4" />
                                <span>Reviewed</span>
                              </Button>
                              <Button
                                variant={application.status === 'SHORTLISTED' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => handleStatusUpdate(application.id, 'SHORTLISTED')}
                                disabled={updating === application.id}
                                className="flex items-center space-x-2"
                              >
                                <Star className="h-4 w-4" />
                                <span>Shortlist</span>
                              </Button>
                              <Button
                                variant={application.status === 'REJECTED' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => handleStatusUpdate(application.id, 'REJECTED')}
                                disabled={updating === application.id}
                                className="flex items-center space-x-2"
                              >
                                <XCircle className="h-4 w-4" />
                                <span>Reject</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
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