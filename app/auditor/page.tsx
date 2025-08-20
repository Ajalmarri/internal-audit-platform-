"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import RoleBasedLayout from "@/components/auth/role-based-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  CheckSquare, 
  Clock, 
  FileText,
  Users,
  Shield,
  TrendingUp,
  Settings,
  Download,
  AlertTriangle,
  CheckCircle2,
  XCircleIcon,
  BarChart3,
  Calendar,
  Activity
} from "lucide-react"

interface User {
  id: string
  name: string
  role: "auditor" | "business-owner"
  department: string
  email: string
}

export default function AuditorDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Check if user is authenticated
    const currentUser = localStorage.getItem('currentUser')
    if (!currentUser) {
      router.push('/login')
      return
    }

    const userData = JSON.parse(currentUser)
    if (userData.role !== 'auditor') {
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
      userRole="auditor" 
      userName={user.name}
      userDepartment={user.department}
    >
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name}
          </h1>
          <p className="text-gray-600">
            {user.department} • Last login: Today at 9:30 AM
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Assignments Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckSquare className="h-5 w-5 mr-2" />
                Active Assignments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900">Q1 Financial Controls Review</h3>
                    <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Review internal controls for Q1 financial reporting
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      Due: January 31, 2024
                    </div>
                    <Progress value={65} className="w-20 h-2" />
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900">IT General Controls Assessment</h3>
                    <Badge className="bg-yellow-100 text-yellow-800">Planning</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Assess IT general controls across the organization
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      Due: February 15, 2024
                    </div>
                    <Progress value={25} className="w-20 h-2" />
                  </div>
                </div>

                <Button className="w-full" variant="outline">
                  View All Assignments
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Audit Statistics Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Audit Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">12</div>
                    <div className="text-sm text-green-600">Completed</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">8</div>
                    <div className="text-sm text-blue-600">In Progress</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">5</div>
                    <div className="text-sm text-yellow-600">Planning</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">3</div>
                    <div className="text-sm text-red-600">Overdue</div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button className="w-full" variant="outline">
                    View Detailed Reports
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button className="h-20 flex flex-col items-center justify-center space-y-2" variant="outline">
                <FileText className="h-6 w-6" />
                <span className="text-sm">New Assignment</span>
              </Button>
              
              <Button className="h-20 flex flex-col items-center justify-center space-y-2" variant="outline">
                <Download className="h-6 w-6" />
                <span className="text-sm">Download Reports</span>
              </Button>
              
              <Button className="h-20 flex flex-col items-center justify-center space-y-2" variant="outline">
                <Users className="h-6 w-6" />
                <span className="text-sm">Team Management</span>
              </Button>
              
              <Button className="h-20 flex flex-col items-center justify-center space-y-2" variant="outline">
                <Settings className="h-6 w-6" />
                <span className="text-sm">Settings</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </RoleBasedLayout>
  )
}
