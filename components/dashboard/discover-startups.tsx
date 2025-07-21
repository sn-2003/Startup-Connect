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
import { apiClient } from '@/lib/api-client';
import { User, Startup, StartupVote, StartupFeedback, Job } from '@/lib/types';
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

function DiscoverStartups() {
  const { user } = useAuth();
  const [startups, setStartups] = useState<Startup[]>([]);
  const [filteredStartups, setFilteredStartups] = useState<Startup[]>([]);
  const [userVotes, setUserVotes] = useState<Map<string, StartupVote>>(new Map());
  const [feedback, setFeedback] = useState<Map<string, (StartupFeedback & { user: Pick<User, 'name' | 'email'> })[]>>(new Map());
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [selectedStartup, setSelectedStartup] = useState<Startup | null>(null);
  const [newFeedback, setNewFeedback] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [voting, setVoting] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [startupsRes, jobsRes] = await Promise.all([
          apiClient.getStartups(),
          apiClient.getJobs(),
        ]);

        if (startupsRes.success && startupsRes.data) {
          setStartups(startupsRes.data);
          setFilteredStartups(startupsRes.data);
        }

        if (jobsRes.success && jobsRes.data) {
          setJobs(jobsRes.data);
        }

        // Load feedback for all startups
        if (startupsRes.success && startupsRes.data) {
          const feedbackMap = new Map();
          for (const startup of startupsRes.data) {
            const feedbackRes = await apiClient.getStartupFeedback(startup.id);
            if (feedbackRes.success && feedbackRes.data) {
              feedbackMap.set(startup.id, feedbackRes.data);
            }
          }
          setFeedback(feedbackMap);
        }
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

  const handleVote = async (startupId: string, type: 'UPVOTE' | 'DOWNVOTE') => {
    if (!user || voting) return;
    setVoting(startupId + '-' + type);
    try {
      const response = await apiClient.voteStartup(startupId, type);
      if (response.success) {
        // Reload startups to get updated vote counts
        const startupsRes = await apiClient.getStartups();
        if (startupsRes.success && startupsRes.data) {
          setStartups(startupsRes.data);
        }
        // Update userVotes based on backend response
        const updatedVote = response.data?.vote || null;
        const newUserVotes = new Map(userVotes);
        if (updatedVote) {
          newUserVotes.set(startupId, updatedVote);
        } else {
          newUserVotes.delete(startupId);
        }
        setUserVotes(newUserVotes);
      }
    } catch (error) {
      console.error('Error voting:', error);
    } finally {
      setVoting(null);
    }
  };

  const handleAddFeedback = async () => {
    if (!user || !selectedStartup || !newFeedback.trim()) return;

    setSubmittingFeedback(true);
    try {
      const response = await apiClient.addStartupFeedback(selectedStartup.id, newFeedback);
      if (response.success && response.data) {
        // Update local feedback state
        const updatedFeedback = new Map(feedback);
        const currentFeedback = updatedFeedback.get(selectedStartup.id) || [];
        updatedFeedback.set(selectedStartup.id, [response.data, ...currentFeedback]);
        setFeedback(updatedFeedback);
        
        setNewFeedback('');
      }
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
      case 'IDEA': return 'bg-gray-100 text-gray-800';
      case 'MVP': return 'bg-blue-100 text-blue-800';
      case 'EARLY': return 'bg-green-100 text-green-800';
      case 'GROWTH': return 'bg-purple-100 text-purple-800';
      case 'SCALE': return 'bg-orange-100 text-orange-800';
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
                  <SelectItem value="IDEA">Idea</SelectItem>
                  <SelectItem value="MVP">MVP</SelectItem>
                  <SelectItem value="EARLY">Early</SelectItem>
                  <SelectItem value="GROWTH">Growth</SelectItem>
                  <SelectItem value="SCALE">Scale</SelectItem>
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
                      <AvatarImage src={startup.logo || undefined} alt={startup.name} />
                      <AvatarFallback>
                        <Building2 className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{startup.name}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={getStageColor(startup.stage)}>
                          {startup.stage.toLowerCase()}
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
                          variant={userVote?.type === 'UPVOTE' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleVote(startup.id, 'UPVOTE')}
                          disabled={!user || voting !== null}
                          className="flex items-center space-x-1"
                        >
                          <ThumbsUp className="h-4 w-4" />
                          <span>{startup.upvotes}</span>
                        </Button>
                        <Button
                          variant={userVote?.type === 'DOWNVOTE' ? 'destructive' : 'outline'}
                          size="sm"
                          onClick={() => handleVote(startup.id, 'DOWNVOTE')}
                          disabled={!user || voting !== null}
                          className="flex items-center space-x-1"
                        >
                          <ThumbsDown className="h-4 w-4" />
                          <span>{startup.downvotes}</span>
                        </Button>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedStartup(startup)}
                            >
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="flex items-center space-x-3">
                                <Avatar className="h-12 w-12">
                                  <AvatarImage src={selectedStartup?.logo || undefined} alt={selectedStartup?.name} />
                                  <AvatarFallback>
                                    <Building2 className="h-6 w-6" />
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <span>{selectedStartup?.name}</span>
                                  <p className="text-sm text-gray-600 font-normal">{selectedStartup?.industry}</p>
                                </div>
                              </DialogTitle>
                              <DialogDescription>
                                {selectedStartup?.stage} • {selectedStartup?.location}
                              </DialogDescription>
                            </DialogHeader>
                            
                            {selectedStartup && (
                              <div className="space-y-6">
                                {/* Startup Details */}
                                <div className="bg-gray-50 rounded-lg p-6">
                                  <h3 className="font-semibold mb-3">About {selectedStartup.name}</h3>
                                  <p className="text-gray-600 mb-4">{selectedStartup.description}</p>
                                  
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                    <div>
                                      <span className="font-medium text-gray-900">Stage</span>
                                      <p className="text-gray-600">{selectedStartup.stage}</p>
                                    </div>
                                    <div>
                                      <span className="font-medium text-gray-900">Industry</span>
                                      <p className="text-gray-600">{selectedStartup.industry}</p>
                                    </div>
                                    <div>
                                      <span className="font-medium text-gray-900">Team Size</span>
                                      <p className="text-gray-600">{selectedStartup.employees}</p>
                                    </div>
                                    <div>
                                      <span className="font-medium text-gray-900">Funding</span>
                                      <p className="text-gray-600">{selectedStartup.funding}</p>
                                    </div>
                                    {selectedStartup.founded && (
                                      <div>
                                        <span className="font-medium text-gray-900">Founded</span>
                                        <p className="text-gray-600">{selectedStartup.founded}</p>
                                      </div>
                                    )}
                                    <div>
                                      <span className="font-medium text-gray-900">Location</span>
                                      <p className="text-gray-600">{selectedStartup.location}</p>
                                    </div>
                                    {selectedStartup.website && (
                                      <div className="col-span-2">
                                        <span className="font-medium text-gray-900">Website</span>
                                        <p>
                                          <a 
                                            href={selectedStartup.website} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                                          >
                                            <ExternalLink className="h-3 w-3" />
                                            <span>{selectedStartup.website}</span>
                                          </a>
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Voting Section */}
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                  <div className="flex items-center space-x-4">
                                    <Button
                                      variant={userVote?.type === 'UPVOTE' ? 'default' : 'outline'}
                                      onClick={() => handleVote(selectedStartup.id, 'UPVOTE')}
                                      disabled={!user || voting !== null}
                                      className="flex items-center space-x-2"
                                    >
                                      <ThumbsUp className="h-4 w-4" />
                                      <span>{selectedStartup.upvotes} upvotes</span>
                                    </Button>
                                    <Button
                                      variant={userVote?.type === 'DOWNVOTE' ? 'destructive' : 'outline'}
                                      onClick={() => handleVote(selectedStartup.id, 'DOWNVOTE')}
                                      disabled={!user || voting !== null}
                                      className="flex items-center space-x-2"
                                    >
                                      <ThumbsDown className="h-4 w-4" />
                                      <span>{selectedStartup.downvotes} downvotes</span>
                                    </Button>
                                  </div>
                                  <div className="flex items-center space-x-1 text-gray-600">
                                    <MessageCircle className="h-4 w-4" />
                                    <span>{feedback.get(selectedStartup.id)?.length || 0} feedback</span>
                                  </div>
                                </div>

                                {/* Add Feedback */}
                                {user && (
                                  <div className="space-y-3">
                                    <h3 className="font-semibold">Share Your Feedback</h3>
                                    <div className="space-y-3">
                                      <Textarea
                                        placeholder="What do you think about this startup? Share your thoughts, suggestions, or questions..."
                                        value={newFeedback}
                                        onChange={(e) => setNewFeedback(e.target.value)}
                                        rows={3}
                                        className="w-full"
                                      />
                                      <Button 
                                        onClick={handleAddFeedback}
                                        disabled={!newFeedback.trim() || submittingFeedback}
                                        size="sm"
                                      >
                                        <Send className="h-4 w-4 mr-2" />
                                        {submittingFeedback ? 'Posting...' : 'Post Feedback'}
                                      </Button>
                                    </div>
                                  </div>
                                )}

                                {/* Feedback List */}
                                <div className="space-y-4">
                                  <h3 className="font-semibold">Community Feedback</h3>
                                  {(feedback.get(selectedStartup.id) || []).length === 0 ? (
                                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                                      <MessageCircle className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                                      <p className="text-gray-500 text-sm">No feedback yet. Be the first to share your thoughts!</p>
                                    </div>
                                  ) : (
                                    <div className="space-y-3 max-h-80 overflow-y-auto">
                                      {(feedback.get(selectedStartup.id) || []).map((item) => (
                                        <div key={item.id} className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                                          <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center space-x-2">
                                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                <span className="text-blue-600 font-medium text-sm">
                                                  {item.user?.name?.charAt(0)?.toUpperCase()}
                                                </span>
                                              </div>
                                              <span className="font-medium text-sm">{item.user?.name}</span>
                                            </div>
                                            <span className="text-xs text-gray-500">
                                              {new Date(item.createdAt).toLocaleDateString()}
                                            </span>
                                          </div>
                                          <p className="text-gray-600 leading-relaxed">{item.comment}</p>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex items-center space-x-1"
                        >
                          <MessageCircle className="h-4 w-4" />
                          <span>{startupFeedback.length}</span>
                        </Button>
                      </div>
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

export default DiscoverStartups;