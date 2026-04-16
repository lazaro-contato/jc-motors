/**
 * pending = Pendente
 * paid = Pago
 * overdue = Vencido
 * cancelled = Cancelado
 */
export const PendingTransactionStatus = "pending"
export const PaidTransactionStatus = "paid"
export const OverdueTransactionStatus = "overdue"
export const CancelledTransactionStatus = "cancelled"

export type TransactionStatus = "pending" | "paid" | "overdue" | "cancelled"