import { NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function GET() {
  try {
    console.log('Fetching primary stakeholders...')
    
    const rows = await query(
      'SELECT PrimaryStakeholderID as id, PrimaryStakeholder as name FROM primarystakeholders WHERE IFNULL(IsDeleted, 0) = 0 ORDER BY PrimaryStakeholder'
    ) as any[]

    console.log('Primary stakeholders query result:', rows)

    return NextResponse.json(rows)
  } catch (error) {
    console.error('Failed to fetch primary stakeholders:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ message: 'Failed to fetch primary stakeholders.', error: message }, { status: 500 })
  }
}