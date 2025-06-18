"use client"

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

interface RiskTrendWidgetProps {
  data: RiskTrendDataPoint[]
  topRisks: TopEnterpriseRisk[]
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
                left: -20, // Adjust to make Y-axis labels visible
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                domain={[0, "dataMax + 1"]} // Ensure some padding at the top
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" hideLabel />} />
              <ChartLegend content={<ChartLegendContent />} />
              {topRisks.map((risk) => (
                <Line
                  key={risk.id}
                  dataKey={risk.id}
                  type="monotone"
                  stroke={risk.color}
                  strokeWidth={2}
                  dot={false}
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
