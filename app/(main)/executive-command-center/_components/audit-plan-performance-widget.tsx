import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { AuditPlanPerformanceData } from "../_types/command-center-types"

interface AuditPlanPerformanceWidgetProps {
  data: AuditPlanPerformanceData
}

export function AuditPlanPerformanceWidget({ data }: AuditPlanPerformanceWidgetProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Annual Audit Plan Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex justify-between items-baseline mb-1">
            <span className="text-sm text-muted-foreground">Overall Completion</span>
            <span className="text-2xl font-bold text-primary">{data.overallProgress}%</span>
          </div>
          <Progress value={data.overallProgress} aria-label={`${data.overallProgress}% complete`} className="h-4" />
        </div>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-2xl font-semibold">
              {data.auditsCompleted}/{data.totalAudits}
            </p>
            <p className="text-xs text-muted-foreground">Audits Completed</p>
          </div>
          <div>
            <p className="text-2xl font-semibold">{data.highRiskFindings}</p>
            <p className="text-xs text-muted-foreground">High-Risk Findings Issued</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
