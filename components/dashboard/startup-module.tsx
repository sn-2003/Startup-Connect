'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/use-auth';
import { apiClient } from '@/lib/api-client';
import { Startup, JobWithStartup, CustomQuestion } from '@/lib/types';
import ApplicantList from './applicant-list';
import { Building2, Plus, MapPin, Users, TrendingUp, Edit, Trash2, Eye, Briefcase, X, Save, UserCheck, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export default function StartupModule() {
  const { user } = useAuth();
  const [startups, setStartups] = useState<Startup[]>([]);
  const [selectedStartup, setSelectedStartup] = useState<Startup | null>(null);
  const [jobs, setJobs] = useState<JobWithStartup[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('startups');
  const [editingStartup, setEditingStartup] = useState<Startup | null>(null);
  const [editingJob, setEditingJob] = useState<JobWithStartup | null>(null);
  const [customQuestions, setCustomQuestions] = useState<CustomQuestion[]>([]);
  const [selectedJobForApplicants, setSelectedJobForApplicants] = useState<JobWithStartup | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [promoFiles, setPromoFiles] = useState<File[]>([]);
  const [promoPreviews, setPromoPreviews] = useState<string[]>([]);
  // Add state for delete confirmation
  const [confirmDelete, setConfirmDelete] = useState<{ type: 'startup' | 'job', id: string } | null>(null);
  const [previewJob, setPreviewJob] = useState<JobWithStartup | null>(null);
  const [promoWarning, setPromoWarning] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;

      try {
        const startupsRes = await apiClient.getMyStartups();
        if (startupsRes.success && startupsRes.data) {
          setStartups(startupsRes.data);
          
          if (startupsRes.data.length > 0) {
            setSelectedStartup(startupsRes.data[0]);
            const jobsRes = await apiClient.getJobsByStartup(startupsRes.data[0].id);
            if (jobsRes.success && jobsRes.data) {
              setJobs(jobsRes.data);
            }
          }
        }
      } catch (error) {
        console.error('Error loading startup data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    const interval = setInterval(() => {
      loadData();
    }, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const loadJobs = async () => {
      if (selectedStartup) {
        try {
          const jobsRes = await apiClient.getJobsByStartup(selectedStartup.id);
          if (jobsRes.success && jobsRes.data) {
            setJobs(jobsRes.data);
          }
        } catch (error) {
          console.error('Error loading jobs:', error);
        }
      }
    };

    loadJobs();
  }, [selectedStartup]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setLogoFile(file);
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
    } else {
      setLogoPreview(null);
    }
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
  };

  const handlePromoImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let files = Array.from(e.target.files || []);
    let newFiles = [...promoFiles, ...files];
    // Remove duplicates by name+size (not perfect, but works for most cases)
    newFiles = newFiles.filter((file, idx, arr) =>
      arr.findIndex(f => f.name === file.name && f.size === file.size) === idx
    );
    if (newFiles.length > 3) {
      setPromoWarning('You can upload a maximum of 3 promotional images.');
      newFiles = newFiles.slice(0, 3);
    } else {
      setPromoWarning(null);
    }
    setPromoFiles(newFiles);
    setPromoPreviews(newFiles.map(file => URL.createObjectURL(file)));
    // Reset the input value so the same file can be selected again if removed
    e.target.value = '';
  };

  const handleRemovePromoImage = (idx: number) => {
    const newFiles = promoFiles.filter((_, i) => i !== idx);
    const newPreviews = promoPreviews.filter((_, i) => i !== idx);
    setPromoFiles(newFiles);
    setPromoPreviews(newPreviews);
    if (promoWarning && newFiles.length <= 3) setPromoWarning(null);
  };

  const handleStartupSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    const formData = new FormData(e.currentTarget);
    
    let logoUrl = editingStartup?.logo || '';
    // If a new logo file is selected, delete the old logo and upload the new one to Supabase
    if (logoFile) {
      let oldLogoPath = '';
      if (editingStartup?.logo && editingStartup.logo.includes('supabase.co/storage/v1/object/public/logos/')) {
        // Extract the path after /logos/
        const match = editingStartup.logo.match(/logos\/(.*)$/);
        if (match && match[1]) {
          oldLogoPath = match[1];
        }
      }
      // Use a consistent file name per startup
      const fileExt = logoFile.name.split('.').pop();
      const fileName = `startup-${editingStartup?.id || Date.now()}.${fileExt}`;
      // Delete old logo if it exists and is different from the new file name
      if (oldLogoPath && oldLogoPath !== fileName) {
        await supabase.storage.from('logos').remove([oldLogoPath]);
      }
      const { data, error } = await supabase.storage.from('logos').upload(fileName, logoFile, {
        cacheControl: '3600',
        upsert: true,
      });
      if (error) {
        console.error('Error uploading logo:', error);
        setSaving(false);
        return;
      }
      // Get public URL
      const { data: publicUrlData } = supabase.storage.from('logos').getPublicUrl(fileName);
      logoUrl = publicUrlData.publicUrl;
    }

    // Upload promotional images (max 3)
    let promotionalImages: string[] = editingStartup?.promotionalImages || [];
    if (promoFiles.length > 0) {
      // Delete old promotional images if editing
      if (editingStartup?.promotionalImages && editingStartup.promotionalImages.length > 0) {
        const oldPromoPaths = editingStartup.promotionalImages
          .map(url => {
            const match = url.match(/promos\/(.*)$/);
            return match && match[1] ? match[1] : null;
          })
          .filter(Boolean) as string[];
        if (oldPromoPaths.length > 0) {
          await supabase.storage.from('promos').remove(oldPromoPaths);
        }
      }
      promotionalImages = [];
      // Only upload up to 3 images
      const filesToUpload = promoFiles.slice(0, 3);
      for (const file of filesToUpload) {
        const fileExt = file.name.split('.').pop();
        const fileName = `promo-${editingStartup?.id || Date.now()}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
        const { data, error } = await supabase.storage.from('promos').upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });
        if (!error) {
          const { data: publicUrlData } = supabase.storage.from('promos').getPublicUrl(fileName);
          promotionalImages.push(publicUrlData.publicUrl);
        }
      }
    }

    const startupData = {
      name: formData.get('name') as string,
      domain: formData.get('domain') as string,
      stage: formData.get('stage') as any,
      description: formData.get('description') as string,
      founded: formData.get('founded') as string,
      location: formData.get('location') as string,
      employees: formData.get('employees') as string,
      funding: formData.get('funding') as string,
      website: formData.get('website') as string,
      industry: formData.get('industry') as string,
      logo: logoUrl,
      xUrl: formData.get('xUrl') as string,
      instagramUrl: formData.get('instagramUrl') as string,
      linkedinUrl: formData.get('linkedinUrl') as string,
      promotionalImages,
    };

    try {
      if (editingStartup) {
        const response = await apiClient.updateStartup(editingStartup.id, startupData);
        if (response.success && response.data) {
          setStartups(startups.map(s => s.id === editingStartup.id ? response.data : s));
          if (selectedStartup?.id === editingStartup.id) {
            setSelectedStartup(response.data);
          }
          setEditingStartup(null);
        }
      } else {
        const response = await apiClient.createStartup(startupData);
        if (response.success && response.data) {
          setStartups([...startups, response.data]);
          if (!selectedStartup) {
            setSelectedStartup(response.data);
          }
        }
      }
      (e.target as HTMLFormElement).reset();
      setLogoFile(null);
      setLogoPreview(null);
      setPromoFiles([]);
      setPromoPreviews([]);
    } catch (error) {
      console.error('Error saving startup:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteStartup = async (startupId: string) => {
    try {
      const response = await apiClient.deleteStartup(startupId);
      if (response.success) {
        const updatedStartups = startups.filter(s => s.id !== startupId);
        setStartups(updatedStartups);
        
        if (selectedStartup?.id === startupId) {
          setSelectedStartup(updatedStartups.length > 0 ? updatedStartups[0] : null);
        }
      }
    } catch (error) {
      console.error('Error deleting startup:', error);
    }
  };

  const addCustomQuestion = () => {
    const newQuestion: CustomQuestion = {
      id: Date.now().toString(),
      question: '',
      type: 'TEXT',
      required: false,
      order: customQuestions.length,
      jobId: '',
    };
    setCustomQuestions([...customQuestions, newQuestion]);
  };

  const updateCustomQuestion = (id: string, updates: Partial<CustomQuestion>) => {
    setCustomQuestions(customQuestions.map(q => 
      q.id === id ? { ...q, ...updates } : q
    ));
  };

  const removeCustomQuestion = (id: string) => {
    setCustomQuestions(customQuestions.filter(q => q.id !== id));
  };

  const handleJobSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedStartup) {
      alert('Please select a startup first');
      return;
    }

    setSaving(true);
    const formData = new FormData(e.currentTarget);
    
    const jobData = {
      startupId: selectedStartup.id,
      title: formData.get('title') as string,
      location: formData.get('location') as string,
      type: formData.get('type') as any,
      description: formData.get('description') as string,
      requirements: (formData.get('requirements') as string).split('\n').filter(req => req.trim()),
      experienceLevel: formData.get('experienceLevel') as any,
      salaryMin: parseInt(formData.get('salaryMin') as string) || undefined,
      salaryMax: parseInt(formData.get('salaryMax') as string) || undefined,
      remote: formData.get('remote') === 'true',
      customQuestions: customQuestions.filter(q => q.question.trim()).map((q, index) => ({
        question: q.question,
        type: q.type,
        required: q.required,
        order: index,
      })),
      unpaid: formData.get('unpaid') === 'on',
    };

    try {
      if (editingJob) {
        const response = await apiClient.updateJob(editingJob.id, jobData);
        if (response.success && response.data) {
          setJobs(jobs.map(j => j.id === editingJob.id ? response.data : j));
          setEditingJob(null);
        }
      } else {
        const response = await apiClient.createJob(jobData);
        if (response.success && response.data) {
          setJobs([response.data, ...jobs]);
        }
      }
      setCustomQuestions([]);
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error('Error saving job:', error);
      alert('Error saving job. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleEditJob = (job: JobWithStartup) => {
    setEditingJob(job);
    setCustomQuestions(job.customQuestions || []);
    setActiveTab('jobs');
  };

  const handleDelistJob = async (jobId: string) => {
    try {
      const response = await apiClient.delistJob(jobId);
      if (response.success) {
        setJobs(jobs.map(j => j.id === jobId ? { ...j, listed: false } : j));
      }
    } catch (error) {
      console.error('Error delisting job:', error);
    }
  };

  const handleRelistJob = async (jobId: string) => {
    try {
      const response = await apiClient.relistJob(jobId);
      if (response.success) {
        setJobs(jobs.map(j => j.id === jobId ? { ...j, listed: true } : j));
      }
    } catch (error) {
      console.error('Error relisting job:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Startups</h1>
        <p className="text-gray-600">Manage your startup profiles and job postings</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="startups">My Startups</TabsTrigger>
          <TabsTrigger value="jobs">Job Postings</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="startups" className="space-y-6">
          {/* Startup List */}
          {startups.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Your Startups</CardTitle>
                <CardDescription>Select a startup to manage or create a new one</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {startups.map((startup) => (
                    <div 
                      key={startup.id} 
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedStartup?.id === startup.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedStartup(startup)}
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={startup.logo || undefined} alt={startup.name} />
                          <AvatarFallback>
                            <Building2 className="h-5 w-5" />
                          </AvatarFallback>
                        </Avatar>
                        <h3 className="font-semibold flex-1">{startup.name}</h3>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingStartup(startup);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setConfirmDelete({ type: 'startup', id: startup.id });
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-3">{startup.description}</p>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">{startup.stage}</Badge>
                        <Badge variant="outline">{startup.industry}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Create/Edit Startup Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="h-5 w-5" />
                <span>{editingStartup ? 'Edit Startup' : 'Create New Startup'}</span>
              </CardTitle>
              <CardDescription>
                {editingStartup ? 'Update your startup information' : 'Register a new startup to get started'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleStartupSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Company Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      required
                      defaultValue={editingStartup?.name || ''}
                      placeholder="Your startup name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="domain">Domain</Label>
                    <Input
                      id="domain"
                      name="domain"
                      defaultValue={editingStartup?.domain || ''}
                      placeholder="yourcompany.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry *</Label>
                    <Select name="industry" defaultValue={editingStartup?.industry || ''}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SaaS">SaaS</SelectItem>
                        <SelectItem value="Analytics">Analytics</SelectItem>
                        <SelectItem value="FinTech">FinTech</SelectItem>
                        <SelectItem value="HealthTech">HealthTech</SelectItem>
                        <SelectItem value="EdTech">EdTech</SelectItem>
                        <SelectItem value="E-commerce">E-commerce</SelectItem>
                        <SelectItem value="AI/ML">AI/ML</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stage">Stage *</Label>
                    <Select name="stage" defaultValue={editingStartup?.stage || ''}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select stage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IDEA">Idea</SelectItem>
                        <SelectItem value="MVP">MVP</SelectItem>
                        <SelectItem value="EARLY">Early Stage</SelectItem>
                        <SelectItem value="GROWTH">Growth</SelectItem>
                        <SelectItem value="SCALE">Scale</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="founded">Founded Year</Label>
                    <Input
                      id="founded"
                      name="founded"
                      type="number"
                      min="1900"
                      max="2026"
                      defaultValue={editingStartup?.founded || ''}
                      placeholder="2023"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      defaultValue={editingStartup?.location || ''}
                      placeholder="Delhi, India"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employees">Team Size</Label>
                    <Select name="employees" defaultValue={editingStartup?.employees || ''}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select team size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-5">1-5 employees</SelectItem>
                        <SelectItem value="6-10">6-10 employees</SelectItem>
                        <SelectItem value="11-25">11-25 employees</SelectItem>
                        <SelectItem value="26-50">26-50 employees</SelectItem>
                        <SelectItem value="51-100">51-100 employees</SelectItem>
                        <SelectItem value="100+">100+ employees</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="funding">Funding Stage</Label>
                    <Select name="funding" defaultValue={editingStartup?.funding || ''}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select funding stage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Bootstrapped">Bootstrapped</SelectItem>
                        <SelectItem value="Pre-seed">Pre-seed</SelectItem>
                        <SelectItem value="Seed">Seed</SelectItem>
                        <SelectItem value="Series A">Series A</SelectItem>
                        <SelectItem value="Series B">Series B</SelectItem>
                        <SelectItem value="Series C+">Series C+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      name="website"
                      type="url"
                      defaultValue={editingStartup?.website || ''}
                      placeholder="https://yourcompany.com or www.yourcompany.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="logo">Logo</Label>
                    <Input
                      id="logo"
                      name="logo"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                    />
                    {(logoPreview || editingStartup?.logo) && (
                      <div className="relative inline-block mt-2">
                        {(() => {
                          const logoSrc = (logoPreview || editingStartup?.logo) ?? undefined;
                          return logoSrc ? (
                            <img src={logoSrc} alt="Logo Preview" className="h-16 rounded" />
                          ) : null;
                        })()}
                        <button
                          type="button"
                          onClick={handleRemoveLogo}
                          className="absolute top-0 right-0 bg-white bg-opacity-80 rounded-full p-0.5 text-xs text-red-600 hover:bg-opacity-100 border border-gray-300"
                          style={{ transform: 'translate(30%, -30%)' }}
                          aria-label="Remove logo"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="promotionalImages">Promotional Images</Label>
                    <Input
                      id="promotionalImages"
                      name="promotionalImages"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePromoImagesChange}
                    />
                    {promoWarning && (
                      <div className="text-red-500 text-xs mt-1">{promoWarning}</div>
                    )}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {promoPreviews.map((src, idx) => (
                        <div key={idx} className="relative inline-block">
                          <img src={src} alt={`Promo Preview ${idx + 1}`} className="h-16 rounded" />
                          <button
                            type="button"
                            onClick={() => handleRemovePromoImage(idx)}
                            className="absolute top-0 right-0 bg-white bg-opacity-80 rounded-full p-0.5 text-xs text-red-600 hover:bg-opacity-100 border border-gray-300"
                            style={{ transform: 'translate(30%, -30%)' }}
                            aria-label="Remove image"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      {!promoPreviews.length && editingStartup?.promotionalImages?.map((src, idx) => (
                        <img key={idx} src={src} alt={`Promo Existing ${idx + 1}`} className="h-16 rounded" />
                      ))}
                    </div>
                  </div>
                </div>
                {/* Social Media Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="xUrl">X (Twitter) URL</Label>
                    <Input
                      id="xUrl"
                      name="xUrl"
                      type="url"
                      defaultValue={editingStartup?.xUrl || ''}
                      placeholder="https://x.com/yourstartup"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instagramUrl">Instagram URL</Label>
                    <Input
                      id="instagramUrl"
                      name="instagramUrl"
                      type="url"
                      defaultValue={editingStartup?.instagramUrl || ''}
                      placeholder="https://instagram.com/yourstartup"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                    <Input
                      id="linkedinUrl"
                      name="linkedinUrl"
                      type="url"
                      defaultValue={editingStartup?.linkedinUrl || ''}
                      placeholder="https://linkedin.com/company/yourstartup"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    required
                    rows={4}
                    defaultValue={editingStartup?.description || ''}
                    placeholder="Describe what your startup does..."
                  />
                </div>
                <div className="flex items-center space-x-3">
                  <Button type="submit" disabled={saving}>
                    {saving ? 'Saving...' : (editingStartup ? 'Update Startup' : 'Create Startup')}
                  </Button>
                  {editingStartup && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setEditingStartup(null)}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="jobs" className="space-y-6">
          {!selectedStartup ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Building2 className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">No startup selected</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Create or select a startup to manage job postings.
                  </p>
                  <div className="mt-6">
                    <Button onClick={() => setActiveTab('startups')}>
                      Manage Startups
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Startup Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Select Startup for Job Posting</CardTitle>
                  <CardDescription>Choose which startup to post jobs for</CardDescription>
                </CardHeader>
                <CardContent>
                  <Select 
                    value={selectedStartup.id} 
                    onValueChange={(value) => {
                      const startup = startups.find(s => s.id === value);
                      if (startup) setSelectedStartup(startup);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {startups.map((startup) => (
                        <SelectItem key={startup.id} value={startup.id}>
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={startup.logo || undefined} alt={startup.name} />
                              <AvatarFallback>
                                <Building2 className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                            <span>{startup.name} ({startup.industry})</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Plus className="h-5 w-5" />
                    <span>{editingJob ? 'Edit Job' : 'Post New Job'} for {selectedStartup.name}</span>
                  </CardTitle>
                  <CardDescription>
                    {editingJob ? 'Update job listing details' : 'Create a job listing to attract talented candidates'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleJobSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="title">Job Title *</Label>
                        <Input
                          id="title"
                          name="title"
                          required
                          defaultValue={editingJob?.title || ''}
                          placeholder="Senior Frontend Developer"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="type">Employment Type *</Label>
                        <Select name="type" defaultValue={editingJob?.type || ''}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="FULL_TIME">Full-time</SelectItem>
                            <SelectItem value="PART_TIME">Part-time</SelectItem>
                            <SelectItem value="CONTRACT">Contract</SelectItem>
                            <SelectItem value="INTERNSHIP">Internship</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          name="location"
                          defaultValue={editingJob?.location || ''}
                          placeholder="Delhi, India"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="experienceLevel">Experience Level *</Label>
                        <Select name="experienceLevel" defaultValue={editingJob?.experienceLevel || ''}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ENTRY">Entry Level</SelectItem>
                            <SelectItem value="MID">Mid Level</SelectItem>
                            <SelectItem value="SENIOR">Senior Level</SelectItem>
                            <SelectItem value="LEAD">Lead Level</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="unpaid">Unpaid Position</Label>
                        <div className="flex items-center space-x-2">
                          <input
                            id="unpaid"
                            name="unpaid"
                            type="checkbox"
                            defaultChecked={editingJob?.unpaid || false}
                            onChange={e => {
                              const salaryMinInput = document.getElementById('salaryMin') as HTMLInputElement;
                              const salaryMaxInput = document.getElementById('salaryMax') as HTMLInputElement;
                              if (salaryMinInput && salaryMaxInput) {
                                salaryMinInput.disabled = e.target.checked;
                                salaryMaxInput.disabled = e.target.checked;
                                if (e.target.checked) {
                                  salaryMinInput.value = '';
                                  salaryMaxInput.value = '';
                                }
                              }
                            }}
                          />
                          <span className="text-sm">This is an unpaid role</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="salaryMin">Minimum Salary</Label>
                        <Input
                          id="salaryMin"
                          name="salaryMin"
                          type="number"
                          defaultValue={editingJob?.salaryMin || ''}
                          placeholder="80000"
                          disabled={editingJob?.unpaid}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="salaryMax">Maximum Salary</Label>
                        <Input
                          id="salaryMax"
                          name="salaryMax"
                          type="number"
                          defaultValue={editingJob?.salaryMax || ''}
                          placeholder="120000"
                          disabled={editingJob?.unpaid}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="remote">Job Mode</Label>
                        <Select name="remote" defaultValue={editingJob?.remote ? 'true' : 'false'}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select job mode" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">Remote</SelectItem>
                            <SelectItem value="false">On-site</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Job Description *</Label>
                      <Textarea
                        id="description"
                        name="description"
                        required
                        rows={4}
                        defaultValue={editingJob?.description || ''}
                        placeholder="Describe the role, responsibilities, and what you're looking for..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="requirements">Requirements (one per line)</Label>
                      <Textarea
                        id="requirements"
                        name="requirements"
                        rows={4}
                        defaultValue={editingJob?.requirements.join('\n') || ''}
                        placeholder="React experience&#10;TypeScript&#10;5+ years experience&#10;Bachelor's degree"
                      />
                    </div>

                    {/* Custom Questions */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Custom Application Questions</Label>
                        <Button type="button" variant="outline" size="sm" onClick={addCustomQuestion}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Question
                        </Button>
                      </div>
                      
                      {customQuestions.map((question) => (
                        <div key={question.id} className="border rounded-lg p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <Label>Question {customQuestions.indexOf(question) + 1}</Label>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeCustomQuestion(question.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <Input
                            placeholder="Enter your question..."
                            value={question.question}
                            onChange={(e) => updateCustomQuestion(question.id, { question: e.target.value })}
                          />
                          <div className="flex items-center space-x-4">
                            <Select 
                              value={question.type} 
                              onValueChange={(value) => updateCustomQuestion(question.id, { type: value as any })}
                            >
                              <SelectTrigger className="w-40">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="TEXT">Short Text</SelectItem>
                                <SelectItem value="TEXTAREA">Long Text</SelectItem>
                                <SelectItem value="URL">URL</SelectItem>
                              </SelectContent>
                            </Select>
                            <label className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={question.required}
                                onChange={(e) => updateCustomQuestion(question.id, { required: e.target.checked })}
                              />
                              <span className="text-sm">Required</span>
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center space-x-3">
                      <Button type="submit" disabled={saving}>
                        {saving ? 'Saving...' : (editingJob ? 'Update Job' : 'Post Job')}
                      </Button>
                      {editingJob && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => {
                            setEditingJob(null);
                            setCustomQuestions([]);
                          }}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Job Postings for {selectedStartup.name}</CardTitle>
                  <CardDescription>
                    Manage your active job listings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {jobs.length === 0 ? (
                    <div className="text-center py-6">
                      <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-semibold text-gray-900">No job postings</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Create your first job posting to start attracting candidates.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {jobs.map((job) => (
                        <div key={job.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">{job.title}</h3>
                              <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                <span className="flex items-center">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  {job.location}
                                </span>
                                <span className="flex items-center">
                                  <Users className="h-4 w-4 mr-1" />
                                  {typeof job.applications === 'number' ? job.applications : (job.applications?.length || 0)} applications
                                </span>
                              </div>
                              <div className="flex items-center space-x-2 mt-2">
                                <Badge variant={job.remote ? 'default' : 'secondary'}>
                                  {job.remote ? 'Remote' : 'On-site'}
                                </Badge>
                                <Badge variant="outline">{job.type}</Badge>
                                <Badge variant="outline">{job.experienceLevel}</Badge>
                                {job.unpaid && (
                                  <Badge variant="destructive">Unpaid</Badge>
                                )}
                                {job.customQuestions && job.customQuestions.length > 0 && (
                                  <Badge variant="outline">
                                    {job.customQuestions.length} custom question{job.customQuestions.length !== 1 ? 's' : ''}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                {job.description}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleEditJob(job)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => setPreviewJob(job)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => setSelectedJobForApplicants(job)}
                                  >
                                    <UserCheck className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle>Applicants</DialogTitle>
                                    <DialogDescription>
                                      Review and manage applications for this job
                                    </DialogDescription>
                                  </DialogHeader>
                                  {selectedJobForApplicants && selectedJobForApplicants.startup && (
                                    <ApplicantList job={{
                                      ...selectedJobForApplicants,
                                      customQuestions: selectedJobForApplicants.customQuestions ?? [],
                                      applications: Array.isArray(selectedJobForApplicants.applications) ? selectedJobForApplicants.applications : [],
                                      savedJobs: selectedJobForApplicants.savedJobs ?? [],
                                      unpaid: selectedJobForApplicants.unpaid ?? false,
                                    }} />
                                  )}
                                </DialogContent>
                              </Dialog>
                              {!job.listed && (
                                <Badge variant="destructive" className="ml-2">Delisted</Badge>
                              )}
                              {!job.listed ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleRelistJob(job.id)}
                                >
                                  Relist
                                </Button>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDelistJob(job.id)}
                                  disabled={!job.listed}
                                >
                                  Delist
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Startups</CardTitle>
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
                <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{jobs.length}</div>
                <p className="text-xs text-muted-foreground">
                  Active job postings
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Applications</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {jobs.reduce((total, job) => {
                    const appCount = typeof job.applications === 'number' 
                      ? job.applications 
                      : job.applications?.length || 0;
                    return total + appCount;
                  }, 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total applications received
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Applications</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {jobs.length > 0 ? Math.round(jobs.reduce((total, job) => {
                    const appCount = typeof job.applications === 'number' 
                      ? job.applications 
                      : job.applications?.length || 0;
                    return total + appCount;
                  }, 0) / jobs.length) : 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Per job posting
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Confirmation Dialog */}
      <Dialog open={!!confirmDelete} onOpenChange={open => { if (!open) setConfirmDelete(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              {confirmDelete?.type === 'startup'
                ? 'This will permanently delete the startup and all its jobs.'
                : 'This will permanently delete the job posting.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(null)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={async () => {
                if (confirmDelete?.type === 'startup') {
                  await handleDeleteStartup(confirmDelete.id);
                } else if (confirmDelete?.type === 'job') {
                  // The original code had handleDeleteJob(confirmDelete.id);
                  // This function is no longer used for deletion, but for delisting.
                  // The new handleDelistJob function is used for delisting.
                  // For deletion, the original handleDeleteJob function is still available.
                  // The user's edit only replaced the button, not the logic.
                  // So, I'm keeping the original handleDeleteJob call for deletion
                  await apiClient.deleteJob(confirmDelete.id); // This line was not in the new_code, but should be kept for deletion
                  setJobs(jobs.filter(j => j.id !== confirmDelete.id));
                }
                setConfirmDelete(null);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Job Preview Dialog */}
      <Dialog open={!!previewJob} onOpenChange={open => { if (!open) setPreviewJob(null); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={previewJob?.startup?.logo || undefined} alt={previewJob?.startup?.name || ''} />
                <AvatarFallback>
                  <Building2 className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <span>{previewJob?.title}</span>
            </DialogTitle>
            <DialogDescription>
              {previewJob?.startup?.name} • {previewJob?.location}
            </DialogDescription>
          </DialogHeader>
          {previewJob && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant={previewJob.remote ? 'default' : 'secondary'}>
                  {previewJob.remote ? 'Remote' : 'On-site'}
                </Badge>
                <Badge variant="outline">{previewJob.type}</Badge>
                <Badge variant="outline">{previewJob.experienceLevel}</Badge>
                {previewJob.unpaid && (
                  <Badge variant="destructive">Unpaid</Badge>
                )}
              </div>
              <div>
                <h3 className="font-semibold mb-2">Job Description</h3>
                <p className="text-gray-600 whitespace-pre-line">{previewJob.description}</p>
              </div>
              {previewJob.requirements && previewJob.requirements.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Requirements</h3>
                  <ul className="space-y-1">
                    {previewJob.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {previewJob.salaryMin && previewJob.salaryMax && !previewJob.unpaid && (
                <div>
                  <h3 className="font-semibold mb-2">Compensation</h3>
                  <p className="text-gray-600">
                    ${previewJob.salaryMin.toLocaleString()} - ${previewJob.salaryMax.toLocaleString()} per year
                  </p>
                </div>
              )}
              {previewJob.unpaid && (
                <div>
                  <h3 className="font-semibold mb-2">Compensation</h3>
                  <p className="text-red-600 font-semibold">Unpaid</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}