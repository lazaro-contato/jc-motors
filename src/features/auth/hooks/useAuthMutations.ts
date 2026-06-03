import { useMutation } from "@tanstack/react-query"

import { authService } from "../services/auth.service"
import { useAuthStore } from "@/store/auth.store"

import type { SignInDTO, SignUpDTO } from "@/types/auth"

export function useSignIn() {
  const setAuth = useAuthStore((s) => s.setAuth)
  return useMutation({
    mutationFn: (dto: SignInDTO) => authService.signIn(dto),
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken)
    },
  })
}

export function useSignUp() {
  const setAuth = useAuthStore((s) => s.setAuth)
  return useMutation({
    mutationFn: (dto: SignUpDTO) => authService.signUp(dto),
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken)
    },
  })
}

export function useRefreshToken() {
  const setTokens = useAuthStore((s) => s.setTokens)
  const refreshToken = useAuthStore((s) => s.refreshToken)
  return useMutation({
    mutationFn: () => authService.refreshToken(refreshToken ?? ""),
    onSuccess: (data) => {
      setTokens(data.accessToken, data.refreshToken)
    },
  })
}
