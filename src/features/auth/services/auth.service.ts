import type { AuthResponse, SignInDTO, SignUpDTO } from "@/types/auth"

import { api } from "@/lib/api"

export const authService = {
  signIn: (dto: SignInDTO) =>
    api.post<AuthResponse>("/auth/sign-in", dto).then((r) => r.data),

  signUp: (dto: SignUpDTO) =>
    api.post<AuthResponse>("/auth/sign-up", dto).then((r) => r.data),

  refreshToken: (refreshToken: string) =>
    api
      .post<AuthResponse>(
        "/auth/refresh-token",
        {},
        { headers: { Authorization: `Bearer ${refreshToken}` } },
      )
      .then((r) => r.data),
}
