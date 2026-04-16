import type { UserType } from "./user-type"

export interface AuthUser {
    id: number
    email: string
    user_type: UserType
    created_at: Date
    updated_at: Date
}
