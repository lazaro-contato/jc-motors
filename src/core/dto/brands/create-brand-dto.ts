import z from "zod"

export const createBrandDtoSchema = z.object({
    name: z.string().min(1, "Nome da marca é obrigatório"),
})

export type CreateBrandDto = z.infer<typeof createBrandDtoSchema>