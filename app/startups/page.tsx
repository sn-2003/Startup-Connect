'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/use-auth';
import { mockAPI } from '@/lib/mock-data';
import { Startup, StartupVote, StartupFeedback, Job } from '@/lib/types';
import { 
  Search, 
  Building2, 
  MapPin, 
  Users, 
  TrendingUp, 
  ThumbsUp, 
  ThumbsDown, 
  MessageCircle,
  ExternalLink,
  Briefcase,
  Calendar,
  Send
} from 'lucide-react';

export default function StartupsPage() {
  const { user } = useAuth();
  const [startups, setStartups] = useState<Startup[]>([]);
  const [filteredStartups, setFilteredStartups] = useState<Startup[]>([]);
  const [userVotes, setUserVotes] = useState<Map<string, StartupVote>>(new Map());
  const [feedback, setFeedback] = useState<Map<string, StartupFeedback[]>>(new Map());
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [selectedStartup, setSelectedStartup] = useState<Startup | null>(null);
  const [newFeedback, setNewFeedback] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [startupsData, jobsData] = await Promise.all([
          mockAPI.getAllStartups(),
          mockAPI.getJobs(),
        ]);

        setStartups(startupsData);
        setFilteredStartups(startupsData);
        setJobs(jobsData);

        // Load user votes if logged in
        if (user) {
          const votes = new Map();
          for (const startup of startupsData) {
            const vote = await mockAPI.getUserVote(user.id, startup.id);
            if (vote) {
              votes.set(startup.id, vote);
            }
          }
          setUserVotes(votes);
        }

        // Load feedback for all startups
        const feedbackMap = new Map();
        for (const startup of startupsData) {
          const startupFeedback = await mockAPI.getStartupFeedback(startup.id);
          feedbackMap.set(startup.id, startupFeedback);
        }
        setFeedback(feedbackMap);
      } catch (error) {
        console.error('Error loading startups:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  useEffect(() => {
    let filtered = startups;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(startup =>
        startup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        startup.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        startup.industry.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Stage filter
    if (stageFilter !== 'all') {
      filtered = filtered.filter(startup => startup.stage === stageFilter);
    }

    // Industry filter
    if (industryFilter !== 'all') {
      filtered = filtered.filter(startup => startup.industry === industryFilter);
    }

    setFilteredStartups(filtered);
  }, [startups, searchTerm, stageFilter, industryFilter]);

  const handleVote = async (startupId: string, type: 'upvote' | 'downvote') => {
    if (!user) return;

    try {
      await mockAPI.voteStartup(user.id, startupId, type);
      
      // Update local state
      const updatedStartups = startups.map(startup => {
        if (startup.id === startupId) {
          const currentVote = userVotes.get(startupId);
          let newUpvotes = startup.upvotes;
          let newDownvotes = startup.downvotes;

          // Remove previous vote
          if (currentVote) {
            if (currentVote.type === 'upvote') newUpvotes--;
            else newDownvotes--;
          }

          // Add new vote
          if (type === 'upvote') newUpvotes++;
          else newDownvotes++;

          return { ...startup, upvotes: newUpvotes, downvotes: newDownvotes };
        }
        return startup;
      });

      setStartups(updatedStartups);
      setFilteredStartups(updatedStartups.filter(s => 
        filteredStartups.some(fs => fs.id === s.id)
      ));

      // Update user votes
      const newUserVotes = new Map(userVotes);
      newUserVotes.set(startupId, {
        id: Date.now().toString(),
        userId: user.id,
        startupId,
        type,
        createdAt: new Date(),
      });
      setUserVotes(newUserVotes);
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const handleAddFeedback = async () => {
    if (!user || !selectedStartup || !newFeedback.trim()) return;

    setSubmittingFeedback(true);
    try {
      const feedbackItem = await mockAPI.addStartupFeedback(user.id, selectedStartup.id, newFeedback);
      
      // Update local feedback state
      const updatedFeedback = new Map(feedback);
      const currentFeedback = updatedFeedback.get(selectedStartup.id) || [];
      updatedFeedback.set(selectedStartup.id, [feedbackItem, ...currentFeedback]);
      setFeedback(updatedFeedback);
      
      setNewFeedback('');
    } catch (error) {
      console.error('Error adding feedback:', error);
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const getJobCount = (startupId: string) => {
    return jobs.filter(job => job.startupId === startupId).length;
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'idea': return 'bg-gray-100 text-gray-800';
      case 'mvp': return 'bg-blue-100 text-blue-800';
      case 'early': return 'bg-green-100 text-green-800';
      case 'growth': return 'bg-purple-100 text-purple-800';
      case 'scale': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Discover Startups</h1>
          <p className="text-gray-600">Explore innovative startups and share your feedback</p>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="h-5 w-5" />
              <span>Find Startups</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search startups, industries, or descriptions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={stageFilter} onValueChange={setStageFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stages</SelectItem>
                  <SelectItem value="idea">Idea</SelectItem>
                  <SelectItem value="mvp">MVP</SelectItem>
                  <SelectItem value="early">Early</SelectItem>
                  <SelectItem value="growth">Growth</SelectItem>
                  <SelectItem value="scale">Scale</SelectItem>
                </SelectContent>
              </Select>
              <Select value={industryFilter} onValueChange={setIndustryFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Industries</SelectItem>
                  <SelectItem value="SaaS">SaaS</SelectItem>
                  <SelectItem value="Analytics">Analytics</SelectItem>
                  <SelectItem value="FinTech">FinTech</SelectItem>
                  <SelectItem value="HealthTech">HealthTech</SelectItem>
                  <SelectItem value="EdTech">EdTech</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            {filteredStartups.length} startup{filteredStartups.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Startup Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStartups.map((startup) => {
            const userVote = userVotes.get(startup.id);
            const startupFeedback = feedback.get(startup.id) || [];
            const jobCount = getJobCount(startup.id);

            return (
              <Card key={startup.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={startup.logo} alt={startup.name} />
                      <AvatarFallback>
                        <Building2 className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{startup.name}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={getStageColor(startup.stage)}>
                          {startup.stage}
                        </Badge>
                        <Badge variant="outline">{startup.industry}</Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {startup.description}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{startup.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Briefcase className="h-4 w-4" />
                        <span>{jobCount} jobs</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{startup.employees}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="h-4 w-4" />
                        <span>{startup.funding}</span>
                      </div>
                    </div>

                    {/* Voting and Feedback */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant={userVote?.type === 'upvote' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleVote(startup.id, 'upvote')}
                          disabled={!user}
                          className="flex items-center space-x-1"
                        >
                          <ThumbsUp className="h-4 w-4" />
                          <span>{startup.upvotes}</span>
                        </Button>
                        <Button
                          variant={userVote?.type === 'downvote' ? 'destructive' : 'outline'}
                          size="sm"
                          onClick={() => handleVote(startup.id, 'downvote')}
                          disabled={!user}
                          className="flex items-center space-x-1"
                        >
                          <ThumbsDown className="h-4 w-4" />
                          <span>{startup.downvotes}</span>
                        </Button>
                      </div>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedStartup(startup)}
                            className="flex items-center space-x-1"
                          >
                            <MessageCircle className="h-4 w-4" />
                            <span>{startupFeedback.length}</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="flex items-center space-x-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={startup.logo} alt={startup.name} />
                                <AvatarFallback>
                                  <Building2 className="h-4 w-4" />
                                </AvatarFallback>
                              </Avatar>
                              <span>{startup.name}</span>
                            </DialogTitle>
                            <DialogDescription>
                              Share your thoughts and read what others are saying
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="space-y-6">
                            {/* Startup Info */}
                            <div className="bg-gray-50 rounded-lg p-4">
                              <p className="text-sm text-gray-600 mb-2">{startup.description}</p>
                              <div className="flex items-center space-x-4 text-xs text-gray-500">
                                <span>{startup.location}</span>
                                <span>•</span>
                                <span>{startup.employees} employees</span>
                                <span>•</span>
                                <span>{startup.funding}</span>
                                {startup.website && (
                                  <>
                                    <span>•</span>
                                    <a 
                                      href={startup.website} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                                    >
                                      <ExternalLink className="h-3 w-3" />
                                      <span>Website</span>
                                    </a>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Add Feedback */}
                            {user && (
                              <div className="space-y-3">
                                <h3 className="font-semibold">Add Your Feedback</h3>
                                <div className="flex space-x-2">
                                  <Textarea
                                    placeholder="Share your thoughts about this startup..."
                                    value={newFeedback}
                                    onChange={(e) => setNewFeedback(e.target.value)}
                                    rows={3}
                                    className="flex-1"
                                  />
                                </div>
                                <Button 
                                  onClick={handleAddFeedback}
                                  disabled={!newFeedback.trim() || submittingFeedback}
                                  size="sm"
                                >
                                  <Send className="h-4 w-4 mr-2" />
                                  {submittingFeedback ? 'Posting...' : 'Post Feedback'}
                                </Button>
                              </div>
                            )}

                            {/* Feedback List */}
                            <div className="space-y-3">
                              <h3 className="font-semibold">Community Feedback</h3>
                              {startupFeedback.length === 0 ? (
                                <p className="text-gray-500 text-sm">No feedback yet. Be the first to share your thoughts!</p>
                              ) : (
                                <div className="space-y-3 max-h-60 overflow-y-auto">
                                  {startupFeedback.map((item) => (
                                    <div key={item.id} className="bg-white border rounded-lg p-3">
                                      <div className="flex items-center justify-between mb-2">
                                        <span className="font-medium text-sm">{item.userName}</span>
                                        <span className="text-xs text-gray-500">
                                          {item.createdAt.toLocaleDateString()}
                                        </span>
                                      </div>
                                      <p className="text-sm text-gray-600">{item.comment}</p>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>

                    {!user && (
                      <p className="text-xs text-gray-500 text-center">
                        Login to vote and leave feedback
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredStartups.length === 0 && (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <Building2 className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">No startups found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search criteria to find relevant startups.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}