import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function DepartmentRiskProfileCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Department Risk Profile</CardTitle>
        <CardDescription>Overall risk assessment for your department.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Operational Risk</span>
            <span className="text-sm text-muted-foreground">45%</span>
          </div>
          <Progress value={45} />
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Compliance Risk</span>
            <span className="text-sm text-muted-foreground">20%</span>
          </div>
          <Progress value={20} className="[&>div]:bg-yellow-500" />
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Financial Risk</span>
            <span className="text-sm text-muted-foreground">75%</span>
          </div>
          <Progress value={75} className="[&>div]:bg-red-500" />
        </div>
      </CardContent>
    </Card>
  )
}
