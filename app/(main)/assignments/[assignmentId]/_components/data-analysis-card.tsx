import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { FileText, PlusCircle, FileSpreadsheet } from "lucide-react"
import Link from "next/link"

type EvidenceFile = {
  id: string
  name: string
  type: "csv" | "xlsx"
  size: string
  analysisDate: string
}

const mockEvidence: EvidenceFile[] = [
  {
    id: "EV001",
    name: "Duplicate Payments Report - Jun 2025.csv",
    type: "csv",
    size: "1.2 MB",
    analysisDate: "2025-07-28",
  },
  {
    id: "EV002",
    name: "Journal Entry Sample - Q3.xlsx",
    type: "xlsx",
    size: "850 KB",
    analysisDate: "2025-07-29",
  },
  {
    id: "EV003",
    name: "Anomalous Expense Claims.csv",
    type: "csv",
    size: "450 KB",
    analysisDate: "2025-08-01",
  },
]

const getFileIcon = (type: EvidenceFile["type"]) => {
  switch (type) {
    case "csv":
      return <FileText className="h-5 w-5 text-muted-foreground" />
    case "xlsx":
      return <FileSpreadsheet className="h-5 w-5 text-muted-foreground" />
    default:
      return <FileText className="h-5 w-5 text-muted-foreground" />
  }
}

export default function DataAnalysisCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Analysis & Evidence</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Link href="/data-analytics" passHref>
          <Button className="w-full">
            <PlusCircle className="mr-2 h-4 w-4" />
            Request & Analyze Data
          </Button>
        </Link>
        <Separator />
        <div>
          <h4 className="text-sm font-medium mb-2">Attached Evidence</h4>
          {mockEvidence.length > 0 ? (
            <ul className="space-y-3">
              {mockEvidence.map((file) => (
                <li
                  key={file.id}
                  className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {getFileIcon(file.type)}
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{file.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {file.size} - Analyzed on {file.analysisDate}
                      </span>
                    </div>
                  </div>
                  {/* Maybe add a download or remove button here in the future */}
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center text-sm text-muted-foreground py-4">
              No evidence has been attached from the Data Analytics Hub.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
