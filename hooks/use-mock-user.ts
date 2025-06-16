"use client"

import { useState } from "react"

export type UserRole = "Audit Manager" | "Auditor" | "Business Owner"

export interface MockUser {
  id: string
  name: string
  email: string
  role: UserRole
  title: string
  avatarUrl?: string
  fallback: string
}

const auditManager: MockUser = {
  id: "user-001",
  name: "John Doe",
  email: "john.doe@example.com",
  role: "Audit Manager",
  title: "Audit Manager",
  avatarUrl: "/placeholder.svg?width=40&height=40",
  fallback: "JD",
}

const auditor: MockUser = {
  id: "user-002",
  name: "Jane Smith",
  email: "jane.smith@example.com",
  role: "Auditor",
  title: "Senior Auditor",
  avatarUrl: "/placeholder.svg?width=40&height=40",
  fallback: "JS",
}

const businessOwner: MockUser = {
  id: "user-003",
  name: "Anya Sharma",
  email: "anya.sharma@business.com",
  role: "Business Owner",
  title: "VP of Finance",
  avatarUrl: "/placeholder.svg?width=40&height=40",
  fallback: "AS",
}

// --- IMPORTANT: SET THE DESIRED ROLE HERE FOR TESTING ---
const CURRENT_MOCK_ROLE: UserRole = "Business Owner" // Or "Auditor", "Audit Manager"
// ---

let currentUser: MockUser
switch (CURRENT_MOCK_ROLE) {
  case "Auditor":
    currentUser = auditor
    break
  case "Business Owner":
    currentUser = businessOwner
    break
  case "Audit Manager":
  default:
    currentUser = auditManager
    break
}

export function useMockUser() {
  // In a real app, this would come from an auth context or API
  // For now, we use a simple state to allow potential future dynamic changes if needed,
  // but it's initialized with our statically chosen currentUser.
  const [user, setUser] = useState<MockUser>(currentUser)

  // If you want to allow changing the user role dynamically for testing (e.g., via a UI element not built here):
  // const setCurrentUserRole = (role: UserRole) => {
  //   switch (role) {
  //     case "Auditor": setUser(auditor); break;
  //     case "Business Owner": setUser(businessOwner); break;
  //     case "Audit Manager": setUser(auditManager); break;
  //     default: setUser(auditManager);
  //   }
  // };

  return { user }
  // If dynamic switching is needed: return { user, setCurrentUserRole };
}
