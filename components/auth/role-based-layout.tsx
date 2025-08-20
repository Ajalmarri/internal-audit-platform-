"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { 
  LayoutDashboard, 
  CheckSquare, 
  FileText, 
  LogOut,
  User,
  Bell,
  Shield,
  TrendingUp,
  Settings,
  Search,
  PlusCircle,
  Eye,
  Rocket,
  CheckCircle2,
  XCircleIcon,
  BarChart3,
  Users,
  Calendar,
  Activity
} from "lucide-react"
import { cn } from "@/lib/utils"

interface RoleBasedLayoutProps {
  children: React.ReactNode
  userRole: "auditor" | "business-owner"
  userName: string
  userDepartment?: string
}

// Auditor Navigation
const auditorNavigation = [
  {
    name: "Dashboard",
    href: "/auditor",
    icon: LayoutDashboard,
  },
  {
    name: "Audit Plans",
    href: "/auditor/audit-plans",
    icon: Shield,
  },
  {
    name: "Assignments",
    href: "/auditor/assignments",
    icon: CheckSquare,
  },
  {
    name: "Findings",
    href: "/auditor/findings",
    icon: Eye,
  },
  {
    name: "Reports",
    href: "/auditor/reports",
    icon: BarChart3,
  },
  {
    name: "Evidence Locker",
    href: "/auditor/evidence-locker",
    icon: FileText,
  },
]

// Business Owner Navigation
const businessOwnerNavigation = [
  {
    name: "Dashboard",
    href: "/business-owner",
    icon: LayoutDashboard,
  },
  {
    name: "My Action Items",
    href: "/business-owner/action-items",
    icon: CheckSquare,
  },
  {
    name: "Evidence Requests",
    href: "/business-owner/evidence-requests",
    icon: FileText,
  },
]

export default function RoleBasedLayout({ 
  children, 
  userRole, 
  userName, 
  userDepartment 
}: RoleBasedLayoutProps) {
  const pathname = usePathname()
  const navigation = userRole === "auditor" ? auditorNavigation : businessOwnerNavigation
  const portalTitle = userRole === "auditor" ? "Audit Platform" : "Business Owner Portal"

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                {portalTitle}
              </h1>
              {userDepartment && (
                <span className="ml-4 text-sm text-gray-500">
                  {userDepartment}
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <Button variant="ghost" size="sm">
                <User className="h-4 w-4 mr-2" />
                {userName}
              </Button>
              <Button variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm border-r">
          <div className="p-4">
            <div className="mb-6">
              <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                Navigation
              </h2>
            </div>
            
            <nav className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      isActive
                        ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <item.icon className="h-4 w-4 mr-3" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1">
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
