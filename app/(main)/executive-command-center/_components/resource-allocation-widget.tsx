"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import type { ResourceAllocationDataPoint } from "../_types/command-center-types"

interface ResourceAllocationWidgetProps {
  data: ResourceAllocationDataPoint[]
}

export function ResourceAllocationWidget({ data }: ResourceAllocationWidgetProps) {
  const chartConfig = data.reduce((config, item) => {
    config[item.name] = { label: item.name, color: item.fill }
    return config
  }, {} as any)

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Audit Function Resource Allocation</CardTitle>
        <CardDescription>Distribution of audit resources by focus area.</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        <ChartContainer config={chartConfig} className="h-[300px] w-full max-w-xs">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={60} // This makes it a donut chart
                labelLine={false}
                // label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} // Optional: labels on slices
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <ChartLegend
                content={<ChartLegendContent nameKey="name" />}
                verticalAlign="bottom"
                align="center"
                iconType="circle"
                wrapperStyle={{ paddingTop: "20px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
