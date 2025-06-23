"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import type { TooltipProps } from "recharts"
import type { RiskTrendDataPoint, TopEnterpriseRisk, RiskDetail } from "../_types/command-center-types"
import { RiskDetailSheet } from "./risk-detail-sheet"

interface RiskTrendWidgetProps {
  data: RiskTrendDataPoint[]
  topRisks: TopEnterpriseRisk[]
}

interface SelectedRiskData {
  riskId: string
  riskName: string
  date: string
  details: RiskDetail
}

const tooltipFormatter = (
  value: number,
  name: string,
  item: TooltipProps<number, string>["payload"] extends (infer U)[] ? U : never,
): [React.ReactNode, string] => {
  const numericValue = typeof value === "number" ? value : Number.parseFloat(String(value))
  const formattedValue = `Score: ${numericValue.toFixed(1)}`
  return [formattedValue, `Risk: ${name}`]
}

export function RiskTrendWidget({ data, topRisks }: RiskTrendWidgetProps) {
  const [selectedRisk, setSelectedRisk] = useState<SelectedRiskData | null>(null)

  const chartConfig = topRisks.reduce((config, risk) => {
    config[risk.id] = { label: risk.name, color: risk.color }
    return config
  }, {} as any)

  const handleChartClick = (chartState: any) => {
    if (chartState && chartState.activePayload && chartState.activePayload.length > 0) {
      const payload = chartState.activePayload[0].payload
      const dataKey = chartState.activePayload[0].dataKey
      const riskId = dataKey.split(".")[0] as TopEnterpriseRisk["id"]

      const riskInfo = topRisks.find((r) => r.id === riskId)
      const riskDetails = payload[riskId] as RiskDetail

      if (riskInfo && riskDetails) {
        setSelectedRisk({
          riskId: riskId,
          riskName: riskInfo.name,
          date: payload.month,
          details: riskDetails,
        })
      }
    }
  }

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Top Enterprise Risk Trend</CardTitle>
          <CardDescription>Trend of top 5 enterprise risks. Click a data point for details.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full cursor-pointer">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }} onClick={handleChartClick}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.split(" ")[0].slice(0, 3)}
                />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} domain={[0, "dataMax + 1"]} />
                <ChartTooltip
                  cursor={true}
                  content={<ChartTooltipContent indicator="dot" formatter={tooltipFormatter} />}
                />
                <ChartLegend content={<ChartLegendContent />} />
                {topRisks.map((risk) => (
                  <Line
                    key={risk.id}
                    dataKey={`${risk.id}.score`} // Access nested score property
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
      <RiskDetailSheet selectedRisk={selectedRisk} onOpenChange={() => setSelectedRisk(null)} />
    </>
  )
}
