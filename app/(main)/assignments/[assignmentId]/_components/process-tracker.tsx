import { cn } from "@/lib/utils"
import { CheckCircle } from "lucide-react"

interface ProcessTrackerProps {
  stages: string[]
  currentStageIndex: number
}

export default function ProcessTracker({ stages, currentStageIndex }: ProcessTrackerProps) {
  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="flex items-center min-w-max">
        {stages.map((stage, index) => {
          const isCompleted = index < currentStageIndex
          const isCurrent = index === currentStageIndex
          const isFuture = index > currentStageIndex

          return (
            <div key={stage} className={cn("flex items-center", index < stages.length - 1 ? "flex-1" : "")}>
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center border-2",
                    isCompleted ? "bg-primary border-primary text-primary-foreground" : "",
                    isCurrent ? "bg-primary/20 border-primary text-primary animate-pulse" : "",
                    isFuture ? "bg-muted border-muted-foreground/30 text-muted-foreground" : "",
                  )}
                >
                  {isCompleted ? <CheckCircle className="w-5 h-5" /> : <span>{index + 1}</span>}
                </div>
                <p
                  className={cn(
                    "text-xs mt-1 text-center w-20 truncate",
                    isCompleted ? "font-medium text-primary" : "",
                    isCurrent ? "font-semibold text-primary" : "",
                    isFuture ? "text-muted-foreground" : "",
                  )}
                  title={stage}
                >
                  {stage}
                </p>
              </div>
              {index < stages.length - 1 && (
                <div
                  className={cn("flex-1 h-1 mx-1", isCompleted || isCurrent ? "bg-primary" : "bg-muted-foreground/30")}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
