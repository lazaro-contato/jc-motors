import type { AuthUser } from "./auth-user"

export interface AuthPayload {
    access: string
    refresh: string
    user: AuthUser
}
