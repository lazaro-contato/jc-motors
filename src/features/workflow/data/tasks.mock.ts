import type {
  TaskStatus,
  TaskInstance,
  WorkflowInstance,
  TaskAssignee,
} from "@/types/workflow"

/* ── Assignees ───────────────────────────────────────────────────────────── */

export const MOCK_ASSIGNEES: TaskAssignee[] = [
  { id: 1, full_name: "Carlos Eduardo Silva", role: "Mecânico" },
  { id: 2, full_name: "Ana Paula Souza", role: "Vendedora" },
  { id: 3, full_name: "Marcos Antônio Lima", role: "Vendedor" },
  { id: 4, full_name: "Fernanda Costa Alves", role: "Financeiro" },
  { id: 5, full_name: "João Pedro Santos", role: "Preparação" },
  { id: 6, full_name: "Patrícia Mendes Rocha", role: "Administrativa" },
]

export const ASSIGNEE_OPTIONS = MOCK_ASSIGNEES.map((a) => ({
  label: a.full_name,
  value: String(a.id),
}))

/* ── Status config ───────────────────────────────────────────────────────── */

export const TASK_STATUS_CONFIG: Record<TaskStatus, { label: string; className: string }> = {
  canceled: { label: "Cancelada",  className: "bg-danger-bg text-danger" },
  pending:  { label: "Fazer",      className: "bg-warning-bg text-warning" },
  doing:    { label: "Fazendo",    className: "bg-info-bg text-info" },
  done:     { label: "Concluído",  className: "bg-success-bg text-success" },
}

export const KANBAN_COLUMNS: { id: TaskStatus; title: string; color: string }[] = [
  { id: "pending",  title: "Fazer",      color: "bg-warning" },
  { id: "doing",    title: "Fazendo",    color: "bg-info" },
  { id: "done",     title: "Concluído",  color: "bg-success" },
  { id: "canceled", title: "Canceladas", color: "bg-danger" },
]

/* ── Mock workflow instances (per car) ───────────────────────────────────── */

export const WORKFLOW_INSTANCES: WorkflowInstance[] = [
  {
    id: 1,
    name: "Preparação Honda HR-V EX",
    workflow_type: "product",
    status: "in_progress",
    car: { id: 1, brand: "Honda", model: "HR-V EX", plate: "ABC-1234", year_model: 2024, cover_image: null },
    steps: [
      {
        id: 1, workflow_instance: 1, workflow_step: 1, name: "Inspeção Mecânica", order: 1, status: "in_progress",
        tasks: [
          { id: 1, step_instance: 1, title: "Revisão mecânica completa", description: "Verificar motor, suspensão, freios e sistema elétrico", status: "doing", assigned_to: [MOCK_ASSIGNEES[0]], order: 1, comments: [] },
          { id: 2, step_instance: 1, title: "Troca de óleo e filtros", description: null, status: "done", assigned_to: [MOCK_ASSIGNEES[0]], order: 2, comments: [] },
          { id: 3, step_instance: 1, title: "Alinhamento e balanceamento", description: "Realizar alinhamento 3D", status: "pending", assigned_to: [MOCK_ASSIGNEES[4]], order: 3, comments: [] },
        ],
      },
      {
        id: 2, workflow_instance: 1, workflow_step: 2, name: "Estética", order: 2, status: "in_progress",
        tasks: [
          { id: 4, step_instance: 2, title: "Polimento completo", description: "Polimento cristalizado em toda a lataria", status: "pending", assigned_to: [MOCK_ASSIGNEES[4]], order: 1, comments: [] },
          { id: 5, step_instance: 2, title: "Higienização interna", description: null, status: "pending", assigned_to: [MOCK_ASSIGNEES[4]], order: 2, comments: [] },
        ],
      },
      {
        id: 3, workflow_instance: 1, workflow_step: 3, name: "Documentação", order: 3, status: "in_progress",
        tasks: [
          { id: 6, step_instance: 3, title: "Vistoria DETRAN", description: "Agendar e realizar vistoria veicular", status: "pending", assigned_to: [MOCK_ASSIGNEES[5]], order: 1, comments: [] },
          { id: 7, step_instance: 3, title: "Atualizar documentação", description: null, status: "canceled", assigned_to: [], order: 2, comments: [] },
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Preparação Toyota Corolla XEi",
    workflow_type: "product",
    status: "in_progress",
    car: { id: 3, brand: "Toyota", model: "Corolla XEi", plate: "GHI-9012", year_model: 2024, cover_image: null },
    steps: [
      {
        id: 4, workflow_instance: 2, workflow_step: 1, name: "Inspeção", order: 1, status: "in_progress",
        tasks: [
          { id: 8, step_instance: 4, title: "Check-up geral do veículo", description: null, status: "done", assigned_to: [MOCK_ASSIGNEES[0]], order: 1, comments: [] },
          { id: 9, step_instance: 4, title: "Verificar recall pendente", description: "Consultar portal Toyota para recalls abertos", status: "doing", assigned_to: [MOCK_ASSIGNEES[0], MOCK_ASSIGNEES[5]], order: 2, comments: [] },
        ],
      },
      {
        id: 5, workflow_instance: 2, workflow_step: 2, name: "Preparação Final", order: 2, status: "in_progress",
        tasks: [
          { id: 10, step_instance: 5, title: "Limpeza e polimento", description: null, status: "pending", assigned_to: [MOCK_ASSIGNEES[4]], order: 1, comments: [] },
          { id: 11, step_instance: 5, title: "Fotos para anúncio", description: "Fotografar exterior e interior do veículo", status: "pending", assigned_to: [MOCK_ASSIGNEES[1]], order: 2, comments: [] },
        ],
      },
    ],
  },
  {
    id: 3,
    name: "Preparação Jeep Compass Limited",
    workflow_type: "product",
    status: "in_progress",
    car: { id: 7, brand: "Jeep", model: "Compass Limited", plate: "HJK-8L90", year_model: 2023, cover_image: null },
    steps: [
      {
        id: 6, workflow_instance: 3, workflow_step: 1, name: "Mecânica", order: 1, status: "completed",
        tasks: [
          { id: 12, step_instance: 6, title: "Revisão de 30.000km", description: "Revisão conforme manual da Jeep", status: "done", assigned_to: [MOCK_ASSIGNEES[0]], order: 1, comments: [] },
          { id: 13, step_instance: 6, title: "Substituir pastilhas de freio", description: null, status: "done", assigned_to: [MOCK_ASSIGNEES[0]], order: 2, comments: [] },
        ],
      },
      {
        id: 7, workflow_instance: 3, workflow_step: 2, name: "Documentação", order: 2, status: "in_progress",
        tasks: [
          { id: 14, step_instance: 7, title: "Transferência de propriedade", description: "Documentação para transferência junto ao DETRAN", status: "doing", assigned_to: [MOCK_ASSIGNEES[5], MOCK_ASSIGNEES[3]], order: 1, comments: [] },
          { id: 15, step_instance: 7, title: "Seguro provisório", description: null, status: "pending", assigned_to: [MOCK_ASSIGNEES[3]], order: 2, comments: [] },
        ],
      },
    ],
  },
  {
    id: 4,
    name: "Preparação BMW 320i M Sport",
    workflow_type: "product",
    status: "completed",
    car: { id: 10, brand: "BMW", model: "320i M Sport", plate: "NMQ-1P89", year_model: 2022, cover_image: null },
    steps: [
      {
        id: 8, workflow_instance: 4, workflow_step: 1, name: "Finalizado", order: 1, status: "completed",
        tasks: [
          { id: 16, step_instance: 8, title: "Revisão completa BMW", description: null, status: "done", assigned_to: [MOCK_ASSIGNEES[0]], order: 1, comments: [] },
          { id: 17, step_instance: 8, title: "Polimento técnico", description: null, status: "done", assigned_to: [MOCK_ASSIGNEES[4]], order: 2, comments: [] },
          { id: 18, step_instance: 8, title: "Documentação DETRAN", description: null, status: "done", assigned_to: [MOCK_ASSIGNEES[5]], order: 3, comments: [] },
        ],
      },
    ],
  },
]

/* ── Helper: flatten all tasks from a workflow ───────────────────────────── */

export function getTasksFromWorkflow(workflow: WorkflowInstance): TaskInstance[] {
  return workflow.steps.flatMap((step) => step.tasks)
}
