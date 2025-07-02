'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/use-auth';
import { mockAPI } from '@/lib/mock-data';
import { Resume, Experience, Education, CustomSection } from '@/lib/types';
import { FileText, Plus, Edit, Trash2, User, Briefcase, GraduationCap, Award, X } from 'lucide-react';

export default function ResumeModule() {
  const { user } = useAuth();
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    const loadResume = async () => {
      if (!user) return;

      try {
        const resumeData = await mockAPI.getResumeByUserId(user.id);
        setResume(resumeData);
        if (resumeData) {
          setSkills(resumeData.skills || []);
        }
      } catch (error) {
        console.error('Error loading resume:', error);
      } finally {
        setLoading(false);
      }
    };

    loadResume();
  }, [user]);

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    const formData = new FormData(e.currentTarget);
    
    const resumeData = {
      userId: user.id,
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      bio: formData.get('bio') as string,
      skills: skills,
      experience: resume?.experience || [],
      education: resume?.education || [],
      customSections: resume?.customSections || [],
      resumeText: formData.get('resumeText') as string,
    };

    try {
      if (resume) {
        const updatedResume = await mockAPI.updateResume(resume.id, resumeData);
        setResume(updatedResume);
      } else {
        const newResume = await mockAPI.createResume(resumeData);
        setResume(newResume);
      }
    } catch (error) {
      console.error('Error saving resume:', error);
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const addExperience = () => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    };

    const updatedExperience = [...(resume?.experience || []), newExperience];
    setResume(prev => prev ? { ...prev, experience: updatedExperience } : null);
  };

  const updateExperience = (id: string, updates: Partial<Experience>) => {
    if (!resume) return;

    const updatedExperience = resume.experience.map(exp =>
      exp.id === id ? { ...exp, ...updates } : exp
    );
    setResume({ ...resume, experience: updatedExperience });
  };

  const removeExperience = (id: string) => {
    if (!resume) return;

    const updatedExperience = resume.experience.filter(exp => exp.id !== id);
    setResume({ ...resume, experience: updatedExperience });
  };

  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: '',
    };

    const updatedEducation = [...(resume?.education || []), newEducation];
    setResume(prev => prev ? { ...prev, education: updatedEducation } : null);
  };

  const updateEducation = (id: string, updates: Partial<Education>) => {
    if (!resume) return;

    const updatedEducation = resume.education.map(edu =>
      edu.id === id ? { ...edu, ...updates } : edu
    );
    setResume({ ...resume, education: updatedEducation });
  };

  const removeEducation = (id: string) => {
    if (!resume) return;

    const updatedEducation = resume.education.filter(edu => edu.id !== id);
    setResume({ ...resume, education: updatedEducation });
  };

  // Custom Sections
  const addCustomSection = () => {
    const newSection: CustomSection = {
      id: Date.now().toString(),
      title: '',
      content: '',
      order: (resume?.customSections.length || 0) + 1,
    };

    const updatedSections = [...(resume?.customSections || []), newSection];
    setResume(prev => prev ? { ...prev, customSections: updatedSections } : null);
  };

  const updateCustomSection = (id: string, updates: Partial<CustomSection>) => {
    if (!resume) return;

    const updatedSections = resume.customSections.map(section =>
      section.id === id ? { ...section, ...updates } : section
    );
    setResume({ ...resume, customSections: updatedSections });
  };

  const removeCustomSection = (id: string) => {
    if (!resume) return;

    const updatedSections = resume.customSections.filter(section => section.id !== id);
    setResume({ ...resume, customSections: updatedSections });
  };

  const moveCustomSection = (id: string, direction: 'up' | 'down') => {
    if (!resume) return;

    const sections = [...resume.customSections];
    const index = sections.findIndex(s => s.id === id);
    
    if (direction === 'up' && index > 0) {
      [sections[index], sections[index - 1]] = [sections[index - 1], sections[index]];
    } else if (direction === 'down' && index < sections.length - 1) {
      [sections[index], sections[index + 1]] = [sections[index + 1], sections[index]];
    }

    // Update order values
    sections.forEach((section, idx) => {
      section.order = idx + 1;
    });

    setResume({ ...resume, customSections: sections });
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
        <h1 className="text-3xl font-bold text-gray-900">My Resume</h1>
        <p className="text-gray-600">Build and manage your professional profile</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="custom">Custom Sections</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Personal Information</span>
              </CardTitle>
              <CardDescription>
                Basic information that will be displayed on your resume
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      required
                      defaultValue={resume?.name || user?.name || ''}
                      placeholder="Your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      defaultValue={resume?.email || user?.email || ''}
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      defaultValue={resume?.phone || ''}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Professional Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    defaultValue={resume?.bio || ''}
                    placeholder="Write a brief professional summary highlighting your key skills and experience..."
                  />
                </div>

                <div className="space-y-4">
                  <Label>Skills</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a skill"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    />
                    <Button type="button" onClick={addSkill}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="flex items-center space-x-1">
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="ml-1 hover:text-red-500"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="resumeText">Resume Text (Optional)</Label>
                  <Textarea
                    id="resumeText"
                    name="resumeText"
                    rows={6}
                    defaultValue={resume?.resumeText || ''}
                    placeholder="Paste your complete resume text here for additional context..."
                  />
                </div>

                <Button type="submit" disabled={saving}>
                  {saving ? 'Saving...' : (resume ? 'Update Profile' : 'Create Profile')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="experience" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Briefcase className="h-5 w-5" />
                  <span>Work Experience</span>
                </CardTitle>
                <CardDescription>
                  Add your professional work experience
                </CardDescription>
              </div>
              <Button onClick={addExperience}>
                <Plus className="h-4 w-4 mr-2" />
                Add Experience
              </Button>
            </CardHeader>
            <CardContent>
              {resume?.experience?.length === 0 ? (
                <div className="text-center py-6">
                  <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">No experience added</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Add your work experience to showcase your professional background.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {resume?.experience?.map((exp) => (
                    <div key={exp.id} className="border rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <Label>Company</Label>
                          <Input
                            value={exp.company}
                            onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                            placeholder="Company name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Position</Label>
                          <Input
                            value={exp.position}
                            onChange={(e) => updateExperience(exp.id, { position: e.target.value })}
                            placeholder="Job title"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Start Date</Label>
                          <Input
                            type="month"
                            value={exp.startDate}
                            onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>End Date</Label>
                          <Input
                            type="month"
                            value={exp.endDate}
                            onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                            disabled={exp.current}
                          />
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`current-${exp.id}`}
                              checked={exp.current}
                              onChange={(e) => updateExperience(exp.id, { 
                                current: e.target.checked,
                                endDate: e.target.checked ? '' : exp.endDate
                              })}
                            />
                            <Label htmlFor={`current-${exp.id}`} className="text-sm">
                              Currently working here
                            </Label>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2 mb-4">
                        <Label>Description</Label>
                        <Textarea
                          value={exp.description}
                          onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
                          placeholder="Describe your role and achievements..."
                          rows={3}
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeExperience(exp.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="education" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <GraduationCap className="h-5 w-5" />
                  <span>Education</span>
                </CardTitle>
                <CardDescription>
                  Add your educational background
                </CardDescription>
              </div>
              <Button onClick={addEducation}>
                <Plus className="h-4 w-4 mr-2" />
                Add Education
              </Button>
            </CardHeader>
            <CardContent>
              {resume?.education?.length === 0 ? (
                <div className="text-center py-6">
                  <GraduationCap className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">No education added</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Add your educational background to complete your profile.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {resume?.education?.map((edu) => (
                    <div key={edu.id} className="border rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <Label>Institution</Label>
                          <Input
                            value={edu.institution}
                            onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                            placeholder="University or school name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Degree</Label>
                          <Input
                            value={edu.degree}
                            onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                            placeholder="Bachelor's, Master's, etc."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Field of Study</Label>
                          <Input
                            value={edu.field}
                            onChange={(e) => updateEducation(edu.id, { field: e.target.value })}
                            placeholder="Computer Science, Business, etc."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>GPA (Optional)</Label>
                          <Input
                            value={edu.gpa}
                            onChange={(e) => updateEducation(edu.id, { gpa: e.target.value })}
                            placeholder="3.8"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Start Date</Label>
                          <Input
                            type="month"
                            value={edu.startDate}
                            onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>End Date</Label>
                          <Input
                            type="month"
                            value={edu.endDate}
                            onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
                          />
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeEducation(edu.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5" />
                  <span>Custom Sections</span>
                </CardTitle>
                <CardDescription>
                  Add custom sections like Projects, Certifications, Awards, etc.
                </CardDescription>
              </div>
              <Button onClick={addCustomSection}>
                <Plus className="h-4 w-4 mr-2" />
                Add Section
              </Button>
            </CardHeader>
            <CardContent>
              {resume?.customSections?.length === 0 ? (
                <div className="text-center py-6">
                  <Award className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">No custom sections added</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Add custom sections to showcase projects, certifications, awards, or other achievements.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {resume?.customSections
                    ?.sort((a, b) => a.order - b.order)
                    .map((section, index) => (
                    <div key={section.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <Label>Section {index + 1}</Label>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveCustomSection(section.id, 'up')}
                            disabled={index === 0}
                          >
                            ↑
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveCustomSection(section.id, 'down')}
                            disabled={index === (resume?.customSections?.length || 0) - 1}
                          >
                            ↓
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCustomSection(section.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Section Title</Label>
                          <Input
                            value={section.title}
                            onChange={(e) => updateCustomSection(section.id, { title: e.target.value })}
                            placeholder="e.g., Projects, Certifications, Awards"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Content</Label>
                          <Textarea
                            value={section.content}
                            onChange={(e) => updateCustomSection(section.id, { content: e.target.value })}
                            placeholder="Describe your projects, certifications, awards, or other achievements..."
                            rows={6}
                          />
                          <p className="text-xs text-gray-500">
                            You can use markdown formatting for better presentation
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Resume Preview</span>
              </CardTitle>
              <CardDescription>
                Preview how your resume will appear to employers
              </CardDescription>
            </CardHeader>
            <CardContent>
              {resume ? (
                <div className="max-w-4xl mx-auto bg-white border rounded-lg p-8 space-y-6">
                  {/* Header */}
                  <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900">{resume.name}</h1>
                    <div className="flex justify-center items-center space-x-4 text-gray-600 mt-2">
                      <span>{resume.email}</span>
                      {resume.phone && <span>•</span>}
                      {resume.phone && <span>{resume.phone}</span>}
                    </div>
                  </div>

                  {/* Bio */}
                  {resume.bio && (
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">Professional Summary</h2>
                      <p className="text-gray-600">{resume.bio}</p>
                    </div>
                  )}

                  {/* Skills */}
                  {resume.skills.length > 0 && (
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">Skills</h2>
                      <div className="flex flex-wrap gap-2">
                        {resume.skills.map((skill) => (
                          <Badge key={skill} variant="secondary">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Experience */}
                  {resume.experience.length > 0 && (
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">Experience</h2>
                      <div className="space-y-4">
                        {resume.experience.map((exp) => (
                          <div key={exp.id} className="border-l-2 border-blue-500 pl-4">
                            <h3 className="font-semibold text-lg">{exp.position}</h3>
                            <p className="text-blue-600 font-medium">{exp.company}</p>
                            <p className="text-sm text-gray-600 mb-2">
                              {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                            </p>
                            {exp.description && (
                              <p className="text-gray-600">{exp.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Education */}
                  {resume.education.length > 0 && (
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">Education</h2>
                      <div className="space-y-4">
                        {resume.education.map((edu) => (
                          <div key={edu.id} className="border-l-2 border-green-500 pl-4">
                            <h3 className="font-semibold text-lg">{edu.degree} in {edu.field}</h3>
                            <p className="text-green-600 font-medium">{edu.institution}</p>
                            <p className="text-sm text-gray-600">
                              {edu.startDate} - {edu.endDate}
                              {edu.gpa && ` • GPA: ${edu.gpa}`}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Custom Sections */}
                  {resume.customSections
                    ?.sort((a, b) => a.order - b.order)
                    .filter(section => section.title && section.content)
                    .map((section) => (
                    <div key={section.id}>
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">{section.title}</h2>
                      <div className="border-l-2 border-purple-500 pl-4">
                        <div className="text-gray-600 whitespace-pre-line">
                          {section.content}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">No resume created</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Complete your profile information to see a preview of your resume.
                  </p>
                  <div className="mt-6">
                    <Button onClick={() => setActiveTab('profile')}>
                      Complete Profile
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}