'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockAPI } from '@/lib/mock-data';
import { Resource } from '@/lib/types';
import { BookOpen, FileText, Video, ExternalLink, Search, Star, Filter } from 'lucide-react';

export default function Resources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    const loadResources = async () => {
      try {
        const resourcesData = await mockAPI.getResources();
        setResources(resourcesData);
        setFilteredResources(resourcesData);
      } catch (error) {
        console.error('Error loading resources:', error);
      } finally {
        setLoading(false);
      }
    };

    loadResources();
  }, []);

  useEffect(() => {
    let filtered = resources;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(resource => resource.category === categoryFilter);
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(resource => resource.type === typeFilter);
    }

    setFilteredResources(filtered);
  }, [resources, searchTerm, categoryFilter, typeFilter]);

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-5 w-5" />;
      case 'video':
        return <Video className="h-5 w-5" />;
      case 'link':
        return <ExternalLink className="h-5 w-5" />;
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'playbook':
        return 'bg-blue-100 text-blue-800';
      case 'template':
        return 'bg-green-100 text-green-800';
      case 'guide':
        return 'bg-purple-100 text-purple-800';
      case 'tool':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Founder Resources</h1>
        <p className="text-gray-600">Essential tools and guides for building your startup</p>
      </div>

      {/* Featured Resources */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Featured Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resources.filter(resource => resource.featured).map((resource) => (
            <Card key={resource.id} className="border-blue-200 bg-blue-50">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="bg-blue-600 p-2 rounded-lg text-white">
                      {getResourceIcon(resource.type)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{resource.title}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={getCategoryColor(resource.category)}>
                          {resource.category}
                        </Badge>
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{resource.description}</p>
                <Button className="w-full">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Access Resource
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Find Resources</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="playbook">Playbooks</SelectItem>
                <SelectItem value="template">Templates</SelectItem>
                <SelectItem value="guide">Guides</SelectItem>
                <SelectItem value="tool">Tools</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="link">Web Link</SelectItem>
                <SelectItem value="video">Video</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* All Resources */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">All Resources</h2>
          <p className="text-gray-600">
            {filteredResources.length} resource{filteredResources.length !== 1 ? 's' : ''} found
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <Card key={resource.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="aspect-video rounded-lg overflow-hidden mb-4">
                  <img
                    src={resource.imageUrl}
                    alt={resource.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <div className="bg-gray-100 p-1 rounded">
                    {getResourceIcon(resource.type)}
                  </div>
                  <Badge className={getCategoryColor(resource.category)}>
                    {resource.category}
                  </Badge>
                  {resource.featured && (
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  )}
                </div>
                <CardTitle className="text-lg">{resource.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4 line-clamp-3">{resource.description}</p>
                <Button variant="outline" className="w-full">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Access Resource
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {filteredResources.length === 0 && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No resources found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search criteria or check back later for new resources.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resource Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Resource Categories</CardTitle>
          <CardDescription>
            Explore different types of resources to help you build your startup
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-blue-900">Playbooks</h3>
              <p className="text-sm text-blue-700">Step-by-step guides</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <FileText className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-green-900">Templates</h3>
              <p className="text-sm text-green-700">Ready-to-use formats</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
              <BookOpen className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold text-purple-900">Guides</h3>
              <p className="text-sm text-purple-700">Comprehensive tutorials</p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
              <ExternalLink className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <h3 className="font-semibold text-orange-900">Tools</h3>
              <p className="text-sm text-orange-700">Useful applications</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}