import { useCallback, useMemo, useState } from "react"
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"

import type { TaskInstance, TaskStatus, WorkflowInstance } from "@/types/workflow"
import { KANBAN_COLUMNS } from "../data/tasks.mock"
import { KanbanColumn } from "./KanbanColumn"
import { TaskCardContent } from "./TaskCard"
import { TaskModal } from "./TaskModal"

/* ── Types ───────────────────────────────────────────────────────────────── */

type ColumnsState = Record<TaskStatus, TaskInstance[]>

const COLUMN_IDS: TaskStatus[] = ["pending", "doing", "done", "canceled"]

/* ── Helpers ──────────────────────────────────────────────────────────────── */

function buildColumns(tasks: TaskInstance[]): ColumnsState {
  const cols: ColumnsState = { pending: [], doing: [], done: [], canceled: [] }
  for (const task of tasks) {
    cols[task.status].push(task)
  }
  return cols
}

function flattenColumns(columns: ColumnsState): TaskInstance[] {
  return COLUMN_IDS.flatMap((status) =>
    columns[status].map((t, idx) => {
      const updated: TaskInstance = { ...t, status, order: idx }
      return updated
    }),
  )
}

function syncWorkflow(
  workflow: WorkflowInstance,
  flatTasks: TaskInstance[],
): WorkflowInstance {
  const taskMap = new Map(flatTasks.map((t) => [t.id, t]))
  return {
    ...workflow,
    steps: workflow.steps.map((step) => ({
      ...step,
      tasks: step.tasks
        .map((t) => taskMap.get(t.id) ?? t)
        .concat(
          flatTasks
            .filter((t) => t.step_instance === step.id && !step.tasks.some((st) => st.id === t.id))
        ),
    })),
  }
}

/* ── Component ───────────────────────────────────────────────────────────── */

interface KanbanBoardProps {
  workflow: WorkflowInstance
  onWorkflowChange: (workflow: WorkflowInstance) => void
}

export function KanbanBoard({ workflow, onWorkflowChange }: KanbanBoardProps) {
  const allTasks = useMemo(
    () => workflow.steps.flatMap((s) => s.tasks),
    [workflow],
  )

  const [columns, setColumns] = useState<ColumnsState>(() => buildColumns(allTasks))
  const [activeTask, setActiveTask] = useState<TaskInstance | null>(null)
  const [editingTask, setEditingTask] = useState<TaskInstance | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
  )

  /* ── Find which column an ID belongs to ──────────────────────────────────── */

  const findColumn = useCallback(
    (id: string | number): TaskStatus | null => {
      // Check if the id is a column id
      if (typeof id === "string" && COLUMN_IDS.includes(id as TaskStatus)) {
        return id as TaskStatus
      }
      // Otherwise find the column that contains this task
      for (const status of COLUMN_IDS) {
        if (columns[status].some((t) => t.id === id)) {
          return status
        }
      }
      return null
    },
    [columns],
  )

  /* ── Persist changes ─────────────────────────────────────────────────────── */

  function persistColumns(next: ColumnsState) {
    setColumns(next)
    const flat = flattenColumns(next)
    onWorkflowChange(syncWorkflow(workflow, flat))
  }

  /* ── Drag Start ──────────────────────────────────────────────────────────── */

  function handleDragStart(event: DragStartEvent) {
    const col = findColumn(event.active.id)
    if (!col) return
    const task = columns[col].find((t) => t.id === event.active.id) ?? null
    setActiveTask(task)
  }

  /* ── Drag Over (cross-column transfer during drag) ───────────────────────── */

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event
    if (!over) return

    const activeCol = findColumn(active.id)
    const overCol = findColumn(over.id)

    if (!activeCol || !overCol || activeCol === overCol) return

    // Move task from activeCol to overCol
    setColumns((prev) => {
      const sourceItems = [...prev[activeCol]]
      const destItems = [...prev[overCol]]

      const activeIdx = sourceItems.findIndex((t) => t.id === active.id)
      if (activeIdx === -1) return prev

      const [movedTask] = sourceItems.splice(activeIdx, 1)
      const updatedTask = { ...movedTask, status: overCol }

      // Find insertion index — if over a task, insert at that position
      const overIdx = destItems.findIndex((t) => t.id === over.id)
      if (overIdx !== -1) {
        destItems.splice(overIdx, 0, updatedTask)
      } else {
        // Dropped on the column itself (empty area) — append
        destItems.push(updatedTask)
      }

      return {
        ...prev,
        [activeCol]: sourceItems,
        [overCol]: destItems,
      }
    })
  }

  /* ── Drag End (reorder within column or finalize cross-column) ───────────── */

  function handleDragEnd(event: DragEndEvent) {
    setActiveTask(null)
    const { active, over } = event
    if (!over) return

    const activeCol = findColumn(active.id)
    const overCol = findColumn(over.id)

    if (!activeCol || !overCol) return

    // Same column — reorder
    if (activeCol === overCol) {
      setColumns((prev) => {
        const items = [...prev[activeCol]]
        const oldIdx = items.findIndex((t) => t.id === active.id)
        const newIdx = items.findIndex((t) => t.id === over.id)

        if (oldIdx === -1 || newIdx === -1 || oldIdx === newIdx) return prev

        const next = {
          ...prev,
          [activeCol]: arrayMove(items, oldIdx, newIdx),
        }
        // Persist after reorder
        const flat = flattenColumns(next)
        onWorkflowChange(syncWorkflow(workflow, flat))
        return next
      })
      return
    }

    // Cross-column was already handled in onDragOver — just persist
    persistColumns(columns)
  }

  /* ── Task editing ────────────────────────────────────────────────────────── */

  function handleTaskClick(task: TaskInstance) {
    setEditingTask(task)
    setIsModalOpen(true)
  }

  function handleTaskSave(updated: TaskInstance) {
    setColumns((prev) => {
      const next = { ...prev }

      // Remove from old column
      for (const status of COLUMN_IDS) {
        next[status] = next[status].filter((t) => t.id !== updated.id)
      }

      // Add to the correct column
      next[updated.status] = [...next[updated.status], updated]

      const flat = flattenColumns(next)
      onWorkflowChange(syncWorkflow(workflow, flat))
      return next
    })
    setIsModalOpen(false)
    setEditingTask(null)
  }

  function handleAddTask(status: TaskStatus) {
    const allIds = COLUMN_IDS.flatMap((s) => columns[s].map((t) => t.id))
    const newId = Math.max(0, ...allIds) + 1
    const firstStep = workflow.steps[0]
    if (!firstStep) return

    const newTask: TaskInstance = {
      id: newId,
      step_instance: firstStep.id,
      title: "Nova tarefa",
      description: null,
      status,
      assigned_to: [],
      order: columns[status].length,
      comments: [],
    }

    const next = {
      ...columns,
      [status]: [...columns[status], newTask],
    }
    persistColumns(next)

    setEditingTask(newTask)
    setIsModalOpen(true)
  }

  /* ── Render ──────────────────────────────────────────────────────────────── */

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex h-[calc(100dvh-12rem)] gap-4 overflow-x-auto pb-2">
          {KANBAN_COLUMNS.map((col) => (
            <KanbanColumn
              key={col.id}
              id={col.id}
              title={col.title}
              color={col.color}
              tasks={columns[col.id]}
              onTaskClick={handleTaskClick}
              onAddTask={handleAddTask}
            />
          ))}
        </div>

        <DragOverlay dropAnimation={null}>
          {activeTask ? (
            <div className="w-[260px]">
              <TaskCardContent task={activeTask} isDragging />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <TaskModal
        task={editingTask}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSave={handleTaskSave}
      />
    </>
  )
}
