import type React from "react"

interface Comment {
  id: string
  author: string
  text: string
  createdAt: Date
}

interface CommentsSectionProps {
  assignmentId: string
}

const mockComments: Comment[] = [
  {
    id: "assignment-1-comment-1", // Updated ID to match assignment ID
    author: "Alice",
    text: "This is a great assignment!",
    createdAt: new Date(),
  },
  {
    id: "assignment-1-comment-2", // Updated ID to match assignment ID
    author: "Bob",
    text: "I agree, very informative.",
    createdAt: new Date(),
  },
  {
    id: "assignment-2-comment-1", // Updated ID to match assignment ID
    author: "Charlie",
    text: "Needs more details on section 3.",
    createdAt: new Date(),
  },
]

const CommentsSection: React.FC<CommentsSectionProps> = ({ assignmentId }) => {
  const filteredComments = mockComments.filter((comment) => comment.id.startsWith(`assignment-${assignmentId}`))

  return (
    <div>
      <h3>Comments</h3>
      {filteredComments.length > 0 ? (
        <ul>
          {filteredComments.map((comment) => (
            <li key={comment.id}>
              <strong>{comment.author}:</strong> {comment.text} - {comment.createdAt.toLocaleDateString()}
            </li>
          ))}
        </ul>
      ) : (
        <p>No comments yet.</p>
      )}
    </div>
  )
}

export default CommentsSection
