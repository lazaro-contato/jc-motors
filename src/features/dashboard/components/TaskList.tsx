import { CheckCircle2, ChevronRight, Circle, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { RECENT_TASKS, type TaskStatus } from "../data/dashboard.mock"

const TASK_STATUS_ICON: Record<TaskStatus, React.ReactNode> = {
  pending: <Circle className="size-3.5 text-muted-foreground" />,
  doing: <Loader2 className="size-3.5 animate-spin text-info" />,
  done: <CheckCircle2 className="size-3.5 text-success" />,
  canceled: <Circle className="size-3.5 text-danger" />,
}

export function TaskList() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="flex-row items-center justify-between space-y-0 border-b border-border pb-3">
        <CardTitle className="text-base font-semibold">Minhas Tarefas</CardTitle>
        <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs text-muted-foreground">
          Ver todas <ChevronRight className="size-3" />
        </Button>
      </CardHeader>
      <CardContent className="flex-1 divide-y divide-border p-0">
        {RECENT_TASKS.map((task) => (
          <div
            key={task.id}
            className={cn(
              "flex items-start gap-3 px-5 py-3.5 transition-colors hover:bg-muted/40",
              task.status === "done" && "opacity-50",
            )}
          >
            <span className="mt-0.5 shrink-0">{TASK_STATUS_ICON[task.status]}</span>
            <div className="min-w-0 flex-1">
              <p className={cn("truncate text-sm font-medium text-foreground", task.status === "done" && "line-through")}>
                {task.title}
              </p>
              <p className="truncate text-xs text-muted-foreground">{task.workflow}</p>
            </div>
            <div className="ml-2 shrink-0 text-right">
              <p className="text-xs text-muted-foreground">{task.assignee}</p>
              <p className={cn("text-xs font-medium", task.due === "Hoje" ? "text-danger" : "text-muted-foreground")}>
                {task.due}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
