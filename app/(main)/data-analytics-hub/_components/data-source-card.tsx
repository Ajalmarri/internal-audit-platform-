"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { DataSource } from "../_types/data-analytics-types"
import { PlugZap } from "lucide-react"

interface DataSourceCardProps {
  dataSource: DataSource
  onConnect: (dataSourceId: string) => void
  isConnecting: boolean
}

export default function DataSourceCard({ dataSource, onConnect, isConnecting }: DataSourceCardProps) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="items-center">
        <Image
          src={dataSource.logoUrl || "/placeholder.svg"}
          alt={`${dataSource.name} logo`}
          width={120}
          height={50}
          className="mb-4 object-contain h-12"
        />
        <CardTitle>{dataSource.name}</CardTitle>
        <CardDescription>{dataSource.description}</CardDescription>
      </CardHeader>
      <CardContent>{/* Additional details or prerequisites can be listed here */}</CardContent>
      <CardFooter>
        <Button className="w-full" onClick={() => onConnect(dataSource.id)} disabled={isConnecting}>
          <PlugZap className="mr-2 h-4 w-4" />
          {isConnecting ? "Connecting..." : "Connect"}
        </Button>
      </CardFooter>
    </Card>
  )
}
