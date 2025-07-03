import { NextResponse } from "next/server"

// Using the mockAssignments from finding-creation-types as per previous context
// Ensure this path is correct and the mockAssignments array is well-defined.
// For this example, I'll redefine a simple mock here to ensure it's available.
// In your actual project, ensure you import from the correct location.

const mockApiAssignments = [
  { id: "ASGN-001", title: "User Access Review Q1 (API)" },
  { id: "ASGN-002", title: "Data Backup Verification (API)" },
  { id: "ASGN-003", title: "Firewall Configuration Audit (API)" },
  { id: "ASGN-004", title: "Vendor Security Assessment - CloudProviderX (API)" },
  { id: "ASGN-005", title: "Incident Response Plan Test (API)" },
  { id: "ASGN-006", title: "Physical Security Audit - HQ (API)" },
  { id: "ASGN-007", title: "Software Patch Management Review (API)" },
]

export async function GET() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 700))

  // In a real application, you would fetch this data from your database
  // For now, we're returning the mockApiAssignments

  if (mockApiAssignments) {
    return NextResponse.json(mockApiAssignments)
  } else {
    return NextResponse.json({ error: "Failed to load assignments" }, { status: 500 })
  }
}
