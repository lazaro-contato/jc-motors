import z from "zod"

export const updateVehicleOptionalSchema = z.object({
    name: z.string().min(1).optional(),
})

export type UpdateVehicleOptionalDto = z.infer<typeof updateVehicleOptionalSchema>
