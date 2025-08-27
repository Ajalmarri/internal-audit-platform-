import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    console.log('Primary Stakeholders API called')
    
    const stakeholders = await query(
      `SELECT PrimaryStakeholderID, PrimaryStakeholder 
       FROM primarystakeholders 
       WHERE IsDeleted = 0 
       ORDER BY PrimaryStakeholder`
    ) as any[]

    console.log('Primary stakeholders query result:', stakeholders.length, 'stakeholders found')

    // Transform the data to match the expected format
    const transformedStakeholders = stakeholders.map(stakeholder => ({
      id: stakeholder.PrimaryStakeholderID.toString(),
      name: stakeholder.PrimaryStakeholder
    }))

    return NextResponse.json(transformedStakeholders)

  } catch (error) {
    console.error("Primary stakeholders error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
