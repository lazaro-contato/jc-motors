export interface Provider {
    id: number
    name: string
    document: string
    email: string | null
    phone: string | null
    is_active: boolean
    notes: string | null
}
