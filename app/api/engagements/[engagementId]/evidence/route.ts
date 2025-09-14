import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/database'

export const dynamic = 'force-dynamic'

// GET: List all evidence documents for a specific engagement
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ engagementId: string }> }
) {
  try {
    const { engagementId } = await params

    if (!engagementId || isNaN(Number(engagementId))) {
      return NextResponse.json(
        { message: 'Valid engagement ID is required' },
        { status: 400 }
      )
    }

    // Validate engagement exists
    const engagementResult = await query(
      'SELECT EngagementID FROM ENGAGEMENTS WHERE EngagementID = ? AND IsDeleted = 0',
      [engagementId]
    )

    if (!Array.isArray(engagementResult) || engagementResult.length === 0) {
      return NextResponse.json(
        { message: 'Engagement not found' },
        { status: 404 }
      )
    }

    // Get evidence documents for this engagement
    const evidence = await query(
      `SELECT 
         d.DocumentID,
         d.DocumentName,
         d.DocumentFileName,
         d.DocumentFileType,
         d.DocumentFileSize,
         d.FindingID,
         d.CreatedDate,
         d.CreatedBy,
         f.Title as FindingTitle
       FROM DOCUMENTS d
       LEFT JOIN FINDINGS f ON d.FindingID = f.FindingID
       WHERE d.EngagementID = ? AND d.IsDeleted = 0
       ORDER BY d.CreatedDate DESC`,
      [engagementId]
    )

    return NextResponse.json(evidence)

  } catch (error) {
    console.error('Failed to fetch engagement evidence:', error)
    return NextResponse.json(
      { message: 'Failed to fetch engagement evidence' },
      { status: 500 }
    )
  }
}











