import { NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function GET() {
  try {
    // Check if findings table exists and get its structure
    const tableStructure = await query(`
      SELECT 
        COLUMN_NAME,
        DATA_TYPE,
        IS_NULLABLE,
        COLUMN_DEFAULT,
        COLUMN_KEY
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'audit_platform' 
      AND TABLE_NAME = 'findings'
      ORDER BY ORDINAL_POSITION
    `) as any[]

    // Check if there are any findings in the table
    const findingsCount = await query(`
      SELECT COUNT(*) as total_count,
             COUNT(CASE WHEN IFNULL(IsDeleted, 0) = 0 THEN 1 END) as active_count,
             COUNT(CASE WHEN IFNULL(IsDeleted, 0) = 1 THEN 1 END) as deleted_count
      FROM findings
    `) as any[]

    // Get a sample finding if any exist
    const sampleFinding = await query(`
      SELECT * FROM findings LIMIT 1
    `) as any[]

    return NextResponse.json({
      success: true,
      tableStructure,
      findingsCount: findingsCount[0] || { total_count: 0, active_count: 0, deleted_count: 0 },
      sampleFinding: sampleFinding[0] || null,
      message: "Findings table structure retrieved successfully"
    })
  } catch (error) {
    console.error('Failed to get findings table structure:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ 
      success: false,
      message: 'Failed to get findings table structure.', 
      error: message 
    }, { status: 500 })
  }
}























