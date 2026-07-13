import type { FuelType, TransmissionType, VehicleStatus } from "@/types/vehicles"
import type { CustomerType } from "@/types/customers"
import type { TransactionStatus, TransactionType } from "@/types/financial"
import type { Decisao, RiscoCompra, StatusKm } from "@/types/calculator"

export type LabelVariant =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info"

export const labelVariantClasses = {
  default: "bg-muted text-muted-foreground",
  success: "bg-success-bg text-success",
  warning: "bg-warning-bg text-warning",
  danger: "bg-danger-bg text-danger",
  info: "bg-info-bg text-info",
} as const satisfies Record<LabelVariant, string>

export const vehicleStatusLabels = {
  AWAITING_RELEASE: "Aguardando Liberação",
  IN_TRANSIT: "Em Trânsito",
  IN_YARD: "No Pátio",
  IN_PREPARATION: "Em Preparação",
  RESERVED: "Reservado",
  SOLD: "Vendido",
} as const satisfies Record<VehicleStatus, string>

export const vehicleStatusVariants = {
  AWAITING_RELEASE: "warning",
  IN_TRANSIT: "info",
  IN_YARD: "success",
  IN_PREPARATION: "warning",
  RESERVED: "info",
  SOLD: "default",
} as const satisfies Record<VehicleStatus, LabelVariant>

export const fuelTypeLabels = {
  FLEX: "Flex",
  GASOLINE: "Gasolina",
  ETHANOL: "Etanol",
  DIESEL: "Diesel",
  ELECTRIC: "Elétrico",
  HYBRID: "Híbrido",
  GNV: "GNV",
} as const satisfies Record<FuelType, string>

export const transmissionTypeLabels = {
  MANUAL: "Manual",
  AUTOMATIC: "Automático",
  CVT: "CVT",
  SEMI_AUTO: "Semi-automático",
  DUAL_CLUTCH: "Dupla Embreagem",
} as const satisfies Record<TransmissionType, string>

export const customerTypeLabels = {
  PF: "Pessoa Física",
  PJ: "Pessoa Jurídica",
} as const satisfies Record<CustomerType, string>

export const transactionTypeLabels = {
  PAYABLE: "A Pagar",
  RECEIVABLE: "A Receber",
} as const satisfies Record<TransactionType, string>

export const transactionTypeVariants = {
  PAYABLE: "warning",
  RECEIVABLE: "info",
} as const satisfies Record<TransactionType, LabelVariant>

export const transactionStatusLabels = {
  PENDING: "Pendente",
  PAID: "Pago",
  OVERDUE: "Vencido",
  CANCELLED: "Cancelado",
} as const satisfies Record<TransactionStatus, string>

export const transactionStatusVariants = {
  PENDING: "warning",
  PAID: "success",
  OVERDUE: "danger",
  CANCELLED: "default",
} as const satisfies Record<TransactionStatus, LabelVariant>

/* ── Calculadora ─────────────────────────────────────────────────────────── */

export const riscoCompraLabels = {
  BAIXO: "Baixo",
  MEDIO: "Médio",
  ALTO: "Alto",
} as const satisfies Record<RiscoCompra, string>

export const riscoCompraVariants = {
  BAIXO: "success",
  MEDIO: "warning",
  ALTO: "danger",
} as const satisfies Record<RiscoCompra, LabelVariant>

export const statusKmLabels = {
  APROVADO: "Aprovado",
  REPROVADO: "Reprovado",
} as const satisfies Record<StatusKm, string>

export const statusKmVariants = {
  APROVADO: "success",
  REPROVADO: "danger",
} as const satisfies Record<StatusKm, LabelVariant>

export const decisaoLabels = {
  COMPRAR: "Comprar",
  NEGOCIAR: "Negociar",
  SEM_MARGEM: "Sem Margem",
  FORA_SHOWROOM: "Fora Showroom",
  NAO_COMPRAR: "Não Comprar",
} as const satisfies Record<Decisao, string>

export const decisaoVariants = {
  COMPRAR: "success",
  NEGOCIAR: "warning",
  SEM_MARGEM: "default",
  FORA_SHOWROOM: "warning",
  NAO_COMPRAR: "danger",
} as const satisfies Record<Decisao, LabelVariant>
