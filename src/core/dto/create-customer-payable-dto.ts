import z from "zod"

export const createCustomerPayableSchema = z.object({
    customer: z.number().int().positive(),
    amount: z.number().int().positive(),
    due_date: z.date(),
    description: z.string().optional(),
    is_paid: z.boolean().default(false),
    vehicle: z.number().int().positive().optional(),
})

export type CreateCustomerPayableDto = z.infer<typeof createCustomerPayableSchema>
