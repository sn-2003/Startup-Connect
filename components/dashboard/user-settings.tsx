'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/hooks/use-auth';
import { apiClient } from '@/lib/api-client';
import { 
  User, 
  Settings, 
  Trash2, 
  AlertTriangle, 
  Shield, 
  Mail, 
  Globe,
  Save,
  Edit,
  X,
  CheckCircle,
  AlertCircle,
  Linkedin,
  Github
} from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function UserSettings() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [editing, setEditing] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form state for profile editing
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    website: '',
    linkedin: '',
    github: '',
  });

  // Load user profile data
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;

      try {
        setProfileLoading(true);
        const response = await apiClient.getUserProfile();
        
        if (response.success && response.data) {
          setFormData({
            name: response.data.name || '',
            email: response.data.email || '',
            website: response.data.website || '',
            linkedin: response.data.linkedin || '',
            github: response.data.github || '',
          });
        } else {
          // Fallback to user data from auth context
          setFormData({
            name: user.name || '',
            email: user.email || '',
            website: '',
            linkedin: '',
            github: '',
          });
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        // Fallback to user data from auth context
        setFormData({
          name: user.name || '',
          email: user.email || '',
          website: '',
          linkedin: '',
          github: '',
        });
      } finally {
        setProfileLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETE') {
      toast.error('Please type DELETE to confirm account deletion');
      return;
    }

    setDeleting(true);
    try {
      const response = await apiClient.deleteAccount();
      
      if (response.success) {
        toast.success('Account deleted successfully');
        logout();
        router.push('/landing');
      } else {
        toast.error(response.error || 'Failed to delete account');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('An error occurred while deleting your account');
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
      setDeleteConfirmation('');
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    setErrors({}); // Clear previous errors
    
    try {
      const response = await apiClient.updateUserProfile(formData);
      
      console.log('API Response:', response); // Debug log
      
      if (response.success) {
        toast.success('Profile updated successfully');
        setEditing(false);
      } else {
        // Handle validation errors
        if (response.error === 'Validation failed' && response.details) {
          console.log('Validation errors:', response.details); // Debug log
          const validationErrors: Record<string, string> = {};
          response.details.forEach((detail: any) => {
            const field = detail.path[0];
            validationErrors[field] = detail.message;
          });
          console.log('Processed errors:', validationErrors); // Debug log
          setErrors(validationErrors);
          toast.error('Please fix the validation errors below');
        } else {
          toast.error(response.error || 'Failed to update profile');
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (profileLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600">Manage your account and profile information</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600">Manage your account and profile information</p>
      </div>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Profile Information</span>
            {!editing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditing(true)}
                className="ml-auto"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
          </CardTitle>
          <CardDescription>
            Update your personal information and profile details. Professional links will be visible to startups when you apply for jobs.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={!editing}
                placeholder="Your full name"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!editing}
                placeholder="your.email@example.com"
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                disabled={!editing}
                placeholder="https://yourwebsite.com or www.yourwebsite.com"
                className={errors.website ? 'border-red-500' : ''}
              />
              {errors.website && (
                <p className="text-sm text-red-600">{errors.website}</p>
              )}
              <p className="text-xs text-gray-500">You can enter www.example.com or https://example.com</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn Profile</Label>
              <Input
                id="linkedin"
                type="url"
                value={formData.linkedin}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                disabled={!editing}
                placeholder="https://linkedin.com/in/yourprofile or www.linkedin.com/in/yourprofile"
                className={errors.linkedin ? 'border-red-500' : ''}
              />
              {errors.linkedin && (
                <p className="text-sm text-red-600">{errors.linkedin}</p>
              )}
              <p className="text-xs text-gray-500">You can enter www.linkedin.com/in/yourprofile or https://linkedin.com/in/yourprofile</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="github">GitHub Profile</Label>
              <Input
                id="github"
                type="url"
                value={formData.github}
                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                disabled={!editing}
                placeholder="https://github.com/yourusername or www.github.com/yourusername"
                className={errors.github ? 'border-red-500' : ''}
              />
              {errors.github && (
                <p className="text-sm text-red-600">{errors.github}</p>
              )}
              <p className="text-xs text-gray-500">You can enter www.github.com/yourusername or https://github.com/yourusername</p>
            </div>
          </div>

          {editing && (
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setEditing(false);
                  setErrors({}); // Clear errors
                  // Reset form data to current values
                  setFormData({
                    name: user?.name || '',
                    email: user?.email || '',
                    website: '',
                    linkedin: '',
                    github: '',
                  });
                }}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSaveProfile} disabled={loading}>
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Account Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Account Security</span>
          </CardTitle>
          <CardDescription>
            Manage your account security and privacy settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-gray-500" />
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-gray-500">Receive updates about your applications and platform activity</p>
              </div>
            </div>
            <Badge variant="secondary">Enabled</Badge>
          </div>
          
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <Globe className="h-5 w-5 text-gray-500" />
              <div>
                <p className="font-medium">Profile Visibility</p>
                <p className="text-sm text-gray-500">Control who can see your profile information</p>
              </div>
            </div>
            <Badge variant="secondary">Public</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-red-700">
            <AlertTriangle className="h-5 w-5" />
            <span>Danger Zone</span>
          </CardTitle>
          <CardDescription className="text-red-600">
            Irreversible and destructive actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border border-red-200 rounded-lg bg-white">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-red-700">Delete Account</h4>
                  <p className="text-sm text-red-600 mt-1">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                  <div className="mt-3 space-y-2 text-sm text-red-600">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4" />
                      <span>All your startups and job postings will be deleted</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4" />
                      <span>All your applications and saved jobs will be removed</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4" />
                      <span>Your resume and profile data will be permanently deleted</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4" />
                      <span>You will lose access to all platform features</span>
                    </div>
                  </div>
                </div>
                <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="max-w-md">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center space-x-2 text-red-700">
                        <AlertTriangle className="h-5 w-5" />
                        <span>Delete Account</span>
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-left">
                        <p className="mb-4">
                          This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                        </p>
                        <div className="space-y-2 text-sm">
                          <p><strong>What will be deleted:</strong></p>
                          <ul className="list-disc list-inside space-y-1 text-gray-600">
                            <li>Your profile and personal information</li>
                            <li>All your startups and job postings</li>
                            <li>All your job applications</li>
                            <li>Your resume and uploaded files</li>
                            <li>All saved jobs and preferences</li>
                            <li>Your activity history and feedback</li>
                          </ul>
                        </div>
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-sm font-medium text-red-700 mb-2">
                            To confirm deletion, type <code className="bg-red-100 px-1 rounded">DELETE</code> below:
                          </p>
                          <Input
                            value={deleteConfirmation}
                            onChange={(e) => setDeleteConfirmation(e.target.value)}
                            placeholder="Type DELETE to confirm"
                            className="border-red-300 focus:border-red-500"
                          />
                        </div>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteAccount}
                        disabled={deleteConfirmation !== 'DELETE' || deleting}
                        className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
                      >
                        {deleting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Deleting...
                          </>
                        ) : (
                          <>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Account
                          </>
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 