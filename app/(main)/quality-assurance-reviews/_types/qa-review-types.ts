import type { User } from "@/app/(main)/global-activity-log/_types/activity-log-types" // Re-using User type

export type QAReviewStatus = "Scheduled" | "In Progress" | "Completed"
export type QAReviewOutcome = "Pending" | "Satisfactory" | "Requires Follow-up"

export interface QAReview {
  id: string
  reviewPeriod: string // e.g., "Q2 2025 Review"
  leadReviewer: User
  status: QAReviewStatus
  outcome: QAReviewOutcome
  createdAt: Date // For sorting or additional info
  // Details like sampledAudits, checklist, comments would be on a detail page
}

export interface SampledAuditItem {
  id: string // e.g., audit plan ID or finding ID
  name: string // e.g., "ITGC Audit - Q2" or "Finding F-123: Weak Password Policy"
  type: "Audit Plan" | "Finding" | "Engagement" | "Report"
  link?: string // Optional link to the item itself
}

// Mock Data
export const mockReviewers: User[] = [
  { id: "user1", name: "John Doe", avatarUrl: "/placeholder.svg?width=40&height=40" },
  { id: "user2", name: "Jane Smith", avatarUrl: "/placeholder.svg?width=40&height=40" },
]

export const mockQAReviews: QAReview[] = [
  {
    id: "QA-2025-002",
    reviewPeriod: "Q2 2025 Review",
    leadReviewer: mockReviewers[0],
    status: "In Progress",
    outcome: "Pending",
    createdAt: new Date("2025-04-01T09:00:00Z"),
  },
  {
    id: "QA-2025-001",
    reviewPeriod: "Q1 2025 Review",
    leadReviewer: mockReviewers[0],
    status: "Completed",
    outcome: "Satisfactory",
    createdAt: new Date("2025-01-15T10:00:00Z"),
  },
  {
    id: "QA-2024-004",
    reviewPeriod: "Q4 2024 Review",
    leadReviewer: mockReviewers[1],
    status: "Completed",
    outcome: "Requires Follow-up",
    createdAt: new Date("2024-10-20T09:00:00Z"),
  },
  {
    id: "QA-2025-003",
    reviewPeriod: "Q3 2025 Review",
    leadReviewer: mockReviewers[1],
    status: "Scheduled",
    outcome: "Pending",
    createdAt: new Date("2025-07-01T09:00:00Z"),
  },
]

export const mockAuditsToSample: SampledAuditItem[] = [
  { id: "AP-2025-01", name: "Financial Controls Audit Q1", type: "Audit Plan", link: "/audit-plans/AP-2025-01" },
  { id: "ENG-003", name: "IT General Controls Review", type: "Engagement", link: "/engagements/ENG-003" },
  { id: "F-301", name: "Finding: Unpatched Server Vulnerability", type: "Finding", link: "/findings/F-301" },
  { id: "RPT-007", name: "Q1 Compliance Report", type: "Report", link: "/reports/RPT-007" },
  {
    id: "AP-2025-02",
    name: "Operational Efficiency Audit - Plant A",
    type: "Audit Plan",
    link: "/audit-plans/AP-2025-02",
  },
  { id: "F-305", name: "Finding: Inadequate Data Backup Procedures", type: "Finding", link: "/findings/F-305" },
]
