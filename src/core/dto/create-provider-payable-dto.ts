import z from "zod"

export const createProviderPayableSchema = z.object({
    provider: z.number().int().positive(),
    amount: z.number().int().positive(),
    due_date: z.date(),
    description: z.string().optional(),
    is_paid: z.boolean().default(false),
    vehicle: z.number().int().positive().optional(),
})

export type CreateProviderPayableDto = z.infer<typeof createProviderPayableSchema>
