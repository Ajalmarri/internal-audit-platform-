import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

// Ensure your DATABASE_URL environment variable is set in Vercel
// For local development, you might use a .env.local file
const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    // Fetch only id and title as that's what the combobox needs
    const auditPlans = await sql`
      SELECT id, title 
      FROM audit_plans 
      WHERE status = 'Active' OR status = 'Draft' -- Example: Fetch only active or draft plans
      ORDER BY title ASC
    `

    if (!auditPlans || auditPlans.length === 0) {
      // Return an empty array if no plans are found,
      // rather than an error, so the frontend can handle it gracefully.
      return NextResponse.json([])
    }

    return NextResponse.json(auditPlans)
  } catch (error) {
    console.error("Failed to fetch audit plans:", error)
    // Return a 500 error with a message
    return NextResponse.json(
      { message: "Failed to fetch audit plans.", error: (error as Error).message },
      { status: 500 },
    )
  }
}
