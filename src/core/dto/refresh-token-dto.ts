import z from "zod";

export const refreshTokenSchema = z.object({
    refresh: z.string().min(1, "Refresh token is required"),
})

export type RefreshTokenDto = z.infer<typeof refreshTokenSchema>
