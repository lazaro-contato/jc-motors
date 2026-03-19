import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { TaskInstance, TaskStatus } from "@/types/workflow"

import { TaskCard } from "./TaskCard"

interface KanbanColumnProps {
  id: TaskStatus
  title: string
  color: string
  tasks: TaskInstance[]
  onTaskClick: (task: TaskInstance) => void
  onAddTask: (status: TaskStatus) => void
}

export function KanbanColumn({
  id,
  title,
  color,
  tasks,
  onTaskClick,
  onAddTask,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id })

  return (
    <div
      className={cn(
        "flex w-[280px] min-w-[280px] flex-col rounded-lg border border-border bg-muted/30 transition-colors",
        isOver && "bg-silver-100/50 ring-2 ring-brand-500/30 dark:bg-silver-900/50",
      )}
    >
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between px-3 pb-2 pt-3">
        <div className="flex items-center gap-2">
          <div className={cn("size-2.5 rounded-full", color)} />
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
            {tasks.length}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="size-6 rounded-md text-muted-foreground hover:text-foreground"
          onClick={() => onAddTask(id)}
        >
          <Plus className="size-3.5" />
        </Button>
      </div>

      {/* Cards — scrollable area */}
      <div
        ref={setNodeRef}
        className="flex flex-1 flex-col gap-2 overflow-y-auto px-2 pb-2"
      >
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onClick={onTaskClick} />
          ))}
        </SortableContext>

        {/* Empty state — ensures droppable area is always visible */}
        {tasks.length === 0 && (
          <div className="flex min-h-[60px] items-center justify-center rounded-lg border border-dashed border-border/50 text-xs text-muted-foreground">
            Arraste tarefas aqui
          </div>
        )}
      </div>
    </div>
  )
}
