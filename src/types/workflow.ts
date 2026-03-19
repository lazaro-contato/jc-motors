export type TaskStatus = "canceled" | "pending" | "doing" | "done"
export type InstanceStatus = "in_progress" | "completed" | "canceled"
export type WorkflowType = "product" | "sale"

export interface TaskAssignee {
  id: number
  full_name: string
  role: string | null
}

export interface TaskComment {
  id: number
  task: number
  author: TaskAssignee
  content: string
  created_at: string
}

export interface TaskInstance extends Record<string, unknown> {
  id: number
  step_instance: number
  title: string
  description: string | null
  status: TaskStatus
  assigned_to: TaskAssignee[]
  order: number
  comments: TaskComment[]
}

export interface StepInstance {
  id: number
  workflow_instance: number
  workflow_step: number
  name: string
  order: number
  status: InstanceStatus
  tasks: TaskInstance[]
}

export interface WorkflowCar {
  id: number
  brand: string
  model: string
  plate: string
  year_model: number
  cover_image: string | null
}

export interface WorkflowInstance {
  id: number
  name: string
  workflow_type: WorkflowType
  status: InstanceStatus
  car: WorkflowCar | null
  steps: StepInstance[]
}
