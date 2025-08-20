"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface User {
  userID: number
  email: string
  firstName: string
  lastName: string
  roleID: number
  roleName: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const checkAuth = async () => {
    try {
      console.log('AuthContext - Checking authentication...')
      const response = await fetch('/api/auth/session')
      const data = await response.json()

      console.log('AuthContext - Session response:', data)

      if (data.isAuthenticated) {
        console.log('AuthContext - User is authenticated')
        setUser(data.user)
        setIsAuthenticated(true)
      } else {
        console.log('AuthContext - User is not authenticated')
        setUser(null)
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error('AuthContext - Auth check failed:', error)
      setUser(null)
      setIsAuthenticated(false)
    } finally {
      console.log('AuthContext - Setting isLoading to false')
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('AuthContext - Attempting login for:', email)
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()
      console.log('AuthContext - Login response:', data)

      if (response.ok) {
        console.log('AuthContext - Login successful')
        setUser(data.user)
        setIsAuthenticated(true)
        return true
      } else {
        console.log('AuthContext - Login failed:', data.message)
        return false
      }
    } catch (error) {
      console.error('AuthContext - Login failed:', error)
      return false
    }
  }

  const logout = async () => {
    try {
      console.log('AuthContext - Logging out...')
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
      setIsAuthenticated(false)
      router.push('/login')
    } catch (error) {
      console.error('AuthContext - Logout failed:', error)
    }
  }

  useEffect(() => {
    console.log('AuthContext - Initializing auth check...')
    checkAuth()
  }, [])

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuth,
  }

  console.log('AuthContext - Current state:', { user, isAuthenticated, isLoading })

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
