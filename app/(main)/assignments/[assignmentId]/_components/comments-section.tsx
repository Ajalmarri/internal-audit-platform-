"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"
import type { Comment, UserStub } from "../_types/assignment-types"
import { formatDistanceToNow } from "date-fns"

interface CommentsSectionProps {
  initialComments: Comment[]
}

// Mock current user for adding comments
const currentUser: UserStub = {
  id: "USR_CURRENT",
  name: "You (Audit Team)",
  avatar: "/placeholder.svg?width=40&height=40",
}

export default function CommentsSection({ initialComments }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [newComment, setNewComment] = useState("")

  const handleAddComment = () => {
    if (newComment.trim() === "") return
    const commentToAdd: Comment = {
      id: `CMT${String(comments.length + 1).padStart(3, "0")}`,
      user: currentUser,
      text: newComment,
      timestamp: new Date(),
    }
    setComments([...comments, commentToAdd])
    setNewComment("")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Comments & Discussion</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="flex items-start gap-3">
                <Avatar className="h-9 w-9 border">
                  <AvatarImage src={comment.user.avatar || "/placeholder.svg"} alt={comment.user.name} />
                  <AvatarFallback>{comment.user.name.substring(0, 1)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 bg-muted/40 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold">{comment.user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(comment.timestamp, { addSuffix: true })}
                    </p>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{comment.text}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No comments yet. Start the discussion!</p>
          )}
        </div>
        <div className="flex items-start gap-3">
          <Avatar className="h-9 w-9 border">
            <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.name} />
            <AvatarFallback>{currentUser.name.substring(0, 1)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 relative">
            <Textarea
              placeholder="Add a comment... (Markdown supported for Audit Team)"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="pr-12 min-h-[60px]"
            />
            <Button
              size="icon"
              variant="ghost"
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              className="absolute right-2 bottom-2 h-8 w-8"
              title="Send Comment"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
