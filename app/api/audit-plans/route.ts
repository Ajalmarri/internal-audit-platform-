import { NextResponse } from "next/server"
import { query } from "@/lib/database"
import type { AuditPlan } from "@/lib/database"

// Fallback mock data when database is not available
const mockAuditPlans = [
  {
    id: "AP001",
    title: "Q1 2024 Financial Controls Audit",
    description: "Comprehensive review of financial controls and procedures",
    status: "active",
    start_date: "2024-01-01",
    end_date: "2024-03-31",
    created_at: new Date("2024-01-01"),
    updated_at: new Date("2024-01-01")
  },
  {
    id: "AP002", 
    title: "IT Security Assessment 2024",
    description: "Annual IT security and infrastructure audit",
    status: "active",
    start_date: "2024-01-15",
    end_date: "2024-06-30",
    created_at: new Date("2024-01-15"),
    updated_at: new Date("2024-01-15")
  },
  {
    id: "AP003",
    title: "Vendor Management Review",
    description: "Assessment of vendor relationships and compliance",
    status: "draft",
    start_date: "2024-02-01",
    end_date: "2024-05-31",
    created_at: new Date("2024-02-01"),
    updated_at: new Date("2024-02-01")
  },
  {
    id: "AP004",
    title: "Compliance Framework Audit",
    description: "Review of regulatory compliance framework",
    status: "completed",
    start_date: "2023-10-01",
    end_date: "2023-12-31",
    created_at: new Date("2023-10-01"),
    updated_at: new Date("2023-12-31")
  },
  {
    id: "AP005",
    title: "Operational Risk Assessment",
    description: "Evaluation of operational risks and controls",
    status: "active",
    start_date: "2024-01-01",
    end_date: "2024-12-31",
    created_at: new Date("2024-01-01"),
    updated_at: new Date("2024-01-01")
  },
]

export async function GET() {
  try {
    // Try to use database first
    const auditPlans = await query<AuditPlan>(`
      SELECT id, title, description, status, start_date, end_date, created_at, updated_at
      FROM audit_plans 
      ORDER BY created_at DESC
    `)

    return NextResponse.json(auditPlans)
  } catch (error) {
    console.log("Database not available, using mock data:", error)
    // Fallback to mock data if database is not available
    return NextResponse.json(mockAuditPlans)
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, status, start_date, end_date } = body

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    const id = `AP${String(Date.now()).slice(-6)}`
    const now = new Date()

    await query(`
      INSERT INTO audit_plans (id, title, description, status, start_date, end_date, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [id, title, description, status || 'draft', start_date, end_date, now, now])

    const newAuditPlan = await query<AuditPlan>(`
      SELECT id, title, description, status, start_date, end_date, created_at, updated_at
      FROM audit_plans WHERE id = $1
    `, [id])

    return NextResponse.json(newAuditPlan[0], { status: 201 })
  } catch (error) {
    console.error("Failed to create audit plan:", error)
    return NextResponse.json(
      { message: "Failed to create audit plan. Database not available." },
      { status: 500 },
    )
  }
}
