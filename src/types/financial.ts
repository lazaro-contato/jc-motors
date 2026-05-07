export type TransactionType = "PAYABLE" | "RECEIVABLE"

export type TransactionStatus = "PENDING" | "PAID" | "OVERDUE" | "CANCELLED"

export interface FinancialTransaction {
  id: string
  type: TransactionType
  status: TransactionStatus
  description: string
  amount: string
  dueDate: string
  paidAt: string | null
  notes: string
  customerId: string | null
  providerId: string | null
  vehicleId: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateFinancialTransactionDTO {
  type: TransactionType
  status?: TransactionStatus
  description: string
  amount: number
  dueDate: string
  paidAt?: string
  notes?: string
  customerId?: string
  providerId?: string
  vehicleId?: string
}

export type UpdateFinancialTransactionDTO = Partial<CreateFinancialTransactionDTO>
