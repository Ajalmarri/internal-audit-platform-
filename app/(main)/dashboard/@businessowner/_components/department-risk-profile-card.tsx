"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"

const riskData = [
  { name: "Operational", level: 7, fill: "hsl(var(--chart-1))" },
  { name: "Financial", level: 5, fill: "hsl(var(--chart-2))" },
  { name: "Compliance", level: 8, fill: "hsl(var(--chart-3))" },
  { name: "Strategic", level: 4, fill: "hsl(var(--chart-4))" },
  { name: "IT Security", level: 9, fill: "hsl(var(--chart-5))" },
]

export function DepartmentRiskProfileCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Department Risk Profile</CardTitle>
        <CardDescription>Current risk levels across key categories.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={riskData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} domain={[0, 10]} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--background))",
                  borderColor: "hsl(var(--border))",
                }}
              />
              <Bar dataKey="level" name="Risk Level" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
