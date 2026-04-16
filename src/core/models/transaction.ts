import type { TransactionType } from "./transaction-type"
import type { TransactionStatus } from "./transaction-status"
import type { Customer } from "./customer"
import type { Provider } from "./provider"
import type { Vehicle } from "./vehicle"

export interface Transaction {
    id: number
    type: TransactionType
    status: TransactionStatus
    description: string
    amount: number
    due_date: Date
    paid_at: Date | null
    notes: string | null
    customer: Customer | null
    provider: Provider | null
    vehicle: Vehicle | null
    created_at: Date
    updated_at: Date
}
