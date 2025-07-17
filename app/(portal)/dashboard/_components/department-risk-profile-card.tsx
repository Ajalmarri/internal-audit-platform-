import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const riskData = [
  { name: "Operational", level: 75, color: "bg-red-500" },
  { name: "Financial", level: 45, color: "bg-yellow-500" },
  { name: "Compliance", level: 60, color: "bg-orange-500" },
  { name: "Strategic", level: 30, color: "bg-green-500" },
]

export function DepartmentRiskProfileCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Department Risk Profile</CardTitle>
        <CardDescription>Overall risk exposure for the Sales department.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {riskData.map((risk) => (
          <div key={risk.name} className="space-y-1">
            <div className="flex justify-between items-baseline">
              <p className="text-sm font-medium">{risk.name}</p>
              <p className="text-sm font-semibold">{risk.level}%</p>
            </div>
            <div className="w-full bg-muted rounded-full h-2.5">
              <div className={`${risk.color} h-2.5 rounded-full`} style={{ width: `${risk.level}%` }}></div>
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter className="justify-end">
        <Button asChild variant="ghost" size="sm">
          <Link href="#">
            View Detailed Risk Report <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
