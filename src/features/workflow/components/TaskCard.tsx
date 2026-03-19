import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, Users } from "lucide-react"

import { cn } from "@/lib/utils"
import type { TaskInstance } from "@/types/workflow"

/* ── Static card (used in DragOverlay) ───────────────────────────────────── */

interface TaskCardContentProps {
  task: TaskInstance
  isDragging?: boolean
}

export function TaskCardContent({ task, isDragging }: TaskCardContentProps) {
  return (
    <div
      className={cn(
        "group rounded-lg border border-border bg-card p-3 shadow-sm",
        isDragging && "rotate-2 shadow-lg ring-2 ring-brand-500/40",
      )}
    >
      <div className="flex items-start gap-2">
        <div className="mt-0.5 shrink-0 p-0.5 text-muted-foreground/50">
          <GripVertical className="size-3.5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium leading-snug text-foreground">
            {task.title}
          </p>
          {task.description && (
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
              {task.description}
            </p>
          )}
        </div>
      </div>

      {task.assigned_to.length > 0 && (
        <div className="mt-2.5 flex items-center gap-1.5">
          <Users className="size-3 text-muted-foreground" />
          <div className="flex flex-wrap gap-1">
            {task.assigned_to.map((person) => (
              <span
                key={person.id}
                className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
              >
                {person.full_name.split(" ")[0]}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Sortable card (used inside columns) ─────────────────────────────────── */

interface TaskCardProps {
  task: TaskInstance
  onClick: (task: TaskInstance) => void
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group rounded-lg border border-border bg-card p-3 shadow-sm transition-shadow hover:shadow-md",
        isDragging && "z-50 opacity-40",
      )}
    >
      <div className="flex items-start gap-2">
        {/* Drag handle */}
        <button
          type="button"
          className="mt-0.5 shrink-0 cursor-grab touch-none rounded p-0.5 text-muted-foreground/50 opacity-0 transition-opacity hover:text-muted-foreground group-hover:opacity-100 active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-3.5" />
        </button>

        {/* Content — clickable */}
        <button
          type="button"
          className="min-w-0 flex-1 text-left"
          onClick={() => onClick(task)}
        >
          <p className="text-sm font-medium leading-snug text-foreground">
            {task.title}
          </p>
          {task.description && (
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
              {task.description}
            </p>
          )}
        </button>
      </div>

      {task.assigned_to.length > 0 && (
        <div className="mt-2.5 flex items-center gap-1.5">
          <Users className="size-3 text-muted-foreground" />
          <div className="flex flex-wrap gap-1">
            {task.assigned_to.map((person) => (
              <span
                key={person.id}
                className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
              >
                {person.full_name.split(" ")[0]}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
