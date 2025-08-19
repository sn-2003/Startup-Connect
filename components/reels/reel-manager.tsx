'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useAuth } from '@/hooks/use-auth';
import { apiClient } from '@/lib/api-client';
import { StartupReelWithRelations } from '@/lib/types';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Instagram, 
  Eye, 
  Star, 
  ArrowUp, 
  ArrowDown,
  ExternalLink,
  Save,
  X,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

export default function ReelManager() {
  const { user } = useAuth();
  const [reels, setReels] = useState<StartupReelWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [editingReel, setEditingReel] = useState<StartupReelWithRelations | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [formData, setFormData] = useState({
    instagramUrls: '',
  });

  useEffect(() => {
    loadReels();
  }, []);

  const loadReels = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getReels({ limit: 100 });
      if (response.success && response.data) {
        setReels(response.data);
      }
    } catch (error) {
      console.error('Error loading reels:', error);
      toast.error('Failed to load reels');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      instagramUrls: '',
    });
  };

  const handleAdd = async () => {
    const urls = formData.instagramUrls.split('\n').filter(url => url.trim() !== '');
    if (urls.length === 0) {
      toast.error('Please enter at least one Instagram URL');
      return;
    }
    setSaving(true);
    try {
      const response = await apiClient.createReel({ instagramUrls: urls });
      if (response.success && response.data) {
        // Assuming the API returns an array of new reels
        const newReels = Array.isArray(response.data) ? response.data : [response.data];
        setReels(prev => [...newReels, ...prev]);
        setShowAddDialog(false);
        resetForm();

        // Notify for each added reel
        newReels.forEach(async (reel) => {
          try {
            await fetch('/api/reels/feed/admin', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                action: 'reel_added', 
                reelId: reel.id 
              }),
            });
          } catch (error) {
            console.error(`Error notifying feed manager for reel ${reel.id}:`, error);
          }
        });
        
        toast.success(`${newReels.length} reel(s) added successfully!`);
      } else {
        toast.error(response.error || 'Failed to add reels');
      }
    } catch (error) {
      console.error('Error adding reels:', error);
      toast.error('Failed to add reels');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async () => {
    if (!editingReel || !formData.instagramUrls.trim()) {
      toast.error('Please enter the Instagram URL');
      return;
    }
    setSaving(true);
    try {
      const response = await apiClient.updateReel(editingReel.id, { instagramUrl: formData.instagramUrls });
      if (response.success && response.data) {
        setReels(prev => prev.map(reel => reel.id === editingReel.id ? response.data : reel));
        setEditingReel(null);
        resetForm();
        toast.success('Reel updated successfully!');
      } else {
        toast.error(response.error || 'Failed to update reel');
      }
    } catch (error) {
      console.error('Error updating reel:', error);
      toast.error('Failed to update reel');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (reelId: string) => {
    setDeleting(reelId);
    try {
      const response = await apiClient.deleteReel(reelId);
      if (response.success) {
        setReels(prev => prev.filter(reel => reel.id !== reelId));
        
        // Handle reel deletion in feed manager
        try {
          await fetch('/api/reels/feed/admin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              action: 'reel_deleted', 
              reelId 
            }),
          });
        } catch (error) {
          console.error('Error notifying feed manager of deletion:', error);
        }
        
        toast.success('Reel deleted successfully!');
      } else {
        toast.error(response.error || 'Failed to delete reel');
      }
    } catch (error) {
      console.error('Error deleting reel:', error);
      toast.error('Failed to delete reel');
    } finally {
      setDeleting(null);
    }
  };

  // Remove featured toggle logic since 'featured' is no longer supported

  const handleToggleActive = async (reel: StartupReelWithRelations) => {
    try {
      const response = await apiClient.updateReel(reel.id, {
        active: !reel.active,
      });
      if (response.success && response.data) {
        setReels(prev => 
          prev.map(r => 
            r.id === reel.id ? { ...r, active: !r.active } : r
          )
        );
        toast.success(`Reel ${reel.active ? 'deactivated' : 'activated'}`);
      }
    } catch (error) {
      console.error('Error toggling active:', error);
      toast.error('Failed to update reel');
    }
  };

  const openEditDialog = (reel: StartupReelWithRelations) => {
    setEditingReel(reel);
    setFormData({
      instagramUrls: reel.instagramUrl, // Keep as instagramUrls for consistency in the form
    });
  };

  const openAddDialog = () => {
    setEditingReel(null);
    resetForm();
    setShowAddDialog(true);
  };

  // Only admins can add reels
  if (!user?.isAdmin) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <Instagram className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">Admin Only</h3>
            <p className="mt-1 text-sm text-gray-500">
              Only admins can add or manage reels.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reels</h2>
          <p className="text-gray-600">Manage Instagram reels</p>
        </div>
        <Button onClick={openAddDialog}>
          Add Reel
        </Button>
      </div>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : reels.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Instagram className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No reels added</h3>
              <p className="mt-1 text-sm text-gray-500">
                Start by adding your first Instagram reel.
              </p>
              <Button onClick={openAddDialog} className="mt-4">
                Add Your First Reel
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reels.map((reel) => (
            <Card key={reel.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{reel.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {reel.description && (
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {reel.description}
                  </p>
                )}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Eye className="h-4 w-4" />
                    <span>{reel.views?.toLocaleString() || 0} views</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>Order: {reel.order}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(reel.instagramUrl, '_blank')}
                    className="flex-1"
                  >
                    View on Instagram
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(reel)}
                  >
                    Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Reel</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{reel.title}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(reel.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          {deleting === reel.id ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Deleting...
                            </>
                          ) : (
                            'Delete'
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                <div className="flex items-center justify-end pt-2 border-t">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor={`active-${reel.id}`} className="text-sm">
                      Active
                    </Label>
                    <Switch
                      id={`active-${reel.id}`}
                      checked={reel.active}
                      onCheckedChange={() => handleToggleActive(reel)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {/* Add/Edit Dialog */}
      <Dialog 
        open={showAddDialog || !!editingReel} 
        onOpenChange={(open) => {
          if (!open) {
            setShowAddDialog(false);
            setEditingReel(null);
            resetForm();
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingReel ? 'Edit Reel' : 'Add New Reel'}
            </DialogTitle>
            <DialogDescription>
              Paste the Instagram reel URL below
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="instagramUrls">Instagram URLs *</Label>
              <Textarea
                id="instagramUrls"
                value={editingReel ? formData.instagramUrls : formData.instagramUrls}
                onChange={(e) => setFormData({ ...formData, instagramUrls: e.target.value })}
                placeholder="https://www.instagram.com/p/ABC123...\nhttps://www.instagram.com/p/DEF456..."
                rows={editingReel ? 1 : 5}
              />
              <p className="text-xs text-gray-500">
                {editingReel
                  ? 'Paste the Instagram post or reel URL here'
                  : 'Paste one or more Instagram reel URLs, each on a new line.'}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddDialog(false);
                setEditingReel(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={editingReel ? handleEdit : handleAdd}
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {editingReel ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {editingReel ? 'Update Reel' : 'Add Reel'}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}