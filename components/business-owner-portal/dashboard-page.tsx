"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  CheckSquare, 
  AlertTriangle, 
  Clock, 
  FileText,
  Users,
  Shield,
  TrendingUp,
  Settings,
  Download,
  Upload
} from "lucide-react"

interface ActionItem {
  id: string
  title: string
  description: string
  dueDate: string
  priority: "High" | "Medium" | "Low"
  status: "Pending" | "In Progress" | "Completed"
}

interface RiskProfile {
  category: string
  riskLevel: number
  color: string
  description: string
}

const actionItems: ActionItem[] = [
  {
    id: "1",
    title: "Review Q4 Financial Controls",
    description: "Complete assessment of internal controls for Q4 financial reporting",
    dueDate: "2024-01-15",
    priority: "High",
    status: "Pending"
  },
  {
    id: "2",
    title: "Update Risk Assessment",
    description: "Review and update department risk assessment matrix",
    dueDate: "2024-01-20",
    priority: "Medium",
    status: "In Progress"
  },
  {
    id: "3",
    title: "Provide Evidence for IT Controls",
    description: "Submit documentation for IT general controls review",
    dueDate: "2024-01-25",
    priority: "High",
    status: "Pending"
  },
  {
    id: "4",
    title: "Complete Compliance Training",
    description: "Complete annual compliance and ethics training module",
    dueDate: "2024-01-30",
    priority: "Low",
    status: "Completed"
  }
]

const riskProfiles: RiskProfile[] = [
  {
    category: "Financial Controls",
    riskLevel: 75,
    color: "bg-red-500",
    description: "Moderate risk - requires attention"
  },
  {
    category: "IT Security",
    riskLevel: 45,
    color: "bg-yellow-500",
    description: "Low to moderate risk"
  },
  {
    category: "Operational Processes",
    riskLevel: 30,
    color: "bg-green-500",
    description: "Low risk - well controlled"
  },
  {
    category: "Compliance",
    riskLevel: 60,
    color: "bg-orange-500",
    description: "Moderate risk - monitoring required"
  }
]

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "High":
      return "bg-red-100 text-red-800"
    case "Medium":
      return "bg-yellow-100 text-yellow-800"
    case "Low":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Pending":
      return "bg-gray-100 text-gray-800"
    case "In Progress":
      return "bg-blue-100 text-blue-800"
    case "Completed":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back, Sarah Johnson
        </h1>
        <p className="text-gray-600">
          Finance Department Manager • Last login: Today at 9:30 AM
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Action Items Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckSquare className="h-5 w-5 mr-2" />
              My Action Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {actionItems.map((item) => (
                <div key={item.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900">{item.title}</h3>
                    <div className="flex space-x-2">
                      <Badge className={getPriorityColor(item.priority)}>
                        {item.priority}
                      </Badge>
                      <Badge className={getStatusColor(item.status)}>
                        {item.status}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    Due: {new Date(item.dueDate).toLocaleDateString()}
                  </div>
                </div>
              ))}
              <Button className="w-full" variant="outline">
                View All Action Items
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Department Risk Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Department Risk Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {riskProfiles.map((risk, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">
                      {risk.category}
                    </span>
                    <span className="text-sm text-gray-500">
                      {risk.riskLevel}%
                    </span>
                  </div>
                  <Progress value={risk.riskLevel} className="h-2" />
                  <p className="text-xs text-gray-500">{risk.description}</p>
                </div>
              ))}
              <div className="pt-4">
                <Button className="w-full" variant="outline">
                  View Detailed Risk Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Quick Links
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button className="h-20 flex flex-col items-center justify-center space-y-2" variant="outline">
              <FileText className="h-6 w-6" />
              <span className="text-sm">Submit Evidence</span>
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
  )
} 