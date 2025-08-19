'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { apiClient } from '@/lib/api-client';
import { Investor } from '@/lib/types';
import { Search, Users, Building2, MapPin, ExternalLink, Mail, Linkedin, CheckCircle } from 'lucide-react';

const INVESTORS_PER_PAGE = 9;

export default function Investors() {
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [filteredInvestors, setFilteredInvestors] = useState<Investor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [sectorFilter, setSectorFilter] = useState('all');
  const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(null);
  const [requestedIntros, setRequestedIntros] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [showImageModal, setShowImageModal] = useState(false);

  useEffect(() => {
    const loadInvestors = async () => {
      try {
        const response = await apiClient.getInvestors();
        if (response.success && response.data) {
          setInvestors(response.data);
          setFilteredInvestors(response.data);
        }
      } catch (error) {
        console.error('Error loading investors:', error);
      } finally {
        setLoading(false);
      }
    };
    loadInvestors();
    const interval = setInterval(() => {
      loadInvestors();
    }, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let filtered = investors;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(investor =>
        investor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        investor.firm.toLowerCase().includes(searchTerm.toLowerCase()) ||
        investor.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        investor.sectors.some(sector => sector.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Stage filter
    if (stageFilter !== 'all') {
      filtered = filtered.filter(investor => 
        investor.preferredStage.some(stage => stage.toLowerCase() === stageFilter.toLowerCase())
      );
    }

    // Sector filter
    if (sectorFilter !== 'all') {
      
      filtered = filtered.filter(investor => 
        investor.sectors.some(sector => sector.toLowerCase() === sectorFilter.toLowerCase())
      );
    }

    setFilteredInvestors(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [investors, searchTerm, stageFilter, sectorFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredInvestors.length / INVESTORS_PER_PAGE);
  const paginatedInvestors = filteredInvestors.slice(
    (currentPage - 1) * INVESTORS_PER_PAGE,
    currentPage * INVESTORS_PER_PAGE
  );

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
      

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Find Investors</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search investors, firms, or sectors..."
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
                <SelectItem value="pre-seed">Pre-seed</SelectItem>
                <SelectItem value="seed">Seed</SelectItem>
                <SelectItem value="series a">Series A</SelectItem>
                <SelectItem value="series b">Series B</SelectItem>
                <SelectItem value="series c+">Series C+</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sectorFilter} onValueChange={setSectorFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Sector" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sectors</SelectItem>
                <SelectItem value="saas">SaaS</SelectItem>
                <SelectItem value="ai/ml">AI/ML</SelectItem>
                <SelectItem value="fintech">FinTech</SelectItem>
                <SelectItem value="healthtech">HealthTech</SelectItem>
                <SelectItem value="edtech">EdTech</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          {filteredInvestors.length} investor{filteredInvestors.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Investor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedInvestors.map((investor) => (
          <Dialog key={investor.id} open={selectedInvestor?.id === investor.id} onOpenChange={(open) => { if (!open) setSelectedInvestor(null); }}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedInvestor(investor)}>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center h-12 w-12 bg-gray-100 rounded-full overflow-hidden">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={investor.imageUrl || ''} alt={investor.name} className="object-contain h-full w-full" />
                      <AvatarFallback>
                        {investor.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div>
                    <CardTitle className="text-lg">{investor.name}</CardTitle>
                    <p className="text-sm text-gray-600">{investor.firm}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {investor.description}
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Building2 className="h-4 w-4 mr-2" />
                      <span>Preferred Stages</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {investor.preferredStage.map((stage) => (
                        <Badge key={stage} variant="secondary" className="text-xs">
                          {stage}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      <span>Sectors</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {investor.sectors.slice(0, 3).map((sector) => (
                        <Badge key={sector} variant="outline" className="text-xs">
                          {sector}
                        </Badge>
                      ))}
                      {investor.sectors.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{investor.sectors.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <Button size="sm" className="bg-black text-white hover:bg-gray-900" onClick={(e) => { e.stopPropagation(); setSelectedInvestor(investor); }}>
                      View Profile
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            <DialogContent className="max-w-2xl">
              <DialogClose asChild>
                <Button className="absolute right-4 top-4 bg-black text-white hover:bg-gray-900 px-4 py-2 z-10" onClick={() => setSelectedInvestor(null)}>
                  Close
                </Button>
              </DialogClose>
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-3">
                  <div className="flex items-center justify-center h-12 w-12 bg-gray-100 rounded-full overflow-hidden cursor-pointer" onClick={() => setShowImageModal(true)}>
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={selectedInvestor?.imageUrl || ''} alt={selectedInvestor?.name || ''} className="object-contain h-full w-full" />
                      <AvatarFallback>
                        {selectedInvestor?.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div>
                    <span>{selectedInvestor?.name}</span>
                    <p className="text-sm text-gray-600 font-normal">{selectedInvestor?.firm}</p>
                  </div>
                </DialogTitle>
              </DialogHeader>
              {selectedInvestor && (
                <div className="space-y-6">
                  <p className="text-gray-600">{selectedInvestor.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-2">Preferred Stages</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedInvestor.preferredStage.map((stage) => (
                          <Badge key={stage} variant="secondary">
                            {stage}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Focus Sectors</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedInvestor.sectors.map((sector) => (
                          <Badge key={sector} variant="outline">
                            {sector}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Geography</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedInvestor.geography.map((geo) => (
                          <Badge key={geo} variant="outline">
                            <MapPin className="h-3 w-3 mr-1" />
                            {geo}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    
                  </div>

                  <div className="flex items-center space-x-3 pt-4 border-t">
                    {selectedInvestor.email && (() => {
                      const email = selectedInvestor.email;
                      if (email.startsWith('http')) {
                        if (email.includes('twitter.com') || email.includes('x.com')) {
                          return (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(email, '_blank')}
                            >
                              <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 5.924c-.793.352-1.645.59-2.54.698a4.48 4.48 0 0 0 1.965-2.475 8.94 8.94 0 0 1-2.828 1.082A4.48 4.48 0 0 0 16.11 4c-2.48 0-4.49 2.01-4.49 4.49 0 .352.04.695.116 1.022C7.728 9.37 4.1 7.6 1.67 4.905c-.386.664-.607 1.437-.607 2.26 0 1.56.795 2.936 2.005 3.744a4.48 4.48 0 0 1-2.034-.563v.057c0 2.18 1.55 4.002 3.604 4.417-.377.103-.775.158-1.186.158-.29 0-.57-.028-.844-.08.57 1.78 2.23 3.08 4.2 3.12A8.98 8.98 0 0 1 2 19.54a12.67 12.67 0 0 0 6.86 2.01c8.23 0 12.74-6.82 12.74-12.74 0-.19-.004-.38-.013-.57A9.1 9.1 0 0 0 24 4.59a8.93 8.93 0 0 1-2.54.698z"/></svg>
                              Twitter
                            </Button>
                          );
                        } else {
                          return (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(email, '_blank')}
                            >
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Website
                            </Button>
                          );
                        }
                      } else {
                        return (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(`mailto:${email}`, '_blank')}
                          >
                            <Mail className="mr-2 h-4 w-4" />
                            Email
                          </Button>
                        );
                      }
                    })()}
                    {selectedInvestor.linkedin && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
  if (selectedInvestor?.linkedin) {
    window.open(selectedInvestor.linkedin, '_blank');
  }
}}
                      >
                        <Linkedin className="mr-2 h-4 w-4" />
                        LinkedIn
                      </Button>
                    )}
                  </div>
                  {/* Image Modal */}
                  {showImageModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70" onClick={() => setShowImageModal(false)}>
                      <img src={selectedInvestor?.imageUrl || ''} alt={selectedInvestor?.name || ''} className="max-h-[80vh] max-w-[90vw] rounded-lg shadow-lg" />
                    </div>
                  )}
                </div>
              )}
            </DialogContent>
          </Dialog>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className="w-10 h-10"
              >
                {page}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {filteredInvestors.length === 0 && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No investors found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search criteria to find relevant investors.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Investment Stages Info */}
      <Card>
        <CardHeader>
          <CardTitle>Understanding Investment Stages</CardTitle>
          <CardDescription>
            Learn about different funding stages and what investors look for
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Pre-seed</h3>
              <p className="text-sm text-blue-700">
                Early stage funding for idea validation and initial development. Typically $50K-$500K.
              </p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2">Seed</h3>
              <p className="text-sm text-green-700">
                Funding to build MVP and gain initial traction. Usually $500K-$2M.
              </p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-semibold text-purple-900 mb-2">Series A</h3>
              <p className="text-sm text-purple-700">
                Scale proven business model and expand team. Typically $2M-$15M.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}