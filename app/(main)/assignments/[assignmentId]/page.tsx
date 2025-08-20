"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { 
  Calendar, 
  Clock, 
  Users, 
  AlertTriangle, 
  FileText, 
  CheckCircle, 
  XCircle, 
  PlayCircle, 
  PauseCircle,
  Edit,
  Trash2,
  Plus,
  MessageSquare,
  Download,
  Eye,
  ChevronRight,
  ChevronDown,
  CalendarDays,
  Target,
  Shield,
  BarChart3,
  Activity
} from "lucide-react"
import type {
  Assignment,
  AuditTask,
  DocumentFile,
  RelatedRiskEntry,
  UserStub,
} from "./_types/assignment-types"

// Default empty data structures
const defaultTasks: AuditTask[] = []
const defaultRelatedRisks: RelatedRiskEntry[] = []
const defaultDocuments: DocumentFile[] = []

export default function AssignmentDetailPage() {
  const params = useParams<{ assignmentId: string }>()
  const router = useRouter()
  const [assignmentData, setAssignmentData] = useState<Assignment | null>(null)
  const [tasks, setTasks] = useState<AuditTask[]>(defaultTasks)
  const [relatedRisksData, setRelatedRisksData] = useState<RelatedRiskEntry[]>(defaultRelatedRisks)
  const [documents, setDocuments] = useState<DocumentFile[]>(defaultDocuments)
  const [availableUsers, setAvailableUsers] = useState<UserStub[]>([])
  const [isLoadingUsers, setIsLoadingUsers] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false)
  const [isAddTeamMemberModalOpen, setIsAddTeamMemberModalOpen] = useState(false)
  const [newTaskData, setNewTaskData] = useState({
    description: "",
    assigneeId: "",
    dueDate: null as Date | null,
    status: "Pending"
  })
  const [newTeamMemberData, setNewTeamMemberData] = useState({
    userId: "",
    assignmentRole: "Team Member"
  })

  // Calculate progress - reactive to task status changes
  const totalTasks = tasks.length
  const completedTasks = tasks.filter(task => task.status === "Completed").length
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  // Debug: Log current state
  console.log('🔄 Component render - Current tasks state:', tasks)
  console.log('🔄 Component render - Tasks length:', tasks.length)
  console.log('🔄 Component render - Tasks content:', JSON.stringify(tasks, null, 2))

  // Fetch assignment data from the database
  useEffect(() => {
    const fetchAssignmentData = async () => {
      if (!params.assignmentId) return
      
      setIsLoading(true)
      setError(null)
      
      try {
        const response = await fetch(`/api/assignments/${params.assignmentId}`)
        if (!response.ok) {
          throw new Error(`Failed to fetch assignment: ${response.status}`)
        }
        
        const data = await response.json()
        console.log("Fetched assignment data:", data)
        
        // Transform the API data to match our Assignment interface
        const transformedAssignment: Assignment = {
          id: data.AssignmentID?.toString() || params.assignmentId,
          title: data.AssignmentName || "Untitled Assignment",
          description: data.AssignmentDescription || "No description available",
          status: data.StatusName || "Unknown",
          currentStageIndex: 0, // Default to first stage
          stages: ["Planning", "Preparation", "Fieldwork", "Reporting", "Follow-up"],
          requirements: {
            type: data.AssignmentTypeName || "General",
            riskLikelihood: data.RiskLikelihoodName || "Unknown",
            impact: data.RiskImpactName || "Unknown",
            inherentRisk: data.InherentRiskName || "Unknown",
          },
          teamMembers: [],
          startDate: data.AssignmentStartDate ? new Date(data.AssignmentStartDate) : new Date(),
          endDate: data.AssignmentDueDate ? new Date(data.AssignmentDueDate) : new Date(),
        }
        
        setAssignmentData(transformedAssignment)
        
        // Fetch real data for tasks, risks, and team members
        await Promise.all([
          fetchTasks(params.assignmentId),
          fetchRisksAndControls(params.assignmentId),
          fetchTeamMembers(params.assignmentId)
        ])
        
        console.log('=== ASSIGNMENT DETAIL PAGE DEBUG ===')
        console.log('Assignment ID:', params.assignmentId)
        console.log('Assignment data:', transformedAssignment)
        console.log('Current tasks state:', tasks)
        console.log('Current risks state:', relatedRisksData)
        console.log('Current team state:', assignmentData?.teamMembers)
        console.log('=====================================')
        
        // Force a re-render to ensure state is updated
        setTimeout(() => {
          console.log('⏰ After timeout - Tasks state:', tasks)
          console.log('⏰ After timeout - Tasks length:', tasks.length)
        }, 100)
        
      } catch (error) {
        console.error("Error fetching assignment:", error)
        setError("Failed to load assignment data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchAssignmentData()
  }, [params.assignmentId])

  // Helper functions to fetch real data
  const fetchTasks = async (assignmentId: string) => {
    try {
      console.log(`🔍 Fetching tasks for assignment ${assignmentId}...`)
      const response = await fetch(`/api/assignments/${assignmentId}/tasks`)
      console.log(`📡 Tasks API response status:`, response.status)
      
      if (response.ok) {
        const tasksData = await response.json()
        console.log('✅ Fetched tasks from API:', tasksData)
        console.log('📊 Tasks array length:', tasksData?.length || 0)
        
        // Set the tasks state
        setTasks(tasksData || [])
        console.log('🔄 setTasks called with:', tasksData || [])
        
        // Force a re-render check
        setTimeout(() => {
          console.log('⏰ After setTasks - Current tasks state should be:', tasksData || [])
        }, 100)
      } else {
        console.warn("❌ Failed to fetch tasks, using empty array")
        setTasks([])
      }
    } catch (error) {
      console.error("💥 Error fetching tasks:", error)
      setTasks([])
    }
  }

  const fetchRisksAndControls = async (assignmentId: string) => {
    try {
      const response = await fetch(`/api/assignments/${assignmentId}/risks`)
      if (response.ok) {
        const risksData = await response.json()
        console.log('Fetched risks:', risksData)
        setRelatedRisksData(risksData || [])
      } else {
        console.warn("Failed to fetch risks, using empty array")
        setRelatedRisksData([])
      }
    } catch (error) {
      console.error("Error fetching risks:", error)
      setRelatedRisksData([])
    }
  }

  const fetchTeamMembers = async (assignmentId: string) => {
    try {
      const response = await fetch(`/api/assignments/${assignmentId}/team`)
      if (response.ok) {
        const teamData = await response.json()
        console.log('Fetched team members:', teamData)
        setAssignmentData(prev => prev ? ({
          ...prev,
          teamMembers: teamData || []
        }) : null)
      } else {
        console.warn("Failed to fetch team members, using empty array")
        setAssignmentData(prev => prev ? ({
          ...prev,
          teamMembers: []
        }) : null)
      }
    } catch (error) {
      console.error("Error fetching team members:", error)
      setAssignmentData(prev => prev ? ({
        ...prev,
        teamMembers: []
      }) : null)
    }
  }

  // Fetch available users for assignment (for adding new team members)
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoadingUsers(true)
      try {
        const response = await fetch("/api/users")
        if (!response.ok) {
          throw new Error(`Failed to fetch users: ${response.status}`)
        }
        const data: UserStub[] = await response.json()
        const usersWithAvatars = data.map(user => ({
          ...user,
          avatar: "/placeholder.svg?width=40&height=40"
        }))
        setAvailableUsers(usersWithAvatars)
      } catch (error) {
        console.error("Error fetching users:", error)
      } finally {
        setIsLoadingUsers(false)
      }
    }

    if (assignmentData) {
      fetchUsers()
    }
  }, [assignmentData])



  const toggleTaskExpansion = (taskId: string) => {
    setExpandedTasks(prev => {
      const newSet = new Set(prev)
      if (newSet.has(taskId)) {
        newSet.delete(taskId)
      } else {
        newSet.add(taskId)
      }
      return newSet
    })
  }

  const handleAddTask = async (taskData: Partial<AuditTask>) => {
    if (!params.assignmentId) return

    try {
      const response = await fetch(`/api/assignments/${params.assignmentId}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: taskData.description,
          status: taskData.status || 'Pending',
          assigneeId: taskData.assigneeId,
          dueDate: taskData.dueDate
        }),
      })

      if (response.ok) {
        const newTask = await response.json()
        setTasks(prev => [...prev, newTask])
        // Refresh tasks to get the latest data
        await fetchTasks(params.assignmentId)
      } else {
        console.error('Failed to create task')
      }
    } catch (error) {
      console.error('Error creating task:', error)
    }
  }

  const handleAddTeamMember = async (teamMemberData: { userId: string; assignmentRole: string }) => {
    if (!params.assignmentId) return

    try {
      const response = await fetch(`/api/assignments/${params.assignmentId}/team`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(teamMemberData),
      })

      if (response.ok) {
        // Refresh team members to get the latest data
        await fetchTeamMembers(params.assignmentId)
      } else {
        console.error('Failed to add team member')
      }
    } catch (error) {
      console.error('Error adding team member:', error)
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/assignments/${params.assignmentId}/tasks?taskId=${taskId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete task')
      }

      // Remove the task from local state
      setTasks(tasks.filter(task => task.id !== taskId))
    } catch (error) {
      console.error('Error deleting task:', error)
      alert('Failed to delete task. Please try again.')
    }
  }

  const handleUpdateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/assignments/${params.assignmentId}/tasks?taskId=${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error('Failed to update task status')
      }

      const updatedTask = await response.json()

      // Update the task in local state
      setTasks(tasks.map(task => 
        task.id === taskId 
          ? { ...task, status: updatedTask.status }
          : task
      ))

      // Show success feedback
      console.log(`Task status updated to: ${newStatus}`)
    } catch (error) {
      console.error('Error updating task status:', error)
      alert('Failed to update task status. Please try again.')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-800 border-green-200"
      case "In Progress": return "bg-blue-100 text-blue-800 border-blue-200"
      case "Pending": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Blocked": return "bg-red-100 text-red-800 border-red-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "High": return "bg-red-100 text-red-800 border-red-200"
      case "Medium": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Low": return "bg-green-100 text-green-800 border-green-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatDate = (date: Date | string | null) => {
    if (!date) return 'No date'
    
    // Convert string to Date if needed
    const dateObj = typeof date === 'string' ? new Date(date) : date
    
    // Check if it's a valid date
    if (isNaN(dateObj.getTime())) return 'Invalid date'
    
    return dateObj.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const getDaysRemaining = (date: Date | string | null) => {
    if (!date) return null
    
    // Convert string to Date if needed
    const dateObj = typeof date === 'string' ? new Date(date) : date
    
    // Check if it's a valid date
    if (isNaN(dateObj.getTime())) return null
    
    const today = new Date()
    const diffTime = dateObj.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <span>Loading assignment details...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="text-red-500 text-xl">⚠️</div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-red-600">Error Loading Assignment</h3>
            <p className="text-muted-foreground">{error}</p>
          </div>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    )
  }

  if (!assignmentData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-semibold">Assignment Not Found</h3>
          <p className="text-muted-foreground">The requested assignment could not be found.</p>
          <Button onClick={() => router.push('/assignments')} className="mt-4">Back to Assignments</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => router.back()}
              className="text-muted-foreground hover:text-foreground"
            >
              ← Back
            </Button>
            <Separator orientation="vertical" className="h-4" />
            <span className="text-sm text-muted-foreground">
              Assignment #{params.assignmentId}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-foreground">{assignmentData.title}</h1>
          <p className="text-muted-foreground mt-2 max-w-3xl">{assignmentData.description}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" size="sm">
            <MessageSquare className="h-4 w-4 mr-2" />
            Add Comment
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsAddTaskModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Activity className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Progress</p>
                <p className="text-2xl font-bold">{Math.round(progressPercentage)}%</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{completedTasks}/{totalTasks}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Days Remaining</p>
                <p className="text-2xl font-bold">{getDaysRemaining(assignmentData.endDate)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Team Size</p>
                <p className="text-2xl font-bold">{assignmentData.teamMembers.length}</p>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="risks">Risks & Controls</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Assignment Details */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Assignment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <Badge variant="outline" className="mt-1">{assignmentData.status}</Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Type</p>
                    <p className="mt-1">{assignmentData.requirements.type}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Start Date</p>
                    <p className="mt-1">{formatDate(assignmentData.startDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">End Date</p>
                    <p className="mt-1">{formatDate(assignmentData.endDate)}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Risk Assessment</p>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 border rounded-lg">
                      <p className="text-xs text-muted-foreground">Likelihood</p>
                      <Badge className={`mt-1 ${getRiskColor(assignmentData.requirements.riskLikelihood)}`}>
                        {assignmentData.requirements.riskLikelihood}
                      </Badge>
                    </div>
                    <div className="text-center p-3 border rounded-lg">
                      <p className="text-xs text-muted-foreground">Impact</p>
                      <Badge className={`mt-1 ${getRiskColor(assignmentData.requirements.impact)}`}>
                        {assignmentData.requirements.impact}
                      </Badge>
                    </div>
                    <div className="text-center p-3 border rounded-lg">
                      <p className="text-xs text-muted-foreground">Inherent Risk</p>
                      <Badge className={`mt-1 ${getRiskColor(assignmentData.requirements.inherentRisk)}`}>
                        {assignmentData.requirements.inherentRisk}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Team Members */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Team Members
                </CardTitle>
                <CardDescription>Assigned team for this assignment</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingUsers ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    <span className="text-sm">Loading...</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {assignmentData.teamMembers.map((member) => (
                      <div key={member.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.role}</p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" className="w-full" onClick={() => setIsAddTeamMemberModalOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Member
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Tasks
                  </CardTitle>
                  <CardDescription>Assignment tasks and progress tracking</CardDescription>
                </div>
                <Button onClick={() => setIsAddTaskModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tasks.map((task) => {
                  const assignee = availableUsers.find(u => u.id === task.assigneeId)
                  const isExpanded = expandedTasks.has(task.id)
                  const daysRemaining = task.dueDate ? getDaysRemaining(task.dueDate) : null
                  
                  return (
                    <div key={task.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleTaskExpansion(task.id)}
                              className="h-6 w-6 p-0"
                            >
                              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                            </Button>
                            <p className="font-medium">{task.description}</p>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Assigned to: {assignee?.name || "Unassigned"}</span>
                            {task.dueDate && (
                              <span className="flex items-center gap-1">
                                <CalendarDays className="h-4 w-4" />
                                Due: {formatDate(task.dueDate)}
                                {daysRemaining !== null && (
                                  <span className={`ml-1 ${daysRemaining < 0 ? 'text-red-600' : daysRemaining <= 3 ? 'text-yellow-600' : 'text-green-600'}`}>
                                    ({daysRemaining < 0 ? 'Overdue' : `${daysRemaining} days left`})
                                  </span>
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <select
                            value={task.status}
                            onChange={(e) => handleUpdateTaskStatus(task.id, e.target.value)}
                            className={`px-2 py-1 text-xs rounded border ${getStatusColor(task.status)}`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="Blocked">Blocked</option>
                          </select>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDeleteTask(task.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Subtasks */}
                      {isExpanded && task.subTasks && task.subTasks.length > 0 && (
                        <div className="mt-4 ml-8 space-y-2">
                          {task.subTasks.map((subTask) => {
                            const subAssignee = availableUsers.find(u => u.id === subTask.assigneeId)
                            const subDaysRemaining = subTask.dueDate ? getDaysRemaining(subTask.dueDate) : null
                            
                            return (
                              <div key={subTask.id} className="border-l-2 border-muted pl-4 py-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <p className="text-sm font-medium">{subTask.description}</p>
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                                      <span>Assigned to: {subAssignee?.name || "Unassigned"}</span>
                                      {subTask.dueDate && (
                                        <span className="flex items-center gap-1">
                                          <CalendarDays className="h-3 w-3" />
                                          Due: {formatDate(subTask.dueDate)}
                                          {subDaysRemaining !== null && (
                                            <span className={`ml-1 ${subDaysRemaining < 0 ? 'text-red-600' : subDaysRemaining <= 3 ? 'text-yellow-600' : 'text-green-600'}`}>
                                              ({subDaysRemaining < 0 ? 'Overdue' : `${subDaysRemaining} days left`})
                                            </span>
                                          )}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge className={getStatusColor(subTask.status)} variant="outline">
                                      {subTask.status}
                                    </Badge>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      onClick={() => handleDeleteTask(subTask.id)}
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50 h-6 w-6 p-0"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                                </div>
      )}

      {/* Add Team Member Modal */}
      {isAddTeamMemberModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Add Team Member</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Select User</label>
                <select
                  value={newTeamMemberData.userId}
                  onChange={(e) => setNewTeamMemberData(prev => ({ ...prev, userId: e.target.value }))}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select a user</option>
                  {availableUsers.map(user => (
                    <option key={user.id} value={user.id}>{user.name} ({user.role})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Assignment Role</label>
                <select
                  value={newTeamMemberData.assignmentRole}
                  onChange={(e) => setNewTeamMemberData(prev => ({ ...prev, assignmentRole: e.target.value }))}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="Team Member">Team Member</option>
                  <option value="Lead">Lead</option>
                  <option value="Reviewer">Reviewer</option>
                  <option value="Observer">Observer</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setIsAddTeamMemberModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={async () => {
                  if (newTeamMemberData.userId) {
                    await handleAddTeamMember(newTeamMemberData)
                    setIsAddTeamMemberModalOpen(false)
                    setNewTeamMemberData({
                      userId: "",
                      assignmentRole: "Team Member"
                    })
                  }
                }}
                disabled={!newTeamMemberData.userId}
              >
                Add Member
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
})}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Risks & Controls Tab */}
        <TabsContent value="risks" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Risks & Controls
              </CardTitle>
              <CardDescription>Risk assessment and control effectiveness</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {relatedRisksData.map((riskEntry) => (
                  <div key={riskEntry.risk.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-lg">{riskEntry.risk.title}</h4>
                        <p className="text-muted-foreground mt-1">{riskEntry.risk.description}</p>
                      </div>
                      <Badge className={getRiskColor(riskEntry.risk.inherentRisk)}>
                        {riskEntry.risk.inherentRisk} Risk
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <h5 className="font-medium">Controls</h5>
                      {riskEntry.controls.map((control) => (
                        <div key={control.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{control.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Last assessed: {control.lastAssessed}
                            </p>
                          </div>
                          <Badge 
                            className={
                              control.assessment === "Effective" ? "bg-green-100 text-green-800 border-green-200" :
                              control.assessment === "Needs Improvement" ? "bg-yellow-100 text-yellow-800 border-yellow-200" :
                              "bg-red-100 text-red-800 border-red-200"
                            }
                          >
                            {control.assessment}
                          </Badge>
                        </div>
                      ))}
                    </div>
                    
                    {riskEntry.residualRisk && (
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Residual Risk:</span>
                          <Badge className={getRiskColor(riskEntry.residualRisk)}>
                            {riskEntry.residualRisk}
                          </Badge>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Documents
                  </CardTitle>
                  <CardDescription>Assignment-related documents and files</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Upload Document
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{doc.size}</span>
                          <span>Uploaded: {doc.uploadDate}</span>
                          <span>By: {doc.uploader}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Project Timeline
              </CardTitle>
              <CardDescription>Assignment stages and milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assignmentData.stages.map((stage, index) => (
                  <div key={stage} className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      index < assignmentData.currentStageIndex 
                        ? 'bg-green-100 text-green-800' 
                        : index === assignmentData.currentStageIndex 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {index < assignmentData.currentStageIndex ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${
                        index === assignmentData.currentStageIndex ? 'text-blue-600' : ''
                      }`}>
                        {stage}
                      </p>
                      {index === assignmentData.currentStageIndex && (
                        <p className="text-sm text-muted-foreground">Current Stage</p>
                      )}
                    </div>
                    {index < assignmentData.stages.length - 1 && (
                      <div className="w-px h-8 bg-gray-200 ml-4"></div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Task Modal */}
      {isAddTaskModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Add New Task</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Task Description</label>
                <input
                  type="text"
                  value={newTaskData.description}
                  onChange={(e) => setNewTaskData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter task description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Assignee</label>
                <select
                  value={newTaskData.assigneeId}
                  onChange={(e) => setNewTaskData(prev => ({ ...prev, assigneeId: e.target.value }))}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Unassigned</option>
                  {availableUsers.map(user => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Due Date</label>
                <input
                  type="date"
                  value={newTaskData.dueDate ? newTaskData.dueDate.toISOString().split('T')[0] : ''}
                  onChange={(e) => setNewTaskData(prev => ({ 
                    ...prev, 
                    dueDate: e.target.value ? new Date(e.target.value) : null 
                  }))}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={newTaskData.status}
                  onChange={(e) => setNewTaskData(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Blocked">Blocked</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setIsAddTaskModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={async () => {
                  if (newTaskData.description.trim()) {
                    await handleAddTask(newTaskData)
                    setIsAddTaskModalOpen(false)
                    setNewTaskData({
                      description: "",
                      assigneeId: "",
                      dueDate: null,
                      status: "Pending"
                    })
                  }
                }}
                disabled={!newTaskData.description.trim()}
              >
                Add Task
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Team Member Modal */}
      {isAddTeamMemberModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Add Team Member</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Select User</label>
                <select
                  value={newTeamMemberData.userId}
                  onChange={(e) => setNewTeamMemberData(prev => ({ ...prev, userId: e.target.value }))}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select a user</option>
                  {availableUsers.map(user => (
                    <option key={user.id} value={user.id}>{user.name} ({user.role})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Assignment Role</label>
                <select
                  value={newTeamMemberData.assignmentRole}
                  onChange={(e) => setNewTeamMemberData(prev => ({ ...prev, assignmentRole: e.target.value }))}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="Team Member">Team Member</option>
                  <option value="Lead">Lead</option>
                  <option value="Reviewer">Reviewer</option>
                  <option value="Observer">Observer</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setIsAddTeamMemberModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={async () => {
                  if (newTeamMemberData.userId) {
                    await handleAddTeamMember(newTeamMemberData)
                    setIsAddTeamMemberModalOpen(false)
                    setNewTeamMemberData({
                      userId: "",
                      assignmentRole: "Team Member"
                    })
                  }
                }}
                disabled={!newTeamMemberData.userId}
              >
                Add Member
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
