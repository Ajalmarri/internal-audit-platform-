"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, AlertTriangle } from "lucide-react"
import type { AiAnalysisResult } from "../../_types/evidence-types"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Mock data store - replace with actual data fetching logic
const mockResultsStore: Record<string, AiAnalysisResult> = {}

export default function AiAnalysisResultPage() {
  const params = useParams()
  const router = useRouter()
  const analysisId = params.analysisId as string
  const [result, setResult] = useState<AiAnalysisResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (analysisId) {
      setIsLoading(true)
      // Simulate fetching data
      setTimeout(() => {
        const fetchedResult = mockResultsStore[analysisId]
        setResult(fetchedResult || null)
        setIsLoading(false)
      }, 500)
    }
  }, [analysisId])

  if (isLoading) {
    return <AiAnalysisResultLoadingSkeleton />
  }

  if (!result) {
    return (
      <div className="container mx-auto p-4 md:p-6 lg:p-8 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
        <h1 className="text-2xl font-bold mb-2">Analysis Result Not Found</h1>
        <p className="text-muted-foreground mb-4">The analysis result with ID "{analysisId}" could not be found.</p>
        <Button onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <Button variant="outline" onClick={() => router.push("/evidence-locker")} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Evidence Locker
      </Button>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">{result.analysisTitle}</CardTitle>
          <CardDescription>
            Analysis run on: {new Date(result.dateRun).toLocaleString()} for instruction: "{result.instruction}"
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            <div>
              <strong>Status:</strong>{" "}
              <Badge variant={result.status === "Completed" ? "success" : "destructive"}>{result.status}</Badge>
            </div>
            <div>
              <strong>Files Analyzed ({result.analyzedFileNames.length}):</strong> {result.analyzedFileNames.join(", ")}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>AI Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap">{result.summary}</p>
        </CardContent>
      </Card>

      {result.exceptions && result.exceptions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Identified Exceptions / Key Findings ({result.exceptions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File Name</TableHead>
                  <TableHead>Page</TableHead>
                  <TableHead>Quote / Finding</TableHead>
                  <TableHead>Reason / Context</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.exceptions.map((ex) => (
                  <TableRow key={ex.id}>
                    <TableCell>{ex.fileName}</TableCell>
                    <TableCell>{ex.pageNumber || "N/A"}</TableCell>
                    <TableCell className="italic">"{ex.quote}"</TableCell>
                    <TableCell>{ex.reason}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Helper function to add mock results to the store (used by EvidenceLockerPage)
export const addMockAnalysisResult = (result: AiAnalysisResult) => {
  mockResultsStore[result.id] = result
}

function AiAnalysisResultLoadingSkeleton() {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-8">
      <div className="h-10 w-48 bg-muted rounded animate-pulse mb-6"></div>
      <Card>
        <CardHeader>
          <div className="h-8 w-3/4 bg-muted rounded animate-pulse mb-2"></div>
          <div className="h-4 w-1/2 bg-muted rounded animate-pulse"></div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="h-4 w-1/3 bg-muted rounded animate-pulse"></div>
          <div className="h-4 w-2/3 bg-muted rounded animate-pulse"></div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <div className="h-6 w-1/4 bg-muted rounded animate-pulse"></div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="h-4 w-full bg-muted rounded animate-pulse"></div>
          <div className="h-4 w-full bg-muted rounded animate-pulse"></div>
          <div className="h-4 w-3/4 bg-muted rounded animate-pulse"></div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <div className="h-6 w-1/3 bg-muted rounded animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex space-x-4">
                <div className="h-4 w-1/4 bg-muted rounded animate-pulse"></div>
                <div className="h-4 w-1/4 bg-muted rounded animate-pulse"></div>
                <div className="h-4 w-1/2 bg-muted rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
