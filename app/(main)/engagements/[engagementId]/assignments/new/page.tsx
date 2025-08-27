'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Plus, Search, Briefcase, Calendar, User, AlertCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'

interface Assignment {
  AssignmentID: number
  AssignmentName: string
  AssignmentDescription: string | null
  AssignmentStatusID: number
  AssignmentTypeID: number
  AssignmentStartDate: string | null
  AssignmentDueDate: string | null
  AssigneeID: number
  StatusName: string
  AssigneeName: string
  TypeName: string
  IsLinked: boolean
}

interface AssignmentType {
  AssignmentTypeID: number
  TypeName: string
}

interface AssignmentStatus {
  StatusID: number
  StatusName: string
}

export default function NewAssignmentPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const engagementId = params.engagementId as string

  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [filteredAssignments, setFilteredAssignments] = useState<Assignment[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [linking, setLinking] = useState<number | null>(null)
  const [unlinking, setUnlinking] = useState<number | null>(null)

  const [assignmentTypes, setAssignmentTypes] = useState<AssignmentType[]>([])
  const [assignmentStatuses, setAssignmentStatuses] = useState<AssignmentStatus[]>([])

  useEffect(() => {
    fetchAssignments()
    fetchAssignmentTypes()
    fetchAssignmentStatuses()
  }, [])

  useEffect(() => {
    filterAssignments()
  }, [searchTerm, selectedType, selectedStatus, assignments])

  const fetchAssignments = async () => {
    try {
      const response = await fetch(`/api/assignments/available?engagementId=${engagementId}`)
      if (response.ok) {
        const data = await response.json()
        setAssignments(data.assignments)
      } else {
        throw new Error('Failed to fetch assignments')
      }
    } catch (error) {
      console.error('Error fetching assignments:', error)
      toast({
        title: "Error",
        description: "Failed to load assignments",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchAssignmentTypes = async () => {
    try {
      const response = await fetch('/api/assignment-types')
      if (response.ok) {
        const data = await response.json()
        setAssignmentTypes(data)
      }
    } catch (error) {
      console.error('Error fetching assignment types:', error)
    }
  }

  const fetchAssignmentStatuses = async () => {
    try {
      const response = await fetch('/api/assignment-statuses')
      if (response.ok) {
        const data = await response.json()
        setAssignmentStatuses(data)
      }
    } catch (error) {
      console.error('Error fetching assignment statuses:', error)
    }
  }

  const filterAssignments = () => {
    let filtered = assignments

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(assignment =>
        assignment.AssignmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (assignment.AssignmentDescription && assignment.AssignmentDescription.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(assignment => assignment.AssignmentTypeID.toString() === selectedType)
    }

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(assignment => assignment.AssignmentStatusID.toString() === selectedStatus)
    }

    setFilteredAssignments(filtered)
  }

  const linkAssignmentToEngagement = async (assignmentId: number) => {
    setLinking(assignmentId)
    try {
      const response = await fetch('/api/engagement-assignments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          engagementId: parseInt(engagementId),
          assignmentId: assignmentId
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Assignment linked to engagement successfully!",
        })
        
        // Update local state to show as linked
        setAssignments(prev => prev.map(assignment =>
          assignment.AssignmentID === assignmentId
            ? { ...assignment, IsLinked: true }
            : assignment
        ))
        
        // Redirect back to dashboard after a short delay
        setTimeout(() => {
          router.push(`/engagements/${engagementId}/dashboard`)
        }, 1500)
      } else {
        throw new Error('Failed to link assignment')
      }
    } catch (error) {
      console.error('Error linking assignment:', error)
      toast({
        title: "Error",
        description: "Failed to link assignment to engagement",
        variant: "destructive"
      })
    } finally {
      setLinking(null)
    }
  }

  const unlinkAssignmentFromEngagement = async (assignmentId: number) => {
    setUnlinking(assignmentId)
    try {
      const response = await fetch('/api/engagement-assignments', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          engagementId: parseInt(engagementId),
          assignmentId: assignmentId
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Assignment unlinked successfully!",
        })
        
        // Update local state to show as unlinked
        setAssignments(prev => prev.map(assignment =>
          assignment.AssignmentID === assignmentId
            ? { ...assignment, IsLinked: false }
            : assignment
        ))
      } else {
        throw new Error('Failed to unlink assignment')
      }
    } catch (error) {
      console.error('Error unlinking assignment:', error)
      toast({
        title: "Error",
        description: "Failed to unlink assignment",
        variant: "destructive"
      })
    } finally {
      setUnlinking(null)
    }
  }

  const getTypeName = (typeId: number) => {
    const type = assignmentTypes.find(t => t.AssignmentTypeID === typeId)
    return type?.TypeName || 'Unknown'
  }

  const getStatusName = (statusId: number) => {
    const status = assignmentStatuses.find(s => s.StatusID === statusId)
    return status?.StatusName || 'Unknown'
  }

  const getStatusColor = (statusId: number) => {
    switch (statusId) {
      case 1: return 'bg-blue-100 text-blue-800' // Planning
      case 2: return 'bg-yellow-100 text-yellow-800' // Preparation
      case 3: return 'bg-orange-100 text-orange-800' // Fieldwork
      case 4: return 'bg-purple-100 text-purple-800' // Reporting
      case 5: return 'bg-indigo-100 text-indigo-800' // Follow-up
      case 6: return 'bg-green-100 text-green-800' // Completed
      case 7: return 'bg-red-100 text-red-800' // Cancelled
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center space-x-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <div>Loading assignments...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Link href={`/engagements/${engagementId}/dashboard`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Add Assignment to Engagement</h1>
            <p className="text-muted-foreground">Select from existing assignments to link to this engagement</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Search and filter available assignments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search assignments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="all">All Types</option>
              {assignmentTypes.map(type => (
                <option key={type.AssignmentTypeID} value={type.AssignmentTypeID}>
                  {type.TypeName}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="all">All Statuses</option>
              {assignmentStatuses.map(status => (
                <option key={status.StatusID} value={status.StatusID}>
                  {status.StatusName}
                </option>
              ))}
            </select>

            <div className="text-sm text-muted-foreground flex items-center">
              {filteredAssignments.length} of {assignments.length} assignments
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assignments List */}
      <Card>
        <CardHeader>
          <CardTitle>Available Assignments</CardTitle>
          <CardDescription>
            Select assignments to link to this engagement. Already linked assignments are marked.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredAssignments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No assignments found matching your criteria.</p>
              <p className="text-sm mt-1">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAssignments.map((assignment) => (
                <div
                  key={assignment.AssignmentID}
                  className={`p-4 border rounded-lg transition-all ${
                    assignment.IsLinked
                      ? 'bg-green-50 border-green-200'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-lg">{assignment.AssignmentName}</h3>
                        <Badge className={getStatusColor(assignment.AssignmentStatusID)}>
                          {getStatusName(assignment.AssignmentStatusID)}
                        </Badge>
                        {assignment.IsLinked && (
                          <Badge className="bg-green-100 text-green-800">
                            Linked
                          </Badge>
                        )}
                      </div>
                      
                      {assignment.AssignmentDescription && (
                        <p className="text-muted-foreground mb-3">
                          {assignment.AssignmentDescription}
                        </p>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Briefcase className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Type:</span>
                          <span>{getTypeName(assignment.AssignmentTypeID)}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Due:</span>
                          <span>
                            {assignment.AssignmentDueDate
                              ? new Date(assignment.AssignmentDueDate).toLocaleDateString()
                              : 'Not set'
                            }
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Assignee:</span>
                          <span>{assignment.AssigneeName}</span>
                        </div>
                      </div>
                    </div>

                                         <div className="ml-4">
                       {assignment.IsLinked ? (
                         <div className="flex gap-2">
                           <Button variant="outline" disabled className="bg-green-50 text-green-700 border-green-200">
                             Linked
                           </Button>
                           <Button
                             variant="outline"
                             size="sm"
                             onClick={() => unlinkAssignmentFromEngagement(assignment.AssignmentID)}
                             disabled={unlinking === assignment.AssignmentID}
                             className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                           >
                             {unlinking === assignment.AssignmentID ? (
                               <>
                                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                                 Unlinking...
                               </>
                               ) : (
                                 <>
                                   Unlink
                                 </>
                               )}
                           </Button>
                         </div>
                       ) : (
                         <Button
                           onClick={() => linkAssignmentToEngagement(assignment.AssignmentID)}
                           disabled={linking === assignment.AssignmentID}
                           className="min-w-[120px]"
                         >
                           {linking === assignment.AssignmentID ? (
                             <>
                               <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                               Linking...
                             </>
                           ) : (
                             <>
                               <Plus className="h-4 w-4 mr-2" />
                               Link Assignment
                             </>
                           )}
                         </Button>
                       )}
                     </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
