import { NextResponse } from "next/server"

// Mock data for audit plans
// In a real application, this would come from a database
const mockAuditPlans = [
  { id: "AP001", title: "Financial Statement Audit FY2024" },
  { id: "AP002", title: "IT General Controls Review Q3 2024" },
  { id: "AP003", title: "Operational Efficiency Audit - Manufacturing" },
  { id: "AP004", title: "Compliance Audit - GDPR Readiness" },
  { id: "AP005", title: "Cybersecurity Threat Assessment" },
]

export async function GET() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return NextResponse.json(mockAuditPlans)
}
