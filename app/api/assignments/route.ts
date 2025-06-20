import { NextResponse } from "next/server"
// Ensure this path correctly points to your types file
import { mockAssignments } from "@/app/(main)/findings/_types/finding-creation-types"

export async function GET() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // In a real application, you would fetch this data from your database
  // For now, we're returning the mockAssignments

  if (mockAssignments) {
    return NextResponse.json(mockAssignments)
  } else {
    // This case might not be hit if mockAssignments is a const array,
    // but good practice for actual data fetching.
    return NextResponse.json({ error: "Failed to load assignments" }, { status: 500 })
  }
}
