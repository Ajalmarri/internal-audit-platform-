import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react"
import type { ComplianceStatusData } from "../_types/command-center-types"

interface ComplianceStatusWidgetProps {
  data: ComplianceStatusData
}

export function ComplianceStatusWidget({ data }: ComplianceStatusWidgetProps) {
  const getStatusStyles = () => {
    switch (data.status) {
      case "Effective":
        return {
          bgColor: "bg-green-100 dark:bg-green-900",
          textColor: "text-green-700 dark:text-green-300",
          Icon: CheckCircle,
          iconColor: "text-green-500 dark:text-green-400",
        }
      case "Needs Improvement":
        return {
          bgColor: "bg-yellow-100 dark:bg-yellow-900",
          textColor: "text-yellow-700 dark:text-yellow-300",
          Icon: AlertTriangle,
          iconColor: "text-yellow-500 dark:text-yellow-400",
        }
      case "Ineffective":
        return {
          bgColor: "bg-red-100 dark:bg-red-900",
          textColor: "text-red-700 dark:text-red-300",
          Icon: XCircle,
          iconColor: "text-red-500 dark:text-red-400",
        }
      default:
        return {
          bgColor: "bg-gray-100 dark:bg-gray-700",
          textColor: "text-gray-700 dark:text-gray-300",
          Icon: AlertTriangle, // Default icon
          iconColor: "text-gray-500 dark:text-gray-400",
        }
    }
  }

  const { bgColor, textColor, Icon, iconColor } = getStatusStyles()

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Organizational Compliance Status</CardTitle>
      </CardHeader>
      <CardContent className={`p-6 rounded-lg ${bgColor}`}>
        <div className="flex items-center justify-center mb-4">
          <Icon className={`h-16 w-16 ${iconColor}`} />
        </div>
        <h2 className={`text-4xl font-bold text-center mb-2 ${textColor}`}>{data.status}</h2>
        <p className={`text-center text-sm ${textColor}`}>{data.summary}</p>
        <p className={`text-center text-xs mt-2 ${textColor} opacity-80`}>As of {data.assessmentDate}</p>
      </CardContent>
    </Card>
  )
}
