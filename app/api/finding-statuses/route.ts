import { NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function GET() {
  try {
    const rows = await query(
      'SELECT FindingStatusID, FindingStatus FROM findingstatuses ORDER BY DisplayOrder, FindingStatus'
    ) as any[]

    return NextResponse.json(rows)
  } catch (error) {
    console.error('Failed to fetch finding statuses:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ message: 'Failed to fetch finding statuses.', error: message }, { status: 500 })
  }
}











