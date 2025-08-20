"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import RoleBasedLayout from "@/components/auth/role-based-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckSquare } from "lucide-react"

interface User {
  id: string
  name: string
  role: "auditor" | "business-owner"
  department: string
  email: string
}

export default function ActionItemsPage() {
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
            My Action Items
          </h1>
          <p className="text-gray-600">
            Track and manage your assigned tasks and responsibilities
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckSquare className="h-5 w-5 mr-2" />
              Pending Action Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900">Review Q4 Financial Controls</h3>
                  <Badge className="bg-red-100 text-red-800">High Priority</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Complete assessment of internal controls for Q4 financial reporting
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  Due: January 15, 2024
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900">Update Risk Assessment</h3>
                  <Badge className="bg-yellow-100 text-yellow-800">Medium Priority</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Review and update department risk assessment matrix
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  Due: January 20, 2024
                </div>
              </div>

              <Button className="w-full" variant="outline">
                View All Action Items
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </RoleBasedLayout>
  )
}
