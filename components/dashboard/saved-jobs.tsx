'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/use-auth';
import { mockAPI } from '@/lib/mock-data';
import { Job } from '@/lib/types';
import { Bookmark, Building2, MapPin, Clock, DollarSign, Users, CheckCircle, BookmarkX } from 'lucide-react';

export default function SavedJobs() {
  const { user } = useAuth();
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [unsaving, setUnsaving] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  useEffect(() => {
    const loadSavedJobs = async () => {
      if (!user) return;

      try {
        const savedJobsData = await mockAPI.getSavedJobs(user.id);
        setSavedJobs(savedJobsData);
      } catch (error) {
        console.error('Error loading saved jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSavedJobs();
  }, [user]);

  const handleUnsaveJob = async (jobId: string) => {
    if (!user) return;

    setUnsaving(jobId);
    try {
      await mockAPI.unsaveJob(user.id, jobId);
      setSavedJobs(prev => prev.filter(job => job.id !== jobId));
    } catch (error) {
      console.error('Error unsaving job:', error);
    } finally {
      setUnsaving(null);
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
        <h1 className="text-3xl font-bold text-gray-900">Saved Jobs</h1>
        <p className="text-gray-600">Jobs you've bookmarked for later review</p>
      </div>

      {savedJobs.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Bookmark className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No saved jobs</h3>
              <p className="mt-1 text-sm text-gray-500">
                Start saving jobs from the job board to keep track of opportunities you're interested in.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {savedJobs.map((job) => (
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
                        <p className="text-gray-600">{job.startupName}</p>
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
                        {job.applications} applications
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
                      {job.customQuestions.length > 0 && (
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
                          <Button variant="outline" onClick={() => setSelectedJob(job)}>
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
                              {selectedJob?.startupName} • {selectedJob?.location}
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
                                <h3 className="font-semibold mb-2">Job Description</h3>
                                <p className="text-gray-600 whitespace-pre-line">
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

                              {selectedJob.customQuestions.length > 0 && (
                                <div>
                                  <h3 className="font-semibold mb-2">Additional Questions</h3>
                                  <div className="space-y-2">
                                    {selectedJob.customQuestions.map((question, index) => (
                                      <div key={question.id} className="bg-gray-50 p-3 rounded">
                                        <p className="text-sm font-medium">
                                          {index + 1}. {question.question}
                                          {question.required && <span className="text-red-500 ml-1">*</span>}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                          Type: {question.type === 'textarea' ? 'Long text' : question.type === 'url' ? 'URL' : 'Short text'}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>

                      <Button
                        variant="destructive"
                        onClick={() => handleUnsaveJob(job.id)}
                        disabled={unsaving === job.id}
                        className="flex items-center space-x-2"
                      >
                        <BookmarkX className="h-4 w-4" />
                        <span>{unsaving === job.id ? 'Removing...' : 'Remove'}</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}