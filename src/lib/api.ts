import axios from "axios"

import type {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios"

import { authService } from "@/features/auth/services/auth.service"
import { useAuthStore } from "@/store/auth.store"

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken
  if (accessToken && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

let refreshPromise: Promise<string> | null = null

async function refreshAccessToken(): Promise<string> {
  const refreshToken = useAuthStore.getState().refreshToken
  if (!refreshToken) throw new Error("No refresh token available")

  const response = await authService.refreshToken(refreshToken)

  useAuthStore
    .getState()
    .setTokens(response.accessToken, response.refreshToken)

  return response.accessToken
}

function logoutAndRedirect(): void {
  useAuthStore.getState().logout()
  if (
    typeof window !== "undefined" &&
    window.location.pathname !== "/login"
  ) {
    window.location.href = "/login"
  }
}

function isAuthEndpoint(url: string | undefined): boolean {
  if (!url) return false
  return (
    url.includes("/auth/sign-in") ||
    url.includes("/auth/sign-up") ||
    url.includes("/auth/refresh-token")
  )
}

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined
    const status = error.response?.status

    if (
      status === 401 &&
      originalRequest?.url?.includes("/auth/refresh-token")
    ) {
      logoutAndRedirect()
      return Promise.reject(error)
    }

    if (
      status !== 401 ||
      !originalRequest ||
      isAuthEndpoint(originalRequest.url)
    ) {
      return Promise.reject(error)
    }

    if (originalRequest._retry) {
      logoutAndRedirect()
      return Promise.reject(error)
    }

    originalRequest._retry = true

    try {
      refreshPromise ??= refreshAccessToken().finally(() => {
        refreshPromise = null
      })
      const newAccessToken = await refreshPromise
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
      return await api.request(originalRequest)
    } catch (refreshError) {
      logoutAndRedirect()
      return Promise.reject(
        refreshError instanceof Error
          ? refreshError
          : new Error(String(refreshError)),
      )
    }
  },
)
