import z from "zod"

export const createVehicleOptionalSchema = z.object({
    name: z.string().min(1),
})

export type CreateVehicleOptionalDto = z.infer<typeof createVehicleOptionalSchema>
