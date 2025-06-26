import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { KriData } from "../_types/command-center-types"

interface KriMeterProps {
  kri: KriData
}

const getStatusColor = (status: KriData["status"]) => {
  switch (status) {
    case "Normal":
      return "bg-green-500"
    case "Elevated":
      return "bg-yellow-500"
    case "Critical":
      return "bg-red-500"
    default:
      return "bg-gray-500"
  }
}

const getStatusTextColor = (status: KriData["status"]) => {
  switch (status) {
    case "Normal":
      return "text-green-600 dark:text-green-400"
    case "Elevated":
      return "text-yellow-600 dark:text-yellow-400"
    case "Critical":
      return "text-red-600 dark:text-red-400"
    default:
      return "text-gray-600 dark:text-gray-400"
  }
}

export function KriMeter({ kri }: KriMeterProps) {
  const needleRotation = (kri.percentage / 100) * 180 - 90 // -90 to 90 degrees

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium text-center">{kri.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center flex-grow">
        <div className="relative w-40 h-20 mb-2">
          {/* Gauge Background Arc */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <div
              className="absolute top-0 left-0 w-full h-[200%] rounded-[50%_50%_0_0] transform -rotate-180"
              style={{
                clipPath: "polygon(0% 0%, 100% 0%, 100% 50%, 0% 50%)",
              }}
            >
              <div className="absolute w-full h-full">
                <div className="absolute w-1/3 h-full left-0 bg-green-500/30 rounded-tl-full"></div>
                <div
                  className="absolute w-1/3 h-full left-1/3 bg-yellow-500/30"
                  style={{ transform: "skewX(-30deg) translateX(-1px)" }} // Approximate segment
                ></div>
                <div className="absolute w-1/3 h-full right-0 bg-red-500/30 rounded-tr-full"></div>
              </div>
            </div>
          </div>

          {/* Needle */}
          <div
            className="absolute bottom-0 left-1/2 w-0.5 h-16 bg-gray-700 dark:bg-gray-300 origin-bottom transform -translate-x-1/2"
            style={{ transform: `translateX(-50%) rotate(${needleRotation}deg)` }}
          />
          {/* Needle Hub */}
          <div className="absolute bottom-0 left-1/2 w-3 h-3 bg-gray-700 dark:bg-gray-300 rounded-full transform -translate-x-1/2 translate-y-1/2" />
        </div>
        <p className="text-2xl font-bold">{kri.value}</p>
        <p className={cn("text-sm font-semibold", getStatusTextColor(kri.status))}>{kri.status}</p>
      </CardContent>
    </Card>
  )
}
