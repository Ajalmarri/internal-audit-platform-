import { NextResponse } from "next/server"
import { neon, type NeonQueryFunction } from "@neondatabase/serverless"

// Ensure your DATABASE_URL environment variable is set in Vercel
// For local development, you might use a .env.local file

let sql: NeonQueryFunction<false, false>

if (process.env.DATABASE_URL) {
  sql = neon(process.env.DATABASE_URL)
} else {
  console.warn(
    "DATABASE_URL environment variable is not set. API route /api/audit-plans will not connect to the database.",
  )
}

interface AuditPlanFromDB {
  id: string
  title: string
  // Add other fields if your table has them and you need them
}

export async function GET() {
  if (!sql) {
    console.error("Database connection is not available in /api/audit-plans because DATABASE_URL is not set.")
    return NextResponse.json({ message: "Database connection not configured." }, { status: 500 })
  }

  try {
    // Fetch only id and title as that's what the combobox needs
    const auditPlans: AuditPlanFromDB[] = await sql<AuditPlanFromDB[]>`
      SELECT id, title 
      FROM audit_plans 
      ORDER BY title ASC
    `
    // Removed WHERE clause for broader testing, can be added back:
    // WHERE status = 'Active' OR status = 'Draft'

    if (!auditPlans) {
      // Should not happen with a valid query, but good for type safety
      console.warn("/api/audit-plans: Query returned undefined/null, sending empty array.")
      return NextResponse.json([])
    }

    // If auditPlans is an empty array, it's a valid response (no plans found)
    // The frontend Combobox handles an empty options list.
    return NextResponse.json(auditPlans)
  } catch (error) {
    console.error("Failed to fetch audit plans from database:", error)
    let errorMessage = "An unknown error occurred"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    return NextResponse.json({ message: "Failed to fetch audit plans.", error: errorMessage }, { status: 500 })
  }
}

// Example of how to add a POST request if needed in the future
// export async function POST(request: Request) {
//   if (!sql) {
//     return NextResponse.json({ message: "Database connection not configured." }, { status: 500 });
//   }
//   try {
//     const body = await request.json();
//     // Add your insert logic here
//     return NextResponse.json({ message: "Audit plan created (mock)" }, { status: 201 });
//   } catch (error) {
//     console.error("Failed to create audit plan:", error);
//     return NextResponse.json({ message: "Failed to create audit plan.", error: (error as Error).message }, { status: 500 });
//   }
// }
