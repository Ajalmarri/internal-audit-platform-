'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Create Finding page error:', error)
  }, [error])

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center text-destructive">
            <AlertTriangle className="mr-2 h-5 w-5" />
            Something went wrong
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            We encountered an error while loading the Create New Finding page. This might be due to a temporary issue or a problem with the form.
          </p>
          
          {error.message && (
            <div className="p-3 bg-muted rounded-md">
              <p className="text-sm font-medium">Error details:</p>
              <p className="text-sm text-muted-foreground mt-1">{error.message}</p>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={reset} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Try again
            </Button>
            <Button variant="outline" asChild>
              <a href="/findings">Back to Findings</a>
            </Button>
          </div>
          
          <div className="text-xs text-muted-foreground">
            If this problem persists, please contact your system administrator.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}











