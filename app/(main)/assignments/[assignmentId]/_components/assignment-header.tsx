import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Share2, Edit, MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { AssignmentStatus } from "../_types/assignment-types"

interface AssignmentHeaderProps {
  title: string
  status: AssignmentStatus
}

const statusBadgeVariant: Record<AssignmentStatus, "default" | "secondary" | "destructive" | "outline"> = {
  Planning: "outline",
  Preparation: "secondary",
  Fieldwork: "default", // Blue-ish
  Reporting: "default",
  "Follow-up": "secondary",
  Completed: "default", // Should be green
  Cancelled: "destructive",
}

const statusBadgeColor: Record<AssignmentStatus, string> = {
  Planning: "",
  Preparation: "",
  Fieldwork: "bg-blue-500 hover:bg-blue-600 text-white",
  Reporting: "bg-purple-500 hover:bg-purple-600 text-white",
  "Follow-up": "bg-teal-500 hover:bg-teal-600 text-white",
  Completed: "bg-green-500 hover:bg-green-600 text-white",
  Cancelled: "",
}

export default function AssignmentHeader({ title, status }: AssignmentHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-semibold text-foreground leading-tight">{title}</h1>
        <Badge variant={statusBadgeVariant[status]} className={`mt-1.5 ${statusBadgeColor[status]}`}>
          Status: {status}
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline">
          <Share2 className="mr-2 h-4 w-4" /> Share
        </Button>
        <Button>
          <Edit className="mr-2 h-4 w-4" /> Edit Assignment
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Mark as Complete</DropdownMenuItem>
            <DropdownMenuItem>Generate Report</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">Cancel Assignment</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
