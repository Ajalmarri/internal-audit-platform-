"use client"

// hooks/use-mock-user.ts
import { useMemo } from "react"

// Define a type for the mock user for better type safety
export type MockUser = {
  id: string
  name: string
  email: string
  avatarUrl: string
  role: "Admin" | "AuditManager" | "Auditor" | "BusinessOwner" // Example roles
  department?: string
  languagePreference: string
  themePreference: "light" | "dark" | "system"
}

// Default mock user data
const defaultMockUser: MockUser = {
  id: "user-123-abc",
  name: "Muhammad Al-Fatih",
  email: "m.alfatih@example.com",
  avatarUrl: "/placeholder.svg?width=128&height=128", // Using placeholder
  role: "Admin", // Default role, can be changed for testing different scenarios
  department: "Internal Audit",
  languagePreference: "en",
  themePreference: "light",
}

/**
 * Custom hook to provide mock user data.
 * In a real application, this would fetch user data from an auth context or API.
 * @param {Partial<MockUser>} overrides - Optional: Object to override default mock user properties.
 * @returns {MockUser} The mock user object.
 */
export const useMockUser = (overrides?: Partial<MockUser>): MockUser => {
  const user = useMemo(
    () => ({
      ...defaultMockUser,
      ...overrides,
    }),
    [overrides],
  )

  return user
}

// Example of how to provide different users for different scenarios if needed
export const useMockBusinessOwner = (): MockUser => {
  return useMockUser({
    id: "user-456-def",
    name: "Yema Al Olman",
    email: "y.alolman@example.com",
    role: "BusinessOwner",
    department: "Finance",
  })
}

export const useMockAuditor = (): MockUser => {
  return useMockUser({
    id: "user-789-ghi",
    name: "Khaled M.",
    email: "k.m@example.com",
    role: "Auditor",
    department: "Internal Audit",
  })
}
