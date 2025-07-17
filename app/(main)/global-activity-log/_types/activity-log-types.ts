export type User = {
  id: string
  name: string
  avatarUrl?: string
}

export type ActionType =
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "VIEW"
  | "LOGIN"
  | "LOGOUT"
  | "EXPORT"
  | "SETTINGS_CHANGE"
  | "PERMISSION_CHANGE"

export type ItemType =
  | "Finding"
  | "Risk"
  | "Control"
  | "User"
  | "UserRole"
  | "Report"
  | "AuditPlan"
  | "Assignment"
  | "SystemSetting"
  | "ActionPlan"
  | "Evidence"

export interface ActivityLogEntry {
  id: string
  timestamp: Date
  user: User
  actionType: ActionType
  itemType?: ItemType
  itemId?: string
  description: string // Pre-formatted human-readable description
  details?: Record<string, any> // Optional: for more structured data if needed for deep dives
}

export interface ActivityLogFilters {
  userId?: string
  actionTypes?: ActionType[]
  itemType?: ItemType
  dateRange?: { from?: Date; to?: Date }
  searchTerm?: string // For searching within descriptions
}

// Mock data for filters
export const mockUsers: User[] = [
  { id: "user1", name: "Alice Wonderland", avatarUrl: "/placeholder.svg?width=40&height=40" },
  { id: "user2", name: "Bob The Builder", avatarUrl: "/placeholder.svg?width=40&height=40" },
  { id: "user3", name: "Charlie Brown", avatarUrl: "/placeholder.svg?width=40&height=40" },
  { id: "user4", name: "Diana Prince", avatarUrl: "/placeholder.svg?width=40&height=40" },
]

export const mockActionTypes: ActionType[] = [
  "CREATE",
  "UPDATE",
  "DELETE",
  "VIEW",
  "LOGIN",
  "LOGOUT",
  "EXPORT",
  "SETTINGS_CHANGE",
  "PERMISSION_CHANGE",
]
export const mockItemTypes: ItemType[] = [
  "Finding",
  "Risk",
  "Control",
  "User",
  "UserRole",
  "Report",
  "AuditPlan",
  "Assignment",
  "SystemSetting",
  "ActionPlan",
  "Evidence",
]

// Mock log entries
export const mockActivityLogs: ActivityLogEntry[] = [
  {
    id: "log1",
    timestamp: new Date("2025-06-18T10:30:15Z"),
    user: mockUsers[0],
    actionType: "CREATE",
    itemType: "Control",
    itemId: "C-128",
    description: "CREATED Control #C-128: 'Quarterly Vulnerability Scanning'",
  },
  {
    id: "log2",
    timestamp: new Date("2025-06-18T09:15:45Z"),
    user: mockUsers[1],
    actionType: "UPDATE",
    itemType: "Finding",
    itemId: "F-291",
    description: "UPDATED Status of Finding #F-291 from 'Open' to 'Awaiting Action Plan'",
  },
  {
    id: "log3",
    timestamp: new Date("2025-06-17T16:45:00Z"),
    user: mockUsers[0],
    actionType: "EXPORT",
    itemType: "Report",
    description: "EXPORTED Report: 'Q2 Financial Controls Audit'",
  },
  {
    id: "log4",
    timestamp: new Date("2025-06-17T14:20:10Z"),
    user: mockUsers[2],
    actionType: "VIEW",
    itemType: "Risk",
    itemId: "R-045",
    description: "VIEWED Details for Risk #R-045",
  },
  {
    id: "log5",
    timestamp: new Date("2025-06-17T08:00:00Z"),
    user: mockUsers[3],
    actionType: "LOGIN",
    description: "User Diana Prince LOGGED IN",
  },
  {
    id: "log6",
    timestamp: new Date("2025-06-16T17:30:00Z"),
    user: mockUsers[1],
    actionType: "DELETE",
    itemType: "Assignment",
    itemId: "AS-007",
    description: "DELETED Assignment #AS-007: 'ITGC Review - Phase 1'",
  },
  {
    id: "log7",
    timestamp: new Date("2025-06-16T11:05:22Z"),
    user: mockUsers[0],
    actionType: "SETTINGS_CHANGE",
    itemType: "SystemSetting",
    description: "UPDATED System Setting: 'Session Timeout' to 30 minutes",
  },
  {
    id: "log8",
    timestamp: new Date("2025-06-15T10:00:00Z"),
    user: mockUsers[2],
    actionType: "CREATE",
    itemType: "ActionPlan",
    itemId: "AP-010",
    description: "CREATED Action Plan #AP-010 for Finding #F-288",
  },
  {
    id: "log9",
    timestamp: new Date("2025-06-15T14:30:00Z"),
    user: mockUsers[1],
    actionType: "UPDATE",
    itemType: "UserRole",
    itemId: "Role-Auditor",
    description: "UPDATED Permissions for User Role 'Auditor'",
  },
  {
    id: "log10",
    timestamp: new Date("2025-06-14T09:00:00Z"),
    user: mockUsers[3],
    actionType: "VIEW",
    itemType: "AuditPlan",
    itemId: "APL-2025",
    description: "VIEWED Audit Plan 'Annual Plan 2025'",
  },
]
