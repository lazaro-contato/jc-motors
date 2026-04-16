import z from "zod"

export const signinSchema = z.object({
    email: z.string().email("E-mail inválido"),
    password: z.string().min(8, "Senha deve ter ao menos 8 caracteres"),
})

export type SigninDto = z.infer<typeof signinSchema>
