import z from "zod"

export const createVehiclePayableSchema = z.object({
    vehicle: z.number().int().positive(),
    amount: z.number().int().positive(),
    due_date: z.date(),
    description: z.string().optional(),
    is_paid: z.boolean().default(false),
})

export type CreateVehiclePayableDto = z.infer<typeof createVehiclePayableSchema>
