"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, PlusCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { type QAReview, mockQAReviews, type QAReviewStatus, type QAReviewOutcome } from "./_types/qa-review-types"

const getStatusBadgeVariant = (status: QAReviewStatus) => {
  switch (status) {
    case "Completed":
      return "success"
    case "In Progress":
      return "secondary"
    case "Scheduled":
      return "outline"
    default:
      return "default"
  }
}

const getOutcomeBadgeVariant = (outcome: QAReviewOutcome) => {
  switch (outcome) {
    case "Satisfactory":
      return "success"
    case "Requires Follow-up":
      return "warning"
    case "Pending":
      return "outline"
    default:
      return "default"
  }
}

export default function QualityAssuranceReviewsPage() {
  const [reviews, setReviews] = useState<QAReview[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setReviews(mockQAReviews.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()))
      setIsLoading(false)
    }, 1000)
  }, [])

  if (isLoading) {
    // A simple loading state, or you can use the loading.tsx for route-level loading
    return <QualityAssuranceReviewsLoading />
  }

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Quality Assurance (QA) Reviews</h1>
          <p className="text-muted-foreground">Manage and document quality reviews on completed audit work.</p>
        </div>
        <Link href="/quality-assurance-reviews/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Start New QA Review
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>QA Review List</CardTitle>
          <CardDescription>A list of all scheduled, in-progress, and completed QA reviews.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Review Period</TableHead>
                <TableHead>Lead Reviewer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Outcome</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.length === 0 && !isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No QA reviews found.
                  </TableCell>
                </TableRow>
              ) : (
                reviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell className="font-medium">{review.reviewPeriod}</TableCell>
                    <TableCell>{review.leadReviewer.name}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(review.status)}>{review.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getOutcomeBadgeVariant(review.outcome)}>{review.outcome}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">More actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/quality-assurance-reviews/${review.id}`}>View Review Details</Link>
                          </DropdownMenuItem>
                          {/* Add other actions like Edit, Delete if applicable */}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

// Inline loading component for simplicity in this example
function QualityAssuranceReviewsLoading() {
  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="h-8 w-72 bg-muted rounded animate-pulse mb-2"></div>
          <div className="h-4 w-96 bg-muted rounded animate-pulse"></div>
        </div>
        <div className="h-10 w-48 bg-muted rounded animate-pulse"></div>
      </div>
      <Card>
        <CardHeader>
          <div className="h-6 w-40 bg-muted rounded animate-pulse mb-2"></div>
          <div className="h-4 w-64 bg-muted rounded animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 border-b last:border-b-0">
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-muted rounded animate-pulse"></div>
                  <div className="h-3 w-24 bg-muted rounded animate-pulse"></div>
                </div>
                <div className="h-4 w-20 bg-muted rounded animate-pulse"></div>
                <div className="h-4 w-20 bg-muted rounded animate-pulse"></div>
                <div className="h-4 w-20 bg-muted rounded animate-pulse"></div>
                <div className="h-8 w-8 bg-muted rounded-full animate-pulse"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
