"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import type { RiskTrendDataPoint, TopEnterpriseRisk } from "../_types/command-center-types"
import type { TooltipProps } from "recharts" // For typing the formatter item

interface RiskTrendWidgetProps {
  data: RiskTrendDataPoint[]
  topRisks: TopEnterpriseRisk[]
}

// Define the formatter function for the tooltip content
const tooltipFormatter = (
  value: number, // The risk score
  name: string, // The original risk name (e.g., "Cybersecurity Risk")
  item: TooltipProps<number, string>["payload"] extends (infer U)[] ? U : never, // Individual payload item
  index: number,
  payload: TooltipProps<number, string>["payload"], // All payload items
): [React.ReactNode, string] => {
  // Returns [formattedValue, newName]

  // Ensure value is a number before calling toFixed
  const numericValue = typeof value === "number" ? value : Number.parseFloat(String(value))
  const formattedValue = `Score: ${numericValue.toFixed(1)}`
  const newName = `Risk: ${name}`

  return [formattedValue, newName]
}

export function RiskTrendWidget({ data, topRisks }: RiskTrendWidgetProps) {
  const chartConfig = topRisks.reduce((config, risk) => {
    config[risk.id] = { label: risk.name, color: risk.color }
    return config
  }, {} as any)

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Top Enterprise Risk Trend</CardTitle>
        <CardDescription>Trend of top 5 enterprise risks over the last 12 months.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 10,
                left: -20,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)} // Displays abbreviated month on axis
              />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} domain={[0, "dataMax + 1"]} />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" formatter={tooltipFormatter} />}
              />
              <ChartLegend content={<ChartLegendContent />} />
              {topRisks.map((risk) => (
                <Line
                  key={risk.id}
                  dataKey={risk.id}
                  type="monotone"
                  stroke={risk.color}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 5 }}
                  name={risk.name}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
