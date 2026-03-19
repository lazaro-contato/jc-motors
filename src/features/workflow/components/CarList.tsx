import { Car, ChevronRight } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { WorkflowInstance } from "@/types/workflow"
import { WORKFLOW_INSTANCES } from "../data/tasks.mock"

const STATUS_LABEL: Record<string, { label: string; className: string }> = {
  in_progress: { label: "Em andamento", className: "bg-info-bg text-info" },
  completed:   { label: "Concluído",    className: "bg-success-bg text-success" },
  canceled:    { label: "Cancelado",    className: "bg-danger-bg text-danger" },
}

interface CarListProps {
  onSelectWorkflow: (workflow: WorkflowInstance) => void
}

export function CarList({ onSelectWorkflow }: CarListProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {WORKFLOW_INSTANCES.map((wf) => {
        const car = wf.car
        if (!car) return null

        const totalTasks = wf.steps.reduce((sum, s) => sum + s.tasks.length, 0)
        const doneTasks = wf.steps.reduce(
          (sum, s) => sum + s.tasks.filter((t) => t.status === "done").length,
          0,
        )
        const statusCfg = STATUS_LABEL[wf.status] ?? STATUS_LABEL.in_progress
        const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0

        return (
          <Card
            key={wf.id}
            className="cursor-pointer transition-all hover:ring-2 hover:ring-brand-500/30"
            onClick={() => onSelectWorkflow(wf)}
          >
            <CardContent className="flex items-center gap-4 p-4">
              {/* Icon */}
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-500/15">
                <Car className="size-5 text-brand-500 dark:text-brand-300" />
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-foreground">
                  {car.brand} {car.model}
                </p>
                <p className="text-xs text-muted-foreground">
                  {car.plate} · {car.year_model}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                      statusCfg.className,
                    )}
                  >
                    {statusCfg.label}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {doneTasks}/{totalTasks} tarefas
                  </span>
                </div>
                {/* Progress bar */}
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-brand-500 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Chevron */}
              <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
