"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { DataSet } from "../_types/data-analytics-types"
import { Database } from "lucide-react"

interface DatasetSelectorProps {
  dataSets: DataSet[]
  selectedDataSetId: string | null
  onSelectDataSet: (dataSetId: string) => void
  isLoading: boolean
}

export default function DatasetSelector({
  dataSets,
  selectedDataSetId,
  onSelectDataSet,
  isLoading,
}: DatasetSelectorProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Available Data Sets</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-280px)]">
          {" "}
          {/* Adjust height as needed */}
          <div className="p-4 space-y-2">
            {dataSets.map((dataSet) => (
              <Button
                key={dataSet.id}
                variant={selectedDataSetId === dataSet.id ? "secondary" : "ghost"}
                className="w-full justify-start text-left h-auto py-2"
                onClick={() => onSelectDataSet(dataSet.id)}
                disabled={isLoading}
              >
                <Database className="mr-3 h-5 w-5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">{dataSet.name}</p>
                  <p className="text-xs text-muted-foreground">{dataSet.description}</p>
                </div>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
