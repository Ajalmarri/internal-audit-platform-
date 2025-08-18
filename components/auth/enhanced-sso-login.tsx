"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface UserRole {
  id: string
  name: string
  role: "auditor" | "business-owner"
  department: string
  email: string
}

// Mock user database - in real app, this would come from your authentication system
const mockUsers: UserRole[] = [
  {
    id: "1",
    name: "John Smith",
    role: "auditor",
    department: "Internal Audit",
    email: "john.smith@company.com"
  },
  {
    id: "2", 
    name: "Sarah Johnson",
    role: "business-owner",
    department: "Finance",
    email: "sarah.johnson@company.com"
  },
  {
    id: "3",
    name: "Michael Chen",
    role: "auditor", 
    department: "Internal Audit",
    email: "michael.chen@company.com"
  },
  {
    id: "4",
    name: "Lisa Rodriguez",
    role: "business-owner",
    department: "IT",
    email: "lisa.rodriguez@company.com"
  }
]

export default function EnhancedSSOLogin() {
  const router = useRouter()
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [showUserSelector, setShowUserSelector] = useState(false)

  // Ensure body has overflow-hidden class for full-screen effect
  useEffect(() => {
    document.body.classList.add('overflow-hidden')
    return () => {
      document.body.classList.remove('overflow-hidden')
    }
  }, [])

  const handleMicrosoftLogin = async () => {
    setIsAuthenticating(true)
    
    // Simulate Microsoft SSO authentication
    setTimeout(() => {
      setIsAuthenticating(false)
      setShowUserSelector(true)
    }, 2000)
  }

  const handleUserSelection = (user: UserRole) => {
    // In a real app, you would store user info in session/localStorage
    localStorage.setItem('currentUser', JSON.stringify(user))
    
    // Redirect based on role
    if (user.role === "auditor") {
      router.push("/auditor")
    } else {
      router.push("/business-owner")
    }
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-800 animate-gradient bg-400">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-cyan-500/20 to-blue-800/20 animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 via-transparent to-cyan-900/50"></div>
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/10 rounded-full animate-float"
            style={{
              left: `${(i * 5.5) % 100}%`,
              top: `${(i * 7.3) % 100}%`,
              animationDelay: `${(i * 0.3) % 3}s`,
              animationDuration: `${3 + (i * 0.2) % 4}s`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
          <CardHeader className="text-center space-y-4 pb-6">
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold text-white tracking-tight">
                Audit Platform
              </CardTitle>
              <CardDescription className="text-lg text-white/80 font-medium">
                Dubai Future Foundation
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {!showUserSelector ? (
              <Button 
                className="w-full h-12 bg-white text-gray-900 hover:bg-gray-100 border-0 shadow-lg font-semibold text-base transition-all duration-200 hover:scale-105"
                onClick={handleMicrosoftLogin}
                disabled={isAuthenticating}
              >
                {isAuthenticating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-3"></div>
                    Authenticating...
                  </>
                ) : (
                  <>
                    <svg 
                      className="w-5 h-5 mr-3" 
                      viewBox="0 0 23 23" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M0 0H11V11H0V0Z" fill="#F25022"/>
                      <path d="M12 0H23V11H12V0Z" fill="#7FBA00"/>
                      <path d="M0 12H11V23H0V12Z" fill="#00A4EF"/>
                      <path d="M12 12H23V23H12V12Z" fill="#FFB900"/>
                    </svg>
                    Sign in with Microsoft
                  </>
                )}
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Select Your Account
                  </h3>
                  <p className="text-white/60 text-sm">
                    Choose your account to continue
                  </p>
                </div>
                
                <div className="space-y-3">
                  {mockUsers.map((user) => (
                    <Button
                      key={user.id}
                      variant="outline"
                      className="w-full justify-start h-auto p-4 bg-white/10 border-white/20 text-white hover:bg-white/20"
                      onClick={() => handleUserSelection(user)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-white/60">{user.email}</div>
                        </div>
                        <Badge className={user.role === "auditor" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}>
                          {user.role === "auditor" ? "Auditor" : "Business Owner"}
                        </Badge>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="text-center">
              <p className="text-white/60 text-sm">
                Secure access to your audit workspace
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional decorative elements */}
      <div className="absolute bottom-8 left-8 text-white/40 text-sm">
        © 2024 Dubai Future Foundation
      </div>
      
      <div className="absolute bottom-8 right-8 text-white/40 text-sm">
        v1.0.0
      </div>
    </div>
  )
} 