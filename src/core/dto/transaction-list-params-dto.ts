import z from "zod"
import { PayableTransactionType, ReceivableTransactionType } from "../models/transaction-type"
import { PendingTransactionStatus, PaidTransactionStatus, OverdueTransactionStatus, CancelledTransactionStatus } from "../models/transaction-status"

export const transactionListParamsSchema = z.object({
    page: z.number().int().positive().default(1),
    limit: z.number().int().positive().default(20),
    type: z.enum([PayableTransactionType, ReceivableTransactionType]).optional(),
    status: z.enum([PendingTransactionStatus, PaidTransactionStatus, OverdueTransactionStatus, CancelledTransactionStatus]).optional(),
    customer: z.number().int().positive().optional(),
    provider: z.number().int().positive().optional(),
    vehicle: z.number().int().positive().optional(),
    is_paid: z.boolean().optional(),
    month: z.number().int().positive().optional(),
    year: z.number().int().positive().optional(),
})

export type TransactionListParamsDto = z.infer<typeof transactionListParamsSchema>