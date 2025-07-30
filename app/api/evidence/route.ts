import { NextResponse } from "next/server"
import { query } from "@/lib/database"
import type { Evidence } from "@/lib/database"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const assignmentId = searchParams.get('assignmentId')
    const findingId = searchParams.get('findingId')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    let sql = `
      SELECT id, title, description, file_path, file_size, file_type, assignment_id, finding_id, uploaded_by, created_at
      FROM evidence
    `
    const params: any[] = []
    let whereClause = ''

    if (assignmentId) {
      whereClause += whereClause ? ' AND ' : ' WHERE '
      whereClause += 'assignment_id = $1'
      params.push(assignmentId)
    }

    if (findingId) {
      whereClause += whereClause ? ' AND ' : ' WHERE '
      whereClause += 'finding_id = $' + (params.length + 1)
      params.push(findingId)
    }

    sql += whereClause + ' ORDER BY created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2)
    params.push(limit, offset)

    const evidence = await query<Evidence>(sql, params)

    // Get total count for pagination
    let countSql = 'SELECT COUNT(*) as total FROM evidence' + whereClause
    const countResult = await query<{total: string}>(countSql, params.slice(0, -2))
    const total = parseInt(countResult[0]?.total || '0')

    return NextResponse.json({
      evidence,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    })
  } catch (error) {
    console.error("Failed to fetch evidence:", error)
    return NextResponse.json(
      { message: "Failed to fetch evidence from database." },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, file_path, file_size, file_type, assignment_id, finding_id, uploaded_by } = body

    if (!title || !file_path || !file_size || !file_type) {
      return NextResponse.json({ error: "Title, file_path, file_size, and file_type are required" }, { status: 400 })
    }

    const id = `EV${String(Date.now()).slice(-6)}`
    const now = new Date()

    await query(`
      INSERT INTO evidence (id, title, description, file_path, file_size, file_type, assignment_id, finding_id, uploaded_by, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `, [id, title, description, file_path, file_size, file_type, assignment_id, finding_id, uploaded_by, now])

    const newEvidence = await query<Evidence>(`
      SELECT id, title, description, file_path, file_size, file_type, assignment_id, finding_id, uploaded_by, created_at
      FROM evidence WHERE id = $1
    `, [id])

    return NextResponse.json(newEvidence[0], { status: 201 })
  } catch (error) {
    console.error("Failed to create evidence:", error)
    return NextResponse.json(
      { message: "Failed to create evidence." },
      { status: 500 },
    )
  }
} 