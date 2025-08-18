"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import RoleBasedLayout from "@/components/auth/role-based-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, FileText, Upload } from "lucide-react"

interface User {
  id: string
  name: string
  role: "auditor" | "business-owner"
  department: string
  email: string
}

export default function EvidenceRequestsPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser')
    if (!currentUser) {
      router.push('/login')
      return
    }

    const userData = JSON.parse(currentUser)
    if (userData.role !== 'business-owner') {
      router.push('/login')
      return
    }

    setUser(userData)
  }, [router])

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <RoleBasedLayout 
      userRole="business-owner" 
      userName={user.name}
      userDepartment={user.department}
    >
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Evidence Requests
          </h1>
          <p className="text-gray-600">
            Submit and track evidence requests from the audit team
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Pending Evidence Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900">IT Controls Documentation</h3>
                  <Badge className="bg-blue-100 text-blue-800">New Request</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Please provide documentation for IT general controls review including access management procedures
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    Due: January 25, 2024
                  </div>
                  <Button size="sm">
                    <Upload className="h-4 w-4 mr-1" />
                    Upload Evidence
                  </Button>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900">Financial Controls Evidence</h3>
                  <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Submit evidence for Q4 financial controls assessment including reconciliation reports
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    Due: January 30, 2024
                  </div>
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                </div>
              </div>

              <Button className="w-full" variant="outline">
                View All Evidence Requests
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </RoleBasedLayout>
  )
} 