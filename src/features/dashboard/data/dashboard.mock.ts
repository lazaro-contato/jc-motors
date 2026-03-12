/* ── Tipos ───────────────────────────────────────────────────────────────── */

export type SaleStatus = "open" | "completed" | "canceled"
export type TaskStatus = "pending" | "doing" | "done" | "canceled"
export type CarStatus = "available" | "preparing" | "reserved" | "sold"

export interface RecentSale extends Record<string, unknown> {
  id: number
  vehicle: string
  customer: string
  employee: string
  price: string
  status: SaleStatus
  date: string
}

export interface RecentTask {
  id: number
  title: string
  workflow: string
  status: TaskStatus
  assignee: string
  due: string
}

export interface InventoryStatus {
  label: string
  intent: CarStatus
  count: number
  color: string
}

export interface TopSeller {
  name: string
  sales: number
  revenue: string
  pct: number
}

/* ── Mock data ───────────────────────────────────────────────────────────── */

export const RECENT_SALES: RecentSale[] = [
  { id: 1, vehicle: "Honda HR-V EX 2024", customer: "Lucas Ferreira", employee: "Ana Costa", price: "R$ 195.000", status: "completed", date: "10/03/2026" },
  { id: 2, vehicle: "Jeep Compass Limited", customer: "Mariana Oliveira", employee: "João Lima", price: "R$ 198.500", status: "open", date: "10/03/2026" },
  { id: 3, vehicle: "BMW 320i M Sport", customer: "Rafael Mendes", employee: "Ana Costa", price: "R$ 269.900", status: "open", date: "09/03/2026" },
  { id: 4, vehicle: "Toyota Corolla XEi", customer: "Camila Souza", employee: "Pedro Alves", price: "R$ 142.000", status: "completed", date: "08/03/2026" },
  { id: 5, vehicle: "Volkswagen T-Cross 2023", customer: "Bruno Rodrigues", employee: "João Lima", price: "R$ 138.000", status: "canceled", date: "07/03/2026" },
]

export const RECENT_TASKS: RecentTask[] = [
  { id: 1, title: "Revisão mecânica completa", workflow: "Prep. Honda HR-V", status: "doing", assignee: "Carlos M.", due: "Hoje" },
  { id: 2, title: "Documentação DETRAN", workflow: "Prep. VW Polo", status: "pending", assignee: "Fernanda P.", due: "Amanhã" },
  { id: 3, title: "Contato pós-venda", workflow: "Venda Corolla", status: "pending", assignee: "Ana Costa", due: "12/03" },
  { id: 4, title: "Vistoria de entrada", workflow: "Prep. BMW 320i", status: "done", assignee: "Carlos M.", due: "09/03" },
  { id: 5, title: "Assinatura do contrato", workflow: "Venda Compass", status: "doing", assignee: "João Lima", due: "Hoje" },
  { id: 6, title: "Limpeza e polimento", workflow: "Prep. Fiat Pulse", status: "pending", assignee: "Carlos M.", due: "13/03" },
]

export const INVENTORY_STATUS: InventoryStatus[] = [
  { label: "Disponíveis", intent: "available", count: 6, color: "bg-success" },
  { label: "Em preparação", intent: "preparing", count: 3, color: "bg-warning" },
  { label: "Reservados", intent: "reserved", count: 2, color: "bg-info" },
  { label: "Vendidos", intent: "sold", count: 14, color: "bg-muted-foreground" },
]

export const TOP_SELLERS: TopSeller[] = [
  { name: "Ana Costa", sales: 4, revenue: "R$ 342.900", pct: 100 },
  { name: "João Lima", sales: 3, revenue: "R$ 336.500", pct: 98 },
  { name: "Pedro Alves", sales: 2, revenue: "R$ 142.000", pct: 41 },
  { name: "Fernanda P.", sales: 1, revenue: "R$ 89.990", pct: 26 },
]

/* ── Status configs ──────────────────────────────────────────────────────── */

export const SALE_STATUS: Record<SaleStatus, { label: string; className: string }> = {
  open: { label: "Em aberto", className: "bg-info-bg text-info" },
  completed: { label: "Concluída", className: "bg-success-bg text-success" },
  canceled: { label: "Cancelada", className: "bg-danger-bg text-danger" },
}
