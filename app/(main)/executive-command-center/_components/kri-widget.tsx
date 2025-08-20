import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { KriData } from "../_types/command-center-types"
import { KriMeter } from "./kri-meter"

interface KriWidgetProps {
  kris: KriData[]
}

export function KriWidget({ kris }: KriWidgetProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Key Risk Indicators (KRIs)</CardTitle>
        <CardDescription>Leading indicators from across the business, tracking potential future risks.</CardDescription>
      </CardHeader>
      <CardContent>
        {kris && kris.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {kris.map((kri) => (
              <KriMeter key={kri.id} kri={kri} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No Key Risk Indicators to display.</p>
        )}
      </CardContent>
    </Card>
  )
}
