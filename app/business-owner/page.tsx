"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import RoleBasedLayout from "@/components/auth/role-based-layout"
import DashboardPage from "@/components/business-owner-portal/dashboard-page"

interface User {
  id: string
  name: string
  role: "auditor" | "business-owner"
  department: string
  email: string
}

export default function BusinessOwnerPage() {
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
      <DashboardPage />
    </RoleBasedLayout>
  )
}
