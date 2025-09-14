'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface Finding {
  id: string;
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

export default function ManualFindingsPage() {
  const [findings, setFindings] = useState<Finding[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    sequence: '',
    year: '',
    audit_plan_name: '',
    assignment_name: '',
    assignment_cycle: '',
    finding_title: '',
    finding_detail: '',
    management_response: '',
    acceptance: '',
    finding_rating: '',
    control_rating: '',
    recommendations: '',
    core_risks: '',
    core_function: '',
    created_by: ''
  });

  // Load findings from localStorage on component mount
  useEffect(() => {
    const savedFindings = localStorage.getItem('manualFindings');
    if (savedFindings) {
      setFindings(JSON.parse(savedFindings));
    }
  }, []);

  // Save findings to localStorage whenever findings change
  useEffect(() => {
    localStorage.setItem('manualFindings', JSON.stringify(findings));
  }, [findings]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.finding_title || !formData.audit_plan_name) {
      toast.error('Finding title and audit plan name are required');
      return;
    }

    if (editingId) {
      // Update existing finding
      setFindings(prev => prev.map(finding => 
        finding.id === editingId 
          ? { ...finding, ...formData, updated_at: new Date().toISOString() }
          : finding
      ));
      setEditingId(null);
      toast.success('Finding updated successfully');
    } else {
      // Add new finding
      const newFinding: Finding = {
        id: Date.now().toString(),
        ...formData,
        created_at: new Date().toISOString()
      };
      setFindings(prev => [...prev, newFinding]);
      toast.success('Finding added successfully');
    }

    // Reset form
    setFormData({
      sequence: '',
      year: '',
      audit_plan_name: '',
      assignment_name: '',
      assignment_cycle: '',
      finding_title: '',
      finding_detail: '',
      management_response: '',
      acceptance: '',
      finding_rating: '',
      control_rating: '',
      recommendations: '',
      core_risks: '',
      core_function: '',
      created_by: ''
    });
    setIsAdding(false);
  };

  const handleEdit = (finding: Finding) => {
    setFormData({
      sequence: finding.sequence,
      year: finding.year,
      audit_plan_name: finding.audit_plan_name,
      assignment_name: finding.assignment_name,
      assignment_cycle: finding.assignment_cycle,
      finding_title: finding.finding_title,
      finding_detail: finding.finding_detail,
      management_response: finding.management_response,
      acceptance: finding.acceptance,
      finding_rating: finding.finding_rating,
      control_rating: finding.control_rating,
      recommendations: finding.recommendations,
      core_risks: finding.core_risks,
      core_function: finding.core_function,
      created_by: finding.created_by
    });
    setEditingId(finding.id);
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this finding?')) {
      setFindings(prev => prev.filter(finding => finding.id !== id));
      toast.success('Finding deleted successfully');
    }
  };

  const getRatingColor = (rating: string) => {
    if (rating.includes('High')) return 'bg-red-100 text-red-800';
    if (rating.includes('Medium')) return 'bg-yellow-100 text-yellow-800';
    if (rating.includes('Low')) return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Manual Findings Management</h1>
          <p className="text-muted-foreground">
            Add and manage audit findings manually
          </p>
        </div>
        <Button onClick={() => setIsAdding(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Finding
        </Button>
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingId ? 'Edit Finding' : 'Add New Finding'}
            </CardTitle>
            <CardDescription>
              {editingId ? 'Update the finding details below' : 'Enter the finding details below'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Sequence</label>
                  <Input
                    value={formData.sequence}
                    onChange={(e) => handleInputChange('sequence', e.target.value)}
                    placeholder="e.g., C&P-2022-001"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Year</label>
                  <Input
                    value={formData.year}
                    onChange={(e) => handleInputChange('year', e.target.value)}
                    placeholder="e.g., 2022"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Audit Plan Name *</label>
                  <Input
                    value={formData.audit_plan_name}
                    onChange={(e) => handleInputChange('audit_plan_name', e.target.value)}
                    placeholder="e.g., Contract Review Q1"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Assignment Name</label>
                  <Input
                    value={formData.assignment_name}
                    onChange={(e) => handleInputChange('assignment_name', e.target.value)}
                    placeholder="e.g., Procurement Audit"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Assignment Cycle</label>
                  <Input
                    value={formData.assignment_cycle}
                    onChange={(e) => handleInputChange('assignment_cycle', e.target.value)}
                    placeholder="e.g., Procure to Pay"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Finding Rating</label>
                  <Select value={formData.finding_rating} onValueChange={(value) => handleInputChange('finding_rating', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-Low">1-Low</SelectItem>
                      <SelectItem value="2-Medium">2-Medium</SelectItem>
                      <SelectItem value="3-High">3-High</SelectItem>
                      <SelectItem value="4-Critical">4-Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Control Rating</label>
                  <Select value={formData.control_rating} onValueChange={(value) => handleInputChange('control_rating', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-Control Effective">1-Control Effective</SelectItem>
                      <SelectItem value="2-Control Ineffective">2-Control Ineffective</SelectItem>
                      <SelectItem value="3-Control Inadequate">3-Control Inadequate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Core Function</label>
                  <Input
                    value={formData.core_function}
                    onChange={(e) => handleInputChange('core_function', e.target.value)}
                    placeholder="e.g., Contracts & Procurement"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Created By</label>
                  <Input
                    value={formData.created_by}
                    onChange={(e) => handleInputChange('created_by', e.target.value)}
                    placeholder="e.g., Auditor Name"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Finding Title *</label>
                <Input
                  value={formData.finding_title}
                  onChange={(e) => handleInputChange('finding_title', e.target.value)}
                  placeholder="Brief description of the finding"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium">Finding Detail</label>
                <Textarea
                  value={formData.finding_detail}
                  onChange={(e) => handleInputChange('finding_detail', e.target.value)}
                  placeholder="Detailed description of the finding"
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Management Response</label>
                <Textarea
                  value={formData.management_response}
                  onChange={(e) => handleInputChange('management_response', e.target.value)}
                  placeholder="Management's response to the finding"
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Recommendations</label>
                <Textarea
                  value={formData.recommendations}
                  onChange={(e) => handleInputChange('recommendations', e.target.value)}
                  placeholder="Recommended actions to address the finding"
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Core Risks</label>
                <Textarea
                  value={formData.core_risks}
                  onChange={(e) => handleInputChange('core_risks', e.target.value)}
                  placeholder="Core risks associated with the finding"
                  rows={2}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  {editingId ? 'Update Finding' : 'Add Finding'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsAdding(false);
                    setEditingId(null);
                    setFormData({
                      sequence: '',
                      year: '',
                      audit_plan_name: '',
                      assignment_name: '',
                      assignment_cycle: '',
                      finding_title: '',
                      finding_detail: '',
                      management_response: '',
                      acceptance: '',
                      finding_rating: '',
                      control_rating: '',
                      recommendations: '',
                      core_risks: '',
                      core_function: '',
                      created_by: ''
                    });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Findings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Findings ({findings.length})</CardTitle>
          <CardDescription>
            All manually added findings
          </CardDescription>
        </CardHeader>
        <CardContent>
          {findings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No findings added yet. Click "Add Finding" to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sequence</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Audit Plan</TableHead>
                  <TableHead>Finding Title</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Function</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {findings.map((finding) => (
                  <TableRow key={finding.id}>
                    <TableCell className="font-mono text-sm">
                      {finding.sequence || '-'}
                    </TableCell>
                    <TableCell>{finding.year || '-'}</TableCell>
                    <TableCell>{finding.audit_plan_name}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {finding.finding_title}
                    </TableCell>
                    <TableCell>
                      {finding.finding_rating && (
                        <Badge className={getRatingColor(finding.finding_rating)}>
                          {finding.finding_rating}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{finding.core_function || '-'}</TableCell>
                    <TableCell>{finding.created_by || '-'}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(finding)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(finding.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


























