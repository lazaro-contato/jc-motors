import { useEffect, useState } from "react"
import { ListChecks, Users } from "lucide-react"

import { AppButton } from "@/components/shared/AppButton"
import { AppInput } from "@/components/shared/AppInput"
import { AppMultiSelect } from "@/components/shared/AppMultiSelect"
import { AppTextarea } from "@/components/shared/AppTextarea"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import type { TaskInstance, TaskStatus } from "@/types/workflow"

import {
  ASSIGNEE_OPTIONS,
  KANBAN_COLUMNS,
  MOCK_ASSIGNEES,
  TASK_STATUS_CONFIG,
} from "../data/tasks.mock"

interface TaskModalProps {
  task: TaskInstance | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (task: TaskInstance) => void
}

export function TaskModal({ task, open, onOpenChange, onSave }: TaskModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState<TaskStatus>("pending")
  const [assigneeIds, setAssigneeIds] = useState<string[]>([])

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description ?? "")
      setStatus(task.status)
      setAssigneeIds(task.assigned_to.map((a) => String(a.id)))
    }
  }, [task])

  function handleSave() {
    if (!task) return

    const assignees = assigneeIds
      .map((id) => MOCK_ASSIGNEES.find((a) => a.id === Number(id)))
      .filter(Boolean) as typeof MOCK_ASSIGNEES

    onSave({
      ...task,
      title: title.trim() || "Sem título",
      description: description.trim() || null,
      status,
      assigned_to: assignees,
    })
  }

  if (!task) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-500/15">
              <ListChecks className="size-4 text-brand-500 dark:text-brand-300" />
            </div>
            <div>
              <DialogTitle>Editar Tarefa</DialogTitle>
              <DialogDescription>Altere os dados e clique em salvar</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Separator />

        <div className="grid gap-4 py-1">
          {/* Title */}
          <AppInput
            label="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nome da tarefa"
          />

          {/* Description */}
          <AppTextarea
            label="Descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descreva a tarefa..."
            rows={3}
          />

          {/* Status */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">Status</label>
            <div className="flex flex-wrap gap-2">
              {KANBAN_COLUMNS.map((col) => {
                const cfg = TASK_STATUS_CONFIG[col.id]
                const isActive = status === col.id
                return (
                  <button
                    key={col.id}
                    type="button"
                    onClick={() => setStatus(col.id)}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-xs font-medium transition-all",
                      isActive
                        ? cn(cfg.className, "ring-2 ring-offset-1 ring-current")
                        : "bg-muted text-muted-foreground hover:bg-accent",
                    )}
                  >
                    {cfg.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Assignees */}
          <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-1.5 text-sm font-medium text-foreground">
              <Users className="size-3.5" />
              Responsáveis
            </label>
            <AppMultiSelect
              options={ASSIGNEE_OPTIONS}
              value={assigneeIds}
              onChange={setAssigneeIds}
              placeholder="Selecione os responsáveis..."
              searchPlaceholder="Buscar pessoa..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <AppButton onClick={handleSave}>
            Salvar
          </AppButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
