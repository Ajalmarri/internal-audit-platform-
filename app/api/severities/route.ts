import { NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function GET() {
  try {
    const rows = await query(
      'SELECT SeverityID, Severity FROM severities ORDER BY Severity'
    ) as any[]

    return NextResponse.json(rows)
  } catch (error) {
    console.error('Failed to fetch severities:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ message: 'Failed to fetch severities.', error: message }, { status: 500 })
  }
}











