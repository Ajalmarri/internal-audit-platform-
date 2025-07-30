import { NextResponse } from "next/server"
import { query } from "@/lib/database"
import type { Finding } from "@/lib/database"

export async function GET() {
  try {
    const findings = await query<Finding>(`
      SELECT id, title, description, severity, status, assignment_id, responsible_party, created_at, updated_at
      FROM findings 
      ORDER BY created_at DESC
    `)

    return NextResponse.json(findings)
  } catch (error) {
    console.error("Failed to fetch findings:", error)
    return NextResponse.json(
      { message: "Failed to fetch findings from database." },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, severity, status, assignment_id, responsible_party } = body

    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 })
    }

    const id = `FND-${String(Date.now()).slice(-6)}`
    const now = new Date()

    await query(`
      INSERT INTO findings (id, title, description, severity, status, assignment_id, responsible_party, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `, [id, title, description, severity || 'medium', status || 'open', assignment_id, responsible_party, now, now])

    const newFinding = await query<Finding>(`
      SELECT id, title, description, severity, status, assignment_id, responsible_party, created_at, updated_at
      FROM findings WHERE id = $1
    `, [id])

    return NextResponse.json(newFinding[0], { status: 201 })
  } catch (error) {
    console.error("Failed to create finding:", error)
    return NextResponse.json(
      { message: "Failed to create finding." },
      { status: 500 },
    )
  }
} 