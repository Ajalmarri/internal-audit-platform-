"use client"

import React, { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Edit, Calendar, User, Target, AlertTriangle, CheckCircle, Clock, Rocket, Eye } from "lucide-react"
import Link from "next/link"

interface ActionPlan {
  id: string
  description: string
  responsible_id: string
  due_date: string
  status_id: number
  finding_id: string
  finding_title: string
  finding_description: string
  objective: string
  priority_id: number
  effort: string
  created_date: string
  is_approved: boolean
  comment: string
  criteria: string
}

export default function ActionPlanDetailPage() {
  const params = useParams()
  const router = useRouter()
  const planId = params.planId as string

  const [actionPlan, setActionPlan] = useState<ActionPlan | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchActionPlan = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/action-plans/${planId}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            setError("Action Plan not found")
          } else {
            throw new Error(`HTTP ${response.status}`)
          }
          return
        }
        
        const data = await response.json()
        setActionPlan(data)
      } catch (error) {
        console.error('Error loading action plan:', error)
        setError('Failed to load action plan details')
      } finally {
        setIsLoading(false)
      }
    }

    if (planId) {
      fetchActionPlan()
    }
  }, [planId])

  const getStatusIcon = (isApproved: boolean) => {
    if (isApproved) {
      return <CheckCircle className="h-4 w-4 text-green-500" />
    }
    return <Clock className="h-4 w-4 text-yellow-500" />
  }

  const getPriorityColor = (priorityId: number) => {
    switch (priorityId) {
      case 1:
        return 'bg-red-500 hover:bg-red-600 text-white'
      case 2:
        return 'bg-orange-500 hover:bg-orange-600 text-white'
      case 3:
        return 'bg-yellow-500 hover:bg-yellow-600 text-black'
      case 4:
        return 'bg-blue-500 hover:bg-blue-600 text-white'
      case 5:
        return 'bg-green-500 hover:bg-green-600 text-white'
      default:
        return 'bg-gray-500 hover:bg-gray-600 text-white'
    }
  }

  const getEffortColor = (effort: string) => {
    switch (effort?.toLowerCase()) {
      case 'high':
        return 'bg-red-500 hover:bg-red-600 text-white'
      case 'medium':
        return 'bg-yellow-500 hover:bg-yellow-600 text-black'
      case 'low':
        return 'bg-green-500 hover:bg-green-600 text-white'
      default:
        return 'bg-gray-500 hover:bg-gray-600 text-white'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Loading action plan details...</span>
      </div>
    )
  }

  if (error || !actionPlan) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Action Plan Not Found</h2>
          <p className="text-gray-600 mb-4">
            {error || "The action plan you're looking for doesn't exist or has been removed."}
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
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-semibold text-foreground">Action Plan Details</h1>
            <p className="text-muted-foreground">ID: {actionPlan.id}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href={`/action-plans/${planId}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Plan
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column - Main Details */}
        <div className="md:col-span-2 space-y-6">
          {/* Action Plan Description */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Action Plan Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{actionPlan.description}</p>
              
              {actionPlan.objective && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Objective</h4>
                  <p className="text-sm text-muted-foreground">{actionPlan.objective}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Status and Priority */}
          <Card>
            <CardHeader>
              <CardTitle>Status & Priority</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusIcon(actionPlan.is_approved)}
                    <Badge variant="outline">
                      {actionPlan.is_approved ? 'Approved' : 'Pending Approval'}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Priority</label>
                  <Badge className={`mt-1 ${getPriorityColor(actionPlan.priority_id)}`}>
                    Priority {actionPlan.priority_id}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Effort</label>
                  <Badge className={`mt-1 ${getEffortColor(actionPlan.effort)}`}>
                    {actionPlan.effort || 'Not specified'}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Finding ID</label>
                  <p className="text-sm">{actionPlan.finding_id}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Related Finding */}
          {actionPlan.finding_title && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Related Finding
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Finding Title</label>
                  <p className="text-sm font-medium">{actionPlan.finding_title}</p>
                </div>
                
                {actionPlan.finding_description && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Finding Description</label>
                    <p className="text-sm text-muted-foreground">{actionPlan.finding_description}</p>
                  </div>
                )}
                
                <div className="pt-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/findings/${actionPlan.finding_id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Finding Details
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Criteria and Comments */}
          {(actionPlan.criteria || actionPlan.comment) && (
            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {actionPlan.criteria && (
                  <div>
                    <h4 className="font-semibold mb-2">Criteria</h4>
                    <p className="text-sm text-muted-foreground">{actionPlan.criteria}</p>
                  </div>
                )}
                
                {actionPlan.comment && (
                  <div>
                    <h4 className="font-semibold mb-2">Comments</h4>
                    <p className="text-sm text-muted-foreground">{actionPlan.comment}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Metadata */}
        <div className="space-y-6">
          {/* Key Information */}
          <Card>
            <CardHeader>
              <CardTitle>Key Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Responsible Person</p>
                  <p className="text-sm text-muted-foreground">ID: {actionPlan.responsible_id}</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Due Date</p>
                  <p className="text-sm text-muted-foreground">
                    {actionPlan.due_date ? new Date(actionPlan.due_date).toLocaleDateString() : 'Not specified'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Created</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(actionPlan.created_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress Tracking */}
          <Card>
            <CardHeader>
              <CardTitle>Progress Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Status</span>
                  <span className="font-medium">
                    {actionPlan.is_approved ? 'In Progress' : 'Not Started'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      actionPlan.is_approved ? 'bg-blue-500' : 'bg-gray-400'
                    }`}
                    style={{ width: actionPlan.is_approved ? '25%' : '0%' }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  {actionPlan.is_approved ? '25% Complete' : '0% Complete'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
