import { NextResponse } from "next/server"
import { query } from "@/lib/database"
import type { Assignment } from "@/lib/database"

// Fallback mock data when database is not available
const mockAssignments = [
  {
    id: "ASGN-001",
    title: "User Access Review Q1",
    description: "Review user access controls and permissions",
    status: "in_progress",
    priority: "high",
    assigned_to: "John Smith",
    due_date: "2024-03-15",
    audit_plan_id: "AP001",
    created_at: new Date("2024-01-15"),
    updated_at: new Date("2024-01-15")
  },
  {
    id: "ASGN-002",
    title: "Data Backup Verification",
    description: "Verify data backup procedures and recovery testing",
    status: "pending",
    priority: "medium",
    assigned_to: "Sarah Johnson",
    due_date: "2024-03-30",
    audit_plan_id: "AP001",
    created_at: new Date("2024-01-20"),
    updated_at: new Date("2024-01-20")
  },
  {
    id: "ASGN-003",
    title: "Firewall Configuration Audit",
    description: "Review firewall rules and network security",
    status: "completed",
    priority: "critical",
    assigned_to: "Mike Wilson",
    due_date: "2024-02-28",
    audit_plan_id: "AP002",
    created_at: new Date("2024-01-10"),
    updated_at: new Date("2024-02-28")
  },
  {
    id: "ASGN-004",
    title: "Vendor Security Assessment",
    description: "Security assessment of cloud service providers",
    status: "in_progress",
    priority: "high",
    assigned_to: "Lisa Brown",
    due_date: "2024-04-15",
    audit_plan_id: "AP003",
    created_at: new Date("2024-02-01"),
    updated_at: new Date("2024-02-01")
  },
  {
    id: "ASGN-005",
    title: "Incident Response Plan Test",
    description: "Test incident response procedures",
    status: "pending",
    priority: "medium",
    assigned_to: "David Lee",
    due_date: "2024-03-20",
    audit_plan_id: "AP002",
    created_at: new Date("2024-01-25"),
    updated_at: new Date("2024-01-25")
  },
]

export async function GET() {
  try {
    // Try to use database first
    const assignments = await query<Assignment>(`
      SELECT id, title, description, status, priority, assigned_to, due_date, audit_plan_id, created_at, updated_at
      FROM assignments 
      ORDER BY created_at DESC
    `)

    return NextResponse.json(assignments)
  } catch (error) {
    console.log("Database not available, using mock data:", error)
    // Fallback to mock data if database is not available
    return NextResponse.json(mockAssignments)
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, status, priority, assigned_to, due_date, audit_plan_id } = body

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    const id = `ASGN-${String(Date.now()).slice(-6)}`
    const now = new Date()

    await query(`
      INSERT INTO assignments (id, title, description, status, priority, assigned_to, due_date, audit_plan_id, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `, [id, title, description, status || 'pending', priority || 'medium', assigned_to, due_date, audit_plan_id, now, now])

    const newAssignment = await query<Assignment>(`
      SELECT id, title, description, status, priority, assigned_to, due_date, audit_plan_id, created_at, updated_at
      FROM assignments WHERE id = $1
    `, [id])

    return NextResponse.json(newAssignment[0], { status: 201 })
  } catch (error) {
    console.error("Failed to create assignment:", error)
    return NextResponse.json(
      { message: "Failed to create assignment. Database not available." },
      { status: 500 },
    )
  }
}
