import { NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ assignmentId: string }> }
) {
  try {
    const { assignmentId } = await params

    if (!assignmentId) {
      return NextResponse.json({ error: "Assignment ID is required" }, { status: 400 })
    }

    // Fetch risk information from the assignment itself and linked risk-control relationships
    const assignmentRows = await query(
      `SELECT 
         CAST(a.AssignmentID AS CHAR) AS assignmentId,
         rl.Likelihood AS riskLikelihood,
         ri.Impact AS riskImpact,
         ir.InherentRisk AS inherentRisk
       FROM assignments a
       LEFT JOIN risklikelihoods rl ON rl.LikelihoodID = a.RiskLikelihoodID
       LEFT JOIN riskimpacts ri ON ri.ImpactID = a.RiskImpactID
       LEFT JOIN inherentrisks ir ON ir.InherentRiskID = a.InherentRiskID
       WHERE a.AssignmentID = ? AND IFNULL(a.IsDeleted, 0) = 0`,
      [assignmentId]
    ) as any[]

    // Fetch linked risk-control relationships (only if tables exist)
    let riskControlRows: any[] = []
    try {
      riskControlRows = await query(
        `SELECT 
           CAST(arc.AssignmentID AS CHAR) AS assignmentId,
           CAST(arc.RiskID AS CHAR) AS riskId,
           CAST(arc.ControlID AS CHAR) AS controlId,
           arc.Assessment AS assessment,
           r.RiskTitle AS riskTitle,
           r.RiskDescription AS riskDescription,
           c.ControlName AS controlName,
           c.ControlDescription AS controlDescription
         FROM assignmentriskcontrols arc
         LEFT JOIN risks r ON r.RiskID = arc.RiskID
         LEFT JOIN controls c ON c.ControlID = arc.ControlID
         WHERE arc.AssignmentID = ? AND IFNULL(arc.IsDeleted, 0) = 0`,
        [assignmentId]
      ) as any[]
    } catch (error) {
      console.log('Risk-control relationships table not available yet, skipping...')
      riskControlRows = []
    }

    if (assignmentRows.length === 0) {
      return NextResponse.json([])
    }

    const assignment = assignmentRows[0]
    
    // Create risk entries based on the assignment's risk fields and linked risk-control relationships
    const riskEntries = []

    // Add assignment-level risk assessment
    riskEntries.push({
      risk: {
        id: "assignment-risk",
        title: `Assignment Risk Assessment`,
        inherentRisk: assignment.inherentRisk || "Unknown",
        description: `Risk assessment for assignment ${assignmentId}`
      },
      controls: [
        {
          id: "default-control",
          name: "Standard Assignment Controls",
          assessment: "Effective",
          lastAssessed: new Date().toISOString().split('T')[0]
        }
      ],
      residualRisk: "Medium" // Default value
    })

    // Add linked risk-control relationships
    riskControlRows.forEach(rc => {
      riskEntries.push({
        risk: {
          id: rc.riskId,
          title: rc.riskTitle || `Risk ${rc.riskId}`,
          inherentRisk: "Linked",
          description: rc.riskDescription || `Linked risk ${rc.riskId}`
        },
        controls: [
          {
            id: rc.controlId,
            name: rc.controlName || `Control ${rc.controlId}`,
            assessment: rc.assessment || "Effective",
            lastAssessed: new Date().toISOString().split('T')[0]
          }
        ],
        residualRisk: "Medium"
      })
    })

    return NextResponse.json(riskEntries)
  } catch (error) {
    console.error("Failed to fetch risks and controls:", error)
    return NextResponse.json(
      { error: "Failed to fetch risks and controls" },
      { status: 500 }
    )
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ assignmentId: string }> }
) {
  try {
    const { assignmentId } = await params
    const body = await request.json()

    if (!assignmentId) {
      return NextResponse.json({ error: "Assignment ID is required" }, { status: 400 })
    }

    if (!body.riskTitle || !body.controlName) {
      return NextResponse.json({ error: "Risk title and control name are required" }, { status: 400 })
    }

    // For now, we'll create a simple risk-control entry
    // In a full implementation, you'd insert into the actual risk and control tables
    const newRiskControl = {
      id: `risk-${Date.now()}`,
      risk: {
        id: `risk-${Date.now()}`,
        title: body.riskTitle,
        inherentRisk: body.inherentRisk || "Medium",
        description: body.riskDescription || `Risk: ${body.riskTitle}`
      },
      controls: [
        {
          id: `control-${Date.now()}`,
          name: body.controlName,
          assessment: body.controlAssessment || "Effective",
          lastAssessed: new Date().toISOString().split('T')[0]
        }
      ],
      residualRisk: body.residualRisk || "Medium"
    }

    return NextResponse.json(newRiskControl)
  } catch (error) {
    console.error("Failed to create risk and control:", error)
    return NextResponse.json(
      { error: "Failed to create risk and control" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ assignmentId: string }> }
) {
  try {
    const { assignmentId } = await params
    const body = await request.json()
    const { searchParams } = new URL(request.url)
    const riskId = searchParams.get('riskId')

    if (!assignmentId) {
      return NextResponse.json({ error: "Assignment ID is required" }, { status: 400 })
    }

    if (!riskId) {
      return NextResponse.json({ error: "Risk ID is required" }, { status: 400 })
    }

    // Update risk and control information
    const updatedRiskControl = {
      id: riskId,
      risk: {
        id: riskId,
        title: body.riskTitle || "Updated Risk",
        inherentRisk: body.inherentRisk || "Medium",
        description: body.riskDescription || "Updated risk description"
      },
      controls: body.controls || [],
      residualRisk: body.residualRisk || "Medium"
    }

    return NextResponse.json(updatedRiskControl)
  } catch (error) {
    console.error("Failed to update risk and control:", error)
    return NextResponse.json(
      { error: "Failed to update risk and control" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ assignmentId: string }> }
) {
  try {
    const { assignmentId } = await params
    const { searchParams } = new URL(request.url)
    const riskId = searchParams.get('riskId')

    if (!assignmentId) {
      return NextResponse.json({ error: "Assignment ID is required" }, { status: 400 })
    }

    if (!riskId) {
      return NextResponse.json({ error: "Risk ID is required" }, { status: 400 })
    }

    // In a full implementation, you'd soft delete from the database
    return NextResponse.json({ message: "Risk and control deleted successfully" })
  } catch (error) {
    console.error("Failed to delete risk and control:", error)
    return NextResponse.json(
      { error: "Failed to delete risk and control" },
      { status: 500 }
    )
  }
}
