import { api } from "@/lib/api"
import type { AuthResponse, SignInDTO, SignUpDTO } from "@/types/auth"

export const authService = {
  signIn: (dto: SignInDTO) =>
    api.post<AuthResponse>("/auth/sign-in", dto).then((r) => r.data),

  signUp: (dto: SignUpDTO) =>
    api.post<AuthResponse>("/auth/sign-up", dto).then((r) => r.data),

  refreshToken: () =>
    api.post<AuthResponse>("/auth/refresh-token").then((r) => r.data),
}
