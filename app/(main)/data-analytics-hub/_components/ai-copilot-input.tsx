"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Sparkles, Send, Loader2 } from "lucide-react"

interface AiCopilotInputProps {
  onQuerySubmit: (query: string) => void
  isLoading: boolean
}

export default function AiCopilotInput({ onQuerySubmit, isLoading }: AiCopilotInputProps) {
  const [query, setQuery] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onQuerySubmit(query.trim())
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 p-4 bg-card border rounded-lg shadow">
      <Sparkles className="h-6 w-6 text-primary flex-shrink-0" />
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ask a question about your data..."
        className="flex-grow"
        disabled={isLoading}
      />
      <Button type="submit" disabled={isLoading || !query.trim()}>
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
        Run Analysis
      </Button>
    </form>
  )
}
