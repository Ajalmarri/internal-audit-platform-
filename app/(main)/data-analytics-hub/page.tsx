"use client"

import { Button } from "@/components/ui/button"

import { useState } from "react"
import {
  type DataSource,
  type DataSet,
  type ColumnConfig,
  mockDataSources,
  mockDataSetsForDynamics,
} from "./_types/data-analytics-types"
import DataSourceCard from "./_components/data-source-card"
import AiCopilotInput from "./_components/ai-copilot-input"
import DatasetSelector from "./_components/dataset-selector"
import DataPreviewTable from "./_components/data-preview-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"

export default function DataAnalyticsHubPage() {
  const [isConnected, setIsConnected] = useState(false)
  const [connectedDataSource, setConnectedDataSource] = useState<DataSource | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)

  const [availableDataSets, setAvailableDataSets] = useState<DataSet[]>([])
  const [selectedDataSet, setSelectedDataSet] = useState<DataSet | null>(null)
  const [isLoadingDataSet, setIsLoadingDataSet] = useState(false)

  const [tableData, setTableData] = useState<Record<string, any>[]>([])
  const [tableColumns, setTableColumns] = useState<ColumnConfig[]>([])

  const [aiQuery, setAiQuery] = useState("")
  const [aiSummary, setAiSummary] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleConnect = async (dataSourceId: string) => {
    setIsConnecting(true)
    setAiSummary(null)
    setSelectedDataSet(null)
    setTableData([])

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    const source = mockDataSources.find((ds) => ds.id === dataSourceId)
    if (source) {
      setConnectedDataSource(source)
      // For now, only Dynamics 365 has mock datasets
      if (dataSourceId === "dynamics365") {
        setAvailableDataSets(mockDataSetsForDynamics)
      } else {
        setAvailableDataSets([]) // Handle other sources if added
      }
      setIsConnected(true)
    }
    setIsConnecting(false)
  }

  const handleSelectDataSet = async (dataSetId: string) => {
    setIsLoadingDataSet(true)
    setAiSummary(null) // Clear previous AI summary
    const dataSet = availableDataSets.find((ds) => ds.id === dataSetId)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 700))

    if (dataSet) {
      setSelectedDataSet(dataSet)
      setTableData(dataSet.sampleData)
      setTableColumns(dataSet.columns)
    }
    setIsLoadingDataSet(false)
  }

  const handleAiQuerySubmit = async (query: string) => {
    if (!selectedDataSet) {
      setAiSummary("Please select a data set before running an analysis.")
      return
    }
    setIsAnalyzing(true)
    setAiQuery(query)
    setAiSummary(null) // Clear previous summary

    // Simulate AI processing and data filtering
    await new Promise((resolve) => setTimeout(resolve, 2000))

    let filteredData = selectedDataSet.sampleData
    let summary = `Analysis complete for query: "${query}" on data set "${selectedDataSet.name}".`

    // Mock AI logic: very basic filtering for demonstration
    if (
      query.toLowerCase().includes("invoice") &&
      query.toLowerCase().includes("over $10000") &&
      query.toLowerCase().includes("without a purchase order")
    ) {
      filteredData = selectedDataSet.sampleData.filter(
        (row: Record<string, any>) =>
          row.amount > 10000 && !row.purchaseOrder && selectedDataSet.id === "vendorInvoices",
      )
      const totalAmount = filteredData.reduce((sum, row) => sum + row.amount, 0)
      summary = `Found ${filteredData.length} invoices over $10,000 without a purchase order, totaling $${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}.`
    } else if (query.toLowerCase().includes("sales") && query.toLowerCase().includes("client x")) {
      filteredData = selectedDataSet.sampleData.filter(
        (row: Record<string, any>) =>
          row.description?.toLowerCase().includes("client x") && selectedDataSet.id === "generalLedger",
      )
      summary = `Found ${filteredData.length} general ledger entries related to 'Client X'.`
    }
    // Add more mock query interpretations here

    setTableData(filteredData)
    setAiSummary(summary)
    setIsAnalyzing(false)
  }

  const handleDisconnect = () => {
    setIsConnected(false)
    setConnectedDataSource(null)
    setAvailableDataSets([])
    setSelectedDataSet(null)
    setTableData([])
    setTableColumns([])
    setAiQuery("")
    setAiSummary(null)
  }

  if (!isConnected) {
    return (
      <div className="container mx-auto p-4 md:p-8 space-y-8">
        <header className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Data Analytics Hub</h1>
          <p className="text-muted-foreground mt-2">
            Connect to integrated data sources to run analyses and gather evidence for your audit assignments.
          </p>
        </header>
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-center">Select a Data Source to Connect</h2>
          <div className="flex flex-wrap justify-center gap-6">
            {mockDataSources.map((ds) => (
              <DataSourceCard
                key={ds.id}
                dataSource={ds}
                onConnect={handleConnect}
                isConnecting={isConnecting && connectedDataSource?.id !== ds.id} // Only show loading for the one being clicked
              />
            ))}
          </div>
        </section>
      </div>
    )
  }

  // Connected State
  return (
    <div className="h-screen flex flex-col p-4 gap-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Data Analytics Hub: <span className="text-primary">{connectedDataSource?.name}</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Use the AI Copilot to query your data or select a data set below.
          </p>
        </div>
        <Button variant="outline" onClick={handleDisconnect}>
          Disconnect
        </Button>
      </header>

      <AiCopilotInput onQuerySubmit={handleAiQuerySubmit} isLoading={isAnalyzing} />

      {aiSummary && (
        <Alert
          variant={
            aiSummary.startsWith("Found") || aiSummary.startsWith("Analysis complete") ? "default" : "destructive"
          }
          className="my-4"
        >
          {aiSummary.startsWith("Found") || aiSummary.startsWith("Analysis complete") ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertTitle>
            {aiSummary.startsWith("Found") || aiSummary.startsWith("Analysis complete")
              ? "AI Analysis Summary"
              : "AI Copilot Note"}
          </AlertTitle>
          <AlertDescription>{aiSummary}</AlertDescription>
        </Alert>
      )}

      <Separator className="my-2" />

      <div className="flex-grow grid grid-cols-1 md:grid-cols-[300px_1fr] gap-4 overflow-hidden">
        <DatasetSelector
          dataSets={availableDataSets}
          selectedDataSetId={selectedDataSet?.id || null}
          onSelectDataSet={handleSelectDataSet}
          isLoading={isLoadingDataSet || isAnalyzing}
        />
        <Card className="flex-grow flex flex-col overflow-hidden">
          <CardHeader>
            <CardTitle>{selectedDataSet ? `Preview: ${selectedDataSet.name}` : "Data Preview"}</CardTitle>
            <CardDescription>
              {selectedDataSet ? selectedDataSet.description : "Select a data set to see a preview or run an AI query."}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow overflow-auto">
            <DataPreviewTable data={tableData} columns={tableColumns} isLoading={isLoadingDataSet || isAnalyzing} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
