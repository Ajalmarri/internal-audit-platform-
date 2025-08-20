import { NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function GET() {
  try {
    const rows = await query(
      `SELECT 
         CAST(RiskID AS CHAR) AS id,
         RiskTitle AS title,
         RiskDescription AS description,
         RiskCategory AS category,
         RiskOwner AS owner,
         RiskStatus AS status
       FROM risks 
       WHERE IFNULL(IsDeleted, 0) = 0
       ORDER BY RiskTitle ASC`
    ) as any[]

    return NextResponse.json(rows)
  } catch (error) {
    console.error("Failed to fetch risks:", error)
    return NextResponse.json(
      { error: "Failed to fetch risks" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    if (!body.title) {
      return NextResponse.json({ error: "Risk title is required" }, { status: 400 })
    }

    const result = await query(
      `INSERT INTO risks (
        RiskTitle,
        RiskDescription,
        RiskCategory,
        RiskOwner,
        RiskStatus,
        CreatedBy,
        ModifiedBy
      ) VALUES (?, ?, ?, ?, ?, 1, 1)`,
      [
        body.title,
        body.description || null,
        body.category || null,
        body.owner || null,
        body.status || 'Active'
      ]
    ) as any

    const newRiskId = result.insertId

    // Fetch the newly created risk
    const newRisk = await query(
      `SELECT 
         CAST(RiskID AS CHAR) AS id,
         RiskTitle AS title,
         RiskDescription AS description,
         RiskCategory AS category,
         RiskOwner AS owner,
         RiskStatus AS status
       FROM risks 
       WHERE RiskID = ?`,
      [newRiskId]
    ) as any[]

    return NextResponse.json(newRisk[0], { status: 201 })
  } catch (error) {
    console.error("Failed to create risk:", error)
    return NextResponse.json(
      { error: "Failed to create risk" },
      { status: 500 }
    )
  }
}






