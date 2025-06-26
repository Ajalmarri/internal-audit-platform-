"use client"

import { useState, useEffect } from "react"
import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton" // For loading state

// Define props if we want to pass data in for a more dynamic briefing
type ExecutiveBriefingWidgetProps = {}

// Mock function to simulate AI generating a briefing
const generateMockBriefing = async (): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // This could be made more dynamic if props were passed
      const exampleBriefing =
        "For Q2 2025, the overall control environment is rated as **Effective**. The annual audit plan is **65% complete** and on track. A key area of focus is **Cybersecurity**, which shows a slight upward risk trend driven by 7 new high-risk findings this quarter. Leadership attention is recommended for the 12 overdue action plans, primarily within the IT Department."
      resolve(exampleBriefing)
    }, 1500) // Simulate network delay
  })
}

export function ExecutiveBriefingWidget({}: ExecutiveBriefingWidgetProps) {
  const [briefing, setBriefing] = useState<string>("")
  const [lastGenerated, setLastGenerated] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const fetchBriefing = async () => {
    setIsLoading(true)
    try {
      const newBriefing = await generateMockBriefing()
      setBriefing(newBriefing)
      setLastGenerated(
        new Date().toLocaleString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
      )
    } catch (error) {
      console.error("Failed to generate briefing:", error)
      setBriefing("Failed to generate briefing. Please try again.")
      // Optionally set lastGenerated to an error state or keep previous
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBriefing()
  }, [])

  // Function to parse the briefing and make parts bold
  const renderBriefingWithBold = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g) // Split by **bolded text**
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={index}>{part.slice(2, -2)}</strong>
      }
      return part
    })
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-semibold">AI-Powered Executive Briefing</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchBriefing}
          disabled={isLoading}
          aria-label="Generate new briefing"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          {isLoading ? "Generating..." : "Generate Briefing"}
        </Button>
      </CardHeader>
      <CardContent className="pt-4">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : (
          <p className="text-sm text-muted-foreground leading-relaxed">{renderBriefingWithBold(briefing)}</p>
        )}
      </CardContent>
      {lastGenerated && !isLoading && (
        <CardFooter className="text-xs text-muted-foreground pt-2">
          <p>Last generated: {lastGenerated}</p>
        </CardFooter>
      )}
    </Card>
  )
}
