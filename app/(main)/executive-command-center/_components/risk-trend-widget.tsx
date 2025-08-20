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
import { RiskDetailSheet } from "./risk-detail-sheet" // Corrected: This file now exists

// Define SelectedRiskData here or move to _types/command-center-types.ts if used elsewhere
export interface SelectedRiskData {
  // Exporting for RiskDetailSheet
  riskId: string
  riskName: string
  date: string // This is the 'month' field from RiskTrendDataPoint
  details: RiskDetail // This is the specific risk's data for that month
}

export interface RiskTrendWidgetProps {
  data: RiskTrendDataPoint[]
  topRisks: TopEnterpriseRisk[]
}

const tooltipFormatter = (
  value: number,
  name: string, // This is topRisks[i].name
  item: TooltipProps<number, string>["payload"] extends (infer U)[] ? U : never,
): [React.ReactNode, string] => {
  // 'value' here is actually the riskDetail.score
  const numericValue = typeof value === "number" ? value : Number.parseFloat(String(value))
  const formattedValue = `Score: ${numericValue.toFixed(1)}`
  // 'name' is the series name (e.g., "Cybersecurity Risk")
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
      const activeItem = chartState.activePayload[0] // The specific line/point clicked
      const dataPoint = activeItem.payload // The whole data object for that X-axis point (month)

      // dataKey from the active line (e.g., "cyberRisk.score")
      const fullDataKey = activeItem.dataKey
      const riskId = fullDataKey.split(".")[0] as TopEnterpriseRisk["id"]

      const riskInfo = topRisks.find((r) => r.id === riskId)
      // The riskDetail object for the clicked riskId within the dataPoint
      const riskDetailsForClickedRisk = dataPoint[riskId] as RiskDetail

      if (riskInfo && riskDetailsForClickedRisk) {
        setSelectedRisk({
          riskId: riskId,
          riskName: riskInfo.name,
          date: dataPoint.month, // The month/year for this data point
          details: riskDetailsForClickedRisk, // The specific details for the clicked risk
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
                  tickFormatter={(value) => value.split(" ")[0].slice(0, 3)} // Assumes "Month Year" format
                />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} domain={[0, "dataMax + 1"]} />
                <ChartTooltip
                  cursor={true} // Show cursor line
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
                    activeDot={{ r: 5, strokeWidth: 1, fill: risk.color }} // Enhanced activeDot
                    name={risk.name} // Used by legend and tooltipFormatter
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
