"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link" // Import Link

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import {
  ArrowLeft,
  Edit,
  MoreVertical,
  AlertOctagon,
  Clock,
  Target,
  User,
  Calendar,
  FileText,
  Briefcase,
  Search,
  Paperclip,
  ChevronRight,
  Archive,
  LayoutDashboard,
  AlertTriangle,
  PlusCircle,
} from "lucide-react"

// --- Enhanced Mock Data and Types ---




interface EngagementData {
  id: string
  title: string
  status: string
  healthMetrics: {
    progress: number
    openHighRiskFindings: number
    overdueTasks: number
    findingsBySeverity: {
      High: number
      Medium: number
      Low: number
      Critical: number
    }
  }
  details: {
    primaryStakeholder: string
    engagementManager: string
    startDate: string
    endDate: string
    objective: string
  }
  // Real data from API
  assignments: Array<{
    id: string
    title: string
    status: string
    dueDate: string | null
    priority: string
  }>
  findings: Array<{
    id: string
    title: string
    severity: string
    status: string
    date: string | null
  }>
  evidence: Array<{
    id: string
    title: string
    type: string
    date: string | null
    status: string
  }>
  actionPlans: Array<{
    id: string
    description: string
    status: string
    dueDate: string | null
    findingId: string
    findingTitle: string
    businessOwnerName: string
    priorityName: string
    statusName: string
  }>
}

// Mock data removed - now using real data from database

export default function EngagementDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const engagementId = params.engagementId as string // This is the main engagement ID from the URL

  const [engagement, setEngagement] = useState<EngagementData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    if (engagementId) {
      setIsLoading(true)
      // Fetch real engagement data from the database
      const fetchEngagement = async () => {
        try {
          const response = await fetch(`/api/engagements/${engagementId}`)
          if (!response.ok) {
            if (response.status === 404) {
              setEngagement(null)
              return
            }
            throw new Error('Failed to fetch engagement')
          }
          
          const foundEngagement = await response.json()
          
          if (foundEngagement) {
            // Calculate real metrics from the data
            const highRiskFindings = foundEngagement.findings?.filter((f: any) => f.severity === 'High')?.length || 0
            const overdueTasks = foundEngagement.assignments?.filter((a: any) => {
              if (!a.dueDate) return false
              return new Date(a.dueDate) < new Date()
            })?.length || 0
            
            // Calculate dynamic progress based on assignments and action plans
            const totalAssignments = foundEngagement.assignments?.length || 0
            const completedAssignments = foundEngagement.assignments?.filter((a: any) => a.status === 'Completed')?.length || 0
            const totalActionPlans = foundEngagement.actionPlans?.length || 0
            const completedActionPlans = foundEngagement.actionPlans?.filter((ap: any) => ap.status === 'Completed')?.length || 0
            
            let progress = 0
            if (totalAssignments > 0 || totalActionPlans > 0) {
              const assignmentProgress = totalAssignments > 0 ? (completedAssignments / totalAssignments) * 100 : 0
              const actionPlanProgress = totalActionPlans > 0 ? (completedActionPlans / totalActionPlans) * 100 : 0
              progress = Math.round((assignmentProgress + actionPlanProgress) / 2)
            }
            
            // Transform the real data to match our interface
            const transformedEngagement: EngagementData = {
              id: foundEngagement.id,
              title: foundEngagement.title,
              status: foundEngagement.status,
              healthMetrics: {
                progress: progress,
                openHighRiskFindings: highRiskFindings,
                overdueTasks: overdueTasks,
                findingsBySeverity: {
                  High: foundEngagement.findings?.filter((f: any) => f.severity === 'High')?.length || 0,
                  Medium: foundEngagement.findings?.filter((f: any) => f.severity === 'Medium')?.length || 0,
                  Low: foundEngagement.findings?.filter((f: any) => f.severity === 'Low')?.length || 0,
                  Critical: foundEngagement.findings?.filter((f: any) => f.severity === 'Critical')?.length || 0,
                },
              },
              details: {
                primaryStakeholder: foundEngagement.stakeholder,
                engagementManager: foundEngagement.manager,
                startDate: foundEngagement.startDate,
                endDate: foundEngagement.endDate,
                objective: foundEngagement.objective || "No objective set",
              },
              // Use real data from API
              assignments: foundEngagement.assignments || [],
              findings: foundEngagement.findings || [],
              evidence: foundEngagement.evidence || [],
              actionPlans: foundEngagement.actionPlans || [],
            }
            setEngagement(transformedEngagement)
          } else {
            setEngagement(null)
          }
        } catch (error) {
          console.error('Error fetching engagement:', error)
          setEngagement(null)
        } finally {
          setIsLoading(false)
        }
      }
      
      fetchEngagement()
    }
  }, [engagementId])

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (engagementId) {
      const interval = setInterval(() => {
        if (engagement) {
          handleRefresh()
        }
      }, 30000) // 30 seconds

      return () => clearInterval(interval)
    }
  }, [engagementId, engagement])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-muted-foreground">Loading engagement details...</p>
      </div>
    )
  }

  if (!engagement) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4 text-center">
        <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
        <h1 className="text-2xl font-semibold mb-2">Engagement Not Found</h1>
        <p className="text-muted-foreground mb-6">
          Sorry, we couldn't find an engagement with ID: <strong>{engagementId}</strong>.
        </p>
        <Button asChild variant="outline">
          <Link href="/engagements">
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Engagements
          </Link>
        </Button>
      </div>
    )
  }

  const getStatusBadgeColor = (status: EngagementData["status"]) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "In Progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "Planning":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "In Review":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "On Hold":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const healthMetricsDisplay = [
    {
      value: `${engagement.healthMetrics.findingsBySeverity.Critical + engagement.healthMetrics.findingsBySeverity.High}`,
      label: "Critical & High Risk",
      icon: AlertOctagon,
      variant: (engagement.healthMetrics.findingsBySeverity.Critical + engagement.healthMetrics.findingsBySeverity.High) > 0 ? "critical" : "default",
    },
    {
      value: `${engagement.healthMetrics.findingsBySeverity.Medium}`,
      label: "Medium Risk",
      icon: AlertTriangle,
      variant: engagement.healthMetrics.findingsBySeverity.Medium > 0 ? "warning" : "default",
    },
    {
      value: `${engagement.healthMetrics.findingsBySeverity.Low}`,
      label: "Low Risk",
      icon: Clock,
      variant: "default",
    },
    {
      value: `${engagement.healthMetrics.overdueTasks}`,
      label: "Overdue Tasks",
      icon: Clock,
      variant: engagement.healthMetrics.overdueTasks > 0 ? "warning" : "default",
    },
  ]

  const handleEditEngagement = () => {
    router.push(`/engagements/${engagement.id}/edit`)
  }

  const handleRefresh = async () => {
    if (engagementId) {
      setIsRefreshing(true)
      try {
                    const response = await fetch(`/api/engagements/${engagementId}`)
            if (response.ok) {
              const foundEngagement = await response.json()
              
              if (foundEngagement) {
                // Calculate real metrics from the data
                const highRiskFindings = foundEngagement.findings?.filter((f: any) => f.severity === 'High')?.length || 0
                const overdueTasks = foundEngagement.assignments?.filter((a: any) => {
                  if (!a.dueDate) return false
                  return new Date(a.dueDate) < new Date()
                })?.length || 0
                
                // Calculate dynamic progress based on assignments and action plans
                const totalAssignments = foundEngagement.assignments?.length || 0
                const completedAssignments = foundEngagement.assignments?.filter((a: any) => a.status === 'Completed')?.length || 0
                const totalActionPlans = foundEngagement.actionPlans?.length || 0
                const completedActionPlans = foundEngagement.actionPlans?.filter((ap: any) => ap.status === 'Completed')?.length || 0
                
                let progress = 0
                if (totalAssignments > 0 || totalActionPlans > 0) {
                  const assignmentProgress = totalAssignments > 0 ? (completedAssignments / totalAssignments) * 100 : 0
                  const actionPlanProgress = totalActionPlans > 0 ? (completedActionPlans / totalActionPlans) * 100 : 0
                  progress = Math.round((assignmentProgress + actionPlanProgress) / 2)
                }
                
                // Transform the real data to match our interface
                const transformedEngagement: EngagementData = {
                  id: foundEngagement.id,
                  title: foundEngagement.title,
                  status: foundEngagement.status,
                  healthMetrics: {
                    progress: progress,
                openHighRiskFindings: highRiskFindings,
                overdueTasks: overdueTasks,
                findingsBySeverity: {
                  High: foundEngagement.findings?.filter((f: any) => f.severity === 'High')?.length || 0,
                  Medium: foundEngagement.findings?.filter((f: any) => f.severity === 'Medium')?.length || 0,
                  Low: foundEngagement.findings?.filter((f: any) => f.severity === 'Low')?.length || 0,
                  Critical: foundEngagement.findings?.filter((f: any) => f.severity === 'Critical')?.length || 0,
                },
              },
              details: {
                primaryStakeholder: foundEngagement.stakeholder,
                engagementManager: foundEngagement.manager,
                startDate: foundEngagement.startDate,
                endDate: foundEngagement.endDate,
                objective: foundEngagement.objective || "No objective set",
              },
              // Use real data from API
              assignments: foundEngagement.assignments || [],
              findings: foundEngagement.findings || [],
              evidence: foundEngagement.evidence || [],
              actionPlans: foundEngagement.actionPlans || [],
            }
            setEngagement(transformedEngagement)
          }
        }
      } catch (error) {
        console.error('Error refreshing engagement:', error)
      } finally {
        setIsRefreshing(false)
      }
    }
  }

  const handleUnlinkAssignment = async (assignmentId: number) => {
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
        
        // Refresh the engagement data to update the UI
        handleRefresh()
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
    }
  }



  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" asChild>
            <Link href="/engagements">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to Engagements</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{engagement.title}</h1>
            <Badge variant="outline" className={`mt-1 ${getStatusBadgeColor(engagement.status)}`}>
              {engagement.status}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
            ) : (
              <div className="mr-2 h-4 w-4" />
            )}
            Refresh
          </Button>
          <Button variant="outline" onClick={handleEditEngagement}>
            <Edit className="mr-2 h-4 w-4" /> Edit Engagement
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => alert("View Full Dashboard (Conceptual)")}>
                <LayoutDashboard className="mr-2 h-4 w-4" /> View Full Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => alert("Generate Report action")}>
                <FileText className="mr-2 h-4 w-4" /> Generate Report
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 hover:!text-red-600 focus:!text-red-600"
                onClick={() => confirm("Are you sure you want to archive this engagement?") && alert("Archive action")}
              >
                <Archive className="mr-2 h-4 w-4" /> Archive Engagement
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Engagement Health Dashboard Section */}
      <Card>
        <CardHeader>
          <CardTitle>Engagement Health</CardTitle>
          <CardDescription>At-a-glance overview of key performance indicators.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-muted-foreground">Overall Progress</span>
              <span className="text-sm font-semibold">{engagement.healthMetrics.progress}%</span>
            </div>
            <Progress value={engagement.healthMetrics.progress} className="h-3" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 pt-4">
            {healthMetricsDisplay.map((metric) => (
              <Card
                key={metric.label}
                className={
                  metric.variant === "critical"
                    ? "border-red-500 bg-red-50 dark:bg-red-900/30"
                    : metric.variant === "warning"
                      ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/30"
                      : ""
                }
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <metric.icon
                    className={`h-6 w-6 ${
                      metric.variant === "critical"
                        ? "text-red-600"
                        : metric.variant === "warning"
                          ? "text-yellow-600"
                          : "text-primary"
                    }`}
                  />
                  <div>
                    <p className="text-2xl font-bold">{metric.value}</p>
                    <p className="text-xs text-muted-foreground">{metric.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}

          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid (Details & Linked Items) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Engagement Details Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Engagement Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-start">
              <User className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground flex-shrink-0" />
              <div>
                <span className="font-medium">Primary Stakeholder:</span>
                <p className="text-muted-foreground">{engagement.details.primaryStakeholder}</p>
              </div>
            </div>
            <div className="flex items-start">
              <Briefcase className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground flex-shrink-0" />
              <div>
                <span className="font-medium">Engagement Manager:</span>
                <p className="text-muted-foreground">{engagement.details.engagementManager}</p>
              </div>
            </div>
            <div className="flex items-start">
              <Calendar className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground flex-shrink-0" />
              <div>
                <span className="font-medium">Dates:</span>
                <p className="text-muted-foreground">
                  Start: {new Date(engagement.details.startDate).toLocaleDateString()} <br />
                  End: {new Date(engagement.details.endDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <Target className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground flex-shrink-0" />
              <div>
                <span className="font-medium">Objective:</span>
                <p className="text-muted-foreground leading-relaxed">{engagement.details.objective}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Linked Items Tabs */}
        <Card className="lg:col-span-2">
          <Tabs defaultValue="assignments" className="h-full flex flex-col">
            <CardHeader className="pb-0">
              <div className="flex justify-between items-center">
                <CardTitle>Linked Items</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <Link href={`/engagements/${engagementId}/assignments/new`}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      New Assignment
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <Link href={`/engagements/${engagementId}/findings/new`}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      New Finding
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <Link href="/action-plans/new">
                      <Target className="mr-2 h-4 w-4" />
                      New Action Plan
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <Link href={`/engagements/${engagementId}/evidence/new`}>
                      <Paperclip className="mr-2 h-4 w-4" />
                      Upload Evidence
                    </Link>
                  </Button>
                </div>
              </div>
              <TabsList className="grid w-full grid-cols-4 mt-2">
                <TabsTrigger value="assignments">Assignments ({engagement.assignments.length})</TabsTrigger>
                <TabsTrigger value="findings">Findings ({engagement.findings.length})</TabsTrigger>
                <TabsTrigger value="action-plans">Action Plans ({engagement.actionPlans.length})</TabsTrigger>
                <TabsTrigger value="evidence">Evidence ({engagement.evidence.length})</TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent className="pt-0 flex-grow">
              <TabsContent value="assignments" className="mt-4 space-y-2">
                {engagement.assignments.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Briefcase className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <Link 
                          href={`/engagements/${engagementId}/assignments/${item.id}`}
                          className="block hover:text-primary transition-colors"
                        >
                          <p className="font-medium cursor-pointer">{item.title}</p>
                        </Link>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={
                            item.status === 'Completed' ? 'default' :
                            item.status === 'In Progress' ? 'secondary' :
                            'outline'
                          }>
                            {item.status}
                          </Badge>
                          {item.dueDate && (
                            <Badge variant={
                              new Date(item.dueDate) < new Date() ? 'destructive' : 'secondary'
                            }>
                              {new Date(item.dueDate) < new Date() ? 'Overdue' : `Due: ${new Date(item.dueDate).toLocaleDateString()}`}
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {item.priority}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUnlinkAssignment(parseInt(item.id))}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Unlink
                      </Button>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                ))}
                {engagement.assignments.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Briefcase className="h-8 w-8 mx-auto mb-2" />
                    <p>No assignments linked yet.</p>
                    <p className="text-xs mt-1">Click "New Assignment" to get started</p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="findings" className="mt-4 space-y-2">
                {engagement.findings.map((item) => (
                  <Link 
                    key={item.id} 
                    href={`/findings/${item.id}`}
                    className="block transition-all duration-200 hover:bg-muted/50 hover:shadow-sm"
                  >
                    <div className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:border-primary/50 group">
                      <div className="flex items-center gap-3">
                        <AlertOctagon className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-foreground group-hover:text-primary transition-colors">{item.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={
                              item.severity === 'High' ? 'destructive' :
                              item.severity === 'Medium' ? 'secondary' :
                              'outline'
                            }>
                              {item.severity}
                            </Badge>
                            <Badge variant={
                              item.status === 'Open' ? 'destructive' :
                              item.status === 'In Progress' ? 'secondary' :
                              'default'
                            }>
                              {item.status}
                            </Badge>
                            {item.date && (
                              <span className="text-xs text-muted-foreground">
                                {new Date(item.date).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                          <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <span className="text-xs text-primary font-medium">Click to view details →</span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </Link>
                ))}
                {engagement.findings.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <AlertOctagon className="h-8 w-8 mx-auto mb-2" />
                    <p>No findings created yet.</p>
                    <p className="text-xs mt-1">Click "New Finding" to document audit discoveries</p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="action-plans" className="mt-4 space-y-2">
                {engagement.actionPlans.map((item) => (
                  <Link 
                    key={item.id} 
                    href={`/action-plans/${item.id}`}
                    className="block transition-all duration-200 hover:bg-muted/50 hover:shadow-sm"
                  >
                    <div className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:border-primary/50 group">
                      <div className="flex items-center gap-3">
                        <Target className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-foreground group-hover:text-primary transition-colors">{item.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {item.findingTitle}
                            </Badge>
                            <Badge variant={
                              item.statusName === 'Completed' ? 'default' :
                              item.statusName === 'In Progress' ? 'secondary' :
                              item.statusName === 'Submitted' ? 'outline' :
                              'destructive'
                            }>
                              {item.statusName}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {item.priorityName}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {item.businessOwnerName}
                            </Badge>
                            {item.dueDate && (
                              <Badge variant={
                                new Date(item.dueDate) < new Date() ? 'destructive' : 'secondary'
                              }>
                                {new Date(item.dueDate) < new Date() ? 'Overdue' : `Due: ${new Date(item.dueDate).toLocaleDateString()}`}
                              </Badge>
                            )}
                          </div>
                          <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <span className="text-xs text-primary font-medium">Click to view details →</span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </Link>
                ))}
                {engagement.actionPlans.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Target className="h-8 w-8 mx-auto mb-2" />
                    <p>No action plans created yet.</p>
                    <p className="text-xs mt-1">Action plans will appear here when created for findings</p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="evidence" className="mt-4 space-y-2">
                {engagement.evidence.map((item) => (
                  <Link 
                    key={item.id} 
                    href={`/engagements/${engagementId}/evidence/${item.id}`}
                    className="block transition-all duration-200 hover:bg-muted/50 hover:shadow-sm"
                  >
                    <div className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:border-primary/50 group">
                      <div className="flex items-center gap-3">
                        <Paperclip className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-foreground group-hover:text-primary transition-colors">{item.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">
                              {item.type}
                            </Badge>
                            <Badge variant={
                              item.status === 'Approved' ? 'default' :
                              item.status === 'Pending Review' ? 'secondary' :
                              'outline'
                            }>
                              {item.status}
                            </Badge>
                            {item.date && (
                              <span className="text-xs text-muted-foreground">
                                {new Date(item.date).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                          <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <span className="text-xs text-primary font-medium">Click to view details →</span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </Link>
                ))}
                {engagement.evidence.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Paperclip className="h-8 w-8 mx-auto mb-2" />
                    <p>No evidence uploaded yet.</p>
                    <p className="text-xs mt-1">Click "Upload Evidence" to attach supporting documents</p>
                  </div>
                )}
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>


      </div>
    </div>
  )
}
