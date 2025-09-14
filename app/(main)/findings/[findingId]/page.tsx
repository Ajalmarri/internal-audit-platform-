"use client"

import React, { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ArrowLeft, 
  Edit, 
  Eye, 
  FileText, 
  Calendar, 
  User, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Shield,
  Target,
  TrendingUp,
  MessageSquare,
  Paperclip,
  Flag,
  Activity,
  BarChart3,
  Users,
  MapPin,
  Tag,
  ExternalLink
} from "lucide-react"
import Link from "next/link"
import { EvidencePanel } from "./evidence/EvidencePanel"

interface Finding {
  id: string
  title: string
  description: string
  assignment_id: string
  engagement_id?: string
  assignment_title?: string
  status: string
  severity: string
  business_owner: string
  business_owner_name?: string
  business_unit?: string
  created_date: string
  updated_date: string
  auditor_in_charge: string
  criteria?: string
  impact: string
  recommendations: string
  cause?: string
  effect?: string
  responsible_business_owner?: string
  attachment_file_name?: string
  attachment_file_type?: string
  attachment_file_size?: number
  management_response?: number
}

interface ActionItem {
  id: string
  description: string
  responsible: string
  dueDate: string
  status: string
  progress: number
}



interface TimelineEvent {
  id: string
  event: string
  user: string
  timestamp: string
  details?: string
}

export default function FindingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const findingId = params.findingId as string

  const [finding, setFinding] = useState<Finding | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data for enhanced sections
  const [actionItems] = useState<ActionItem[]>([
    {
      id: "1",
      description: "Review and update IT security policy",
      responsible: "IT Security Team",
      dueDate: "2025-09-30",
      status: "In Progress",
      progress: 60
    },
    {
      id: "2",
      description: "Conduct staff training on policy compliance",
      responsible: "HR Department",
      dueDate: "2025-10-15",
      status: "Not Started",
      progress: 0
    }
  ])



  const [timelineEvents] = useState<TimelineEvent[]>([
    {
      id: "1",
      event: "Finding Created",
      user: "John Auditor",
      timestamp: "2025-08-23 10:30 AM",
      details: "Initial finding documented based on audit observations"
    },
    {
      id: "2",
      event: "Status Updated",
      user: "Sarah Manager",
      timestamp: "2025-08-23 2:15 PM",
      details: "Status changed to 'Pending Verification'"
    },
    {
      id: "3",
      event: "Evidence Added",
      user: "John Auditor",
      timestamp: "2025-08-23 3:45 PM",
      details: "Policy violation report uploaded"
    }
  ])

  const fetchFinding = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/findings/${findingId}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          setError("Finding not found")
        } else {
          throw new Error(`HTTP ${response.status}`)
        }
        return
      }
      
      const data = await response.json()
      console.log('Finding data loaded:', data)
      console.log('Finding engagement_id:', data.engagement_id)
      setFinding(data)
    } catch (error) {
      console.error('Error loading finding:', error)
      setError('Failed to load finding details')
    } finally {
      setIsLoading(false)
    }
  }



  useEffect(() => {
    if (findingId) {
      fetchFinding()
    }
  }, [findingId])

  // Evidence is now handled by the EvidencePanel component

  const getStatusIcon = (status: string | undefined) => {
    if (!status) return <Clock className="h-4 w-4 text-gray-500" />
    
    switch (status.toLowerCase()) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'draft':
        return <FileText className="h-4 w-4 text-gray-500" />
      case 'pending verification':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'action plan submitted':
        return <AlertTriangle className="h-4 w-4 text-blue-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getSeverityColor = (severity: string | undefined) => {
    if (!severity) return 'bg-gray-500 hover:bg-gray-600 text-white'
    
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'bg-red-500 hover:bg-red-600 text-white'
      case 'high':
        return 'bg-orange-500 hover:bg-orange-600 text-white'
      case 'medium':
        return 'bg-yellow-500 hover:bg-yellow-600 text-black'
      case 'low':
        return 'bg-green-500 hover:bg-green-600 text-white'
      default:
        return 'bg-gray-500 hover:bg-gray-600 text-white'
    }
  }

  const getActionItemStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'in progress':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'not started':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }





  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Loading finding details...</span>
      </div>
    )
  }

  if (error || !finding) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Finding Not Found</h2>
          <p className="text-gray-600 mb-4">
            {error || "The finding you're looking for doesn't exist or has been removed."}
          </p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
                      <div>
              <h1 className="text-3xl font-bold text-foreground">{finding.title}</h1>
              <div className="flex items-center gap-4 mt-2">
                <Badge variant="outline" className="text-sm">ID: {finding.id}</Badge>
                <Badge className={getSeverityColor(finding.severity)}>
                  {finding.severity || 'Unknown'} Severity
                </Badge>
                <div className="flex items-center gap-2">
                  {getStatusIcon(finding.status)}
                  <Badge variant="outline">{finding.status || 'Unknown'}</Badge>
                </div>
              </div>
            </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <MessageSquare className="mr-2 h-4 w-4" />
            Add Comment
          </Button>
          <Button asChild>
            <Link href={`/findings/${findingId}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Finding
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Content with Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Detailed Analysis</TabsTrigger>
          <TabsTrigger value="actions">Action Items</TabsTrigger>
          <TabsTrigger value="evidence">Evidence</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left Column - Main Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Finding Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    Finding Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-muted-foreground leading-relaxed">
                      {finding.description || 'No description provided'}
                    </p>
                  </div>
                  
                  {finding.recommendations && (
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Recommendations
                      </h4>
                      <p className="text-blue-800">{finding.recommendations}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Assignment and Context */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-500" />
                    Assignment & Context
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Parent Assignment</label>
                      <div className="mt-1">
                        {finding.assignment_title ? (
                          <Link 
                            href={`/assignments/${finding.assignment_id}`}
                            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                          >
                            {finding.assignment_title}
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        ) : (
                          <span className="text-gray-500">Not assigned</span>
                        )}
                      </div>
                    </div>
                                      <div>
                    <label className="text-sm font-medium text-muted-foreground">Risk Level</label>
                    <p className="text-sm mt-1">{finding.criteria || 'Not specified'}</p>
                  </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Key Information */}
            <div className="space-y-6">
              {/* Key Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-purple-500" />
                    Key Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Business Owner</p>
                      <p className="text-sm text-muted-foreground">{finding.business_owner_name || finding.business_owner || 'Not assigned'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Business Unit</p>
                      <p className="text-sm text-muted-foreground">{finding.business_unit || 'Not assigned'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Auditor in Charge</p>
                      <p className="text-sm text-muted-foreground">
                        {finding.auditor_in_charge ? `User ${finding.auditor_in_charge}` : 'Not assigned'}
                      </p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Created</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(finding.created_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Last Updated</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(finding.updated_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Impact Assessment */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-red-500" />
                    Impact Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {finding.impact || 'The potential impact of this observation needs to be assessed.'}
                  </p>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-green-500" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Flag className="mr-2 h-4 w-4" />
                    Flag for Review
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Paperclip className="mr-2 h-4 w-4" />
                    Add Evidence
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Target className="mr-2 h-4 w-4" />
                    Create Action Plan
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Detailed Analysis Tab */}
        <TabsContent value="details" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-blue-500" />
                    Condition
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {finding.description || 'No specific condition documented'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-500" />
                    Criteria
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {finding.criteria || 'No specific criteria documented'}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    Root Cause
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {finding.cause || 'Root cause analysis pending'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-red-500" />
                    Effect
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {finding.effect || finding.impact || 'Effects not yet assessed'}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Action Items Tab */}
        <TabsContent value="actions" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  Action Items
                </CardTitle>
                <Button size="sm">
                  <Target className="mr-2 h-4 w-4" />
                  Add Action Item
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {actionItems.length > 0 ? (
                <div className="space-y-4">
                  {actionItems.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium">{item.description}</h4>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {item.responsible}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Due: {new Date(item.dueDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <Badge className={getActionItemStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                      </div>
                      
                      {item.status === 'In Progress' && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>{item.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${item.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No action items created yet</p>
                  <Button variant="outline" size="sm" className="mt-3">
                    Create First Action Item
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Evidence Tab */}
        <TabsContent value="evidence" className="space-y-6">
          <EvidencePanel findingId={findingId} />
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-500" />
                Activity Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {timelineEvents.map((event, index) => (
                  <div key={event.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      {index < timelineEvents.length - 1 && (
                        <div className="w-0.5 h-8 bg-gray-200 mt-2"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{event.event}</span>
                        <Badge variant="outline" className="text-xs">
                          {event.user}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {new Date(event.timestamp).toLocaleString()}
                      </p>
                      {event.details && (
                        <p className="text-sm text-muted-foreground">{event.details}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
