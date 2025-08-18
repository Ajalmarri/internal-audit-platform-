import { NextResponse } from "next/server"
import { query } from "@/lib/database"

interface RiskFromDB {
  id: string
  title: string
  description?: string
  likelihood?: string
  impact?: string
  inherent_risk?: string
  status?: string
  created_at?: string
  updated_at?: string
}

export async function GET() {
  try {
    const rows = (await query(
      `SELECT id, title, description, likelihood, impact, inherent_risk, status, created_at, updated_at 
       FROM risks 
       ORDER BY created_at DESC`
    )) as RiskFromDB[]

    return NextResponse.json(rows)
  } catch (error) {
    console.error("Failed to fetch risks from database:", error)
    let errorMessage = "An unknown error occurred"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    return NextResponse.json(
      { message: "Failed to fetch risks from database.", error: errorMessage },
      { status: 500 },
    )
  }
}





