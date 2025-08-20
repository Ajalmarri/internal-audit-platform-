'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Download, Eye, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface CSVFinding {
  id: number;
  sequence: string;
  year: string;
  audit_plan_name: string;
  assignment_name: string;
  assignment_cycle: string;
  finding_title: string;
  finding_detail: string;
  management_response: string;
  acceptance: string;
  finding_rating: string;
  control_rating: string;
  recommendations: string;
  core_risks: string;
  core_function: string;
  created_by: string;
  created_at: string;
}

export default function CSVFindingsPage() {
  const [findings, setFindings] = useState<CSVFinding[]>([]);
  const [filteredFindings, setFilteredFindings] = useState<CSVFinding[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [functionFilter, setFunctionFilter] = useState('');
  const [selectedFinding, setSelectedFinding] = useState<CSVFinding | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Load findings from API
  useEffect(() => {
    fetchFindings();
  }, []);

  // Filter findings when search or filters change
  useEffect(() => {
    let filtered = findings;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(finding =>
        finding.finding_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        finding.sequence?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        finding.audit_plan_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        finding.assignment_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply year filter
    if (yearFilter) {
      filtered = filtered.filter(finding => finding.year === yearFilter);
    }

    // Apply rating filter
    if (ratingFilter) {
      filtered = filtered.filter(finding => finding.finding_rating === ratingFilter);
    }

    // Apply function filter
    if (functionFilter) {
      filtered = filtered.filter(finding => finding.core_function === functionFilter);
    }

    setFilteredFindings(filtered);
  }, [findings, searchTerm, yearFilter, ratingFilter, functionFilter]);

  const fetchFindings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/findings-csv');
      if (response.ok) {
        const data = await response.json();
        setFindings(data);
      } else {
        toast.error('Failed to fetch findings');
      }
    } catch (error) {
      toast.error('Error fetching findings');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to clean messy data
  const cleanData = (data: string) => {
    if (!data || typeof data !== 'string') return 'Unknown';
    // Remove HTML tags and clean up the text
    const cleaned = data
      .replace(/<[^>]*>/g, ' ')
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/&#58;/g, ':')
      .replace(/&#160;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    // Return 'Unknown' if the cleaned data is empty or just whitespace
    return cleaned && cleaned.length > 0 ? cleaned : 'Unknown';
  };

  const getRatingColor = (rating: string) => {
    if (!rating) return 'bg-gray-100 text-gray-800';
    const cleanRating = cleanData(rating);
    if (cleanRating.includes('High') || cleanRating.includes('3-')) return 'bg-red-100 text-red-800';
    if (cleanRating.includes('Medium') || cleanRating.includes('2-')) return 'bg-yellow-100 text-yellow-800';
    if (cleanRating.includes('Low') || cleanRating.includes('1-')) return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getControlRatingColor = (rating: string) => {
    if (!rating) return 'bg-gray-100 text-gray-800';
    if (rating.includes('Ineffective')) return 'bg-red-100 text-red-800';
    if (rating.includes('Inadequate')) return 'bg-orange-100 text-orange-800';
    if (rating.includes('Effective')) return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  const handleViewDetails = (finding: CSVFinding) => {
    setSelectedFinding(finding);
    setShowDetailModal(true);
  };

  const exportToCSV = () => {
    const headers = [
      'Sequence', 'Year', 'Audit Plan', 'Assignment', 'Cycle', 'Finding Title',
      'Rating', 'Control Rating', 'Function', 'Created By'
    ];
    
    const csvContent = [
      headers.join(','),
      ...filteredFindings.map(finding => [
        finding.sequence || '',
        finding.year || '',
        finding.audit_plan_name || '',
        finding.assignment_name || '',
        finding.assignment_cycle || '',
        finding.finding_title || '',
        finding.finding_rating || '',
        finding.control_rating || '',
        finding.core_function || '',
        finding.created_by || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'findings_export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Findings exported successfully');
  };

  // Get unique values for filters - ensure no empty strings and clean the data
  const getFilterValues = (data: CSVFinding[], field: keyof CSVFinding) => {
    const values = [...new Set(
      data
        .map(f => f[field])
        .filter((value): value is string => typeof value === 'string' && value.trim() !== '')
        .map(value => cleanData(value))
        .filter(value => value && value.trim() !== '' && value !== 'Unknown')
    )].sort();
    
    // Final safety check - ensure no empty strings
    return values.filter(value => value && value.trim() !== '');
  };

  const years = getFilterValues(findings, 'year');
  const ratings = getFilterValues(findings, 'finding_rating');
  const functions = getFilterValues(findings, 'core_function');

  // Debug logging to help identify any empty values
  console.log('Filter values:', { years, ratings, functions });
  console.log('Years empty check:', years.some(y => !y || y.trim() === ''));
  console.log('Ratings empty check:', ratings.some(r => !r || r.trim() === ''));
  console.log('Functions empty check:', functions.some(f => !f || f.trim() === ''));

  // Utility function to ensure safe values for Select components
  const getSafeSelectValue = (value: string): string => {
    if (!value || typeof value !== 'string' || value.trim() === '') {
      return 'unknown';
    }
    return value.trim();
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading findings...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">CSV Findings Management</h1>
          <p className="text-muted-foreground">
            View and manage findings imported from CSV ({findings.length} total findings)
          </p>
        </div>
        <Button onClick={exportToCSV} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export to CSV
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search findings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Year</label>
              <Select value={yearFilter} onValueChange={(val) => setYearFilter(val === 'all' ? '' : val)}>
                <SelectTrigger>
                  <SelectValue placeholder="All years" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All years</SelectItem>
                  {years
                    .filter(year => year && year.trim() !== '')
                    .map(year => {
                      const safeValue = getSafeSelectValue(year);
                      return (
                        <SelectItem key={safeValue} value={safeValue}>
                          {safeValue}
                        </SelectItem>
                      );
                    })}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Rating</label>
              <Select value={ratingFilter} onValueChange={(val) => setRatingFilter(val === 'all' ? '' : val)}>
                <SelectTrigger>
                  <SelectValue placeholder="All ratings" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All ratings</SelectItem>
                  {ratings
                    .filter(rating => rating && rating.trim() !== '')
                    .map(rating => {
                      const safeValue = getSafeSelectValue(rating);
                      return (
                        <SelectItem key={safeValue} value={safeValue}>
                          {safeValue}
                        </SelectItem>
                      );
                    })}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Function</label>
              <Select value={functionFilter} onValueChange={(val) => setFunctionFilter(val === 'all' ? '' : val)}>
                <SelectTrigger>
                  <SelectValue placeholder="All functions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All functions</SelectItem>
                  {functions
                    .filter(func => func && func.trim() !== '')
                    .map(func => {
                      const safeValue = getSafeSelectValue(func);
                      return (
                        <SelectItem key={safeValue} value={safeValue}>
                          {safeValue}
                        </SelectItem>
                      );
                    })}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {filteredFindings.length} of {findings.length} findings
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchTerm('');
              setYearFilter('');
              setRatingFilter('');
              setFunctionFilter('');
            }}
          >
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Findings Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sequence</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Audit Plan</TableHead>
                <TableHead>Finding Title</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Control Rating</TableHead>
                <TableHead>Function</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFindings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No findings found matching your criteria
                  </TableCell>
                </TableRow>
              ) : (
                filteredFindings.map((finding) => (
                  <TableRow key={finding.id}>
                    <TableCell className="font-mono text-sm">
                      {finding.sequence || '-'}
                    </TableCell>
                    <TableCell>{finding.year || '-'}</TableCell>
                                         <TableCell className="max-w-xs truncate">
                       {cleanData(finding.audit_plan_name) || '-'}
                     </TableCell>
                     <TableCell className="max-w-md truncate">
                       {cleanData(finding.finding_title) || '-'}
                     </TableCell>
                    <TableCell>
                      {finding.finding_rating && (
                        <Badge className={getRatingColor(finding.finding_rating)}>
                          {finding.finding_rating}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {finding.control_rating && (
                        <Badge className={getControlRatingColor(finding.control_rating)}>
                          {finding.control_rating}
                        </Badge>
                      )}
                    </TableCell>
                                         <TableCell className="max-w-xs truncate">
                       {cleanData(finding.core_function) || '-'}
                     </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(finding)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail Modal */}
      {showDetailModal && selectedFinding && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">Finding Details</h2>
              <Button
                variant="outline"
                onClick={() => setShowDetailModal(false)}
              >
                Close
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Sequence</label>
                  <p className="text-lg">{selectedFinding.sequence || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Year</label>
                  <p className="text-lg">{selectedFinding.year || '-'}</p>
                </div>
                                 <div>
                   <label className="text-sm font-medium text-gray-600">Audit Plan</label>
                   <p className="text-lg">{cleanData(selectedFinding.audit_plan_name) || '-'}</p>
                 </div>
                 <div>
                   <label className="text-sm font-medium text-gray-600">Assignment</label>
                   <p className="text-lg">{cleanData(selectedFinding.assignment_name) || '-'}</p>
                 </div>
                 <div>
                   <label className="text-sm font-medium text-gray-600">Cycle</label>
                   <p className="text-lg">{cleanData(selectedFinding.assignment_cycle) || '-'}</p>
                 </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Finding Rating</label>
                  <Badge className={getRatingColor(selectedFinding.finding_rating)}>
                    {selectedFinding.finding_rating || '-'}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Control Rating</label>
                  <Badge className={getControlRatingColor(selectedFinding.control_rating)}>
                    {selectedFinding.control_rating || '-'}
                  </Badge>
                </div>
                                 <div>
                   <label className="text-sm font-medium text-gray-600">Core Function</label>
                   <p className="text-lg">{cleanData(selectedFinding.core_function) || '-'}</p>
                 </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Created By</label>
                  <p className="text-lg">{selectedFinding.created_by || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Created At</label>
                  <p className="text-lg">
                    {selectedFinding.created_at ? new Date(selectedFinding.created_at).toLocaleDateString() : '-'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 space-y-4">
                             <div>
                 <label className="text-sm font-medium text-gray-600">Finding Title</label>
                 <p className="text-lg font-medium">{cleanData(selectedFinding.finding_title) || '-'}</p>
               </div>
              
                             {selectedFinding.finding_detail && (
                 <div>
                   <label className="text-sm font-medium text-gray-600">Finding Detail</label>
                   <div className="mt-2 p-4 bg-gray-50 rounded-lg max-h-40 overflow-y-auto">
                     <p className="whitespace-pre-wrap">{cleanData(selectedFinding.finding_detail)}</p>
                   </div>
                 </div>
               )}
              
                             {selectedFinding.management_response && (
                 <div>
                   <label className="text-sm font-medium text-gray-600">Management Response</label>
                   <div className="mt-2 p-4 bg-blue-50 rounded-lg max-h-40 overflow-y-auto">
                     <p className="whitespace-pre-wrap">{cleanData(selectedFinding.management_response)}</p>
                   </div>
                 </div>
               )}
               
               {selectedFinding.recommendations && (
                 <div>
                   <label className="text-sm font-medium text-gray-600">Recommendations</label>
                   <div className="mt-2 p-4 bg-green-50 rounded-lg max-h-40 overflow-y-auto">
                     <p className="whitespace-pre-wrap">{cleanData(selectedFinding.recommendations)}</p>
                   </div>
                 </div>
               )}
               
               {selectedFinding.core_risks && (
                 <div>
                   <label className="text-sm font-medium text-gray-600">Core Risks</label>
                   <div className="mt-2 p-4 bg-red-50 rounded-lg max-h-40 overflow-y-auto">
                     <p className="whitespace-pre-wrap">{cleanData(selectedFinding.core_risks)}</p>
                   </div>
                 </div>
               )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
