import type { PersonType } from "@/types/customers"
import type { Address } from "./address"

export interface Customer {
    id: number
    full_name: string
    person_type: PersonType
    document: string
    email: string
    phone: string | null
    address: Address | null
    is_active: boolean
    created_at: Date
    updated_at: Date
}
