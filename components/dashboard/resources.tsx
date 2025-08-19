'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { apiClient } from '@/lib/api-client';
import { Resource } from '@/lib/types';
import {
  BookOpen,
  FileText,
  Video,
  ExternalLink,
  Search,
  Star,
  Filter,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const RESOURCES_PER_PAGE = 6;

export default function Resources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadResources = async () => {
      try {
        const response = await apiClient.getResources();
        if (response.success && response.data) {
          setResources(response.data);
          setFilteredResources(response.data);
        }
      } catch (error) {
        console.error('Error loading resources:', error);
      } finally {
        setLoading(false);
      }
    };
    loadResources();
    const interval = setInterval(() => {
      loadResources();
    }, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let filtered = resources;

    if (searchTerm) {
      filtered = filtered.filter(
        (r) =>
          r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter((r) => r.category === categoryFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter((r) => r.type === typeFilter);
    }

    setFilteredResources(filtered);
    setCurrentPage(1); // Reset to first page on filter change
  }, [resources, searchTerm, categoryFilter, typeFilter]);

  const paginatedResources = filteredResources.slice(
    (currentPage - 1) * RESOURCES_PER_PAGE,
    currentPage * RESOURCES_PER_PAGE
  );

  const totalPages = Math.ceil(filteredResources.length / RESOURCES_PER_PAGE);

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'PDF':
        return <FileText className="h-5 w-5" />;
      case 'VIDEO':
        return <Video className="h-5 w-5" />;
      case 'LINK':
        return <ExternalLink className="h-5 w-5" />;
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'PLAYBOOK':
        return 'bg-blue-100 text-blue-800';
      case 'TEMPLATE':
        return 'bg-green-100 text-green-800';
      case 'GUIDE':
        return 'bg-purple-100 text-purple-800';
      case 'TOOL':
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
      
      {/* Featured */}
      {resources.some((r) => r.featured) && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Featured Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resources
              .filter((resource) => resource.featured)
              .map((resource) => (
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
                              {resource.category.toLowerCase()}
                            </Badge>
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{resource.description}</p>
                    <Link href={resource.url} target="_blank" rel="noopener noreferrer">
                      <Button className="w-full">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Access Resource
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      )}

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
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="PLAYBOOK">Playbooks</SelectItem>
                <SelectItem value="TEMPLATE">Templates</SelectItem>
                <SelectItem value="GUIDE">Guides</SelectItem>
                <SelectItem value="TOOL">Tools</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="PDF">PDF</SelectItem>
                <SelectItem value="LINK">Web Link</SelectItem>
                <SelectItem value="VIDEO">Video</SelectItem>
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
          {paginatedResources.map((resource) => (
            <Card key={resource.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="aspect-video rounded-lg overflow-hidden mb-4">
                  <img
                    src={
                      resource.imageUrl ||
                      'https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
                    }
                    alt={resource.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <div className="bg-gray-100 p-1 rounded">{getResourceIcon(resource.type)}</div>
                  <Badge className={getCategoryColor(resource.category)}>
                    {resource.category.toLowerCase()}
                  </Badge>
                  {resource.featured && (
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  )}
                </div>
                <CardTitle className="text-lg">{resource.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4 line-clamp-3">{resource.description}</p>
                <Link href={resource.url} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Access Resource
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Empty State */}
      {filteredResources.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No resources found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search criteria or check back later.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
