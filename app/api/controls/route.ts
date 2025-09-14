import { NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function GET() {
  try {
    const rows = await query(
      `SELECT 
         CAST(ControlID AS CHAR) AS id,
         ControlName AS name,
         ControlDescription AS description,
         ControlType AS type,
         ControlEffectiveness AS effectiveness,
         LastAssessed AS lastAssessed
       FROM controls 
       WHERE IFNULL(IsDeleted, 0) = 0
       ORDER BY ControlName ASC`
    ) as any[]

    return NextResponse.json(rows)
  } catch (error) {
    console.error("Failed to fetch controls:", error)
    return NextResponse.json(
      { error: "Failed to fetch controls" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    if (!body.name) {
      return NextResponse.json({ error: "Control name is required" }, { status: 400 })
    }

    const result = await query(
      `INSERT INTO controls (
        ControlName,
        ControlDescription,
        ControlType,
        ControlEffectiveness,
        LastAssessed,
        CreatedBy,
        ModifiedBy
      ) VALUES (?, ?, ?, ?, ?, 1, 1)`,
      [
        body.name,
        body.description || null,
        body.type || null,
        body.effectiveness || 'Effective',
        body.lastAssessed || null
      ]
    ) as any

    const newControlId = result.insertId

    // Fetch the newly created control
    const newControl = await query(
      `SELECT 
         CAST(ControlID AS CHAR) AS id,
         ControlName AS name,
         ControlDescription AS description,
         ControlType AS type,
         ControlEffectiveness AS effectiveness,
         LastAssessed AS lastAssessed
       FROM controls 
       WHERE ControlID = ?`,
      [newControlId]
    ) as any[]

    return NextResponse.json(newControl[0], { status: 201 })
  } catch (error) {
    console.error("Failed to create control:", error)
    return NextResponse.json(
      { error: "Failed to create control" },
      { status: 500 }
    )
  }
}

























