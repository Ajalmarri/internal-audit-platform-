import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import type { ActivityLogEntry, ActionType } from "../_types/activity-log-types"
import { format } from "date-fns"
import {
  PlusCircle,
  Edit3,
  Trash2,
  Eye,
  LogIn,
  LogOut,
  Download,
  Settings,
  ShieldCheck,
  FileText,
  Info,
  type LucideIcon,
  ShieldAlert,
  Users,
  BarChart3,
} from "lucide-react"

interface ActivityLogItemProps {
  entry: ActivityLogEntry
}

const actionIcons: Record<ActionType, LucideIcon> = {
  CREATE: PlusCircle,
  UPDATE: Edit3,
  DELETE: Trash2,
  VIEW: Eye,
  LOGIN: LogIn,
  LOGOUT: LogOut,
  EXPORT: Download,
  SETTINGS_CHANGE: Settings,
  PERMISSION_CHANGE: ShieldCheck,
}

const getItemIcon = (itemType?: string): LucideIcon => {
  switch (itemType) {
    case "Finding":
      return FileText
    case "Risk":
      return ShieldAlert
    case "Control":
      return ShieldCheck
    case "User":
      return Users
    case "Report":
      return BarChart3
    default:
      return Info
  }
}

export default function ActivityLogItem({ entry }: ActivityLogItemProps) {
  const ActionIcon = actionIcons[entry.actionType] || Info
  const ItemIcon = getItemIcon(entry.itemType)

  return (
    <Card className="mb-3 hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4 flex items-start space-x-4">
        <div className="flex flex-col items-center pt-1">
          <Avatar className="h-10 w-10 mb-1">
            <AvatarImage src={entry.user.avatarUrl || "/placeholder.svg"} alt={entry.user.name} />
            <AvatarFallback>{entry.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <ActionIcon className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start mb-1">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{entry.user.name}</p>
            <p className="text-xs text-muted-foreground">{format(entry.timestamp, "MMM d, yyyy, hh:mm:ss a")}</p>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300">{entry.description}</p>
          {entry.itemType && entry.itemId && (
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              <ItemIcon className="h-3 w-3 mr-1.5" />
              {entry.itemType}: {entry.itemId}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
