import z from "zod"

export const updateBrandDtoSchema = z.object({
    name: z.string().min(1, "Nome da marca é obrigatório").optional(),
})

export type UpdateBrandDto = z.infer<typeof updateBrandDtoSchema>