import { useState } from "react"

import { AppPageHeader } from "@/components/shared/AppPageHeader"
import type { WorkflowInstance } from "@/types/workflow"

import { CarList } from "../components/CarList"
import { KanbanBoard } from "../components/KanbanBoard"
import { WORKFLOW_INSTANCES } from "../data/tasks.mock"

export function MyTasksPage() {
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowInstance | null>(null)

  // Keep workflows in local state so drag updates persist during session
  const [workflows, setWorkflows] = useState(WORKFLOW_INSTANCES)

  function handleSelectWorkflow(wf: WorkflowInstance) {
    // Use latest version from state
    const current = workflows.find((w) => w.id === wf.id) ?? wf
    setSelectedWorkflow(current)
  }

  function handleWorkflowChange(updated: WorkflowInstance) {
    setSelectedWorkflow(updated)
    setWorkflows((prev) => prev.map((w) => (w.id === updated.id ? updated : w)))
  }

  function handleBack() {
    setSelectedWorkflow(null)
  }

  /* ── Kanban view ─────────────────────────────────────────────────────────── */
  if (selectedWorkflow) {
    const car = selectedWorkflow.car
    return (
      <div className="space-y-6">
        <AppPageHeader
          title={car ? `${car.brand} ${car.model}` : selectedWorkflow.name}
          subtitle={car ? `${car.plate} · ${car.year_model} — ${selectedWorkflow.name}` : undefined}
          onBack={handleBack}
        />
        <KanbanBoard
          workflow={selectedWorkflow}
          onWorkflowChange={handleWorkflowChange}
        />
      </div>
    )
  }

  /* ── Car list view ───────────────────────────────────────────────────────── */
  return (
    <div className="space-y-6">
      <AppPageHeader
        title="Minhas Tarefas"
        subtitle="Selecione um veículo para visualizar e gerenciar suas tarefas."
      />
      <CarList onSelectWorkflow={handleSelectWorkflow} />
    </div>
  )
}
