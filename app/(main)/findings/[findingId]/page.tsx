"use client"

import React, { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Edit, Eye, FileText, Calendar, User, AlertTriangle, CheckCircle, Clock } from "lucide-react"
import Link from "next/link"

interface Finding {
  id: string
  title: string
  description: string
  assignment_id: string
  assignment_title: string
  status: string
  severity: string
  business_owner: string
  created_date: string
  updated_date: string
  auditor_in_charge: string
  risk_level: string
  impact: string
  recommendations: string
}

export default function FindingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const findingId = params.findingId as string

  const [finding, setFinding] = useState<Finding | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
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
        setFinding(data)
      } catch (error) {
        console.error('Error loading finding:', error)
        setError('Failed to load finding details')
      } finally {
        setIsLoading(false)
      }
    }

    if (findingId) {
      fetchFinding()
    }
  }, [findingId])

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
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-semibold text-foreground">Finding Details</h1>
            <p className="text-muted-foreground">ID: {finding.id}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href={`/findings/${findingId}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Finding
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column - Main Details */}
        <div className="md:col-span-2 space-y-6">
          {/* Finding Title and Description */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {finding.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{finding.description}</p>
              
              {finding.recommendations && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Recommendations</h4>
                  <p className="text-sm text-muted-foreground">{finding.recommendations}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Assignment and Status */}
          <Card>
            <CardHeader>
              <CardTitle>Assignment & Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Assignment</label>
                  <p className="text-sm">{finding.assignment_title}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusIcon(finding.status)}
                                         <Badge variant="outline">{finding.status || 'Unknown'}</Badge>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Severity</label>
                                       <Badge className={`mt-1 ${getSeverityColor(finding.severity)}`}>
                       {finding.severity || 'Unknown'}
                     </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Risk Level</label>
                  <p className="text-sm">{finding.risk_level || 'Not specified'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
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
                  <p className="text-sm font-medium">Business Owner</p>
                  <p className="text-sm text-muted-foreground">{finding.business_owner}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Auditor in Charge</p>
                  <p className="text-sm text-muted-foreground">{finding.auditor_in_charge || 'Not assigned'}</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Created</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(finding.created_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Last Updated</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(finding.updated_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Impact Assessment */}
          {finding.impact && (
            <Card>
              <CardHeader>
                <CardTitle>Impact Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{finding.impact}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
