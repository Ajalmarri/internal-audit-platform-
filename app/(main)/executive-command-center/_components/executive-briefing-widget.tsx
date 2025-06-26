"use client"

import { useState, useEffect, useRef, type FormEvent } from "react"
import { RefreshCw, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import type { JSX } from "react/jsx-runtime" // Import JSX to fix the undeclared variable error

interface Message {
  id: string
  sender: "user" | "ai"
  content: string | JSX.Element
  timestamp: Date
}

// Mock function to simulate AI generating an initial briefing
const generateMockInitialBriefing = async (): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const exampleBriefing =
        "For Q2 2025, the overall control environment is rated as **Effective**. The annual audit plan is **65% complete** and on track. A key area of focus is **Cybersecurity**, which shows a slight upward risk trend driven by 7 new high-risk findings this quarter. Leadership attention is recommended for the 12 overdue action plans, primarily within the IT Department."
      resolve(exampleBriefing)
    }, 1000)
  })
}

// Mock function to simulate AI responding to a follow-up question
const generateMockAiFollowUp = async (userMessage: string): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let response = "I'm not sure how to respond to that yet. Try asking about 'high-risk findings'."
      if (userMessage.toLowerCase().includes("high-risk findings")) {
        response =
          "Of the 7 new high-risk findings, 4 are related to **'IT Security'** and 3 are related to **'Financial Controls'**. The most critical is **'Unsecured S3 Bucket'**, which has an assigned owner but no approved action plan yet. Would you like to see the full list?"
      } else if (userMessage.toLowerCase().includes("full list")) {
        response =
          "Displaying the full list of high-risk findings is not yet implemented in this demo. However, I can tell you more about specific categories if you like."
      }
      resolve(response)
    }, 1200)
  })
}

// Helper to render text with **bold** markdown
const renderFormattedText = (text: string): JSX.Element => {
  const parts = text.split(/(\*\*.*?\*\*)/g)
  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={index}>{part.slice(2, -2)}</strong>
        }
        return part
      })}
    </>
  )
}

export function ExecutiveBriefingWidget() {
  const [conversation, setConversation] = useState<Message[]>([])
  const [userInput, setUserInput] = useState<string>("")
  const [isLoadingInitialBriefing, setIsLoadingInitialBriefing] = useState<boolean>(true)
  const [isAiResponding, setIsAiResponding] = useState<boolean>(false)
  const [lastBriefingTimestamp, setLastBriefingTimestamp] = useState<string | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector("div[data-radix-scroll-area-viewport]")
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight
      }
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [conversation])

  const loadInitialBriefing = async (isRefresh = false) => {
    setIsLoadingInitialBriefing(true)
    if (isRefresh) {
      setConversation([]) // Clear previous conversation on refresh
    }

    const initialBriefingText = await generateMockInitialBriefing()
    const newTimestamp = new Date()
    const initialAiMessage: Message = {
      id: `ai-init-${Date.now()}`,
      sender: "ai",
      content: renderFormattedText(initialBriefingText),
      timestamp: newTimestamp,
    }

    let updatedConversation = [initialAiMessage]

    // Add example interaction if it's the very first load (not a refresh)
    // and if the conversation is empty (or just has the initial briefing)
    if (!isRefresh) {
      const exampleUserMessage: Message = {
        id: `user-example-${Date.now()}`,
        sender: "user",
        content: "Tell me more about the 7 new high-risk findings.",
        timestamp: new Date(newTimestamp.getTime() + 1000), // slightly after
      }
      const exampleAiResponseText =
        "Of the 7 new high-risk findings, 4 are related to **'IT Security'** and 3 are related to **'Financial Controls'**. The most critical is **'Unsecured S3 Bucket'**, which has an assigned owner but no approved action plan yet. Would you like to see the full list?"
      const exampleAiMessage: Message = {
        id: `ai-example-${Date.now()}`,
        sender: "ai",
        content: renderFormattedText(exampleAiResponseText),
        timestamp: new Date(newTimestamp.getTime() + 2000), // slightly after user
      }
      updatedConversation = [...updatedConversation, exampleUserMessage, exampleAiMessage]
    }

    setConversation(updatedConversation)
    setLastBriefingTimestamp(
      newTimestamp.toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
    )
    setIsLoadingInitialBriefing(false)
  }

  useEffect(() => {
    loadInitialBriefing()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Load initial briefing on mount

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault()
    if (!userInput.trim() || isAiResponding) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      content: userInput,
      timestamp: new Date(),
    }
    setConversation((prev) => [...prev, userMessage])
    setUserInput("")
    setIsAiResponding(true)

    const aiResponseText = await generateMockAiFollowUp(userInput)
    const aiMessage: Message = {
      id: `ai-${Date.now()}`,
      sender: "ai",
      content: renderFormattedText(aiResponseText),
      timestamp: new Date(),
    }
    setConversation((prev) => [...prev, aiMessage])
    setIsAiResponding(false)
  }

  return (
    <Card className="w-full flex flex-col h-[600px]">
      {" "}
      {/* Increased height for chat */}
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b">
        <CardTitle className="text-xl font-semibold">AI-Powered Executive Briefing</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={() => loadInitialBriefing(true)}
          disabled={isLoadingInitialBriefing || isAiResponding}
          aria-label="Generate new briefing"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoadingInitialBriefing ? "animate-spin" : ""}`} />
          {isLoadingInitialBriefing ? "Generating..." : "Refresh Briefing"}
        </Button>
      </CardHeader>
      <CardContent className="flex-grow p-0 overflow-hidden">
        <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
          {isLoadingInitialBriefing && conversation.length === 0 ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className={cn("flex items-end space-x-2", i % 2 === 0 ? "justify-start" : "justify-end")}>
                  {i % 2 === 0 && <Skeleton className="h-8 w-8 rounded-full" />}
                  <div
                    className={cn(
                      "p-3 rounded-lg max-w-[70%]",
                      i % 2 === 0 ? "bg-muted" : "bg-primary text-primary-foreground",
                    )}
                  >
                    <Skeleton className="h-4 w-48 mb-1" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  {i % 2 !== 0 && <Skeleton className="h-8 w-8 rounded-full" />}
                </div>
              ))}
            </div>
          ) : (
            conversation.map((msg) => (
              <div
                key={msg.id}
                className={cn("flex items-end space-x-2 mb-4", msg.sender === "user" ? "justify-end" : "justify-start")}
              >
                {msg.sender === "ai" && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?width=32&height=32" alt="AI Avatar" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "p-3 rounded-lg max-w-[70%] text-sm",
                    msg.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted",
                  )}
                >
                  <p className="leading-relaxed">{msg.content}</p>
                  <p className="text-xs opacity-70 mt-1 text-right">
                    {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                {msg.sender === "user" && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?width=32&height=32" alt="User Avatar" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))
          )}
          {isAiResponding && (
            <div className="flex items-end space-x-2 mb-4 justify-start">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?width=32&height=32" alt="AI Avatar" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <div className="p-3 rounded-lg bg-muted max-w-[70%]">
                <div className="flex space-x-1">
                  <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-0"></span>
                  <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                  <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-300"></span>
                </div>
              </div>
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
          <Input
            type="text"
            placeholder="Ask a follow-up question..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            disabled={isAiResponding || isLoadingInitialBriefing}
            className="flex-grow"
          />
          <Button type="submit" size="icon" disabled={isAiResponding || isLoadingInitialBriefing || !userInput.trim()}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </CardFooter>
      {lastBriefingTimestamp && !isLoadingInitialBriefing && (
        <div className="text-xs text-muted-foreground px-4 pb-2 text-center">
          Initial briefing generated: {lastBriefingTimestamp}
        </div>
      )}
    </Card>
  )
}
