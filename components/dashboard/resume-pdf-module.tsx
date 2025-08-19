'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';
import { apiClient } from '@/lib/api-client';
import { Resume } from '@/lib/types';
import { 
  FileText, 
  Upload, 
  Download, 
  Trash2, 
  Eye, 
  CheckCircle, 
  AlertCircle,
  File,
  Calendar,
  User
} from 'lucide-react';
import { toast } from 'sonner';

export default function ResumePdfModule() {
  const { user } = useAuth();
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showPdf, setShowPdf] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pdfError, setPdfError] = useState(false);

  useEffect(() => {
    loadResume();
  }, [user]);

  const loadResume = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await apiClient.getMyResume();
      if (response.success && response.data) {
        setResume(response.data);
      }
    } catch (error) {
      console.error('Error loading resume:', error);
      toast.error('Failed to load resume');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadResume(file);
    }
  };

  const uploadResume = async (file: File) => {
    if (!user) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      toast.error('Please select a PDF file');
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('File size must be less than 10MB');
      return;
    }

    try {
      setUploading(true);
      const response = await apiClient.uploadResumePdf(file);
      
      if (response.success && response.data) {
        setResume(response.data);
        toast.success('Resume uploaded successfully!');
      } else {
        toast.error(response.error || 'Failed to upload resume');
      }
    } catch (error) {
      console.error('Error uploading resume:', error);
      toast.error('Failed to upload resume');
    } finally {
      setUploading(false);
    }
  };

  const deleteResume = async () => {
    if (!user || !resume?.pdfUrl) return;

    try {
      setDeleting(true);
      const response = await apiClient.deleteResumePdf();
      
      if (response.success && response.data) {
        setResume(response.data);
        setShowPdf(false);
        toast.success('Resume deleted successfully!');
      } else {
        toast.error(response.error || 'Failed to delete resume');
      }
    } catch (error) {
      console.error('Error deleting resume:', error);
      toast.error('Failed to delete resume');
    } finally {
      setDeleting(false);
    }
  };

  const downloadResume = async () => {
    if (!resume?.pdfUrl) return;

    try {
      const response = await fetch(resume.pdfUrl, { mode: 'cors' });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = resume.pdfFileName || 'resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the object URL
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error('Failed to download resume');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Resume</h1>
          <p className="text-gray-600">Upload and manage your PDF resume</p>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Resume</h1>
        <p className="text-gray-600">Upload and manage your PDF resume</p>
      </div>

      {!resume?.pdfUrl ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Upload Your Resume</span>
            </CardTitle>
            <CardDescription>
              Upload your resume in PDF format to showcase your experience to potential employers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No resume uploaded yet
              </h3>
              <p className="text-gray-600 mb-6">
                Upload your resume in PDF format to get started
              </p>
              <Button 
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full sm:w-auto"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload PDF Resume
                  </>
                )}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="mt-4 text-sm text-gray-500">
                <p>• Maximum file size: 10MB</p>
                <p>• Only PDF files are supported</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Resume Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Your Resume</span>
                <Badge variant="secondary" className="ml-2">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Uploaded
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <File className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {resume.pdfFileName || 'resume.pdf'}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        Uploaded {formatDate(resume.updatedAt)}
                      </span>
                    </div>
                    {resume.name && (
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <User className="h-3 w-3 mr-1" />
                        {resume.name}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPdf(!showPdf)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {showPdf ? 'Hide' : 'View'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={downloadResume}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    {uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600 mr-1"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Replace
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={deleteResume}
                    disabled={deleting}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    {deleting ? (
                      <>
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-600 mr-1"></div>
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </>
                    )}
                  </Button>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
            </CardContent>
          </Card>

          {/* PDF Viewer */}
          {showPdf && resume.pdfUrl && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="h-5 w-5" />
                  <span>Resume Preview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center items-center w-full">
                  {!pdfError ? (
                    <iframe
                      src={`${resume.pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                      className="w-full max-w-[700px] h-[900px] rounded-lg border"
                      title="Resume Preview"
                      onError={() => setPdfError(true)}
                      style={{ background: 'white', transform: 'translateZ(0)' }}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12">
                      <AlertCircle className="h-10 w-10 text-red-500 mb-2" />
                      <p className="text-red-600 font-semibold mb-2">Unable to preview PDF.</p>
                      <Button onClick={downloadResume}>
                        <Download className="h-4 w-4 mr-2" />
                        Download Resume
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
} 